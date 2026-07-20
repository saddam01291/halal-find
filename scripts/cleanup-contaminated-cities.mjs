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

async function run() {
    console.log("🔍 Scanning for records where city does not match address...");

    let { data: places, error } = await supabase
        .from('places')
        .select('id, name, city, address');

    if (error) {
        console.error("❌ Error fetching places:", error.message);
        process.exit(1);
    }

    const contaminated = [];

    for (const place of places) {
        if (!place.address || !place.city) continue;

        // Skip India specific edge case names that we might just skip parsing for simplicity
        if (place.city === 'India') continue;

        const addressLower = place.address.toLowerCase();
        const cityLower = place.city.toLowerCase();

        // If the city name is not anywhere in the address string, it's highly likely contaminated 
        // due to the silent fallback bug.
        if (!addressLower.includes(cityLower)) {
            contaminated.push(place);
        }
    }

    console.log(`\n⚠️ Found ${contaminated.length} potentially contaminated records out of ${places.length} total.`);
    
    if (contaminated.length === 0) {
        console.log("✅ Database looks clean.");
        return;
    }

    console.log("Top 10 examples:");
    contaminated.slice(0, 10).forEach(p => {
        console.log(`- ${p.name} | Assigned City: ${p.city} | Actual Address: ${p.address}`);
    });

    const isDelete = process.argv.includes('--delete');

    if (isDelete) {
        console.log("\n🗑️ Deleting contaminated records...");
        const idsToDelete = contaminated.map(p => p.id);
        
        // Delete in batches of 100
        let deletedCount = 0;
        for (let i = 0; i < idsToDelete.length; i += 100) {
            const batch = idsToDelete.slice(i, i + 100);
            const { error: delErr } = await supabase
                .from('places')
                .delete()
                .in('id', batch);
            
            if (delErr) {
                console.error("❌ Error deleting batch:", delErr.message);
            } else {
                deletedCount += batch.length;
                console.log(`  Deleted ${deletedCount}/${idsToDelete.length}`);
            }
        }
        console.log("✅ Cleanup complete.");
    } else {
        console.log("\n💡 Run with --delete flag to remove these contaminated records.");
    }
}

run();
