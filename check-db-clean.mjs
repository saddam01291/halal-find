import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, count, error } = await supabase
        .from('places')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('Connection Error:', error.message);
        process.exit(1);
    }

    console.log('TOTAL_PLACES_IN_DB:', count);

    if (data && data.length > 0) {
        console.log('SAMPLE_NAME:', data[0].name);
    }

    const { data: arsalan } = await supabase
        .from('places')
        .select('name')
        .ilike('name', '%arsalan%');

    console.log('ARSALAN_COUNT:', arsalan?.length || 0);
    process.exit(0);
}

test().catch(err => {
    console.error('Script Error:', err);
    process.exit(1);
});
