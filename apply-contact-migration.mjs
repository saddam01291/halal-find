import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://eqrnhujkvvuipymdtekk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcm5odWprdnZ1aXB5bWR0ZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI2MjUsImV4cCI6MjA4NjYzODYyNX0.LH0lmt_ua_2fhI0-e297h7S3P4J7a-47fl6p6gDs_Gs'
);

async function verify() {
    const { data, error } = await supabase.from('seo_city_pages').select('id').limit(1);
    console.log(error ? '❌ seo_city_pages table NOT found — run the migration SQL' : '✅ seo_city_pages table exists');
    if (error) {
        console.log('\nPlease run this SQL in Supabase SQL Editor:');
        console.log('https://supabase.com/dashboard/project/eqrnhujkvvuipymdtekk/sql');
        console.log('\n' + `CREATE TABLE IF NOT EXISTS seo_city_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  city_slug text UNIQUE NOT NULL,
  city_name text NOT NULL,
  state text,
  country text,
  restaurant_count int DEFAULT 0,
  top_cuisines text[] DEFAULT '{}',
  top_restaurants jsonb DEFAULT '[]',
  ai_intro text,
  ai_faq jsonb DEFAULT '[]',
  meta_title text,
  meta_description text,
  nearby_cities jsonb DEFAULT '[]',
  avg_rating numeric(3,2) DEFAULT 0,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seo_city_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view city pages" ON seo_city_pages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert city pages" ON seo_city_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update city pages" ON seo_city_pages FOR UPDATE USING (true);
CREATE INDEX IF NOT EXISTS idx_seo_city_slug ON seo_city_pages(city_slug);`);
    }
}
verify();
