/**
 * import-archive.mjs
 * Imports clean restaurant data from "archive/Dataset .csv" into the Supabase `places` table.
 *
 * Filters applied (bad data skipped):
 *  - Aggregate rating == 0 or blank (unrated)
 *  - Missing Latitude / Longitude
 *  - Missing Restaurant Name
 *  - Missing Cuisines
 *  - Missing City
 *
 * Safe defaults (matching actual live DB schema):
 *  - verified = false
 *  - verification_status = 'unverified'
 *  - halal_status = 'Unknown'
 *  - serves_alcohol = false
 *  - contamination_risk = 'low'
 *  - is_mixed_neighborhood = false
 *  - slug = generated from name + city (unique)
 */

import { createClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// ── Load env manually ─────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── Config ────────────────────────────────────────────────────────────────────
const CSV_PATH = path.resolve(__dirname, '../../archive/Dataset .csv');
const BATCH_SIZE = 100;

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseFloatSafe(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}
function parseIntSafe(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}
function parseCuisines(val) {
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}
function priceRangeTag(val) {
  const p = parseIntSafe(val);
  if (p === 1) return 'Budget';
  if (p === 2) return 'Moderate';
  if (p === 3) return 'Expensive';
  if (p === 4) return 'Fine Dining';
  return null;
}

// Generate a URL-safe slug from the restaurant name + city to avoid collisions
const slugCounts = {};
function makeSlug(name, city) {
  const base = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
  slugCounts[base] = (slugCounts[base] || 0) + 1;
  return slugCounts[base] === 1 ? base : `${base}-${slugCounts[base]}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Reading CSV from:', CSV_PATH);

  const records = [];
  let skipped = 0;

  await new Promise((resolve, reject) => {
    const parser = parse({ columns: true, skip_empty_lines: true, trim: true });
    createReadStream(CSV_PATH).pipe(parser)
      .on('data', row => {
        const rating = parseFloatSafe(row['Aggregate rating']);
        const lat = parseFloatSafe(row['Latitude']);
        const lng = parseFloatSafe(row['Longitude']);
        const name = (row['Restaurant Name'] || '').trim();
        const cuisines = (row['Cuisines'] || '').trim();
        const city = (row['City'] || '').trim();

        // Skip bad / incomplete rows
        if (!name || !cuisines || !city) { skipped++; return; }
        if (lat === null || lng === null) { skipped++; return; }
        if (!rating || rating === 0) { skipped++; return; }

        // Build tags array
        const cuisineList = parseCuisines(cuisines);
        const tags = [...cuisineList];
        const priceTag = priceRangeTag(row['Price range']);
        if (priceTag) tags.push(priceTag);
        if (row['Has Table booking'] === 'Yes') tags.push('Table Booking');
        if (row['Has Online delivery'] === 'Yes') tags.push('Online Delivery');

        // Build place record matching actual live DB schema
        records.push({
          name,
          cuisine: cuisineList[0] || cuisines,
          address: (row['Address'] || row['Locality Verbose'] || city).trim(),
          city,
          rating: parseFloat(Math.min(5, Math.max(0, rating)).toFixed(2)),
          review_count: parseIntSafe(row['Votes']),
          image: '',
          lat,
          lng,
          tags,
          verified: false,
          verification_status: 'unverified',
          halal_status: 'Unknown',
          serves_alcohol: false,
          contamination_risk: 'low',
          is_mixed_neighborhood: false,
          slug: makeSlug(name, city),
          phone: null,
          email: null,
          certificate_url: null,
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Parsed ${records.length} valid records, skipped ${skipped} bad rows.`);

  if (records.length === 0) {
    console.log('Nothing to import.');
    return;
  }

  // Batch insert
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('places').upsert(batch, {
      onConflict: 'name,address',
      ignoreDuplicates: true,
    });
    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\rInserted ${inserted}/${records.length} ...`);
    }
  }

  console.log(`\n\nImport complete!`);
  console.log(`  Inserted : ${inserted}`);
  console.log(`  Errors   : ${errors}`);
  console.log(`  Skipped  : ${skipped}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
