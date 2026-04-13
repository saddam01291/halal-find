import { execSync } from 'child_process';

const cities = [
    "Delhi, India",
    "Mumbai, India",
    "Hyderabad, India",
    "Bangalore, India",
    "Kolkata, India",
    "Chennai, India",
    "New York, USA",
    "Dubai, UAE",
    "Toronto, Canada",
    "Sydney, Australia",
    "Singapore"
];

console.log("🚀 Starting Bulk OSM Halal Run...");

for (const city of cities) {
    try {
        console.log(`\n============================`);
        console.log(`📡 Fetching: ${city}`);
        console.log(`============================`);
        
        execSync(`node scripts/import-osm.mjs "${city}"`, { stdio: 'inherit' });
        
        console.log(`\n⏳ Waiting 5 seconds to skip rate limits...`);
        execSync(`node -e "setTimeout(()=>{}, 5000)"`);
        
    } catch (err) {
        console.error(`❌ Failed on ${city}. Skipping to next...`);
    }
}

console.log("\n🎉 Bulk Run Complete!");
