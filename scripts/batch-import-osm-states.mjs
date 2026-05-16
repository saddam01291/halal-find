import { execSync } from 'child_process';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const states = [
    "Kerala", "Tamil Nadu", "Maharashtra", "West Bengal", "Uttar Pradesh", 
    "Bihar", "Karnataka", "Telangana", "Andhra Pradesh", "Gujarat", 
    "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Assam", "Odisha",
    "Jammu and Kashmir", "Goa", "Delhi"
];

async function run() {
    for (const state of states) {
        console.log(`\n🚀 Starting OSM import for State: ${state}`);
        try {
            execSync(`node scripts/import-osm.mjs "${state}, India"`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`❌ Failed to import OSM data for ${state}:`, error.message);
        }
        console.log(`\n💤 Sleeping for 15 seconds to avoid rate limits...`);
        await sleep(15000);
    }
    console.log("\n✅ Nationwide State-wise OSM import complete!");
}

run();
