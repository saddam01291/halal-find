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

async function run() {
  const { data: places, error } = await supabase.from('places').select('id, name, address, cuisine');
  if (error) throw error;

  let updated = 0;
  for (const place of places) {
    let newName = place.name;
    let newAddr = place.address;
    let newCuisine = place.cuisine;

    const cleanup = (str) => {
        if (!str) return str;
        // Fix the weird A'l' 'B'a'k'e which was caused by \uFFFD replacement
        // Just remove single quotes that are immediately followed by a letter or space and preceded by a letter, 
        // wait, a better way is to remove all single quotes if there are too many (e.g. > 3)
        // Or let's just remove ALL \uFFFD and all single quotes except for standard apostrophes (like "Domino's").
        // Actually, if we just remove single quotes between two letters if it happens repeatedly?
        // Let's use a regex to remove `'` if it's surrounded by letters, but wait, that breaks Domino's.
        // Let's replace ' with nothing if the string matches the pattern of having single quotes between every letter.
        if (str.includes('\uFFFD')) {
            str = str.replace(/\uFFFD/g, "");
        }
        
        // Fix specific ones mentioned: "Con'_u" or "Con_u"
        str = str.replace(/Con'_u/g, "Con_u");
        str = str.replace(/Con_u/g, "Con_u");
        str = str.replace(/Sahibs/g, "Sahib's");
        str = str.replace(/Sahib''s/g, "Sahib's");

        // The previous script made A'l' 'B'a'k'e. 
        if (str.split("'").length > 3) {
            str = str.replace(/'/g, "");
        }
        
        return str;
    };

    newName = cleanup(newName);
    newAddr = cleanup(newAddr);
    newCuisine = cleanup(newCuisine);

    if (newName !== place.name || newAddr !== place.address || newCuisine !== place.cuisine) {
      console.log(`Fixing: ${place.name} -> ${newName}`);
      await supabase.from('places').update({
        name: newName,
        address: newAddr,
        cuisine: newCuisine
      }).eq('id', place.id);
      updated++;
    }
  }
  console.log(`Updated ${updated} records.`);
}
run();
