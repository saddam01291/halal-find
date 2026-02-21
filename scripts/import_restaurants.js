require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
    console.error('Missing environment variables. Check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const GRID_FILE = './scripts/kolkata_grid.json';
const grid = require(GRID_FILE);

const SEARCH_KEYWORDS = ['Halal restaurant', 'Biryani', 'Mughlai', 'Muslim food', 'Kebab'];

async function searchGrid() {
    console.log('Starting Kolkata Bulk Import Scan...');
    let totalFound = 0;
    let totalImported = 0;

    for (const area of grid) {
        console.log(`\nScanning Area: ${area.name}...`);

        for (const keyword of SEARCH_KEYWORDS) {
            try {
                // Using Text Search for better keyword matching
                const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                    params: {
                        query: `${keyword} in ${area.name}, Kolkata`,
                        location: `${area.center.lat},${area.center.lng}`,
                        radius: area.radius,
                        key: googleApiKey
                    }
                });

                const results = response.data.results;
                console.log(`  Found ${results.length} results for "${keyword}"`);
                totalFound += results.length;

                for (const place of results) {
                    const imported = await importPlace(place);
                    if (imported) totalImported++;
                }

                // API throttles if too fast
                await new Promise(r => setTimeout(r, 500));

            } catch (err) {
                console.error(`  Error searching for ${keyword}:`, err.message);
            }
        }
    }

    console.log(`\nScan Complete!`);
    console.log(`Total items processed: ${totalFound}`);
    console.log(`Total new items imported: ${totalImported}`);
}

async function importPlace(googlePlace) {
    try {
        // Basic filter: must be a restaurant/food establishment
        if (!googlePlace.types.includes('restaurant') && !googlePlace.types.includes('food') && !googlePlace.types.includes('establishment')) {
            return false;
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('places')
            .select('id')
            .eq('name', googlePlace.name)
            .ilike('address', `%${googlePlace.formatted_address.split(',')[0]}%`)
            .single();

        if (existing) return false;

        // Fetch deep details (reviews, etc) for Halal verification
        const detailsResp = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: googlePlace.place_id,
                fields: 'reviews,serves_beer,serves_wine,editorial_summary',
                key: googleApiKey
            }
        });

        const details = detailsResp.data.result || {};
        const reviews = details.reviews || [];
        const reviewText = reviews.map(r => r.text).join(' ').toLowerCase();

        // Simple Halal keyword scoring
        let halalScore = 0;
        if (reviewText.includes('halal')) halalScore += 5;
        if (reviewText.includes('muslim')) halalScore += 2;
        if (googlePlace.name.toLowerCase().includes('halal')) halalScore += 10;

        // Anti-halal signals
        if (details.serves_beer || details.serves_wine) halalScore -= 10;
        if (reviewText.includes('pork')) halalScore -= 20;

        // Only import if it seems likely halal or if biryani/mughlai is known halal in Kolkata
        // In Kolkata, Biryani/Mughlai places are almost 100% halal
        const isLikelyHalal = halalScore > 0 ||
            googlePlace.name.toLowerCase().includes('biryani') ||
            googlePlace.name.toLowerCase().includes('aminia') ||
            googlePlace.name.toLowerCase().includes('arsalan');

        if (!isLikelyHalal) return false;

        const { error } = await supabase.from('places').insert({
            name: googlePlace.name,
            cuisine: googlePlace.types.includes('bakery') ? 'Bakery' : 'Mughlai / Indian',
            address: googlePlace.formatted_address,
            city: 'Kolkata',
            rating: googlePlace.rating || 0,
            image: googlePlace.photos?.[0]?.photo_reference
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${googlePlace.photos[0].photo_reference}&key=${googleApiKey}`
                : 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
            lat: googlePlace.geometry.location.lat,
            lng: googlePlace.geometry.location.lng,
            tags: googlePlace.types,
            verified: halalScore > 5 // Mark as verified if "Halal" mentioned often
        });

        if (error) {
            console.error(`  Failed to insert ${googlePlace.name}:`, error.message);
            return false;
        }

        console.log(`  + Imported: ${googlePlace.name}`);
        return true;

    } catch (err) {
        console.error(`  Error importing ${googlePlace.name}:`, err.message);
        return false;
    }
}

searchGrid();
