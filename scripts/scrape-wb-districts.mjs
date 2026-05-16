import { execSync } from 'child_process';
import axios from 'axios';
import fs from 'fs';

const districts = [
    'Howrah', 'Darjeeling', 'Kalimpong', 'Jalpaiguri', 'Alipurduar', 'Cooch Behar', 
    'Malda', 'Uttar Dinajpur', 'Dakshin Dinajpur', 'Murshidabad', 'Nadia', 
    'North 24 Parganas', 'South 24 Parganas', 'Hooghly', 'Purba Bardhaman', 
    'Paschim Bardhaman', 'Purba Medinipur', 'Paschim Medinipur', 'Jhargram', 
    'Bankura', 'Purulia', 'Birbhum'
];

async function run() {
    for (const district of districts) {
        console.log(`\n🌍 Scraping district: ${district}, West Bengal`);
        const url = `https://www.zabihah.com/search?type=restaurants&q=Halal%2C%20${encodeURIComponent(district)}%2C%20West%20Bengal`;
        
        try {
            // We use a temporary file for each district
            const tempFile = `scratch/zabihah_${district.replace(/\s+/g, '_')}.md`;
            
            // In a real scenario, I'd use read_url_content here, but since I'm writing a script to be RUN, 
            // I'll have to rely on the fact that I'll run these one by one or fetch them first.
            // Actually, I'll fetch them ALL now in the background and then run the import.
            
            console.log(`🔗 URL: ${url}`);
        } catch (error) {
            console.error(`❌ Error fetching ${district}:`, error.message);
        }
    }
}

run();
