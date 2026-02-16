import { createBrowserClient } from '@supabase/ssr';
import fs from 'fs';

// Mock process.env
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

// Direct mimic of src/lib/supabase.ts
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing with Browser Client...');
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Found:', data.length, 'places');
        if (data.length > 0) {
            console.log('Sample:', data[0].name);
        }
    }
}

test();
