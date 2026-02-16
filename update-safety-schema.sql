-- ============================================
-- SAFETY & RESOLUTION SYSTEM: REVIEWS UPDATE
-- ============================================

-- Add fields to track non-halal reports and their resolutions
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_non_halal_report BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_dispute_resolved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resolution_note TEXT;

-- Create an index to quickly find non-resolved reports
CREATE INDEX IF NOT EXISTS idx_reviews_non_halal_reports 
ON reviews (place_id, is_non_halal_report) 
WHERE is_non_halal_report = TRUE AND is_dispute_resolved = FALSE;
