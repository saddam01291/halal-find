import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findAryan() {
  const { data, error } = await supabase
    .from('places')
    .select('id, name, city, address, created_at')
    .ilike('name', '%Aryan%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('--- ARYAN ENTRIES FOUND ---');
  console.log(JSON.stringify(data, null, 2));
}

findAryan();
