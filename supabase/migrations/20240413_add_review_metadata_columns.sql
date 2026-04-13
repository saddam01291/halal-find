-- Migration: Add Halal Verification Metadata to Reviews
-- Description: Adds columns for halal confirmation, non-halal reporting, and admin dispute resolution.

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_halal_confirmed BOOLEAN DEFAULT false;

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_non_halal_report BOOLEAN DEFAULT false;

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_dispute_resolved BOOLEAN DEFAULT false;

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS resolution_note TEXT;

-- Recommended: Update column comments for clarity
COMMENT ON COLUMN reviews.is_halal_confirmed IS 'Flag indicating the user confirmed the restaurant is 100% Halal.';
COMMENT ON COLUMN reviews.is_non_halal_report IS 'Flag indicating the user reported the restaurant as no longer Halal.';
COMMENT ON COLUMN reviews.is_dispute_resolved IS 'Admin flag to mark a report dispute as resolved.';
