/* 🚀 SUPABASE HARD RESET - DEFINITIVE FIX 🚀 */

-- 1. CLEAN THE SLATE
-- We drop the table and recreate it to ensure NO schema mismatch or hidden RLS locks.
DROP TABLE IF EXISTS places CASCADE;

-- 2. CREATE THE TABLE WITH FULL SCHEMA
CREATE TABLE places (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_place_identity UNIQUE (name, address)
);

-- 3. GLOBAL VISIBILITY (CRITICAL)
-- Enable RLS and add public READ policy
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view places" ON places;
CREATE POLICY "Public can view places" ON places
FOR SELECT USING (true);

-- Grant direct permissions to public roles
GRANT SELECT ON places TO anon, authenticated;

-- 4. INJECT INITIAL VOLUME (Wave 1)
INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
('Arsalan (Park Street)', 'Mughlai / Biryani', '191, Park St, Kolkata 700017', 'Kolkata', 4.5, 45200, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8', 22.5458, 88.3644, ARRAY['Halal', 'Biryani', 'Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Aminia (New Market)', 'Mughlai / Biryani', '6A, S.N. Banerjee Road, Kolkata 700087', 'Kolkata', 4.3, 35000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb', 22.5645, 88.3515, ARRAY['Halal', 'Biryani', 'Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Zam Zam Restaurant', 'Mughlai / Biryani', '28A, Syed Amir Ali Ave, Kolkata 700017', 'Kolkata', 4.3, 12000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 22.5440, 88.3655, ARRAY['Halal', 'Beef Biryani'], true, 'community_verified', false, 'Standard', 'none', false),
('Tayyabs (London)', 'Punjabi', 'Fieldgate St, London E1 1JU', 'London', 4.4, 15000, 'https://images.unsplash.com/photo-1544025162-d76694265947', 51.5170, -0.0630, ARRAY['Halal', 'Legendary', 'UK'], true, 'community_verified', false, 'HMC Certified', 'none', true),
('Hjh Maimunah (Singapore)', 'Nasi Padang', 'Jalan Pisang, Singapore 199078', 'Singapore', 4.4, 18000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8', 1.3015, 103.8585, ARRAY['Halal', 'Michelin'], true, 'community_verified', false, 'MUIS Certified', 'none', true);
