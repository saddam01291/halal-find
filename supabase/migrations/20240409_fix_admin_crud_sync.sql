-- ==============================================================
-- FIX ADMIN CRUD SYNC
-- 1. Add missing restaurant fields to verification_requests
-- 2. Repair cascading deletes and RLS for Admin
-- ==============================================================

DO $$ 
BEGIN 
    -- 1. Add missing fields to verification_requests to support full editing before approval
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='cuisine') THEN
        ALTER TABLE verification_requests ADD COLUMN cuisine TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='address') THEN
        ALTER TABLE verification_requests ADD COLUMN address TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='city') THEN
        ALTER TABLE verification_requests ADD COLUMN city TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='lat') THEN
        ALTER TABLE verification_requests ADD COLUMN lat DOUBLE PRECISION;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='lng') THEN
        ALTER TABLE verification_requests ADD COLUMN lng DOUBLE PRECISION;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='tags') THEN
        ALTER TABLE verification_requests ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='halal_status') THEN
        ALTER TABLE verification_requests ADD COLUMN halal_status TEXT DEFAULT 'Full Halal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='serves_alcohol') THEN
        ALTER TABLE verification_requests ADD COLUMN serves_alcohol BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='halal_source') THEN
        ALTER TABLE verification_requests ADD COLUMN halal_source TEXT;
    END IF;

    -- 2. Add owner_name if missing (redundancy check)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='owner_name') THEN
        ALTER TABLE verification_requests ADD COLUMN owner_name TEXT DEFAULT 'Community Member';
    END IF;

END $$;

-- 3. Ensure Admin can DELETE and UPDATE anything
-- Verification Requests
DROP POLICY IF EXISTS "Admin can manage all verification requests" ON verification_requests;
CREATE POLICY "Admin can manage all verification requests"
    ON verification_requests
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Places
DROP POLICY IF EXISTS "Admin can manage all places" ON places;
CREATE POLICY "Admin can manage all places"
    ON places
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Reviews
DROP POLICY IF EXISTS "Admin can manage all reviews" ON reviews;
CREATE POLICY "Admin can manage all reviews"
    ON reviews
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. Fix Foreign Key for verification_requests if not already cascading
-- (Note: Standard Supabase doesn't always show constraint names clearly, we'll try to drop if exists)
DO $$
BEGIN
    ALTER TABLE verification_requests 
    DROP CONSTRAINT IF EXISTS verification_requests_place_id_fkey;
    
    ALTER TABLE verification_requests
    ADD CONSTRAINT verification_requests_place_id_fkey 
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint already exists or table is missing';
END $$;
