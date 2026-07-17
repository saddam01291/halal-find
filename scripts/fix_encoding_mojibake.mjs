import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Common mojibake replacements
const MOJIBAKE_MAP = {
  '\uFFFD': "'", // Often replacement char is for apostrophe
  '': "'",
  'â€"': "-",
  'â€™': "'",
  'â€œ': '"',
  'â€': '"'
};

function fixEncoding(str) {
  if (!str) return str;
  let newStr = str;
  for (const [bad, good] of Object.entries(MOJIBAKE_MAP)) {
    newStr = newStr.split(bad).join(good);
  }
  return newStr;
}

async function fixMojibake() {
  console.log('Scanning for character encoding bugs...');

  const { data: places, error } = await supabase.from('places').select('id, name, address, cuisine');

  if (error) {
    console.error('Error fetching places:', error);
    return;
  }

  let fixCount = 0;

  for (const place of places) {
    const fixedName = fixEncoding(place.name);
    const fixedAddress = fixEncoding(place.address);
    const fixedCuisine = fixEncoding(place.cuisine);

    if (
      fixedName !== place.name ||
      fixedAddress !== place.address ||
      fixedCuisine !== place.cuisine
    ) {
      // Needs update
      await supabase.from('places').update({
        name: fixedName,
        address: fixedAddress,
        cuisine: fixedCuisine
      }).eq('id', place.id);
      
      fixCount++;
      console.log(`Fixed mojibake in place ID: ${place.id} (${fixedName})`);
    }
  }

  console.log(`Finished fixing encoding. Updated ${fixCount} records.`);
}

fixMojibake();
