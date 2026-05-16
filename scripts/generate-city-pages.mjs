import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function generateCityPages() {
    console.log("Fetching all places...");
    const { data: places, error } = await supabase.from('places').select('*');
    if (error) {
        console.error("Error fetching places:", error);
        return;
    }

    // Group by city
    const cityMap = new Map();
    places.forEach(place => {
        if (!place.city) return;
        const cityName = place.city.trim();
        if (!cityName) return;

        if (!cityMap.has(cityName)) {
            cityMap.set(cityName, []);
        }
        cityMap.get(cityName).push(place);
    });

    console.log(`Found ${cityMap.size} unique cities.`);

    for (const [cityName, cityPlaces] of cityMap.entries()) {
        const city_slug = generateSlug(cityName);
        
        // Count restaurants
        const restaurant_count = cityPlaces.length;

        // Extract top cuisines
        const cuisineCounts = {};
        let totalRating = 0;
        let ratedCount = 0;

        cityPlaces.forEach(p => {
            if (p.cuisine) {
                const c = p.cuisine.trim();
                cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
            }
            if (p.rating > 0) {
                totalRating += Number(p.rating);
                ratedCount++;
            }
        });

        const top_cuisines = Object.entries(cuisineCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);

        const avg_rating = ratedCount > 0 ? Number((totalRating / ratedCount).toFixed(1)) : 0;

        // Top restaurants
        const top_restaurants = cityPlaces
            .sort((a, b) => (b.rating * b.review_count) - (a.rating * a.review_count))
            .slice(0, 10)
            .map(p => ({
                id: p.id,
                name: p.name,
                rating: p.rating,
                review_count: p.review_count,
                image: p.image,
                cuisine: p.cuisine
            }));

        const meta_title = `Halal Restaurants in ${cityName} — Verified by Community | FindHalal`;
        const meta_description = `Find the best halal restaurants in ${cityName}. ${restaurant_count}+ verified halal spots with reviews, addresses, and real-time status. Eat with confidence.`;

        const pageData = {
            city_slug,
            city_name: cityName,
            restaurant_count,
            top_cuisines,
            top_restaurants,
            avg_rating,
            meta_title,
            meta_description,
            generated_at: new Date().toISOString()
        };

        // Upsert
        const { error: upsertError } = await supabase
            .from('seo_city_pages')
            .upsert(pageData, { onConflict: 'city_slug' });

        if (upsertError) {
            console.error(`Error upserting ${cityName}:`, upsertError);
        } else {
            console.log(`✅ Upserted ${cityName} (${restaurant_count} places)`);
        }
    }

    console.log("Done generating city pages.");
}

generateCityPages();
