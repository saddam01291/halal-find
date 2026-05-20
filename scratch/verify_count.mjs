import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount() {
    const { count, error } = await supabase
        .from('places')
        .select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error('Error fetching count:', error);
    } else {
        console.log('Final Database Count:', count);
    }
}

checkCount();
