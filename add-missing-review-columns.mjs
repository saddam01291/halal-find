import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('Adding missing columns to verification_requests...');

  // We use raw SQL via rpc to add columns safely
  const migrations = [
    `ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_review TEXT;`,
    `ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_rating INTEGER DEFAULT 5;`
  ];

  for (const sql of migrations) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // If exec_sql RPC doesn't exist, try a direct approach
      console.log('RPC failed, trying direct approach...');
      console.log('SQL to run manually in Supabase SQL Editor:');
      console.log('------------------------------------------');
      console.log('ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_review TEXT;');
      console.log('ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_rating INTEGER DEFAULT 5;');
      console.log('------------------------------------------');
      return;
    }
    console.log('✅ Migration applied:', sql);
  }

  // Verify the columns now exist
  const { data, error: checkError } = await supabase
    .from('verification_requests')
    .select('initial_review, initial_rating')
    .limit(1);

  if (checkError) {
    console.error('❌ Columns still missing:', checkError.message);
  } else {
    console.log('✅ SUCCESS! Columns are now present in the database.');
  }
}

runMigration();
