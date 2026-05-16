import { execSync } from 'child_process';
import path from 'path';

const files = [
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\264\\content.md", // Toronto
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\267\\content.md", // London
    "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\271\\content.md"  // Chicago
];

for (const file of files) {
    console.log(`\n🚀 Starting import for: ${file}`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${file}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${file}:`, error.message);
    }
}
console.log("\n✅ All batches complete!");
