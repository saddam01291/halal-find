-- SUPABASE HEALTH & VOLUME REPAIR SCRIPT
-- 1. Ensure Table Structure
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cuisine TEXT,
    address TEXT,
    city TEXT,
    rating DECIMAL,
    review_count INTEGER DEFAULT 0,
    image TEXT,
    lat DECIMAL,
    lng DECIMAL,
    tags TEXT[],
    verified BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'unverified',
    owner_id UUID REFERENCES auth.users(id),
    certificate_url TEXT,
    serves_alcohol BOOLEAN DEFAULT false,
    halal_source TEXT,
    contamination_risk TEXT DEFAULT 'low',
    is_mixed_neighborhood BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Security & Visibility (CRITICAL)
-- Enable RLS and add public READ policy so users can see the data
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view places" ON places;
CREATE POLICY "Public can view places" ON places
FOR SELECT USING (true);

-- 3. Data Population (Volume Injection Wave 1)
INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
-- KOLKATA ANCHORS
('Arsalan (Park Street)', 'Mughlai / Biryani', '191, Park St, Kolkata', 'Kolkata', 4.5, 45200, 'images.unsplash.com/photo-1563379091339-03b21bc4a4f8', 22.5458, 88.3644, ARRAY['Halal', 'Biryani', 'Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Aminia (New Market)', 'Mughlai / Biryani', '6A, S.N. Banerjee Road, Kolkata', 'Kolkata', 4.3, 35000, 'images.unsplash.com/photo-1623341214825-9f4f963a5ccb', 22.5645, 88.3515, ARRAY['Halal', 'Biryani', 'Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Zam Zam Restaurant', 'Mughlai / Biryani', '28A, Syed Amir Ali Ave, Kolkata', 'Kolkata', 4.3, 12000, 'images.unsplash.com/photo-1517248135467-4c7edcad34c4', 22.5440, 88.3655, ARRAY['Halal', 'Beef Biryani'], true, 'community_verified', false, 'Standard', 'none', false),
('Royal Indian Restaurant', 'Mughlai', 'Zakaria St, Kolkata', 'Kolkata', 4.4, 15000, 'images.unsplash.com/photo-1601050690597-df056fb13295', 22.5800, 88.3580, ARRAY['Halal', 'Mutton Chaap'], true, 'community_verified', false, 'Standard', 'none', false),

-- INTERNATIONAL ANCHORS (Verification)
('Tayyabs (London)', 'Punjabi', 'Fieldgate St, London', 'London', 4.4, 15000, 'images.unsplash.com/photo-1544025162-d76694265947', 51.5170, -0.0630, ARRAY['Halal', 'Legendary', 'UK'], true, 'community_verified', false, 'HMC Certified', 'none', true),
('Shah''s Halal (Queens)', 'Fast Food', 'NYC, USA', 'New York', 4.3, 5800, 'images.unsplash.com/photo-1514326640560-7d063ef2aed5', 40.7485, -73.8920, ARRAY['Halal', 'Cart Style'], true, 'community_verified', false, 'Certified', 'none', true),
('Hjh Maimunah', 'Nasi Padang', 'Jalan Pisang, Singapore', 'Singapore', 4.4, 18000, 'images.unsplash.com/photo-1563379091339-03b21bc4a4f8', 1.3015, 103.8585, ARRAY['Halal', 'Michelin'], true, 'community_verified', false, 'MUIS Certified', 'none', true)

ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified,
  serves_alcohol = EXCLUDED.serves_alcohol,
  halal_source = EXCLUDED.halal_source,
  contamination_risk = EXCLUDED.contamination_risk,
  is_mixed_neighborhood = EXCLUDED.is_mixed_neighborhood;
