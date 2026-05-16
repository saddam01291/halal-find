import { execSync } from 'child_process';

const batches = [
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\992\\content.md", city: "Thiruvananthapuram" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\995\\content.md", city: "Thrissur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\998\\content.md", city: "Malappuram" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1001\\content.md", city: "Kannur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\1004\\content.md", city: "Kollam" }
];

for (const batch of batches) {
    console.log(`\n🚀 Starting import for: ${batch.city} (Kerala High Density)`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${batch.file}" "${batch.city}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${batch.city}:`, error.message);
    }
}
console.log("\n✅ Kerala batch 11 complete!");
