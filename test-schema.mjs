import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: place, error: placesError } = await supabase
        .from('places')
        .select('*')
        .limit(1);

    const { data: req, error: reqError } = await supabase
        .from('verification_requests')
        .select('*')
        .limit(1);

    console.log('--- PLACES SCHEMA ---');
    if (placesError) console.error(placesError);
    else if (place && place.length > 0) console.log(Object.keys(place[0]));
    else console.log('places table is empty');

    console.log('\n--- VERIFICATION_REQUESTS SCHEMA ---');
    if (reqError) console.error(reqError);
    else if (req && req.length > 0) console.log(Object.keys(req[0]));
    else console.log('verification_requests table is empty');

    process.exit(0);
}

test();
