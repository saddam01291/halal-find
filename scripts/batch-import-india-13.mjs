import { execSync } from 'child_process';

const batches = [
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1035\\content.md", city: "Aligarh" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1038\\content.md", city: "Rampur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1041\\content.md", city: "Firozabad" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1044\\content.md", city: "Sambhal" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1051\\content.md", city: "Amroha" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1054\\content.md", city: "Budaun" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1057\\content.md", city: "Bahraich" }
];

for (const batch of batches) {
    console.log(`\n🚀 Starting import for: ${batch.city} (High Density Regional)`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${batch.file}" "${batch.city}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${batch.city}:`, error.message);
    }
}
console.log("\n✅ High-density batch 13 complete!");
