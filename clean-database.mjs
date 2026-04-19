import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clean() {
    console.log('--- STARTING CLEAN SLATE RESET ---');

    console.log('Cleaning database: Deleting all reviews...');
    const { error: reviewError } = await supabase
        .from('reviews')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

    if (reviewError) {
        console.error('Error cleaning reviews:', reviewError.message);
        process.exit(1);
    }
    console.log('✅ Success! All reviews have been removed.');

    console.log('Resetting places counts and ratings...');
    const { error: placeError } = await supabase
        .from('places')
        .update({
            review_count: 0,
            rating: 0
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (placeError) {
        console.error('Error resetting places:', placeError.message);
        process.exit(1);
    }
    console.log('✅ Places metadata reset.');

    console.log('--- CLEAN SLATE COMPLETE ---');
    process.exit(0);
}

clean().catch(err => {
    console.error('Script Error:', err);
    process.exit(1);
});
