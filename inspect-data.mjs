import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Fetching places...');
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Count:', data.length);
    console.log('First 5 Places:');
    data.forEach((p, i) => {
        console.log(`--- Place ${i + 1} ---`);
        console.log('ID:', p.id);
        console.log('Name:', p.name);
        console.log('Cuisine:', p.cuisine);
        console.log('City:', p.city);
        console.log('Image:', p.image);
        console.log('Rating:', p.rating);
        console.log('Tags:', p.tags);
    });
}

test();
