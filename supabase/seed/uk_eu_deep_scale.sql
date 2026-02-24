-- UK & EUROPE DEEP SCALE: Part 1
-- Focus: London (Whitechapel, Edgware Rd, Soho), Manchester (Curry Mile), Birmingham, Berlin (Kreuzberg).

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
-- LONDON: WHITECHAPEL & BRICK LANE (High Density)
('Tayyabs', 'Punjabi', '83-89 Fieldgate St, London E1 1JU, UK', 'London', 4.4, 15000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 51.5170, -0.0630, ARRAY['Halal', 'Legendary', 'Lamb Chops'], false, 'pending', false, 'HMC Certified', 'none', true),
('Lahore Kebab House', 'Pakistani', '2-10 Umberston St, London E1 1PY, UK', 'London', 4.3, 12000, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 51.5140, -0.0650, ARRAY['Halal', 'Authentic', 'Brick Lane'], false, 'pending', false, 'Standard Halal', 'none', true),
('Needoo Grill', 'Pakistani', '87 New Rd, London E1 1HH, UK', 'London', 4.2, 5200, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 51.5175, -0.0610, ARRAY['Halal', 'Punjabi', 'Kebabs'], false, 'pending', false, 'Standard Halal', 'none', true),
('Aladin Brick Lane', 'Bangladeshi', '132 Brick Ln, London E1 6RU, UK', 'London', 4.1, 8500, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 51.5220, -0.0710, ARRAY['Halal', 'Brick Lane', 'Curry'], false, 'pending', false, 'Certified Supply', 'none', true),
('The Monsoon', 'Indian/Bangladeshi', '78 Brick Ln, London E1 6RL, UK', 'London', 4.0, 3100, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 51.5200, -0.0720, ARRAY['Halal', 'Brick Lane', 'Authentic'], false, 'pending', false, 'Standard Supply', 'low', true),

-- LONDON: EDGWARE ROAD & SOHO (Middle Eastern / Mixed)
('Maroush (Edgware Road)', 'Lebanese', '21 Edgware Rd, London W2 2JE, UK', 'London', 4.2, 9500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 51.5135, -0.1610, ARRAY['Halal', 'Arabian', 'Late Night'], false, 'pending', false, 'Maroush Certified', 'none', true),
('Patogh', 'Persian', '8 Crawford Pl, London W1H 5NE, UK', 'London', 4.5, 2800, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 51.5190, -0.1640, ARRAY['Halal', 'Hidden Gem', 'Persian'], false, 'pending', false, 'Certified Halal', 'none', true),
('Ishbilia', 'Lebanese', '8-9 William St, London SW1X 9HL, UK', 'London', 4.3, 5800, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 51.5010, -0.1580, ARRAY['Halal', 'Fine Dining', 'Knightsbridge'], false, 'pending', false, 'Certified Halal', 'none', true),
('Dishoom (Carnaby)', 'Indian', '22 Kingly St, London W1B 5QP, UK', 'London', 4.6, 25000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 51.5125, -0.1410, ARRAY['Halal Options', 'Iconic', 'Bombay Cafe'], false, 'pending', true, 'Hand Slaughtered Lamb/Chicken', 'low', true),

-- MANCHESTER & BIRMINGHAM
('MyLahore (Manchester)', 'Fusion', '14-18 Wilmslow Rd, Manchester M14 5TP, UK', 'Manchester', 4.4, 12000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 53.4560, -2.2250, ARRAY['Halal', 'Curry Mile', 'Fusion'], false, 'pending', false, 'MyLahore Certified', 'none', false),
('Akbar''s (Manchester)', 'Indian', '73-83 Liverpool Rd, Manchester M3 4NQ, UK', 'Manchester', 4.3, 15000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 53.4770, -2.2530, ARRAY['Halal', 'Family', 'Giant Naan'], false, 'pending', false, 'Standard Halal', 'none', false),
('Dishoom (Birmingham)', 'Indian', 'One Chamberlain Sq, Birmingham B3 3AX, UK', 'Birmingham', 4.7, 8500, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 52.4795, -1.9035, ARRAY['Halal Options', 'Modern', 'Birmingham Hub'], false, 'pending', true, 'Halal Certified Poultry/Lamb', 'low', true),

-- BERLIN: KREUZBERG & NEUKÖLLN
('Yeni Adana Grillhaus', 'Turkish', 'Manteuffelstraße 77, 10999 Berlin, Germany', 'Berlin', 4.5, 9500, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 52.4990, 13.4350, ARRAY['Halal', 'Turkish', 'Adana Kebab'], false, 'pending', false, 'Turkish Halal Supply', 'none', false),
('Salamat', 'Iraqi/Arabian', 'Oranienstraße 18, 10999 Berlin, Germany', 'Berlin', 4.4, 5200, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 52.5015, 13.4190, ARRAY['Halal', 'Iraqi', 'Kreuzberg'], false, 'pending', false, 'Certified Supply', 'none', false),

-- LONDON: EXTENDED SOHO & WEST END (Mixed Neighborhoods)
('Zaiqa London', 'Pakistani', '109 Whitechapel High St, London E1 7RA, UK', 'London', 4.2, 2100, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 51.5160, -0.0710, ARRAY['Halal', 'Pakistani', 'Whitechapel'], false, 'pending', false, 'Standard Halal', 'none', true),
('Hajji Tikka (London)', 'Kebabs', '84 Fieldgate St, London E1 1JU, UK', 'London', 4.3, 1200, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 51.5165, -0.0640, ARRAY['Halal', 'Kebabs', 'Brick Lane'], false, 'pending', false, 'Standard Halal', 'none', true),
('Pistachio Grill', 'Middle Eastern', 'Station Rd, Edgware, London HA8 7AW, UK', 'London', 4.4, 1800, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 51.6110, -0.2710, ARRAY['Halal', 'Family', 'Edgware'], false, 'pending', false, 'Certified Supply', 'none', true),

-- MANCHESTER: EXTENDED CURRY MILE
('Ziya Asian Grill', 'Modern Indian', '65-67 Wilmslow Rd, Manchester M14 5TB, UK', 'Manchester', 4.5, 3200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 53.4540, -2.2230, ARRAY['Halal', 'Curry Mile', 'Modern'], false, 'pending', false, 'Standard Halal', 'low', true),
('Cafe Istanbul (Manchester)', 'Turkish', '79-81 Bridge St, Manchester M3 2RH, UK', 'Manchester', 4.3, 2100, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 53.4810, -2.2490, ARRAY['Halal', 'Turkish', 'City Centre'], false, 'pending', true, 'Halal Certified Meat', 'low', true),
('Etci Mehmet (Manchester)', 'Turkish Steakhouse', 'Unit 4, The Quadrangle, Manchester M1 5QS, UK', 'Manchester', 4.6, 5800, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 53.4750, -2.2390, ARRAY['Halal', 'Steakhouse', 'Turkish'], false, 'pending', false, 'Hand Slaughtered', 'none', true),

-- LONDON: SOUTHALL & HOUNSLOW (The Desi Powerhouse)
('Spice Village Southall', 'Pakistani', '185-189 The Broadway, Southall UB1 1LX', 'London', 4.1, 8500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 51.5120, -0.3780, ARRAY['Halal', 'Lahori', 'Spice Village'], false, 'pending', false, 'Standard Halal', 'none', false),
('Madhu''s Southall', 'Indian/High-End', '39 South Rd, Southall UB1 1SW', 'London', 4.4, 3200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 51.5090, -0.3750, ARRAY['Halal', 'Fine Dining', 'Southall'], false, 'pending', false, 'Certified Supply', 'none', true),
('Watan Southall', 'Afghan', '183 The Broadway, Southall UB1 1LX', 'London', 4.2, 2100, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 51.5115, -0.3775, ARRAY['Halal', 'Afghan', 'Southall'], false, 'pending', false, 'Standard Halal', 'none', false),
('Yalla Beirut Hounslow', 'Lebanese', '258 High St, Hounslow TW3 1HB', 'London', 4.3, 1500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 51.4680, -0.3620, ARRAY['Halal', 'Lebanese', 'Hounslow'], false, 'pending', false, 'Standard Halal', 'none', true),

-- LONDON: EAST HAM & ILFORD (The Bengali/Asian Hub)
('Chico''s East Ham', 'Burgers/Fusion', '241 High St N, London E6 1JG', 'London', 4.5, 5800, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', 51.5350, 0.0520, ARRAY['Halal', 'Smash Burger', 'East Ham'], false, 'pending', false, 'Certified Supply', 'none', true),
('Sahara Grill Ilford', 'Grilled Chicken', '2 Ley St, Ilford IG1 4EE', 'London', 4.1, 9500, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 51.5610, 0.0710, ARRAY['Halal', 'Grill', 'Ilford'], false, 'pending', false, 'Standard Halal', 'none', true),
('Saffron Kitchen Ilford', 'Modern Indian', '300 Lea Bridge Rd, London E10 7LD', 'London', 4.4, 3200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 51.5710, -0.0410, ARRAY['Halal', 'Modern', 'Ilford'], false, 'pending', true, 'Halal Certified', 'low', true)
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
