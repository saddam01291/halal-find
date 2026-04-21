/**
 * SEO City Page Content Generator
 * 
 * Generates unique, data-driven city landing page content using real DB data.
 * NO AI API needed — uses smart templates + real restaurant data = genuinely unique per city.
 * 
 * Usage: node scripts/generate-seo-content.mjs [--limit=20] [--city=Kolkata]
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqrnhujkvvuipymdtekk.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcm5odWprdnZ1aXB5bWR0ZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI2MjUsImV4cCI6MjA4NjYzODYyNX0.LH0lmt_ua_2fhI0-e297h7S3P4J7a-47fl6p6gDs_Gs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── CITY METADATA (from cities.ts) ──────────────────────
const CITY_META = {
    'Kolkata': { state: 'West Bengal', country: 'India', culture: 'Bengali', specialties: ['Biryani', 'Kathi Rolls', 'Mughlai', 'Rezala'] },
    'Howrah': { state: 'West Bengal', country: 'India', culture: 'Bengali', specialties: ['Biryani', 'Kebab', 'Mughlai'] },
    'Darjeeling': { state: 'West Bengal', country: 'India', culture: 'Nepali-Bengali', specialties: ['Momos', 'Thukpa', 'Biryani'] },
    'Murshidabad': { state: 'West Bengal', country: 'India', culture: 'Bengali', specialties: ['Murshidabadi Biryani', 'Kebab', 'Mughlai'] },
    'Malda': { state: 'West Bengal', country: 'India', culture: 'Bengali', specialties: ['Mango Cuisine', 'Biryani', 'Bengali'] },
    'Mumbai': { state: 'Maharashtra', country: 'India', culture: 'Maharashtrian', specialties: ['Seekh Kebab', 'Biryani', 'Nihari', 'Pav Bhaji'] },
    'New Delhi': { state: 'Delhi', country: 'India', culture: 'North Indian', specialties: ['Butter Chicken', 'Biryani', 'Kebab', 'Nihari'] },
    'Hyderabad': { state: 'Telangana', country: 'India', culture: 'Deccani', specialties: ['Hyderabadi Biryani', 'Haleem', 'Double Ka Meetha'] },
    'Chennai': { state: 'Tamil Nadu', country: 'India', culture: 'South Indian', specialties: ['Biriyani', 'Seeraga Samba Rice', 'Chicken 65'] },
    'Bangalore': { state: 'Karnataka', country: 'India', culture: 'South Indian', specialties: ['Donne Biryani', 'Kebab', 'Mandi'] },
    'Lucknow': { state: 'Uttar Pradesh', country: 'India', culture: 'Awadhi', specialties: ['Tunday Kebab', 'Lucknowi Biryani', 'Nihari', 'Galawati'] },
    'Patna': { state: 'Bihar', country: 'India', culture: 'Bihari', specialties: ['Bihari Kebab', 'Biryani', 'Litti Chokha'] },
    'Surat': { state: 'Gujarat', country: 'India', culture: 'Gujarati', specialties: ['Surti Locho', 'Biryani', 'Seekh Kebab'] },
    'Ahmedabad': { state: 'Gujarat', country: 'India', culture: 'Gujarati', specialties: ['Biryani', 'Kebab', 'Mughlai'] },
    'Jaipur': { state: 'Rajasthan', country: 'India', culture: 'Rajasthani', specialties: ['Laal Maas', 'Biryani', 'Kebab'] },
    'Kochi': { state: 'Kerala', country: 'India', culture: 'Keralite', specialties: ['Malabar Biryani', 'Fish Curry', 'Pathiri'] },
    'Bhopal': { state: 'Madhya Pradesh', country: 'India', culture: 'Bhopali', specialties: ['Bhopali Gosht Korma', 'Biryani', 'Kebab'] },
    'Srinagar': { state: 'Jammu and Kashmir', country: 'India', culture: 'Kashmiri', specialties: ['Wazwan', 'Rogan Josh', 'Yakhni'] },
    'Guwahati': { state: 'Assam', country: 'India', culture: 'Assamese', specialties: ['Assamese Curry', 'Biryani', 'Kebab'] },
    'London': { state: 'England', country: 'UK', culture: 'British-Multicultural', specialties: ['Curry', 'Shawarma', 'Fried Chicken'] },
    'Birmingham': { state: 'England', country: 'UK', culture: 'British-South Asian', specialties: ['Balti', 'Biryani', 'Kebab'] },
    'New York City': { state: 'New York', country: 'USA', culture: 'American-Multicultural', specialties: ['Halal Cart', 'Shawarma', 'Biryani'] },
    'Houston': { state: 'Texas', country: 'USA', culture: 'Texan-Multicultural', specialties: ['BBQ', 'Biryani', 'Pakistani'] },
    'Chicago': { state: 'Illinois', country: 'USA', culture: 'Midwestern', specialties: ['Mediterranean', 'Biryani', 'Shawarma'] },
    'Dubai': { state: 'Dubai', country: 'UAE', culture: 'Emirati-Global', specialties: ['Mandi', 'Shawarma', 'Machboos'] },
    'Kuala Lumpur': { state: 'Kuala Lumpur', country: 'Malaysia', culture: 'Malay', specialties: ['Nasi Lemak', 'Rendang', 'Satay'] },
    'Istanbul': { state: 'Istanbul', country: 'Turkey', culture: 'Turkish', specialties: ['Döner', 'Lahmacun', 'Iskender'] },
    'Paris': { state: 'Île-de-France', country: 'France', culture: 'French-North African', specialties: ['Couscous', 'Shawarma', 'Tagine'] },
    'Toronto': { state: 'Ontario', country: 'Canada', culture: 'Canadian-Multicultural', specialties: ['Shawarma', 'Biryani', 'Poutine'] },
    'Singapore City': { state: 'Singapore', country: 'Singapore', culture: 'Malay-Chinese', specialties: ['Nasi Padang', 'Mee Goreng', 'Satay'] },
};

// ─── SLUG HELPER ──────────────────────
function cityToSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── CONTENT GENERATION (Data-Driven, Zero AI) ──────────────────────

/**
 * Generate a unique 350-450 word intro for a city.
 * The trick: Uses REAL restaurant names, real cuisine counts, real ratings
 * so every city's content is genuinely unique and factual.
 */
function generateIntro(cityName, meta, stats) {
    const { state, country, culture, specialties } = meta;
    const { count, topCuisines, topRated, avgRating, neighborhoods } = stats;

    const specialtyStr = specialties?.slice(0, 3).join(', ') || 'diverse Halal cuisines';
    const topCuisineStr = topCuisines.slice(0, 4).join(', ') || 'various styles';
    const neighborhoodStr = neighborhoods.length > 0
        ? neighborhoods.slice(0, 3).join(', ')
        : cityName;

    // Pick varied opening patterns based on city hash to avoid repetition
    const hash = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const openers = [
        `${cityName} stands as one of ${country}'s most vibrant destinations for Halal dining. With ${count} verified Halal restaurants listed on FindHalalOnly, the city offers an exceptional range of authentic ${culture} and international Halal cuisine that caters to both residents and visitors seeking trusted dining options.`,
        `When it comes to Halal food, ${cityName} delivers an experience unlike any other city in ${state}. Home to ${count} Halal restaurants verified by our community, this ${culture} culinary hub blends tradition with modern dining — making it one of the most exciting places to explore Halal cuisine in ${country}.`,
        `For Muslim travellers and food enthusiasts visiting ${state}, ${cityName} is a treasure trove of certified Halal restaurants. Our community has verified ${count} Halal dining spots across the city, spanning everything from street food stalls to premium fine-dining — each committed to serving genuinely Halal meals.`,
        `${cityName}, ${state} has earned its reputation as a premier Halal food destination in ${country}. With a growing network of ${count} verified restaurants on FindHalalOnly, the city's ${culture} culinary heritage shines through an incredible diversity of Halal options that satisfy every palate and budget.`,
    ];

    const topRatedSection = topRated.length > 0
        ? `Among the highest-rated Halal restaurants in ${cityName}, ${topRated.slice(0, 3).map(r => `**${r.name}**`).join(', ')} ${topRated.length > 1 ? 'have' : 'has'} earned outstanding community ratings for consistent quality, authentic preparation, and verified Halal sourcing. These establishments represent the gold standard of Halal dining in the region.`
        : `The Halal restaurants in ${cityName} are regularly reviewed and rated by our growing community of diners, ensuring you always have up-to-date information about food quality and Halal compliance.`;

    const cuisineSection = `The culinary landscape spans ${topCuisineStr}, with local favourites like ${specialtyStr} drawing both everyday diners and food tourists. Whether you're craving a quick bite in ${neighborhoodStr} or planning a family dinner, ${cityName}'s Halal scene has something for every occasion.`;

    const closingPatterns = [
        `At FindHalalOnly, we believe every Muslim family deserves access to trustworthy Halal dining information. Our community-driven verification process ensures that each listing in ${cityName} meets genuine Halal standards — so you can dine with complete confidence. Browse our curated list below to discover your next favourite spot.`,
        `FindHalalOnly's mission is simple: help you find Halal food you can trust. Every restaurant listed in ${cityName} has been reviewed by real community members who verify Halal authenticity, food quality, and overall experience. Explore the verified listings below and find your perfect Halal meal today.`,
        `Whether you're a local resident or visiting ${cityName} for the first time, FindHalalOnly is your most reliable guide to verified Halal dining. Our ${count} listings are regularly updated with fresh reviews, ratings, and verification statuses — giving you the confidence to eat Halal, anywhere in ${state}.`,
    ];

    return [
        openers[hash % openers.length],
        '',
        cuisineSection,
        '',
        topRatedSection,
        '',
        closingPatterns[hash % closingPatterns.length]
    ].join('\n');
}

/**
 * Generate 5 unique FAQ Q&As per city using real statistics
 */
function generateFAQ(cityName, meta, stats) {
    const { state, country } = meta;
    const { count, topCuisines, avgRating, topRated } = stats;

    const bestRestaurant = topRated[0]?.name || 'several top-rated spots';
    const cuisineList = topCuisines.slice(0, 4).join(', ') || 'Indian, Middle Eastern, and International';

    return [
        {
            q: `How many Halal restaurants are there in ${cityName}?`,
            a: `FindHalalOnly currently lists ${count} verified Halal restaurants in ${cityName}, ${state}. This number grows regularly as our community adds and verifies new spots. Each listing includes ratings, reviews, and Halal verification status to help you make informed dining choices.`
        },
        {
            q: `What are the best Halal restaurants in ${cityName}?`,
            a: `Based on community ratings and reviews, ${bestRestaurant} is among the top-rated Halal restaurants in ${cityName}. The average rating across all Halal restaurants in the city is ${avgRating}/5. Browse our full list below sorted by rating and community trust score to find the best options near you.`
        },
        {
            q: `What types of Halal cuisine are available in ${cityName}?`,
            a: `${cityName} offers a diverse range of Halal cuisines including ${cuisineList}. From traditional local dishes to international favourites, the city's Halal food scene caters to every taste preference and dietary requirement.`
        },
        {
            q: `How does FindHalalOnly verify Halal restaurants in ${cityName}?`,
            a: `Every restaurant on FindHalalOnly goes through a multi-layer verification process. Community members submit reviews confirming Halal status, restaurant owners can claim and verify their listings with documentation, and our trust scoring system aggregates all verification signals. Look for the "Owner Verified" or "Community Verified" badges on each listing.`
        },
        {
            q: `Is it safe for Muslim tourists to find Halal food in ${cityName}?`,
            a: `Yes, ${cityName} has a well-established Halal food network. With ${count} verified restaurants on our platform and an active community of reviewers, Muslim visitors can confidently find authentic Halal dining options across the city. We recommend checking the verification badge and recent reviews before visiting any restaurant.`
        }
    ];
}

/**
 * Generate SEO meta title and description
 */
function generateMeta(cityName, state, country, count) {
    const title = `Best Halal Food in ${cityName} — ${count} Verified Restaurants | FindHalalOnly`;
    
    // Keep under 155 chars
    const descOptions = [
        `Discover ${count} verified Halal restaurants in ${cityName}, ${state}. Community-rated, owner-verified. Find trusted Halal food near you on FindHalalOnly.`,
        `Find the best Halal restaurants in ${cityName}. ${count} verified spots with ratings, reviews & Halal certification status. Your trusted Halal food guide.`,
        `${count} Halal restaurants in ${cityName}, ${state} — verified by community. Ratings, maps, reviews & Halal status. Discover authentic Halal dining today.`,
    ];
    const hash = cityName.length % descOptions.length;
    const description = descOptions[hash].substring(0, 155);
    
    return { title, description };
}

/**
 * Compute nearby cities using simple distance heuristic from CITY_META keys
 */
function findNearbyCities(cityName, allCitySlugs) {
    // Simple approach: same state/country preference
    const meta = CITY_META[cityName];
    if (!meta) return allCitySlugs.filter(c => c.name !== cityName).slice(0, 5);

    const sameState = allCitySlugs.filter(c => c.name !== cityName && c.state === meta.state);
    const sameCountry = allCitySlugs.filter(c => c.name !== cityName && c.country === meta.country && c.state !== meta.state);

    const nearby = [...sameState.slice(0, 3), ...sameCountry.slice(0, 2)].slice(0, 5);
    
    if (nearby.length < 3) {
        const others = allCitySlugs.filter(c => c.name !== cityName && !nearby.find(n => n.name === c.name));
        nearby.push(...others.slice(0, 5 - nearby.length));
    }
    
    return nearby.map(c => ({ name: c.name, slug: cityToSlug(c.name), count: c.count }));
}

// ─── MAIN EXECUTION ──────────────────────

async function main() {
    const args = process.argv.slice(2);
    const limitArg = args.find(a => a.startsWith('--limit='));
    const cityArg = args.find(a => a.startsWith('--city='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 999;
    const onlyCity = cityArg ? cityArg.split('=')[1] : null;

    console.log('🚀 SEO City Page Content Generator');
    console.log('─'.repeat(50));

    // 1. Fetch all cities from DB with restaurant counts
    console.log('\n📊 Fetching city statistics from database...');
    const { data: places, error } = await supabase
        .from('places')
        .select('id, name, cuisine, city, address, rating, review_count, verified, lat, lng, image, halal_status');

    if (error || !places) {
        console.error('❌ Failed to fetch places:', error?.message);
        process.exit(1);
    }

    console.log(`   Found ${places.length} total restaurants`);

    // 2. Aggregate by city
    const cityMap = {};
    for (const p of places) {
        const city = (p.city || '').trim();
        if (!city || city === 'Unknown') continue;

        if (!cityMap[city]) {
            cityMap[city] = { restaurants: [], cuisines: {}, neighborhoods: new Set() };
        }
        cityMap[city].restaurants.push(p);
        
        const cuisine = (p.cuisine || '').trim();
        if (cuisine) {
            cityMap[city].cuisines[cuisine] = (cityMap[city].cuisines[cuisine] || 0) + 1;
        }

        // Extract neighborhood from address
        const addr = (p.address || '').trim();
        if (addr && addr !== city) {
            const parts = addr.split(',').map(s => s.trim()).filter(s => s && s !== city);
            if (parts.length > 0) {
                cityMap[city].neighborhoods.add(parts[0]);
            }
        }
    }

    // 3. Sort by restaurant count
    let cityList = Object.entries(cityMap)
        .map(([name, data]) => ({
            name,
            count: data.restaurants.length,
            data
        }))
        .sort((a, b) => b.count - a.count);

    if (onlyCity) {
        cityList = cityList.filter(c => c.name.toLowerCase() === onlyCity.toLowerCase());
    }

    cityList = cityList.slice(0, limit);

    console.log(`\n🏙  Processing ${cityList.length} cities (sorted by restaurant count):\n`);
    cityList.forEach((c, i) => console.log(`   ${i + 1}. ${c.name} — ${c.count} restaurants`));

    // Prepare city list for nearby calculation
    const allCityInfo = cityList.map(c => ({
        name: c.name,
        state: CITY_META[c.name]?.state || '',
        country: CITY_META[c.name]?.country || '',
        count: c.count
    }));

    // 4. Generate content for each city
    let generated = 0;
    for (const city of cityList) {
        const slug = cityToSlug(city.name);
        const meta = CITY_META[city.name] || {
            state: '', country: 'Global', culture: 'Multicultural', specialties: ['Halal Food']
        };

        // Compute stats
        const topCuisines = Object.entries(city.data.cuisines)
            .sort(([, a], [, b]) => b - a)
            .map(([name]) => name)
            .slice(0, 6);

        const topRated = city.data.restaurants
            .filter(r => r.rating > 0)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 10)
            .map(r => ({
                id: r.id,
                name: r.name,
                cuisine: r.cuisine,
                rating: r.rating,
                review_count: r.review_count,
                image: r.image,
                halal_status: r.halal_status,
                verified: r.verified
            }));

        const totalRating = city.data.restaurants.reduce((sum, r) => sum + (r.rating || 0), 0);
        const ratedCount = city.data.restaurants.filter(r => r.rating > 0).length;
        const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : '4.0';

        const neighborhoods = [...city.data.neighborhoods].slice(0, 5);

        const stats = { count: city.count, topCuisines, topRated, avgRating, neighborhoods };

        // Generate content
        const intro = generateIntro(city.name, meta, stats);
        const faq = generateFAQ(city.name, meta, stats);
        const { title, description } = generateMeta(city.name, meta.state, meta.country, city.count);
        const nearbyCities = findNearbyCities(city.name, allCityInfo);

        // 5. Upsert into seo_city_pages
        const { error: upsertError } = await supabase
            .from('seo_city_pages')
            .upsert({
                city_slug: slug,
                city_name: city.name,
                state: meta.state || null,
                country: meta.country || 'Global',
                restaurant_count: city.count,
                top_cuisines: topCuisines,
                top_restaurants: topRated,
                ai_intro: intro,
                ai_faq: faq,
                meta_title: title,
                meta_description: description,
                nearby_cities: nearbyCities,
                avg_rating: parseFloat(avgRating),
                generated_at: new Date().toISOString()
            }, { onConflict: 'city_slug' });

        if (upsertError) {
            console.error(`   ❌ ${city.name}: ${upsertError.message}`);
        } else {
            generated++;
            console.log(`   ✅ ${city.name} (${slug}) — ${city.count} restaurants, ${topCuisines.length} cuisines`);
        }
    }

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`✨ Generated SEO content for ${generated}/${cityList.length} cities`);
    console.log(`📝 Run 'next build' to generate static city pages`);
    console.log(`🗺  Don't forget to submit sitemap.xml to Google Search Console`);
}

main().catch(console.error);
