-- MIXED NEIGHBORHOOD SEED: Halal Options in Diverse Areas
-- Areas: Salt Lake, New Town, Ballygunge (Kolkata), South Delhi (Saket, South Ext), Bangalore (Indiranagar, Koramangala), Mumbai (Bandra, Juhu)

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status)
VALUES
-- KOLKATA: SALT LAKE & NEW TOWN (Mixed Residential/Tech)
('Kareem''s (New Town)', 'Mughlai', 'Action Area 1, PS Srijan Corporate Park, New Town, Kolkata 700156', 'Kolkata', 4.1, 8200, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 22.5850, 88.4750, ARRAY['Halal', 'Mixed Area', 'Mughlai'], true, 'community_verified'),
('Jabbrr Afghani', 'Afghani / Rolls', 'Sector V, Salt Lake City, Kolkata 700091', 'Kolkata', 4.0, 3500, 'https://images.unsplash.com/photo-1593560708920-61dd04e46a4e?auto=format&fit=crop&q=80', 22.5780, 88.4350, ARRAY['Halal', 'Tech Hub', 'Rolls'], true, 'community_verified'),
('Zaffran (Salt Lake)', 'North Indian', 'City Centre 1, Block DC, Sector 1, Salt Lake, Kolkata 700064', 'Kolkata', 4.2, 5800, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 22.5880, 88.4080, ARRAY['Halal', 'Mixed Neighborhood', 'North Indian'], true, 'community_verified'),
('HFC (Hamza Fried Chicken)', 'Fast Food', 'Action Area 1, New Town, Kolkata 700156', 'Kolkata', 4.3, 1200, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80', 22.5860, 88.4760, ARRAY['Halal', 'Fast Food', 'Budget'], true, 'community_verified'),

-- KOLKATA: BALLYGUNGE & KASBA (Diverse South Kolkata)
('Shimla Biriyani (Kasba)', 'Biryani', '73, Dr. GS Bose Road, Kasba, Kolkata 700039', 'Kolkata', 4.1, 4500, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 22.5180, 88.3850, ARRAY['Halal', 'Mixed Locality', 'Biryani'], true, 'community_verified'),
('NFC Food Funda', 'Mughlai', 'AJC Bose Road, near Beck Bagan, Kolkata 700017', 'Kolkata', 4.0, 3100, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 22.5410, 88.3580, ARRAY['Halal', 'Diverse Area', 'Mughlai'], true, 'community_verified'),

-- DELHI: SOUTH EXTENSION & SAKET (High-End Mixed)
('Zaffran (South Ext)', 'North Indian', 'South Extension 2, New Delhi 110049', 'Delhi', 4.3, 2100, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80', 28.5680, 77.2200, ARRAY['Halal', 'Upscale Mixed', 'North Indian'], true, 'community_verified'),
('Al-Nawaz (Saket)', 'Mughlai', 'Near Saket Community Centre, New Delhi 110017', 'Delhi', 4.2, 5200, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 28.5280, 77.2180, ARRAY['Halal', 'Mixed Hub', 'Mughlai'], true, 'community_verified'),
('Karim''s (Saket)', 'Mughlai', 'Saket District Centre, New Delhi 110017', 'Delhi', 4.1, 8500, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 28.5260, 77.2190, ARRAY['Halal', 'Iconic in Mixed Area', 'Biryani'], true, 'community_verified'),

-- BANGALORE: INDIRANAGAR & KORAMANGALA (Modern Mixed)
('Sharief Bhai (Indiranagar)', 'Deccani Mughlai', '100 Feet Rd, Indiranagar, Bangalore 560038', 'Bangalore', 4.4, 15000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 12.9710, 77.6410, ARRAY['Halal', 'Tech Hub', 'Paya Soup'], true, 'community_verified'),
('Empire Restaurant (Koramangala)', 'Multi-cuisine', '5th Block, Koramangala, Bangalore 560095', 'Bangalore', 4.2, 45000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 12.9350, 77.6140, ARRAY['Halal', 'Late Night', 'Mixed Crowds'], true, 'community_verified'),
('Meghana Foods (Indiranagar)', 'Biryani', '100 Feet Rd, Indiranagar, Bangalore 560038', 'Bangalore', 4.5, 32000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 12.9720, 77.6420, ARRAY['Halal', 'Famous Biryani', 'Mixed Neighborhood'], true, 'community_verified'),

-- MUMBAI: BANDRA & JUHU (Mixed Cosmopolitan)
('Lucky Restaurant (Bandra)', 'Mughlai / Biryani', 'Hill Road, Bandra West, Mumbai 400050', 'Mumbai', 4.1, 28000, 'https://images.unsplash.com/photo-1545231027-63b3b1cdf437?auto=format&fit=crop&q=80', 19.0560, 72.8340, ARRAY['Halal', 'Cosmopolitan Hub', 'Legendary'], true, 'community_verified'),
('Alibaba Cafe (Juhu)', 'Middle Eastern', 'Near Juhu Beach, Juhu, Mumbai 400049', 'Mumbai', 4.3, 5200, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 19.1050, 72.8260, ARRAY['Halal', 'Sea View', 'Mixed Gathering'], true, 'community_verified')
ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified;
