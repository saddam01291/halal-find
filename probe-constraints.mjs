import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Use SERVICE ROLE KEY to query internal postgres tables if needed, 
// though we'll try a regular RPC or query first.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkConstraints() {
  // Querying information_schema to find unique/primary constraints
  const { data, error } = await supabase.rpc('inspect_constraints');
  
  if (error) {
    // If RPC doesn't exist, try a direct query (might fail if not permitted)
    const { data: data2, error: error2 } = await supabase
      .from('places')
      .select('*')
      .limit(1);
    
    console.log('Error querying constraints via RPC:', error.message);
    console.log('Probing tables manually...');
  } else {
    console.log('--- CONSTRAINTS FOUND ---');
    console.log(JSON.stringify(data, null, 2));
  }
}

// Since we cannot easily create RPCs here, let's try to infer from common unique constraints
async function probeSpecificConstraints() {
    console.log('Probing for common unique violations...');
    
    // Check if verification_requests has a unique index on place_id or user_id
    // We can test this by attempting a dry-run insert or checking error messages from previous attempts
    console.log('Suggestion: Check if place_id in verification_requests is UNIQUE.');
}

checkConstraints();
probeSpecificConstraints();
