import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase.from('places').select('*').limit(1);
if (error) {
  console.error('Error:', error.message);
} else {
  if (data && data.length > 0) {
    console.log('Actual columns in places table:');
    console.log(Object.keys(data[0]).join(', '));
    console.log('\nSample row:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('Table is empty. Probing columns...');
    // Try inserting a minimal test to get column info from error
    const { error: e2 } = await supabase.from('places').select('added_by').limit(1);
    console.log('added_by probe:', e2 ? e2.message : 'EXISTS');
    const { error: e3 } = await supabase.from('places').select('halal_status').limit(1);
    console.log('halal_status probe:', e3 ? e3.message : 'EXISTS');
    const { error: e4 } = await supabase.from('places').select('slug').limit(1);
    console.log('slug probe:', e4 ? e4.message : 'EXISTS');
  }
}
process.exit(0);
