-- Migration: Add initial review and rating columns to verification_requests
-- Run this in Supabase SQL Editor if 'Add Restaurant' shows a column error

ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_review TEXT;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS initial_rating INTEGER DEFAULT 5;
