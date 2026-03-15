import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
    console.log('--- Checking Supabase Storage ---');

    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('Error listing buckets:', bucketError.message);
    } else {
        console.log('Buckets found:', buckets.map(b => b.name));
        const restaurantBucket = buckets.find(b => b.name === 'restaurant-images');
        if (restaurantBucket) {
            console.log('Bucket "restaurant-images" exists and is', restaurantBucket.public ? 'PUBLIC' : 'PRIVATE');
        } else {
            console.log('Bucket "restaurant-images" is MISSING!');
        }
    }

    // Try a "ghost" upload attempt to see error
    console.log('\n--- Probing Upload Permissions ---');
    const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload('test-probe.txt', 'test content');

    if (error) {
        console.log('Upload Probe Error:', error.message);
        console.log('Error Details:', JSON.stringify(error));
    } else {
        console.log('Upload Probe SUCCESS! (Cleaning up...)');
        await supabase.storage.from('restaurant-images').remove(['test-probe.txt']);
    }

    process.exit(0);
}

checkStorage().catch(console.error);
