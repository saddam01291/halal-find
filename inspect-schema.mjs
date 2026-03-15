import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking verification_requests Table ---');

    // Try to fetch one row to see which columns are actually returned
    const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching verification_requests:', error.message);
        if (error.message.includes('column "type" does not exist')) {
            console.log('CONFIRMED: Column "type" is MISSING.');
        }
    } else {
        console.log('Successfully fetched sample row:', data);
        if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]));
        } else {
            console.log('Table is empty, trying to probe columns via error induction...');
            const { error: typeError } = await supabase.from('verification_requests').select('type').limit(1);
            if (typeError) console.log('Probing "type":', typeError.message);
            else console.log('Column "type" EXISTS.');

            const { error: idError } = await supabase.from('verification_requests').select('place_id').limit(1);
            if (idError) console.log('Probing "place_id":', idError.message);
            else console.log('Column "place_id" EXISTS.');
        }
    }

    console.log('\n--- Checking places Table ---');
    const { error: halalError } = await supabase.from('places').select('halal_status').limit(1);
    if (halalError) console.log('Column "halal_status" in places:', halalError.message);
    else console.log('Column "halal_status" EXISTS in places.');

    process.exit(0);
}

checkSchema().catch(console.error);
