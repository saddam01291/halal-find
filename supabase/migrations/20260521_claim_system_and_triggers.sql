-- ============================================================
-- MIGRATION: Claim System, Rating Triggers & Dedup Enforcement
-- FindHalal — 2026-05-21
-- Run this in Supabase SQL Editor (one-time migration)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- SECTION 1: Ensure all required columns exist
-- ─────────────────────────────────────────────────────────────

-- Places table extensions
ALTER TABLE places ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE places ADD COLUMN IF NOT EXISTS halal_status TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS halal_source TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS serves_alcohol BOOLEAN DEFAULT FALSE;
ALTER TABLE places ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Verification requests table extensions
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'community_addition'
  CHECK (type IN ('community_addition', 'claim', 'new_place'));
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS place_id UUID REFERENCES places(id);
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS cuisine TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS halal_status TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS serves_alcohol BOOLEAN DEFAULT FALSE;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS halal_source TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_review TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_rating INTEGER DEFAULT 5;

-- Admin notes on claim review
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);

-- ─────────────────────────────────────────────────────────────
-- SECTION 2: Rating Recalculation Trigger
-- Automatically keeps places.rating and places.review_count
-- in sync whenever reviews are inserted, updated, or deleted.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.recalculate_place_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_place_id UUID;
  avg_rating NUMERIC(3,2);
  total_count INTEGER;
BEGIN
  -- Determine which place to update (handle DELETE where NEW is null)
  IF TG_OP = 'DELETE' THEN
    target_place_id := OLD.place_id;
  ELSE
    target_place_id := NEW.place_id;
  END IF;

  -- Recalculate from all reviews for this place
  SELECT
    COALESCE(AVG(rating)::NUMERIC(3,2), 0),
    COUNT(*)::INTEGER
  INTO avg_rating, total_count
  FROM reviews
  WHERE place_id = target_place_id;

  -- Update the place
  UPDATE places
  SET
    rating = avg_rating,
    review_count = total_count
  WHERE id = target_place_id;

  -- Return appropriate row
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present (idempotent migration)
DROP TRIGGER IF EXISTS on_review_changed ON reviews;

-- Create the trigger for INSERT, UPDATE, DELETE
CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_place_rating();

-- ─────────────────────────────────────────────────────────────
-- SECTION 3: Verification / Claim Approval Trigger
-- When an admin approves (status → 'approved') a claim or 
-- community_addition, automatically:
--   • Sets verification_status on the place
--   • Binds owner_id for claim requests
--   • Copies contact info from the request to the place
--   • Records the reviewed_at timestamp
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.on_verification_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- Only act when status changes TO 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN

    -- Record review timestamp
    NEW.reviewed_at := NOW();

    -- Only proceed if we have a linked place
    IF NEW.place_id IS NOT NULL THEN

      IF NEW.type = 'claim' THEN
        -- Claim approval: mark as owner-verified, bind owner
        UPDATE places SET
          verified             = TRUE,
          verification_status  = 'owner_verified',
          owner_id             = NEW.user_id,
          -- Merge provided contact details (don't overwrite with null)
          phone                = COALESCE(NEW.phone,  phone),
          email                = COALESCE(NEW.email,  email),
          halal_status         = COALESCE(NEW.halal_status, halal_status),
          halal_source         = COALESCE(NEW.halal_source, halal_source),
          serves_alcohol       = COALESCE(NEW.serves_alcohol, serves_alcohol)
        WHERE id = NEW.place_id;

      ELSIF NEW.type IN ('community_addition', 'new_place') THEN
        -- Community approval: mark as community-verified
        UPDATE places SET
          verified             = TRUE,
          verification_status  = 'community_verified',
          phone                = COALESCE(NEW.phone,  phone),
          email                = COALESCE(NEW.email,  email),
          halal_status         = COALESCE(NEW.halal_status, halal_status),
          halal_source         = COALESCE(NEW.halal_source, halal_source)
        WHERE id = NEW.place_id;
      END IF;

    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present (idempotent)
DROP TRIGGER IF EXISTS on_verification_status_changed ON verification_requests;

CREATE TRIGGER on_verification_status_changed
  BEFORE UPDATE OF status ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.on_verification_approved();

-- ─────────────────────────────────────────────────────────────
-- SECTION 4: Deduplication — Partial Unique Index
-- Prevents exact same (name + city) combination from being
-- inserted twice into places. Case-insensitive via lower().
-- NOTE: Only enforced at DB level as a safety net.
-- The application layer checks BEFORE inserting (preferred).
-- ─────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_places_unique_name_city
  ON places (LOWER(name), LOWER(city))
  WHERE city IS NOT NULL AND city != '' AND city != 'Unknown';

-- ─────────────────────────────────────────────────────────────
-- SECTION 5: Dedup guard on verification_requests
-- Prevent an owner from submitting multiple pending claims
-- for the same place simultaneously.
-- ─────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_unique_pending_claim
  ON verification_requests (place_id, user_id, type)
  WHERE status = 'pending' AND type = 'claim' AND place_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- SECTION 6: RLS — Allow admins to update verification status
-- ─────────────────────────────────────────────────────────────

-- Drop pre-existing admin policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can update verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Admins can view all verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Admins can update places" ON places;

-- Admins can see ALL verification requests
CREATE POLICY "Admins can view all verification requests"
  ON verification_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
    OR auth.uid() = user_id
  );

-- Admins can update verification request status
CREATE POLICY "Admins can update verification requests"
  ON verification_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Admins can update any place (for approvals)
CREATE POLICY "Admins can update places"
  ON places FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
    OR auth.uid() = owner_id
  );

-- ─────────────────────────────────────────────────────────────
-- SECTION 7: Index for performance
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_verification_requests_status
  ON verification_requests (status, created_at);

CREATE INDEX IF NOT EXISTS idx_verification_requests_place_id
  ON verification_requests (place_id);

CREATE INDEX IF NOT EXISTS idx_places_verification_status
  ON places (verification_status);

CREATE INDEX IF NOT EXISTS idx_places_name_lower
  ON places (LOWER(name));

-- ─────────────────────────────────────────────────────────────
-- Done. Run this migration once in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────
