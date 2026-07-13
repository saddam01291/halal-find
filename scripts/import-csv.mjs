import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_FILE_PATH = 'D:/PROJECT- FIND HALAL/archive/Dataset .csv';

async function importData() {
  console.log('Starting CSV parsing...');
  
  const results = [];
  const uniqueTracker = new Set();
  let duplicateCount = 0;

  // First, fetch existing places from DB to prevent duplicates
  // Since we don't have a unique constraint on (name, lat, lng), we do it in memory.
  // We'll just fetch name and coordinates to build our unique set.
  console.log('Fetching existing places from database...');
  let hasMore = true;
  let from = 0;
  let to = 999;
  while (hasMore) {
    const { data: existingPlaces, error } = await supabase
      .from('places')
      .select('name, lat, lng')
      .range(from, to);
      
    if (error) {
      console.error('Error fetching existing places:', error);
      break;
    }
    
    if (existingPlaces.length > 0) {
      for (const place of existingPlaces) {
        // Create a unique key: lowercase name + rounded coordinates
        const key = `${place.name.trim().toLowerCase()}_${Number(place.lat).toFixed(4)}_${Number(place.lng).toFixed(4)}`;
        uniqueTracker.add(key);
      }
      from += 1000;
      to += 1000;
    } else {
      hasMore = false;
    }
  }
  
  console.log(`Found ${uniqueTracker.size} existing unique places in DB.`);

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (data) => {
      // Map columns based on our plan
      const name = data['Restaurant Name']?.trim();
      let cuisine = data['Cuisines']?.trim() || 'General';
      const address = data['Address']?.trim() || '';
      const locality = data['Locality Verbose']?.trim() || '';
      const city = data['City']?.trim() || '';
      const lat = parseFloat(data['Latitude']);
      const lng = parseFloat(data['Longitude']);
      const rating = parseFloat(data['Aggregate rating']) || 0;
      const review_count = parseInt(data['Votes'], 10) || 0;
      
      // Basic validation
      if (!name || isNaN(lat) || isNaN(lng)) {
        return;
      }
      
      const fullAddress = locality && !address.includes(locality) ? `${address}, ${locality}` : address;
      
      const key = `${name.toLowerCase()}_${lat.toFixed(4)}_${lng.toFixed(4)}`;
      
      if (uniqueTracker.has(key)) {
        duplicateCount++;
        return;
      }
      
      uniqueTracker.add(key);
      
      // Tags
      const tags = cuisine.split(',').map(t => t.trim()).filter(Boolean);
      
      results.push({
        name,
        cuisine,
        address: fullAddress,
        city,
        rating,
        review_count,
        lat,
        lng,
        tags,
        verified: false // Halal not verified
      });
    })
    .on('end', async () => {
      console.log(`Parsed ${results.length} new unique valid records.`);
      console.log(`Skipped ${duplicateCount} duplicates (either internal or already in DB).`);
      
      if (results.length === 0) {
        console.log('No new records to insert.');
        return;
      }
      
      console.log('Starting bulk insert...');
      
      // Insert in batches of 500 to avoid request limits
      const BATCH_SIZE = 500;
      let insertedCount = 0;
      
      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);
        
        const { error } = await supabase
          .from('places')
          .insert(batch);
          
        if (error) {
          console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
        } else {
          insertedCount += batch.length;
          console.log(`Inserted ${insertedCount} / ${results.length} records...`);
        }
      }
      
      console.log('Import completed successfully!');
    });
}

importData();
