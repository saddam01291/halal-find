-- SUPABASE STORAGE SETUP FOR RESTAURANT IMAGES

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access to view files (READ)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'restaurant-images' );

-- 3. Allow Authenticated Users to upload files (INSERT)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'restaurant-images' );

-- 4. Allow Authenticated Users to update their own files (UPDATE)
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'restaurant-images' AND owner = auth.uid() );

-- 5. Allow Authenticated Users to delete their own files (DELETE)
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'restaurant-images' AND owner = auth.uid() );
