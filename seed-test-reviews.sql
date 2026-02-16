-- ============================================
-- Seed Test Reviews for Community Verification
-- ============================================

-- First, make sure you have run update-reviews-schema.sql

-- Let's add some reviews for "Arsalan" (id from your previous seed)
-- Assuming Arsalan has ID 'arsalan-park-circus' if you used my IDs
-- If you used serial IDs, check the ID in the 'places' table first.

-- This script adds 5 Halal-confirmed reviews to test the logic
-- It uses a real user ID from your profiles table to avoid foreign key errors
INSERT INTO reviews (place_id, user_id, user_name, rating, comment, is_halal_confirmed, created_at)
SELECT 
    p.id, 
    (SELECT id FROM profiles LIMIT 1), -- Automatically picks the first real user ID
    'Foodie Member ' || i,
    5,
    'Confirmed Halal. Amazing food!',
    TRUE,
    NOW() - (i || ' hours')::interval
FROM places p
CROSS JOIN generate_series(1, 5) AS i
WHERE p.name ILIKE '%Arsalan%'
LIMIT 5;
