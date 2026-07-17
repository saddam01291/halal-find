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

// Simple Levenshtein distance
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }

  return matrix[b.length][a.length];
}

function normalizeStr(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function mergeDuplicates() {
  console.log('Starting Duplicate Listings Merge...');

  // 1. Fetch all places
  const { data: places, error } = await supabase.from('places').select('*');
  
  if (error) {
    console.error('Error fetching places:', error);
    return;
  }

  // Group by city for optimization
  const cityGroups = {};
  for (const place of places) {
    if (!place.city) continue;
    const city = place.city.toLowerCase().trim();
    if (!cityGroups[city]) cityGroups[city] = [];
    cityGroups[city].push(place);
  }

  const merges = [];
  const processedIds = new Set();
  const deleteIds = [];

  for (const [city, cityPlaces] of Object.entries(cityGroups)) {
    for (let i = 0; i < cityPlaces.length; i++) {
      const p1 = cityPlaces[i];
      if (processedIds.has(p1.id)) continue;

      const duplicates = [p1];

      for (let j = i + 1; j < cityPlaces.length; j++) {
        const p2 = cityPlaces[j];
        if (processedIds.has(p2.id)) continue;

        // Check if name is very similar
        const n1 = normalizeStr(p1.name);
        const n2 = normalizeStr(p2.name);
        
        // Either identical normalized names, or very close (Levenshtein < 3)
        let isNameSimilar = n1 === n2;
        if (!isNameSimilar && n1.length > 5 && n2.length > 5) {
           const dist = levenshtein(n1, n2);
           if (dist <= 2) isNameSimilar = true;
           // "Hotel Shadab" vs "Hotel Shadab (Banjara Hills)"
           if (n1.includes(n2) || n2.includes(n1)) isNameSimilar = true;
        }

        if (isNameSimilar) {
          // Check location proximity (rough approx: 0.002 deg lat/lng is ~200m)
          const latDiff = Math.abs(p1.lat - p2.lat);
          const lngDiff = Math.abs(p1.lng - p2.lng);
          
          if (latDiff < 0.002 && lngDiff < 0.002) {
            duplicates.push(p2);
          }
        }
      }

      if (duplicates.length > 1) {
        // We found duplicates. Find the best one to keep.
        // Best = has most reviews, highest rating, or is verified
        duplicates.sort((a, b) => {
          if (a.verified !== b.verified) return a.verified ? -1 : 1;
          if (a.review_count !== b.review_count) return b.review_count - a.review_count;
          return 0; // fallback
        });

        const keeper = duplicates[0];
        const toMerge = duplicates.slice(1);

        let combinedReviews = keeper.review_count;
        let totalScore = keeper.rating * keeper.review_count;

        for (const duplicate of toMerge) {
          processedIds.add(duplicate.id);
          deleteIds.push(duplicate.id);
          merges.push({
            keeper_id: keeper.id,
            keeper_slug: keeper.slug,
            duplicate_id: duplicate.id,
            duplicate_slug: duplicate.slug
          });

          // Re-point reviews
          await supabase.from('reviews').update({ place_id: keeper.id }).eq('place_id', duplicate.id);
          
          combinedReviews += duplicate.review_count;
          totalScore += duplicate.rating * duplicate.review_count;
        }

        // Update keeper stats
        if (combinedReviews > keeper.review_count) {
          const newAvg = totalScore / combinedReviews;
          await supabase.from('places').update({
            review_count: combinedReviews,
            rating: newAvg
          }).eq('id', keeper.id);
        }
      }
    }
  }

  // Delete merged places
  if (deleteIds.length > 0) {
    // Note: since reviews are repointed, we can delete the places
    // First remove verification_requests just in case
    for(const id of deleteIds) {
      await supabase.from('verification_requests').delete().eq('place_id', id);
    }
    const { error: delError } = await supabase.from('places').delete().in('id', deleteIds);
    if (delError) {
      console.error('Error deleting duplicates:', delError);
    }
  }

  // Output report
  if (merges.length > 0) {
    const csvHeader = 'Kept Slug,Merged Slug\n';
    const csvRows = merges.map(m => `"${m.keeper_slug}","${m.duplicate_slug}"`).join('\n');
    const outputPath = join(__dirname, '../merged_duplicates_report.csv');
    
    fs.writeFileSync(outputPath, csvHeader + csvRows);
    console.log(`Merge complete. Merged ${merges.length} duplicates. Report saved to ${outputPath}`);
  } else {
    console.log('Merge complete. No duplicates found.');
  }

}

mergeDuplicates();
