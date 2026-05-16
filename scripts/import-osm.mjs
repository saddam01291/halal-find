import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase credentials in .env.local (You need SUPABASE_SERVICE_ROLE_KEY to bypass RLS)");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function importOrchestrator() {
    const cityArgs = process.argv.slice(2).join(' ');
    if (!cityArgs) {
        console.error('Please provide a city name. Example: npm run import:osm "London, UK"');
        process.exit(1);
    }
    
    if (cityArgs.toLowerCase().includes('india') && !cityArgs.includes(',')) {
        console.log(`🔍 Querying Overpass API for ALL strictly tagged Halal locations in India...`);
        const overpassQuery = `
            [out:json][timeout:300];
            area["name"="India"]->.searchArea;
            (
                node["diet:halal"="yes"](area.searchArea);
                way["diet:halal"="yes"](area.searchArea);
                node["cuisine"="halal"](area.searchArea);
                way["cuisine"="halal"](area.searchArea);
                node["halal"="yes"](area.searchArea);
                way["halal"="yes"](area.searchArea);
            );
            out center;
        `;
        const overpassServers = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://overpass.n.osmsurround.org/api/interpreter'
        ];
        
        let overpassRes;
        let success = false;
        
        for (const server of overpassServers) {
            console.log(`📡 Querying server: ${server}`);
            try {
                overpassRes = await fetch(server, {
                    method: 'POST',
                    body: overpassQuery,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 300000
                });
                if (overpassRes.ok) {
                    success = true;
                    break;
                }
                console.warn(`⚠️  Server ${server} failed with status ${overpassRes.status}`);
            } catch (err) {
                console.warn(`⚠️  Server ${server} encountered an error: ${err.message}`);
            }
        }
        
        if (!success) {
            console.error(`❌ All Overpass API servers failed for global query.`);
            process.exit(1);
        }
        const osmData = await overpassRes.json();
        const elements = osmData.elements;
        if (!elements || elements.length === 0) {
            console.log(`ℹ️ No Halal locations found via OSM in India.`);
            process.exit(0);
        }
        processElements(elements, "India");
        return;
    }

    console.log(`\n🌍 Geocoding: ${cityArgs}...`);
    try {
        const nominatimRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityArgs)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'FindHalalApp/1.1 (Contact: admin)' }
        });
        
        if (!nominatimRes.ok) {
            throw new Error(`Nominatim API returned ${nominatimRes.status}`);
        }
        
        const geoData = await nominatimRes.json();
        if (!geoData || geoData.length === 0) {
            console.error('❌ City not found via Nominatim.');
            process.exit(1);
        }
        
        const bbox = geoData[0].boundingbox;
        const overpassBbox = `${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]}`;
        
        console.log(`✅ Found bounding box for ${geoData[0].display_name}`);
        console.log(`🔍 Querying Overpass API for strictly tagged Halal locations...`);
        
        const overpassQuery = `
            [out:json][timeout:180];
            (
                node["diet:halal"="yes"](${overpassBbox});
                way["diet:halal"="yes"](${overpassBbox});
                node["cuisine"="halal"](${overpassBbox});
                way["cuisine"="halal"](${overpassBbox});
                node["halal"="yes"](${overpassBbox});
                way["halal"="yes"](${overpassBbox});
            );
            out center;
        `;
        
        const overpassServers = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://overpass.n.osmsurround.org/api/interpreter'
        ];
        
        let overpassRes;
        let success = false;
        
        for (const server of overpassServers) {
            console.log(`📡 Querying server: ${server}`);
            try {
                overpassRes = await fetch(server, {
                    method: 'POST',
                    body: overpassQuery,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 60000
                });
                if (overpassRes.ok) {
                    success = true;
                    break;
                }
                console.warn(`⚠️  Server ${server} failed with status ${overpassRes.status}`);
            } catch (err) {
                console.warn(`⚠️  Server ${server} encountered an error: ${err.message}`);
            }
        }
        
        if (!success) {
            console.error(`❌ All Overpass API servers failed.`);
            process.exit(1);
        }
        
        const osmData = await overpassRes.json();
        const elements = osmData.elements;
        
        if (!elements || elements.length === 0) {
            console.log(`ℹ️ No authentic Halal locations found via OSM in ${cityArgs}.`);
            process.exit(0);
        }
        
        processElements(elements, cityArgs);
    } catch (error) {
        console.error(`❌ Unexpected error:`, error.message);
        process.exit(1);
    }
}

async function processElements(elements, cityContext) {
        console.log(`✅ Found ${elements.length} strictly tagged Halal places.`);
        console.log(`💾 Inserting into Supabase...`);
        
        let addedCount = 0;
        let skippedCount = 0;

        for (const el of elements) {
            if (!el.tags) continue;
            
            const name = el.tags.name;
            if (!name) {
                skippedCount++;
                continue;
            }
            
            const lat = el.lat || el.center?.lat;
            const lon = el.lon || el.center?.lon;
            const address = `${el.tags['addr:street'] || ''} ${el.tags['addr:housenumber'] || ''}`.trim() || 'Address not listed';
            const extractedCity = el.tags['addr:city'] || cityContext.split(',')[0].trim();
            
            try {
                // Deduplication check by name and approximate location
                const { data: existing, error: checkErr } = await supabase
                    .from('places')
                    .select('id')
                    .eq('name', name)
                    .gt('lat', lat - 0.001)
                    .lt('lat', lat + 0.001)
                    .limit(1);
                    
                if (existing && existing.length > 0) {
                    skippedCount++;
                    continue;
                }
                
                const { error: insertErr } = await supabase.from('places').insert({
                    name: name,
                    cuisine: "Halal", 
                    address: address,
                    city: extractedCity,
                    rating: 0,
                    review_count: 0,
                    image: null, 
                    lat: lat,
                    lng: lon,
                    tags: ["community_sourced", "open_street_map", "authentic"],
                    verified: false,
                    verification_status: 'unverified',
                    halal_status: 'Authentic Halal',
                    halal_source: 'OpenStreetMap Community (diet:halal=yes marker)'
                });
                
                if (insertErr) {
                    // console.error(`Failed to insert ${name}:`, insertErr.message);
                    skippedCount++;
                } else {
                    addedCount++;
                    if (addedCount % 10 === 0) process.stdout.write('.');
                }

            } catch (err) {
                skippedCount++;
            }
        }
        
        console.log(`\n🎉 Process Complete for ${cityContext}!`);
        console.log(`✅ Added: ${addedCount}`);
        console.log(`⏭️  Skipped: ${skippedCount}`);
        process.exit(0);
}

importOrchestrator();
