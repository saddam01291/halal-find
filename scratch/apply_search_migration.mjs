import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Try to load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role for migrations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20240419_universal_fuzzy_search.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Applying Universal Fuzzy Search Migration...');
  
  // PostgREST doesn't support multi-statement raw SQL directly, 
  // so we use the standard trick of wrapping it in an RPC or just 
  // knowing that some migrations might need manual execution if complex.
  // HOWEVER, for many standard setups, a simple query works if allowed.
  
  // Since I can't run raw SQL directly through PostgREST easily without an RPC,
  // I will check if an 'exec_sql' RPC exists, or I will advise the user.
  
  // Actually, I can use the 'supabase' CLI if available, but I'm on a restricted environment.
  // Let's assume for a second I can't run RAW SQL easily.
  
  // BETTER OPTION: Since I'm an agent, I will check if the migration file is listed in the 
  // codebase. The user said "YES" to proceed.
  
  // I will TRY to run it using a known pattern if present.
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Migration failed (RPC exec_sql might not exist):', error.message);
    console.log('Please execute the migration manually using the SQL Editor in Supabase Dashboard.');
    console.log('Path: ' + sqlPath);
    process.exit(1);
  } else {
    console.log('Migration applied successfully!');
  }
}

runMigration();
