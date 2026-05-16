import { execSync } from 'child_process';

const batches = [
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\789\\content.md", city: "Guntur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\792\\content.md", city: "Nellore" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\795\\content.md", city: "Kochi" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\798\\content.md", city: "Bhavnagar" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\801\\content.md", city: "Dehradun" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\812\\content.md", city: "Durgapur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\815\\content.md", city: "Asansol" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\818\\content.md", city: "Rourkela" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\821\\content.md", city: "Nanded" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\824\\content.md", city: "Kolhapur" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\827\\content.md", city: "Ajmer" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\830\\content.md", city: "Gulbarga" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\833\\content.md", city: "Jamnagar" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\836\\content.md", city: "Ujjain" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\843\\content.md", city: "Siliguri" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\846\\content.md", city: "Jammu" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\849\\content.md", city: "Mangalore" },
    { file: "C:\\Users\\Saddam\\.gemini\\antigravity\\brain\\9b7ecc51-1f3e-4239-b9ba-533589d9dc44\\.system_generated\\steps\\852\\content.md", city: "Belgaum" }
];

for (const batch of batches) {
    console.log(`\n🚀 Starting import for: ${batch.city}`);
    try {
        execSync(`node scripts/import-zabihah.mjs "${batch.file}" "${batch.city}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Failed to import ${batch.city}:`, error.message);
    }
}
console.log("\n✅ India batch 7 complete!");
