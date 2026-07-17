import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: places, error } = await supabase.from('places').select('id, name, city, slug, review_count, rating, address');
  if (error) throw error;

  // Group by city and normalized name
  const groups = {};
  
  for (const p of places) {
    if (!p.city || !p.name) continue;
    const key = `${p.city.toLowerCase()}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  let mergedCount = 0;
  const newRedirects = [];

  for (const [key, group] of Object.entries(groups)) {
    if (group.length > 1) {
      // Sort to find the "best" record to keep (highest review count, then highest rating)
      group.sort((a, b) => {
        const aReviews = a.review_count || 0;
        const bReviews = b.review_count || 0;
        if (aReviews !== bReviews) return bReviews - aReviews;
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        return bRating - aRating;
      });

      const keep = group[0];
      const duplicates = group.slice(1);
      
      for (const dup of duplicates) {
        console.log(`Merging ${dup.name} (${dup.id}) into ${keep.name} (${keep.id})`);
        
        if (dup.slug && keep.slug && dup.slug !== keep.slug) {
          // If the keep record is "bawarchi" and dup is "bawarchi-1"
          const citySlug = dup.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          newRedirects.push({
            source: `/${citySlug}/${dup.slug}`,
            destination: `/${citySlug}/${keep.slug}`,
            permanent: true,
          });
        }

        await supabase.from('places').delete().eq('id', dup.id);
        mergedCount++;
      }
    }
  }

  console.log(`Merged and deleted ${mergedCount} duplicate records.`);
  fs.writeFileSync(join(__dirname, 'redirects.json'), JSON.stringify(newRedirects, null, 2));
}
run();
