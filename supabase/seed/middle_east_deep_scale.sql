-- MIDDLE EAST DEEP SCALE: Part 1
-- Focus: Dubai (Downtown, Deira), Riyadh (Olaya, KAFD), Doha (Souq Waqif), Abu Dhabi.

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
-- DUBAI: DOWNTOWN & DFM
('Armani/Ristorante', 'Italian', 'Burj Khalifa, Downtown Dubai', 'Dubai', 4.6, 5200, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 25.1970, 55.2740, ARRAY['Halal', 'Fine Dining', 'Burj Khalifa'], false, 'pending', true, 'Certified Halal Ingredients', 'low', true),
('Zaroob', 'Levantine', 'Sheikh Zayed Rd, Dubai', 'Dubai', 4.3, 8500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 25.2100, 55.2750, ARRAY['Halal', 'Street Food', '24/7'], false, 'pending', false, 'Standard Halal', 'none', true),
('Swiss Butter (Downtown)', 'Steakhouse', 'Sofitel Downtown Dubai', 'Dubai', 4.5, 3200, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 25.2010, 55.2780, ARRAY['Halal', 'Steak', 'Secret Sauce'], false, 'pending', false, 'Certified Supply', 'none', true),

-- DUBAI: DEIRA & OLD DUBAI (High Density)
('Ravi Restaurant', 'Pakistani', 'Satwa, Dubai', 'Dubai', 4.4, 15000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 25.2340, 55.2790, ARRAY['Halal', 'Legendary', 'Budget'], false, 'pending', false, 'Standard Halal', 'none', false),
('Al Ustad Special Kabab', 'Persian', 'Al Fahidi, Bur Dubai', 'Dubai', 4.7, 12000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 25.2570, 55.2930, ARRAY['Halal', 'Historic', 'Kebabs'], false, 'pending', false, 'Standard Halal', 'none', false),
('Al Fanar Restaurant', 'Emirati', 'Dubai Festival City', 'Dubai', 4.2, 5800, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 25.2210, 55.3520, ARRAY['Halal', 'Authentic', 'Culture'], false, 'pending', false, 'Halal Certified', 'none', false),

-- RIYADH: OLAYA & KAFD
('Mama Noura', 'Saudi/Shawarma', 'As Sulimaniyah, Riyadh', 'Riyadh', 4.5, 35000, 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80', 24.7000, 46.6850, ARRAY['Halal', 'Iconic', 'Shawarma'], false, 'pending', false, 'Standard Halal', 'none', false),
('Gymkhana Riyadh', 'Indian', 'Via Riyadh, Al Hada', 'Riyadh', 4.7, 5200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 24.6850, 46.6350, ARRAY['Halal', 'Fine Dining', 'Award Winning'], false, 'pending', false, 'Certified Halal', 'none', true),
('Chotto Matte Riyadh', 'Nikkei', 'KAFD, Riyadh', 'Riyadh', 4.4, 1800, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 24.7610, 46.6430, ARRAY['Halal', 'Trendy', 'KAFD'], false, 'pending', false, 'Certified Supply', 'none', true),

-- DOHA: SOUQ WAQIF & THE PEARL
('Al Shurfa', 'Arabic', 'Souq Waqif, Doha', 'Doha', 4.6, 8500, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 25.2867, 51.5333, ARRAY['Halal', 'View', 'Authentic'], false, 'pending', false, 'Standard Halal', 'none', true),
('Yasmine Palace', 'Middle Eastern', 'The Pearl, Porto Arabia, Doha', 'Doha', 4.5, 12000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 25.3720, 51.5510, ARRAY['Halal', 'Luxurious', 'Family'], false, 'pending', false, 'Certified Halal', 'none', true),

-- ABU DHABI
('Beirut Sur Mer', 'Lebanese', 'Saadiyat Island, Abu Dhabi', 'Abu Dhabi', 4.4, 5200, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 24.5350, 54.4320, ARRAY['Halal', 'Beachfront', 'Levantine'], false, 'pending', false, 'Certified Supply', 'none', true),
('Butcher & Still', 'Steakhouse', 'Four Seasons Abu Dhabi', 'Abu Dhabi', 4.7, 3100, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 24.5020, 54.3850, ARRAY['Halal', 'Steakhouse', 'Chicago Style'], false, 'pending', true, 'Certified Halal Prime Cuts', 'low', true),

-- DUBAI: FINE DINING & MODERN (Mixed)
('Zuma Dubai', 'Japanese', 'DIFC Gateway Village, Dubai', 'Dubai', 4.6, 15000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 25.2130, 55.2810, ARRAY['Halal Options', 'Fine Dining', 'DIFC'], false, 'pending', true, 'Halal Certified Wagyu/Poultry', 'low', true),
('Nobu Dubai', 'Japanese Fusion', 'Atlantis The Palm, Dubai', 'Dubai', 4.5, 9500, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 25.1310, 55.1180, ARRAY['Halal Options', 'Iconic', 'Palm Jumeirah'], false, 'pending', true, 'Halal Omakase Menu', 'low', true),
('3 Fils', 'Asian Fusion', 'Jumeirah Fishing Harbour, Dubai', 'Dubai', 4.7, 5800, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 25.2150, 55.2410, ARRAY['Halal', 'Award Winning', 'Harbour'], false, 'pending', false, 'Standard Halal', 'none', false),

-- RIYADH: MODERN HUB
('LPM Riyadh', 'French/Mediterranean', 'Al Olaya, Riyadh', 'Riyadh', 4.6, 5200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 24.6950, 46.6810, ARRAY['Halal Options', 'Fine Dining', 'Olaya'], false, 'pending', false, 'Certified Halal', 'low', true),
('Mr. Chow Riyadh', 'Chinese/Cantonese', 'KAFD, Riyadh', 'Riyadh', 4.4, 1500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 24.7620, 46.6440, ARRAY['Halal Options', 'KAFD', 'Modern'], false, 'pending', false, 'Certified Supply', 'low', true)
ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified,
  serves_alcohol = EXCLUDED.serves_alcohol,
  halal_source = EXCLUDED.halal_source,
  contamination_risk = EXCLUDED.contamination_risk,
  is_mixed_neighborhood = EXCLUDED.is_mixed_neighborhood;
