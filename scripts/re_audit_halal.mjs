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
  const { data: places, error } = await supabase.from('places').select('*');
  if (error) throw error;

  const nonHalalChains = [
    'mcdonald', 'kfc', 'burger king', 'subway', 'domino', 'pizza hut',
    'chili', "ab's absolute barbecues", 'absolute barbecue', 'barbeque nation',
    'peter cat', "wendy's", 'taco bell', 'dunkin', 'costa coffee', 'starbucks', 'cafe coffee day'
  ];

  let downgraded = 0;
  for (const place of places) {
    if (!place.name) continue;
    const nameLower = place.name.toLowerCase();
    
    // Check if it matches a known non-halal chain
    const isChain = nonHalalChains.some(chain => nameLower.includes(chain));
    
    // Check if it claims to be Full Halal without real evidence (if it's a chain)
    // Or if it claims to be Full Halal but has 'osm_import' as verification status and 0 reviews
    if (isChain || place.halal_status === 'Full Halal' || place.halal_status === 'Authentic' || place.halal_status === 'Authentic Halal' || place.verification_status === 'Verified') {
      // If it's a known chain, or imported without certificate
      if (isChain || (!place.certificate_url && (place.halal_source === 'osm' || place.verification_status === 'osm_import' || place.verification_status === 'unverified' || place.review_count < 5))) {
        if (place.halal_status !== 'Unverified' || place.verification_status !== 'unverified') {
          console.log(`Downgrading: ${place.name} (ID: ${place.id})`);
          await supabase.from('places').update({
            halal_status: 'Unverified',
            verification_status: 'unverified'
          }).eq('id', place.id);
          downgraded++;
        }
      }
    }
  }
  
  console.log(`Downgraded ${downgraded} places.`);
}
run();
