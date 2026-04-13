import { execSync } from 'child_process';

const cities = [
    "Kolkata, West Bengal, India",
    "Howrah, West Bengal, India",
    "Darjeeling, West Bengal, India",
    "Siliguri, West Bengal, India",
    "Asansol, West Bengal, India",
    "Durgapur, West Bengal, India",
    "Bardhaman, West Bengal, India",
    "Malda, West Bengal, India",
    "Baharampur, West Bengal, India",
    "Kharagpur, West Bengal, India",
    "Haldia, West Bengal, India",
    "Jalpaiguri, West Bengal, India",
    "Alipurduar, West Bengal, India",
    "Purulia, West Bengal, India",
    "Raiganj, West Bengal, India",
    "Balurghat, West Bengal, India",
    "Krishnanagar, West Bengal, India",
    "Midnapore, West Bengal, India",
    "Bankura, West Bengal, India",
    "Cooch Behar, West Bengal, India",
    "Hooghly, West Bengal, India",
    "Nadia, West Bengal, India"
];

console.log("🚀 Starting Bulk OSM Halal Scrape for West Bengal...");

for (const city of cities) {
    try {
        console.log(`\n======================================================`);
        console.log(`📡 Fetching data for: ${city}`);
        console.log(`======================================================`);
        
        execSync(`node scripts/import-osm.mjs "${city}"`, { stdio: 'inherit' });
        
        console.log(`\n⏳ Cooling down for 8 seconds to respect Overpass API limits...`);
        execSync(`node -e "setTimeout(()=>{}, 8000)"`);
        
    } catch (err) {
        console.error(`❌ Failed or timed out on ${city}. Skipping gracefully to next...`);
        
        console.log(`⏳ Enforcing extended 10 second recovery cooldown...`);
        execSync(`node -e "setTimeout(()=>{}, 10000)"`);
    }
}

console.log("\n🎊 🎊 West Bengal Import Run Complete! 🎊 🎊");
