-- Update places table for 3-tier verification and certificates
ALTER TABLE places ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE places ADD COLUMN IF NOT EXISTS certificate_url TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Add useful indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_verification ON places(verification_status);
CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);

-- Comment explaining the statuses: 'unverified', 'community_verified', 'owner_verified'
COMMENT ON COLUMN places.verification_status IS 'Tiered trust: unverified (google/auto), community_verified (user polls), owner_verified (doc uploaded)';
