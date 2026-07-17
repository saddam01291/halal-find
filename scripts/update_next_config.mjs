import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redirectsPath = path.join(__dirname, 'redirects.json');
const nextConfigPath = path.join(__dirname, '../next.config.ts');

const redirectsStr = fs.readFileSync(redirectsPath, 'utf8');
const redirects = JSON.parse(redirectsStr);

let config = fs.readFileSync(nextConfigPath, 'utf8');

// We need to insert the redirects into the existing redirects array.
const newRedirects = redirects.map(r => `
      {
        source: '${r.source}',
        destination: '${r.destination}',
        permanent: true,
      }`).join(',');

const replacement = `async redirects() {
    return [
      {
        source: '/halal-restaurants-%D8%AF%D8%A8%D9%8A', // /halal-restaurants-دبي
        destination: '/halal-restaurants-dubai',
        permanent: true,
      },${newRedirects}
    ];
  },`;

config = config.replace(/async redirects\(\) \{[\s\S]*?\},/, replacement);

fs.writeFileSync(nextConfigPath, config);
console.log('Updated next.config.ts with 42 new redirects.');
