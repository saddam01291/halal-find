import { execSync } from 'child_process';
import path from 'path';

const files = [
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\327\\content.md", // Mumbai
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\330\\content.md", // Delhi
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\333\\content.md", // Hyderabad
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\336\\content.md", // Bengaluru
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\339\\content.md"  // Kolkata
];

for (const file of files) {
    console.log(`\n🇮🇳 Starting import for Indian city: ${file}`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${file}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${file}:`, error.message);
    }
}
console.log("\n✅ All Indian city batches complete!");
