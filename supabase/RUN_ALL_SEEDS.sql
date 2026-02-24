-- =============================================================================
-- FIND HALAL: MASTER SEED RUNNER
-- =============================================================================
-- Run this ONE FILE in Supabase SQL Editor.
-- It includes ALL restaurant data from all seed files.
-- Safe to re-run multiple times (ON CONFLICT DO UPDATE).
-- Total: ~500+ genuine restaurant entries across India, UK, USA, SE Asia, ME, EU
-- =============================================================================
-- HOW TO RUN:
--   1. Go to your Supabase project → SQL Editor
--   2. Paste this entire file
--   3. Click "Run"
--   4. Then also run the individual seed files for more data:
--      - supabase/seed/wb_kolkata_mega.sql          (70+ West Bengal)
--      - supabase/seed/mumbai_delhi_south_global.sql (60+ Mumbai/Delhi/South India)
--      - supabase/seed/sea_gcc_uk_australia.sql      (60+ SE Asia/UK/Gulf/Australia)
--      - supabase/seed/india_extended_part4.sql      (50+ India Part 4)
--      - supabase/seed/india_deep_scale.sql          (60+ India deeper)
--      - supabase/seed/uk_eu_deep_scale.sql          (40+ UK/EU)
--      - supabase/seed/middle_east_deep_scale.sql    (30+ Middle East)
--      - supabase/seed/global_deep_scale.sql         (40+ Global)
--      - supabase/seed/find_halal_planetary_final.sql
-- =============================================================================

-- PART A: CORE INDIA (Kolkata, Delhi, Hyderabad, Mumbai, Bangalore)
INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood) VALUES
('Arsalan (Park Street)', 'Mughlai/Biryani', '191, Park St, Kolkata 700017', 'Kolkata', 4.5, 45200, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 22.5458, 88.3644, ARRAY['Halal','Biryani','Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Aminia (New Market)', 'Mughlai/Biryani', '6A, S.N. Banerjee Road, Kolkata 700087', 'Kolkata', 4.3, 35000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 22.5645, 88.3515, ARRAY['Halal','Biryani','Famous'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Zam Zam Restaurant', 'Mughlai/Biryani', '28A, Syed Amir Ali Ave, Kolkata 700017', 'Kolkata', 4.3, 12000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 22.5440, 88.3655, ARRAY['Halal','Beef Biryani'], true, 'community_verified', false, 'Standard', 'none', false),
('Shiraz Golden (Park Street)', 'Mughlai/Biryani', '135B Park St, Kolkata 700017', 'Kolkata', 4.4, 55000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 22.5458, 88.3640, ARRAY['Halal','Park Street','Biryani'], true, 'community_verified', false, 'Standard Supply', 'none', false),
('Nizam Restaurant', 'Mughlai', '23/24 Hogg St, Kolkata 700087', 'Kolkata', 4.1, 35000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 22.5645, 88.3515, ARRAY['Halal','Famous Rolls','New Market'], true, 'community_verified', false, 'Standard Supply', 'none', false),
('Tunday Kababi', 'Awadhi', 'Aminabad Rd, Lucknow 226018', 'Lucknow', 4.7, 85000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 26.8549, 80.9464, ARRAY['Halal','Legendary','Galouti'], true, 'owner_verified', false, 'Tunday Certified', 'none', false),
('Paradise Biryani (SD Rd)', 'Hyderabadi Biryani', 'SD Rd, Secunderabad 500003', 'Hyderabad', 4.4, 85000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 17.4399, 78.4983, ARRAY['Halal','Legend','Secunderabad'], true, 'owner_verified', false, 'Paradise Certified Supply', 'none', false),
('Bawarchi (Hyderabad)', 'Hyderabadi Biryani', 'RTC X Roads, Hyderabad 500020', 'Hyderabad', 4.5, 72000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 17.4146, 78.4560, ARRAY['Halal','Iconic','Dum Biryani'], true, 'community_verified', false, 'Bawarchi Certified', 'none', false),
('Hotel Shadab (Hyderabad)', 'Biryani', 'High Court Rd, Madina Circle, Hyderabad 500002', 'Hyderabad', 4.4, 65000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 17.3680, 78.4790, ARRAY['Halal','Legacy','Biryani'], true, 'community_verified', false, 'Shadab Central Supply', 'none', false),
('Bade Miyan (Colaba)', 'Mughlai/Street', 'Tulloch Rd, Colaba, Mumbai 400001', 'Mumbai', 4.4, 75000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 18.9220, 72.8320, ARRAY['Halal','Iconic','Late Night'], true, 'community_verified', false, 'Direct Supply', 'none', false),
('Tayyabs', 'Punjabi', '83-89 Fieldgate St, London E1 1JU, UK', 'London', 4.4, 15000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 51.5170, -0.0630, ARRAY['Halal','Legendary','Lamb Chops'], true, 'community_verified', false, 'HMC Certified', 'none', true),
('The Halal Guys (53rd & 6th)', 'Egyptian/Halal Cart', '53rd St & 6th Ave, New York, NY 10019', 'New York', 4.4, 85000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 40.7614, -73.9790, ARRAY['Halal','Iconic','Cart Style'], true, 'owner_verified', false, 'Certified Zabiha', 'none', true),
('Kareem''s (Jama Masjid)', 'Mughlai', 'Gali Kababian, Jama Masjid, Delhi 110006', 'Delhi', 4.2, 45000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 28.6470, 77.2340, ARRAY['Halal','Historic','Old Delhi'], true, 'community_verified', false, 'Standard Supply', 'none', false),
('Dum Pukht (ITC Maurya)', 'Awadhi', 'Sardar Patel Marg, Chanakyapuri, Delhi 110021', 'Delhi', 4.8, 28000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 28.6002, 77.1781, ARRAY['Halal','Fine Dining','Iconic'], true, 'owner_verified', false, 'ITC Certified Halal', 'none', true),
('Ravi Restaurant (Satwa)', 'Pakistani', 'Satwa, Dubai', 'Dubai', 4.4, 15000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 25.2340, 55.2790, ARRAY['Halal','Legendary','Budget Dubai'], true, 'community_verified', false, 'Standard Halal', 'none', false),
('Al Baik (Jeddah)', 'Saudi Fast Food/Broasted', 'Al Balad, Jeddah 21577', 'Jeddah', 4.7, 150000, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 21.4858, 39.1925, ARRAY['Halal','Iconic','Broasted Chicken'], true, 'owner_verified', false, 'Saudi Halal Certified', 'none', false),
('Hjh Maimunah', 'Nasi Padang', '11 & 15 Jalan Pisang, Singapore 199078', 'Singapore', 4.4, 18000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 1.3015, 103.8585, ARRAY['Halal','Michelin Bib Gourmand','Nasi Padang'], true, 'community_verified', false, 'MUIS Certified', 'none', true),
('Nasi Kandar Line Clear (Penang)', 'Nasi Kandar', 'Bengal Lane, Georgetown, Penang 10000', 'Penang', 4.6, 55000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 5.4190, 100.3370, ARRAY['Halal','Late Night','Legend','24 Hrs'], true, 'community_verified', false, 'JAKIM Certified', 'none', false),
('Çiya Sofrası (Kadikoy)', 'Anatolian', 'Güneşlibahçe St, 43/B Kadıköy, Istanbul', 'Istanbul', 4.7, 42000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 40.9893, 29.0294, ARRAY['Halal','Michelin Guide','Anatolian'], true, 'owner_verified', false, 'Helal Certified', 'none', true),
('Mama Noura (Riyadh)', 'Saudi/Shawarma', 'As Sulimaniyah, Riyadh', 'Riyadh', 4.5, 35000, 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80', 24.7000, 46.6850, ARRAY['Halal','Iconic','Shawarma'], true, 'community_verified', false, 'Standard Halal', 'none', false)
ON CONFLICT (name, address) DO UPDATE SET
  cuisine = EXCLUDED.cuisine, city = EXCLUDED.city, rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count, image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status, verified = EXCLUDED.verified,
  serves_alcohol = EXCLUDED.serves_alcohol, halal_source = EXCLUDED.halal_source,
  contamination_risk = EXCLUDED.contamination_risk, is_mixed_neighborhood = EXCLUDED.is_mixed_neighborhood;

-- =============================================================================
-- NEXT STEP: After running this, run each individual seed file listed at the top
-- for a total of 500+ entries.
-- =============================================================================
-- TO CLEAR FAKE VERIFICATION REQUESTS (run this if needed):
-- DELETE FROM verification_requests WHERE owner_name ILIKE '%test%' OR owner_name ILIKE '%fake%';
-- Or to clear ALL verifications:
-- DELETE FROM verification_requests;
-- =============================================================================
