-- ============================================
-- RESET ALL DATA FOR REAL REVIEWS
-- ============================================

-- 1. DELETE ALL REVIEWS (Clears test data and fake confirmations)
TRUNCATE TABLE reviews CASCADE;

-- 2. RESET PLACE STATUSES
-- This removes the "Owner Verified" yellow badge and resets review counts
UPDATE places 
SET 
    verified = FALSE,
    certificate_url = NULL,
    rating = 0,
    review_count = 0;

-- 3. KEEP THE PLACES (The restaurant names and addresses)
-- But they will now all show as "Community Report" until real users review them.

-- OPTIONAL: If you want to delete the restaurants too, uncomment the next line:
-- TRUNCATE TABLE places CASCADE;
