-- Test script to verify the auto-verify trigger
-- Run this in Supabase SQL editor after running auto-verify-trigger.sql

-- 1. Create a dummy unverified place
INSERT INTO places (id, name, cuisine, address, city, lat, lng, verified, verification_status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Test Imported Place', 'General', '123 Test Ave', 'Test City', 0, 0, false, 'unverified')
ON CONFLICT DO NOTHING;

-- 2. Insert 4 positive reviews (should NOT trigger community verification yet)
INSERT INTO reviews (place_id, user_id, user_name, rating, comment, is_halal_confirmed)
VALUES 
('00000000-0000-0000-0000-000000000001', NULL, 'User 1', 5, 'Great food', true),
('00000000-0000-0000-0000-000000000001', NULL, 'User 2', 4, 'Good', true),
('00000000-0000-0000-0000-000000000001', NULL, 'User 3', 5, 'Awesome', true),
('00000000-0000-0000-0000-000000000001', NULL, 'User 4', 4, 'Nice', true);

-- Verify status is still unverified
SELECT name, verification_status, verified, halal_status FROM places WHERE id = '00000000-0000-0000-0000-000000000001';

-- 3. Insert the 5th positive review (should TRIGGER community verification)
INSERT INTO reviews (place_id, user_id, user_name, rating, comment, is_halal_confirmed)
VALUES 
('00000000-0000-0000-0000-000000000001', NULL, 'User 5', 5, 'The 5th confirmation', true);

-- Verify status is now community_verified
SELECT name, verification_status, verified, halal_status FROM places WHERE id = '00000000-0000-0000-0000-000000000001';

-- Cleanup (optional)
-- DELETE FROM places WHERE id = '00000000-0000-0000-0000-000000000001';
