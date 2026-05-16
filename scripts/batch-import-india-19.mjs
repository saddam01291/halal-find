import { execSync } from 'child_process';

const batches = [
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1358\\content.md", city: "Kasaragod" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1361\\content.md", city: "Wayanad" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1364\\content.md", city: "Palakkad" }
];

for (const batch of batches) {
    console.log(`\n🚀 Starting import for: ${batch.city} (Kerala Expansion)`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${batch.file}" "${batch.city}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${batch.city}:`, error.message);
    }
}
console.log("\n✅ Kerala Expansion batch 19 complete!");
