-- ============================================
-- Expanded West Bengal Halal Restaurant Data (Kolkata, Durgapur, Siliguri)
-- Based on real user reviews and ratings from Zomato/Swiggy
-- Run this in Supabase SQL Editor
-- ============================================

-- Inserting expanded data for West Bengal major cities
insert into places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, added_by) values
  -- KOLKATA (Expanded)
  ('Shimla Biriyani', 'Mughlai', 'EM Bypass, Near Science City, Kolkata', 'Kolkata', 4.0, 5500, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 22.5392, 88.3964, ARRAY['Biryani', 'Mughlai', 'Large Groups', 'Ambiance'], true, 'community'),
  ('Benfish', 'Bengali & Seafood', 'GN Block, Sector V, Bidhannagar, Kolkata 700091', 'Kolkata', 4.2, 4200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 22.5694, 88.4331, ARRAY['Bengali', 'Seafood', 'Halal-friendly', 'Sector V'], true, 'community'),
  ('Bawarchi Restaurant', 'North Indian', '63, Prince Anwar Shah Rd, Tollygunge, Kolkata 700033', 'Kolkata', 3.9, 4000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 22.5024, 88.3444, ARRAY['North Indian', 'Rolls', 'Biryani', 'Pocket Friendly'], true, 'community'),
  ('Cafe Mezzuna', 'Mediterranean', 'Loudon Mansions, 1st Floor, Loudon St, Kolkata 700017', 'Kolkata', 4.1, 3200, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 22.5484, 88.3544, ARRAY['Mediterranean', 'Pasta', 'Pizza', 'Upscale'], true, 'community'),

  -- DURGAPUR (Expanded)
  ('Saheb Biryani', 'Mughlai', 'City Garden, Benachity, Durgapur 713213', 'Durgapur', 5.0, 1200, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 23.5512, 87.2794, ARRAY['Biryani', 'Kebab', 'Highly Rated', 'Benachity'], true, 'community'),
  ('The Grand Lazeez', 'Mughlai', 'City Centre, Durgapur 713216', 'Durgapur', 5.0, 850, 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800', 23.5342, 87.2912, ARRAY['Mughlai', 'Fine Dining', 'Hospitality', 'Cozy'], true, 'community'),
  ('Lazeez Restaurant', 'Mughlai', 'Nachan Rd, Benachity, Durgapur 713213', 'Durgapur', 4.5, 2100, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800', 23.5521, 87.2811, ARRAY['Mughlai', 'Kebab', 'Family', 'Budget Friendly'], true, 'community'),
  ('The Belly Gong', 'Italian & Continental', 'City Centre, Durgapur 713216', 'Durgapur', 5.0, 420, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', 23.5321, 87.2944, ARRAY['Italian', 'Continental', 'Ambiance', 'Top Rated'], true, 'community'),

  -- SILIGURI (Expanded)
  ('The Grand Lazeez (Siliguri)', 'Mughlai', 'Planet Mall, Sevoke Rd, Siliguri 734001', 'Siliguri', 5.0, 950, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 26.7321, 88.4312, ARRAY['Mughlai', 'Fine Dining', 'Premium', 'Sevoke Road'], true, 'community'),
  ('Rollaza', 'Fast Food', 'Bidhan Market Rd, Siliguri 734001', 'Siliguri', 5.0, 1500, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800', 26.7142, 88.4214, ARRAY['Rolls', 'Kebab', 'Quick Service', 'Highly Rated'], true, 'community'),
  ('7 Colour''s Kabab Hut', 'Mughlai', 'Bidhan Market, Siliguri 734001', 'Siliguri', 4.0, 850, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 26.7155, 88.4222, ARRAY['Tandoori', 'Kebab', 'Late Night'], true, 'community'),
  ('Sangam Biryani', 'Indian', 'Jyoti Nagar, Siliguri 734001', 'Siliguri', 5.0, 320, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 26.7212, 88.4144, ARRAY['Biryani', 'Affordable', 'Friendly Service'], true, 'community');
