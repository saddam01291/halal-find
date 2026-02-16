-- ============================================
-- FINAL COMPREHENSIVE WEST BENGAL HALAL DATA
-- Cities: Kolkata, Durgapur, Siliguri
-- Sourced from Zomato, Swiggy, and Justdial stats
-- Run this in Supabase SQL Editor
-- ============================================

-- Clearing existing community-added Bengal data to prevent duplicates (Optional)
-- DELETE FROM places WHERE city IN ('Kolkata', 'Durgapur', 'Siliguri') AND added_by = 'community';

insert into places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, added_by) values
  -- KOLKATA: LEGENDARY & TOP RATED
  ('Arsalan (Park Circus)', 'Mughlai', '119A, Muzaffar Ahmed St, Park Circus, Kolkata 700017', 'Kolkata', 4.7, 55000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 22.5448, 88.3658, ARRAY['Biryani', 'Mughlai', 'Iconic', 'Legendary'], true, 'community'),
  ('Aminia (New Market)', 'Mughlai', '6A, S.N. Banerjee Road, New Market, Kolkata 700087', 'Kolkata', 4.5, 42000, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 22.5601, 88.3514, ARRAY['Biryani', 'Heritage', 'Kebab', 'Family'], true, 'community'),
  ('Royal Indian Restaurant', 'Mughlai', 'Zakaria Street, Kolkata 700073', 'Kolkata', 4.4, 28000, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 22.5781, 88.3562, ARRAY['Awadhi', 'Chaap', 'Zakaria Street', 'Old Kolkata'], true, 'community'),
  ('Shiraz Golden Restaurant', 'Mughlai', '56, Park Street, Kolkata 700017', 'Kolkata', 4.4, 35000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 22.5457, 88.3631, ARRAY['Mughlai', 'Kebab', 'Historic', 'Dine-in'], true, 'community'),
  ('Zeeshan Restaurant', 'Mughlai', '17, Syed Amir Ali Ave, Park Circus, Kolkata 700017', 'Kolkata', 4.3, 18500, 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800', 22.5414, 88.3629, ARRAY['Rolls', 'Kebab', 'Street Food', 'Bestseller'], true, 'community'),
  ('Da Wwok (Park Circus)', 'Chinese', '36A, Bright Street, Park Circus, Kolkata 700017', 'Kolkata', 4.6, 1500, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800', 22.5398, 88.3688, ARRAY['Chinese', 'Halal Chinese', 'Drums of Heaven', 'Cozy'], true, 'community'),
  ('Kareem''s (Park Circus)', 'North Indian', '55B, Mirza Ghalib St, Park St Area, Kolkata 700016', 'Kolkata', 4.5, 5200, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 22.5512, 88.3533, ARRAY['North Indian', 'Fine Dining', 'Kebab', 'Premium'], true, 'community'),
  ('Shimla Biriyani', 'Mughlai', '7, Sambhunath Pandit St, Bhawanipur, Kolkata 700020', 'Kolkata', 4.0, 5500, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 22.5362, 88.3444, ARRAY['Biryani', 'Traditional', 'Pocket Friendly'], true, 'community'),

  -- DURGAPUR: POPULAR & HIGHLY RATED
  ('Saheb Biryani', 'Mughlai', 'City Garden, Benachity, Durgapur 713213', 'Durgapur', 5.0, 1200, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 23.5512, 87.2794, ARRAY['Biryani', 'Kebab', 'Highly Rated', 'Benachity'], true, 'community'),
  ('The Grand Lazeez', 'Mughlai', 'City Centre, Durgapur 713216', 'Durgapur', 5.0, 850, 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800', 23.5342, 87.2912, ARRAY['Mughlai', 'Fine Dining', 'Hospitality', 'Cozy'], true, 'community'),
  ('Zaffran', 'North Indian', 'Near HDFC Bank, City Centre, Durgapur 713216', 'Durgapur', 4.4, 2100, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 23.5332, 87.2939, ARRAY['Kebab', 'North Indian', 'Ambiance', 'City Centre'], true, 'community'),
  ('Lazeez Restaurant', 'Mughlai', 'Nachan Rd, Benachity, Durgapur 713213', 'Durgapur', 4.5, 3500, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800', 23.5521, 87.2811, ARRAY['Mughlai', 'Kebab', 'Family', 'Budget Friendly'], true, 'community'),
  ('Rollaza', 'Fast Food', 'Opposite Big Bazaar, City Centre, Durgapur 713216', 'Durgapur', 5.0, 1500, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800', 23.5322, 87.2944, ARRAY['Rolls', 'Kebab', 'Quick Service', 'City Centre'], true, 'community'),
  ('Mughal Darbar', 'Mughlai', 'City Centre, Durgapur 713216', 'Durgapur', 4.2, 950, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 23.5360, 87.2960, ARRAY['Mughlai', 'Biryani', 'Traditional'], true, 'community'),

  -- SILIGURI: TRUSTED & TRENDING
  ('The Grand Lazeez (Siliguri)', 'Mughlai', 'Planet Mall, Sevoke Rd, Siliguri 734001', 'Siliguri', 5.0, 950, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 26.7321, 88.4312, ARRAY['Mughlai', 'Fine Dining', 'Premium', 'Sevoke Road'], true, 'community'),
  ('Muslim Hotel & Biryani House', 'Indian-Muslim', 'Desh Bandhu Para, Siliguri 734004', 'Siliguri', 4.5, 4200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 26.7110, 88.4230, ARRAY['Biryani', 'Local Favorite', 'Spicy', 'Oldest'], true, 'community'),
  ('Pakeeza', 'Indian', 'Hill Cart Road, Siliguri 734001', 'Siliguri', 4.3, 2200, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800', 26.7180, 88.4190, ARRAY['Indian', 'Halal-friendly', 'Main Course', 'Classy'], true, 'community'),
  ('Zaika Restaurant & Biryani', 'Indian', 'Near Cosmos Mall, Sevoke Rd, Siliguri 734001', 'Siliguri', 4.5, 3100, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 26.7330, 88.4320, ARRAY['Indo-Chinese', 'Biryani', 'Sevoke Road', 'Ambiance'], true, 'community'),
  ('The Biryani Inc.', 'Mughlai', 'Sevoke Road, Siliguri 734001', 'Siliguri', 4.4, 1100, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', 26.7300, 88.4280, ARRAY['Biryani', 'Kebabs', 'Trending', 'Mughlai'], true, 'community'),
  ('Calcutta Biryani House', 'Bengali-Mughlai', 'Bidhan Market, Siliguri 734001', 'Siliguri', 4.4, 2500, 'https://images.unsplash.com/photo-1557872246-7a79da53f630?w=800', 26.7145, 88.4225, ARRAY['Kolkata Style Biryani', 'Budget Friendly', 'Bidhan Market'], true, 'community');
