import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkReviews() {
  const ids = ["151313b1-dd0f-4758-bcd2-a2bb38c3eede", "0ab42cb2-8ca3-4bf8-b80e-f682df1bc416"];
  
  for (const id of ids) {
    const { count, error } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', id);
    
    console.log(`Place ID ${id} has ${count} reviews.`);
  }
}

checkReviews();
