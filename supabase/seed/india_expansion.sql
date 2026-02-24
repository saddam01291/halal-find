-- NATIONAL SEED: India Halal Gems (Expansion)
-- Cities: Delhi, Mumbai, Lucknow, Hyderabad

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status)
VALUES
-- DELHI: OLD DELHI & JAMIA
('Karim''s Hotel (Original)', 'Mughlai', '16, Gali Kababian, Jama Masjid, Old Delhi 110006', 'Delhi', 4.5, 55000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 28.6496, 77.2343, ARRAY['Halal', 'Legendary', 'Mutton Burra'], false, 'pending'),
('Al Jawahar Restaurant', 'Mughlai', 'No. 8, Opp. Gate No. 1, Jama Masjid, Delhi 110006', 'Delhi', 4.3, 15000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 28.6498, 77.2345, ARRAY['Halal', 'Mughlai', 'Old Delhi'], false, 'pending'),
('Aslam Chicken Corner', 'Mughlai / Butter Chicken', 'Near Jama Masjid, Matia Mahal, Old Delhi 110006', 'Delhi', 4.1, 12000, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80', 28.6490, 77.2350, ARRAY['Halal', 'Butter Chicken', 'Unique'], false, 'pending'),
('Qureshi Kabab Corner', 'Kebabs', 'Opposite Gate 1, Jama Masjid, Old Delhi 110006', 'Delhi', 4.4, 8500, 'https://images.unsplash.com/photo-1529193591184-b1d58b34ecdf?auto=format&fit=crop&q=80', 28.6502, 77.2340, ARRAY['Halal', 'Kebabs', 'Street Food'], false, 'pending'),

-- MUMBAI: MOHAMMAD ALI ROAD & BANDRA
('Bade Miya (Colaba)', 'Kebabs / Rolls', 'Tulloch Rd, Apollo Bandar, Colaba, Mumbai 400039', 'Mumbai', 4.2, 35000, 'https://images.unsplash.com/photo-1593560708920-61dd04e46a4e?auto=format&fit=crop&q=80', 18.9221, 72.8317, ARRAY['Halal', 'Legendary', 'Open Late'], false, 'pending'),
('Shalimar Restaurant', 'Mughlai', 'Vazir Bldg, Bhendi Bazaar, Mumbai 400003', 'Mumbai', 4.3, 21000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 18.9558, 72.8327, ARRAY['Halal', 'Mughlai', 'Family'], false, 'pending'),
('Lucky Biryani (Bandra)', 'Biryani', 'Hill Rd, Bandra West, Mumbai 400050', 'Mumbai', 4.1, 18500, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 19.0560, 72.8340, ARRAY['Halal', 'Biryani', 'Famous'], false, 'pending'),
('Bagdadi', 'Mughlai / Budget', 'Tulloch Rd, Colaba, Mumbai 400039', 'Mumbai', 4.0, 12000, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 18.9215, 72.8320, ARRAY['Halal', 'Budget', 'Heavy Boti'], false, 'pending'),

-- LUCKNOW: THE CITY OF NAWABS
('Tunday Kababi (Chowk)', 'Kebabs', 'Phool Wali Gali, Chowk, Lucknow 226003', 'Lucknow', 4.7, 45000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 26.8672, 80.9125, ARRAY['Halal', 'World Famous', 'Galouti'], false, 'pending'),
('Idris Biryani', 'Awadhi Biryani', 'Near Raja Bazar, Chowk, Lucknow 226003', 'Lucknow', 4.4, 11000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 26.8685, 80.9140, ARRAY['Halal', 'Authentic', 'Mutton Biryani'], false, 'pending'),
('Wahid Biryani', 'Biryani', 'Aminabad, Lucknow 226018', 'Lucknow', 4.2, 18000, 'https://images.unsplash.com/photo-1545231027-63b3b1cdf437?auto=format&fit=crop&q=80', 26.8450, 80.9250, ARRAY['Halal', 'Famous', 'Aminabad'], false, 'pending'),

-- HYDERABAD: THE BIRYANI CAPITAL
('Paradise Biryani (Secunderabad)', 'Hyderabadi Biryani', 'SD Road, Secunderabad, Hyderabad 500003', 'Hyderabad', 4.2, 125000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 17.4430, 78.4900, ARRAY['Halal', 'Hyderabadi', 'Famous'], false, 'pending'),
('Bawarchi Restaurant', 'Hyderabadi Biryani', 'RTC X Roads, Musheerabad, Hyderabad 500020', 'Hyderabad', 4.5, 95000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 17.4020, 78.4920, ARRAY['Halal', 'Original', 'Best Biryani'], false, 'pending'),
('Shah Ghouse', 'Hyderabadi Biryani / Haleem', 'Near Charminar, Hyderabad 500002', 'Hyderabad', 4.4, 82000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 17.3600, 78.4730, ARRAY['Halal', 'Haleem', 'Late Night'], false, 'pending'),
('Hotel Shadab', 'Hyderabadi Biryani', 'High Court Rd, Ghansi Bazaar, Hyderabad 500066', 'Hyderabad', 4.3, 41000, 'https://images.unsplash.com/photo-1529193591184-b1d58b34ecdf?auto=format&fit=crop&q=80', 17.3650, 78.4750, ARRAY['Halal', 'Old City', 'Biryani'], false, 'pending')
ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified;
