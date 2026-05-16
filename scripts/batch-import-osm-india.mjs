import { execSync } from 'child_process';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Chennai", 
    "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow", "Kanpur", 
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", 
    "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", 
    "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", 
    "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", 
    "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", 
    "Madurai", "Raipur", "Kota", "Chandigarh", "Guwahati", "Solapur", 
    "Hubli-Dharwad", "Kerala", "West Bengal", "Uttar Pradesh", "Bihar",
    "Tamil Nadu", "Maharashtra", "Karnataka", "Telangana", "Andhra Pradesh",
    "Gujarat", "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Assam", "Odisha"
];

async function run() {
    for (const city of cities) {
        console.log(`\n🚀 Starting OSM import for: ${city}`);
        try {
            execSync(`node scripts/import-osm.mjs "${city}, India"`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`❌ Failed to import OSM data for ${city}:`, error.message);
        }
        console.log(`\n💤 Sleeping for 15 seconds to avoid rate limits...`);
        await sleep(15000);
    }
    console.log("\n✅ Nationwide OSM import complete!");
}

run();
