import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUniqueIndexes() {
  console.log('--- Probing for Unique Indexes via trial-and-error ---');
  
  // Try to find any unique constraint on 'places' by looking at the error code 
  // on a dummy insert with a known ID.
  const dummyId = "00000000-0000-0000-0000-000000000000";
  
  const { error } = await supabase
    .from('places')
    .insert({
        id: dummyId,
        name: 'Test',
        cuisine: 'Test',
        address: 'Test',
        lat: 0,
        lng: 0,
        city: 'Test'
    });

  if (error) {
    console.log('Insert error message:', error.message);
    if (error.message.includes('unique constraint')) {
        console.log('Confirmed: ID collision causes this error.');
    }
  }
}

checkUniqueIndexes();
