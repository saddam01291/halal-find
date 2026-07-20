import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeGoogle(address) {
    if (!GOOGLE_MAPS_API_KEY) return null;
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await axios.get(url);
        if (res.data.status === 'OK') {
            const result = res.data.results[0];
            return {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                formatted_address: result.formatted_address,
                city: result.address_components.find(c => c.types.includes('locality'))?.long_name || 
                      result.address_components.find(c => c.types.includes('sublocality'))?.long_name || 
                      result.address_components.find(c => c.types.includes('administrative_area_level_2'))?.long_name || ''
            };
        }
    } catch (error) {}
    return null;
}

async function geocodeNominatim(query) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'FindHalalApp/1.1 (Contact: admin)' },
            timeout: 5000
        });
        if (res.data && res.data.length > 0) {
            const result = res.data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                formatted_address: result.display_name,
                city: result.address?.city || result.address?.town || result.address?.village || result.address?.county || result.address?.state_district || ''
            };
        }
    } catch (error) {}
    return null;
}

async function geocode(name, address, city) {
    // 1. Try Google with full address
    let result = await geocodeGoogle(address);
    if (result) return result;
    
    // 2. Try Nominatim with full address
    await sleep(1000);
    result = await geocodeNominatim(address);
    if (result) return result;
    
    // 3. Try Nominatim with Name + City (Broader)
    console.log(`🔄 Trying broader search for: ${name} in ${city}`);
    await sleep(1000);
    result = await geocodeNominatim(`${name}, ${city}`);
    if (result) return result;

    // 4. Try Nominatim with City only as a last resort (not ideal but better than nothing for map placement)
    // Actually, let's just fail if we can't find a specific point.
    
    return null;
}

async function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const restaurants = [];
    
    const regex = /### (.*)\r?\n(.*)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const name = match[1].trim();
        const address = match[2].trim();
        
        if (['Discover', 'Company', 'Social', 'Get the app', 'Top cuisines', 'Location', 'Similar restaurants', 'Nearby halal restaurants', 'Halal summary', 'Filter your results'].includes(name)) continue;
        if (address.length > 200 || address.length < 3) continue;

        restaurants.push({ name, address });
    }
    return restaurants;
}

async function run() {
    const filePath = process.argv[2];
    const targetCity = process.argv[3] || 'India';
    if (!filePath) {
        console.error("Please provide a path to the markdown file.");
        process.exit(1);
    }
    
    const restaurants = await parseMarkdownFile(filePath);
    console.log(`\n📄 Parsed ${restaurants.length} restaurants from file.`);
    
    let addedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const item of restaurants) {
        console.log(`\n📍 Processing: ${item.name}...`);
        
        const { data: existing } = await supabase
            .from('places')
            .select('id')
            .ilike('name', item.name)
            .ilike('city', targetCity)
            .limit(1);
        
        if (existing && existing.length > 0) {
            console.log(`⏭️  Skipping duplicate: ${item.name} already exists in ${targetCity}`);
            skippedCount++;
            continue;
        }

        const geo = await geocode(item.name, item.address, targetCity);
        if (geo) {
            let finalCity = geo.city;
            if (finalCity && finalCity.endsWith(' District')) {
                finalCity = finalCity.replace(' District', '');
            }
            if (!finalCity) {
                 console.log(`⚠️  Could not determine city for ${item.name}. Skipping to prevent data contamination.`);
                 skippedCount++;
                 continue;
            }

            const { error } = await supabase.from('places').insert({
                name: item.name,
                cuisine: "Halal", 
                address: geo.formatted_address || item.address,
                city: finalCity,
                rating: 0,
                review_count: 0,
                lat: geo.lat,
                lng: geo.lng,
                tags: ['verified_listing', 'community'], 
                verified: false,
                verification_status: 'unverified',
                halal_status: 'Authentic'
            });
            
            if (error) {
                console.error(`❌ Insert error for ${item.name}:`, error.message);
                failedCount++;
            } else {
                console.log(`✅ Success: ${item.name}`);
                addedCount++;
            }
        } else {
            console.warn(`⚠️  Geocoding failed for ${item.name}. Skipping.`);
            failedCount++;
        }
        await sleep(500); 
    }
    console.log(`\n🎉 Done! Added ${addedCount}, Skipped ${skippedCount}, Failed ${failedCount}`);
}

run();
