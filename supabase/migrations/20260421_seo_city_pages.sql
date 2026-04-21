-- SEO City Pages: Stores pre-generated content for city landing pages
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS seo_city_pages (
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

-- Allow public read access for SSR
ALTER TABLE seo_city_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view city pages" ON seo_city_pages FOR SELECT USING (true);

-- Index for fast slug lookups  
CREATE INDEX IF NOT EXISTS idx_seo_city_slug ON seo_city_pages(city_slug);
