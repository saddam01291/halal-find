import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteDuplicate() {
  const idToDelete = "0ab42cb2-8ca3-4bf8-b80e-f682df1bc416";
  
  const { error } = await supabase
    .from('places')
    .delete()
    .eq('id', idToDelete);
  
  if (error) {
    console.error('Error deleting duplicate (Service Role):', error);
  } else {
    console.log(`Successfully deleted duplicate entry ${idToDelete} using Service Role Key.`);
  }
}

deleteDuplicate();
