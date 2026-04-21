import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eqrnhujkvvuipymdtekk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcm5odWprdnZ1aXB5bWR0ZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI2MjUsImV4cCI6MjA4NjYzODYyNX0.LH0lmt_ua_2fhI0-e297h7S3P4J7a-47fl6p6gDs_Gs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSlugs() {
    console.log('Checking city slugs...');
    const { data, error } = await supabase
        .from('seo_city_pages')
        .select('city_name, city_slug');

    if (error) {
        console.error('Error fetching slugs:', error);
        return;
    }

    const emptySlugs = data.filter(c => !c.city_slug || c.city_slug.length === 0);
    const duplicates = data.filter((c, i) => data.findIndex(x => x.city_slug === c.city_slug) !== i);

    console.log(`Total cities: ${data.length}`);
    console.log(`Empty slugs: ${emptySlugs.length}`);
    emptySlugs.forEach(c => console.log(`  - ${c.city_name}`));
    console.log(`Duplicate slugs: ${duplicates.length}`);
    duplicates.forEach(c => console.log(`  - ${c.city_name} (${c.city_slug})`));
}

checkSlugs();
