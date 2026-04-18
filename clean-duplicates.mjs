import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanDuplicates() {
  console.log('Cleaning up duplicate Muslim Hotel entries...');

  const idsToDelete = [
    '2df3f56e-e78a-4ba6-a1dd-ecb178ee410f',
    '77293169-c107-439c-b168-6f9a9176c0e0'
  ];

  for (const id of idsToDelete) {
    // 1. Delete associated verification requests
    await supabase.from('verification_requests').delete().eq('place_id', id);
    // 2. Delete the place itself
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) {
       console.error(`Failed to delete ${id}:`, error.message);
    } else {
       console.log(`Deleted place ${id}`);
    }
  }
}

cleanDuplicates();
