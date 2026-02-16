-- ============================================
-- Update Reviews Table for Community Verification
-- Run this in Supabase SQL Editor
-- ============================================

-- Add is_halal_confirmed column to reviews table
ALTER TABLE IF EXISTS reviews 
ADD COLUMN IF NOT EXISTS is_halal_confirmed BOOLEAN DEFAULT FALSE;

-- Optional: Add a comment to describe the column
COMMENT ON COLUMN reviews.is_halal_confirmed IS 'Indicates if the user confirmed the restaurant serves Halal food';
