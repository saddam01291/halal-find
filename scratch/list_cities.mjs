import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eqrnhujkvvuipymdtekk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcm5odWprdnZ1aXB5bWR0ZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI2MjUsImV4cCI6MjA4NjYzODYyNX0.LH0lmt_ua_2fhI0-e297h7S3P4J7a-47fl6p6gDs_Gs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listCities() {
    const { data, error } = await supabase
        .from('seo_city_pages')
        .select('city_name, city_slug, restaurant_count')
        .order('restaurant_count', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Cities in seo_city_pages:');
    data.forEach(c => {
        console.log(`${c.city_name} (${c.city_slug}) - ${c.restaurant_count} restaurants`);
    });
}

listCities();
