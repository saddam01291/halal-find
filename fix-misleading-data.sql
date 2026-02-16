-- ============================================
-- RESET VERIFIED STATUS FOR INITIAL SEED DATA
-- ============================================

-- This ensures that only restaurants with manually uploaded certificates show as "Owner Verified"
-- All current Bengal data will rely on "Community Verification" (5+ reviews)

UPDATE places 
SET verified = FALSE,
    certificate_url = NULL
WHERE added_by = 'community' 
   OR city IN ('Kolkata', 'Durgapur', 'Siliguri');

-- Note: Arsalan and others will now show as "Community Verified" (if you ran the seed script)
-- or "Community Report" (if they have < 5 reviews).
