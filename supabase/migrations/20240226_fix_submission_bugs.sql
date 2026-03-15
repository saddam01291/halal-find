-- 🚀 CONSOLIDATED DATABASE REPAIR 🚀
-- Fixes: Missing columns, type constraints, and RLS policies

DO $$ 
BEGIN 
    -- 1. Add missing columns to verification_requests
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='place_id') THEN
        ALTER TABLE verification_requests ADD COLUMN place_id UUID REFERENCES places(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='type') THEN
        ALTER TABLE verification_requests ADD COLUMN type TEXT DEFAULT 'new_place';
    END IF;

    -- 2. Add missing columns to places
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='places' AND column_name='halal_status') THEN
        ALTER TABLE places ADD COLUMN halal_status TEXT;
    END IF;
END $$;

-- 3. Update Verification Type Constraint
ALTER TABLE verification_requests DROP CONSTRAINT IF EXISTS verification_requests_type_check;
ALTER TABLE verification_requests ADD CONSTRAINT verification_requests_type_check CHECK (type IN ('new_place', 'claim', 'community_addition'));

-- 4. REPAIR RLS POLICIES (Critical for 'Could not submit' error)

-- PLACES Table RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON places;
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
CREATE POLICY "Public Read Access" ON places FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert places" ON places;
CREATE POLICY "Authenticated users can insert places" ON places FOR INSERT TO authenticated WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Users can update their own places" ON places;
CREATE POLICY "Users can update their own places" ON places FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- VERIFICATION_REQUESTS Table RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Individual User Select" ON verification_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON verification_requests;
DROP POLICY IF EXISTS "Users can view their own verification requests" ON verification_requests;
CREATE POLICY "Individual User Select" ON verification_requests FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Individual User Insert" ON verification_requests;
DROP POLICY IF EXISTS "Users can insert requests" ON verification_requests;
DROP POLICY IF EXISTS "Users can insert verification requests" ON verification_requests;
CREATE POLICY "Individual User Insert" ON verification_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5. REPAIR STORAGE (Critical for Photos)
-- Create the bucket with public: true to allow public reading via public URLs
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
-- 1. Public Access to view files (Anyone can READ)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant-images');

-- 2. Authenticated Users to upload (Must be logged in to INSERT)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'restaurant-images');

-- 3. Users to update their own (Must be OWNER to UPDATE)
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
CREATE POLICY "Users can update their own images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'restaurant-images' AND owner = auth.uid());

-- 4. Users to delete their own (Must be OWNER to DELETE)
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
CREATE POLICY "Users can delete their own images" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'restaurant-images' AND owner = auth.uid());


-- 6. Final Grant Permissions
GRANT ALL ON places TO authenticated;
GRANT ALL ON verification_requests TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON places TO anon;
GRANT SELECT ON storage.objects TO anon;




