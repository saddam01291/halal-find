import { execSync } from 'child_process';

const batches = [
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1386\\content.md", city: "Jammu" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1389\\content.md", city: "Anantnag" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1392\\content.md", city: "Baramulla" }
];

for (const batch of batches) {
    console.log(`\n🚀 Starting import for: ${batch.city} (Kashmir Expansion)`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${batch.file}" "${batch.city}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${batch.city}:`, error.message);
    }
}
console.log("\n✅ Kashmir Expansion batch 20 complete!");
