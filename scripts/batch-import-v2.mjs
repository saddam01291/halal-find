import { execSync } from 'child_process';

// A massive genuine data list
const cities = [
    // UK & Europe
    "Birmingham, UK", "Manchester, UK", "Bradford, UK", "Leicester, UK", "Glasgow, UK",
    "Paris, France", "Berlin, Germany", "Frankfurt, Germany", "Amsterdam, Netherlands",
    "Brussels, Belgium", "Vienna, Austria", "Stockholm, Sweden", "Oslo, Norway",
    "Madrid, Spain", "Barcelona, Spain", "Rome, Italy",

    // North America
    "Chicago, USA", "Los Angeles, USA", "Dearborn, USA", "Houston, USA", "Dallas, USA", 
    "Washington DC, USA", "Philadelphia, USA", "Montreal, Canada", "Vancouver, Canada",

    // Asia & Pacific
    "Kuala Lumpur, Malaysia", "Jakarta, Indonesia", "Bangkok, Thailand", "Tokyo, Japan",
    "Seoul, South Korea", "Dhaka, Bangladesh", "Karachi, Pakistan", "Lahore, Pakistan",
    "Islamabad, Pakistan", "Colombo, Sri Lanka", "Melbourne, Australia", "Auckland, New Zealand",

    // Retry problematic hubs
    "Singapore", "Chennai, India", "Pune, India", "Ahmedabad, India", "Lucknow, India", 
    "Agra, India",

    // MENA & Africa
    "Cairo, Egypt", "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Doha, Qatar",
    "Kuwait City", "Amman, Jordan", "Beirut, Lebanon", "Istanbul, Turkey", "Ankara, Turkey",
    "Casablanca, Morocco", "Marrakech, Morocco", "Cape Town, South Africa", "Lagos, Nigeria"
];

console.log("🚀 Starting MASSIVE Global OSM Halal Scrape V2...");

for (const city of cities) {
    try {
        console.log(`\n======================================================`);
        console.log(`📡 Fetching data for: ${city}`);
        console.log(`======================================================`);
        
        execSync(`node scripts/import-osm.mjs "${city}"`, { stdio: 'inherit' });
        
        // Use an 8-second delay to firmly avoid Overpass API 504 Timeout hits
        console.log(`\n⏳ Cooling down for 8 seconds to respect Overpass API limits...`);
        execSync(`node -e "setTimeout(()=>{}, 8000)"`);
        
    } catch (err) {
        console.error(`❌ Failed or timed out on ${city}. Skipping gracefully to next...`);
        
        // Wait an extra 10 seconds if we hit a failure to let the API recover
        console.log(`⏳ Enforcing extended 10 second recovery cooldown...`);
        execSync(`node -e "setTimeout(()=>{}, 10000)"`);
    }
}

console.log("\n🎊 🎊 MASSIVE Global Import Run Complete! 🎊 🎊");
