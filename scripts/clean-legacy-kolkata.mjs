import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function cleanLegacyKolkata() {
    console.log("🧹 Starting Database Cleanup: Purging legacy Kolkata defaults...");

    // Kolkata defaults we used to have:
    const DEFAULT_LAT = 22.5726;
    const DEFAULT_LNG = 88.3639;

    // 1. Find places where city is NOT Kolkata but coordinates ARE the Kolkata default
    console.log("🔍 Searching for mismatched coordinates in 'places' table...");
    
    // We use a small epsilon because sometimes floats vary slightly
    const { data: mismatchedPlaces, error: fetchError } = await supabase
        .from('places')
        .select('id, name, city, address')
        .neq('city', 'Kolkata')
        .gt('lat', DEFAULT_LAT - 0.0001)
        .lt('lat', DEFAULT_LAT + 0.0001)
        .gt('lng', DEFAULT_LNG - 0.0001)
        .lt('lng', DEFAULT_LNG + 0.0001);

    if (fetchError) {
        console.error("❌ Error fetching mismatched places:", fetchError.message);
        return;
    }

    console.log(`📡 Found ${mismatchedPlaces?.length || 0} places with incorrect Kolkata defaults.`);

    if (mismatchedPlaces && mismatchedPlaces.length > 0) {
        const ids = mismatchedPlaces.map(p => p.id);
        
        console.log(`🛠️ Resetting coordinates to NULL for ${ids.length} places (setting them to "Location Pending")...`);
        
        const { error: updateError } = await supabase
            .from('places')
            .update({ lat: null, lng: null })
            .in('id', ids);

        if (updateError) {
            console.error("❌ Error updating places:", updateError.message);
        } else {
            console.log("✅ Successfully updated places.");
            mismatchedPlaces.forEach(p => console.log(`   - Fixed: ${p.name} (${p.city})`));
        }
    }

    // 2. Also check 'verification_requests' table as new submissions go there
    console.log("\n🔍 Checking 'verification_requests' table...");
    const { data: mismatchedRequests, error: reqFetchError } = await supabase
        .from('verification_requests')
        .select('id, restaurant_name, city')
        .neq('city', 'Kolkata')
        .gt('lat', DEFAULT_LAT - 0.0001)
        .lt('lat', DEFAULT_LAT + 0.0001)
        .gt('lng', DEFAULT_LNG - 0.0001)
        .lt('lng', DEFAULT_LNG + 0.0001);

    if (reqFetchError) {
        console.error("❌ Error fetching verification requests:", reqFetchError.message);
    } else if (mismatchedRequests && mismatchedRequests.length > 0) {
        console.log(`📡 Found ${mismatchedRequests.length} pending requests with incorrect Kolkata defaults.`);
        const reqIds = mismatchedRequests.map(r => r.id);
        
        const { error: reqUpdateError } = await supabase
            .from('verification_requests')
            .update({ lat: null, lng: null })
            .in('id', reqIds);

        if (reqUpdateError) {
            console.error("❌ Error updating verification requests:", reqUpdateError.message);
        } else {
            console.log("✅ Successfully updated pending requests.");
        }
    } else {
        console.log("✅ No pending requests found with bad defaults.");
    }

    console.log("\n🎉 Cleanup Complete!");
}

cleanLegacyKolkata();
