import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const NON_HALAL_CHAINS = [
  'McDonald\'s', 'McDonalds', 'Chili\'s', 'Chilis', 
  'Barbeque Nation', 'Peter Cat', 'KFC', 'Burger King', 'Domino\'s'
];

async function auditHalalStatus() {
  console.log('Starting Halal Status Audit...');
  
  const { data: places, error } = await supabase
    .from('places')
    .select('id, name, city, verified, verification_status, halal_status, halal_source, certificate_url, review_count');

  if (error) {
    console.error('Error fetching places:', error);
    return;
  }

  const flaggedRecords = [];

  for (const place of places) {
    let shouldFlag = false;
    let reason = '';

    const isNonHalalChain = NON_HALAL_CHAINS.some(chain => 
      place.name.toLowerCase().includes(chain.toLowerCase())
    );

    const isClaimingHalal = ['Full Halal', 'Authentic', 'Verified'].includes(place.halal_status) || place.verified === true || place.verification_status === 'verified';
    const hasNoRealSource = !place.halal_source && !place.certificate_url && place.review_count < 5;

    if (isClaimingHalal && hasNoRealSource) {
      shouldFlag = true;
      reason = 'Claims halal/verified but lacks certificate, source, or >= 5 reviews';
    }
    
    if (isClaimingHalal && isNonHalalChain && !place.certificate_url) {
      shouldFlag = true;
      reason = 'Known non-halal chain marked as halal/verified without explicit certificate';
    }

    if (shouldFlag) {
      flaggedRecords.push({
        id: place.id,
        name: place.name,
        city: place.city,
        old_status: `${place.halal_status} / ${place.verification_status} / ${place.verified}`,
        new_status: 'Unknown / unverified / false',
        reason: reason
      });
      
      // Update DB
      await supabase.from('places').update({ 
        verified: false,
        verification_status: 'unverified',
        halal_status: 'Unknown'
      }).eq('id', place.id);
    }
  }

  // Output CSV
  if (flaggedRecords.length > 0) {
    const csvHeader = 'Restaurant Name,City,Old Status,New Status,Reason\n';
    const csvRows = flaggedRecords.map(r => `"${r.name}","${r.city}","${r.old_status}","${r.new_status}","${r.reason}"`).join('\n');
    const outputPath = join(__dirname, '../halal_audit_report.csv');
    
    fs.writeFileSync(outputPath, csvHeader + csvRows);
    console.log(`Audit complete. Flagged and updated ${flaggedRecords.length} records. Report saved to ${outputPath}`);
  } else {
    console.log('Audit complete. No records needed downgrading.');
  }
}

auditHalalStatus();
