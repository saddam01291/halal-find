import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyColumns() {
  console.log('Probing live database for initial_review and initial_rating columns...');

  const { data, error } = await supabase
    .from('verification_requests')
    .select('initial_review, initial_rating')
    .limit(1);

  if (error) {
    console.error('❌ COLUMNS MISSING:', error.message);
    console.log('Please run the SQL migration again in Supabase SQL Editor.');
  } else {
    console.log('✅ SUCCESS! Both columns exist in the live database.');
    console.log('The "Add Restaurant" form will now store reviews correctly.');
  }
}

verifyColumns();
