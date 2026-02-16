-- ============================================
-- West Bengal Halal Restaurant Data (Kolkata, Durgapur, Siliguri)
-- Run this in Supabase SQL Editor
-- ============================================

-- Inserting real data for West Bengal major cities
insert into places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, added_by) values
  -- KOLKATA
  ('Arsalan (Park Circus)', 'Mughlai', '119A, Muzaffar Ahmed Street (Ripon Street), Kolkata 700016', 'Kolkata', 4.7, 15400, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 22.5448, 88.3658, ARRAY['Biryani', 'Kebab', 'Mughlai', 'Iconic'], true, 'community'),
  ('Aminia (New Market)', 'Mughlai', '6A, S.N. Banerjee Road, New Market, Kolkata 700087', 'Kolkata', 4.5, 12200, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 22.5601, 88.3514, ARRAY['Biryani', 'Heritage', 'Kebab', 'Family'], true, 'community'),
  ('Shiraz Golden Restaurant', 'Mughlai', '56, Park Street, Mullick Bazar, Park Circus, Kolkata 700017', 'Kolkata', 4.4, 9800, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 22.5457, 88.3631, ARRAY['Mughlai', 'Kebab', 'Historic'], true, 'community'),
  ('Zeeshan Restaurant', 'Mughlai', '17, Syed Amir Ali Avenue, Park Circus, Kolkata 700017', 'Kolkata', 4.3, 7500, 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800', 22.5414, 88.3629, ARRAY['Rolls', 'Kebab', 'Street Food'], true, 'community'),

  -- DURGAPUR
  ('Zaffran', 'North Indian', 'Near HDFC Bank, City Centre, Durgapur 713216', 'Durgapur', 4.4, 520, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 23.5332, 87.2939, ARRAY['Kebab', 'North Indian', 'City Centre'], true, 'community'),
  ('Aminia (Durgapur)', 'Mughlai', 'City Centre, Durgapur 713216', 'Durgapur', 4.3, 310, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 23.5350, 87.2950, ARRAY['Biryani', 'Mughlai', 'Famous'], true, 'community'),
  ('Marhaba Restaurant', 'Indo-Chinese', 'Benachity, Durgapur 713213', 'Durgapur', 4.2, 180, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', 23.5488, 87.2814, ARRAY['Indo-Chinese', 'Chicken', 'Affordable'], true, 'community'),

  -- SILIGURI
  ('Muslim Hotel & Biryani House', 'Indian-Muslim', 'Desh Bandhu Para, Siliguri 734004', 'Siliguri', 4.5, 450, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800', 26.7110, 88.4230, ARRAY['Biryani', 'Local Favorite', 'Spicy'], true, 'community'),
  ('Pakeeza', 'Indian', 'Hill Cart Road, Siliguri 734001', 'Siliguri', 4.3, 210, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800', 26.7180, 88.4190, ARRAY['Indian', 'Halal-friendly', 'Main Course'], true, 'community');
