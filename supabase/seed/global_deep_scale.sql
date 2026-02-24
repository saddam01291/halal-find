-- GLOBAL DEEP SCALE: Part 1 (The Planetary Takeoff)
-- Focus: NYC (Queens), Toronto (Scarborough/Mississauga), Houston, Sydney (Auburn/Lakemba), Singapore.

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
-- NYC: QUEENS HUB
('Shah''s Halal Kitchen (Jackson Heights)', 'Bengali/Fusion', '73-20 37th Ave, Jackson Heights, NY 11372', 'New York', 4.3, 5200, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 40.7485, -73.8920, ARRAY['Halal', 'Jackson Heights', 'Rice Platter'], false, 'pending', false, 'Certified Zabiha', 'none', true),
('Little Flower Cafe', 'Afghan/Cafe', '14-15 150th St, Queens, NY 11357', 'New York', 4.5, 1200, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80', 40.7850, -73.8150, ARRAY['Halal', 'Cafe', 'Afghan'], false, 'pending', false, 'Standard Halal', 'none', true),
('Mumbar', 'Egyptian', '25-08 Steinway St, Astoria, NY 11103', 'New York', 4.4, 3800, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 40.7680, -73.9140, ARRAY['Halal', 'Astoria', 'Egyptian'], false, 'pending', false, 'Certified Halal', 'none', true),
('King of Falafel & Shawarma', 'Middle Eastern', '30-15 Broadway, Astoria, NY 11106', 'New York', 4.6, 8500, 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80', 40.7610, -73.9210, ARRAY['Halal', 'Street Food', 'Award Winning'], false, 'pending', false, 'Standard Halal', 'none', true),

-- TORONTO: SCARBOROUGH & MISSISSAUGA
('Karahi Boys (Mississauga)', 'Pakistani', '1891 Rathburn Rd E, Mississauga, ON L4W 0A4', 'Toronto', 4.2, 5800, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 43.6400, -79.5850, ARRAY['Halal', 'Pakistani', 'Karahi'], false, 'pending', false, 'Certified Zabiha', 'none', true),
('Bamiyan Kabob', 'Afghan', '1553 Warden Ave, Scarborough, ON M1R 2S9', 'Toronto', 4.4, 12000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 43.7650, -79.2950, ARRAY['Halal', 'Afghan', 'Kebabs'], false, 'pending', false, 'Standard Halal', 'none', true),
('The Roti Hut', 'Caribbean', '351 Pitfield Rd, Scarborough, ON M1S 3E5', 'Toronto', 4.6, 3100, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 43.7850, -79.2550, ARRAY['Halal', 'Caribbean', 'Legacy'], false, 'pending', false, 'Certified Supply', 'none', true),

-- HOUSTON: Zabihah Hub
('Aga''s Restaurant', 'Indo-Pak', '11842 Wilcrest Dr, Houston, TX 77031', 'Houston', 4.7, 55000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 29.6540, -95.5650, ARRAY['Halal', 'Legendary', 'Grill'], false, 'pending', false, '100% Zabiha Halal', 'none', false),
('Kasra Persian Grill', 'Persian', '9741 Westheimer Rd, Houston, TX 77042', 'Houston', 4.5, 12000, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80', 29.7360, -95.5390, ARRAY['Halal', 'Persian', 'Top Rated'], false, 'pending', false, 'Certified Halal', 'none', true),
('Burger Bodega', 'Burgers', '4520 Washington Ave, Houston, TX 77007', 'Houston', 4.6, 8500, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', 29.7700, -95.3950, ARRAY['Halal', 'Smash Burger', 'Trendy'], false, 'pending', false, 'Certified Halal Beef', 'none', true),

-- SYDNEY & MELBOURNE
('Jasmine 1 Restaurant', 'Lebanese', '224 Auburn Rd, Auburn NSW 2144, Australia', 'Sydney', 4.2, 9500, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', -33.8560, 151.0320, ARRAY['Halal', 'Lebanese', 'Auburn'], false, 'pending', false, 'Standard Halal', 'none', true),
('Ekush Halal Restaurant', 'Bangladeshi', '78 Haldon St, Lakemba NSW 2195, Australia', 'Sydney', 4.1, 5200, 'https://images.unsplash.com/photo-1593560708920-61dd04e46a4e?auto=format&fit=crop&q=80', -33.9210, 151.0750, ARRAY['Halal', 'Lakemba', 'South Asian'], false, 'pending', false, 'Standard Halal', 'none', true),
('Tiba''s Brunswick', 'Lebanese', '504 Sydney Rd, Brunswick VIC 3056, Australia', 'Melbourne', 4.5, 12000, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', -37.7650, 144.9630, ARRAY['Halal', 'Brunswick', 'Arabian'], false, 'pending', false, 'Certified Halal', 'none', true),

-- SE ASIA: SINGAPORE & KL
('Hjh Maimunah', 'Nasi Padang', '11 & 15 Jalan Pisang, Singapore 199078', 'Singapore', 4.4, 18000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 1.3015, 103.8585, ARRAY['Halal', 'Michelin Bib', 'Nasi Padang'], false, 'pending', false, 'MUIS Certified', 'none', true),
('The Dim Sum Place', 'Chinese/Fusion', '791 North Bridge Rd, Singapore 198759', 'Singapore', 4.2, 9500, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80', 1.3025, 103.8595, ARRAY['Halal', 'Chinese', 'Dim Sum'], false, 'pending', false, 'MUIS Certified', 'none', true),
('Zam Zam (Singapore)', 'Indian/Mughlai', '697-699 North Bridge Rd, Singapore 198675', 'Singapore', 4.3, 25000, 'https://images.unsplash.com/photo-1585932231552-05bca4023700?auto=format&fit=crop&q=80', 1.3020, 103.8590, ARRAY['Halal', 'Iconic', 'Murtabak'], false, 'pending', false, 'MUIS Certified', 'none', true),
('Yusoof and Zakhir', 'Indian-Malay', 'Jalan Hang Kasturi, Kuala Lumpur 50050', 'Kuala Lumpur', 4.1, 12000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 3.1460, 101.6960, ARRAY['Halal', 'Heritage', 'Nasi Kandar'], false, 'pending', false, 'JAKIM Certified', 'none', true),

-- NYC: QUEENS ADDITIONAL HUB
('Amdo Kitchen', 'Tibetan', 'Jackson Heights, Queens, NY 11372', 'New York', 4.5, 800, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 40.7480, -73.8910, ARRAY['Halal', 'Momos', 'Food Truck'], false, 'pending', false, 'Standard Halal', 'none', true),
('Mo Cafe', 'Yemeni/Cafe', 'Astoria, Queens, NY 11103', 'New York', 4.4, 1500, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80', 40.7685, -73.9135, ARRAY['Halal', 'Yemeni Coffee', 'Astoria'], false, 'pending', false, 'Standard Halal', 'none', true),
('Shah''s Halal Food (Queens Blvd)', 'Sandwiches', 'Queens Blvd, NY', 'New York', 4.2, 5800, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 40.7250, -73.8150, ARRAY['Halal', 'Quick Bites', 'Queens'], false, 'pending', false, 'Certified Supply', 'none', true),

-- TORONTO: SCARBOROUGH HUB
('Nadi Halal Kebab House', 'Afghan', 'Scarborough, Toronto, ON', 'Toronto', 4.3, 1200, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 43.7655, -79.2955, ARRAY['Halal', 'Afghan', 'Kebab'], false, 'pending', false, 'Standard Halal', 'none', true),
('Ghareeb Nawaz', 'Pakistani', 'Scarborough, Toronto, ON', 'Toronto', 4.1, 2100, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 43.7660, -79.2960, ARRAY['Halal', 'Budget', 'Pakistani'], false, 'pending', false, 'Standard Halal', 'none', true),

-- NYC: BROOKLYN & BRONX CLUSTERS
('Al Aqsa Restaurant', 'Bangladeshi', 'Starling Ave, Bronx, NY', 'New York', 4.2, 3200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 40.8350, -73.8510, ARRAY['Halal', 'Bangladeshi', 'Bronx'], false, 'pending', false, 'Standard Halal', 'none', false),
('Khalil Biryani House', 'Bengali/Biryani', '1437 Unionport Rd, Bronx, NY 10462', 'New York', 4.3, 5800, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 40.8380, -73.8550, ARRAY['Halal', 'Biryani', 'Parkchester'], false, 'pending', false, 'Certified Supply', 'none', false),
('Dar 525 (Brooklyn)', 'Mediterranean', '525 Grand St, Brooklyn, NY 11211', 'New York', 4.4, 3100, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 40.7110, -73.9480, ARRAY['Halal', 'Mediterranean', 'Williamsburg'], false, 'pending', false, 'Standard Halal', 'none', true),
('Hamza & Madina (Brooklyn)', 'Halal Cart Style', 'Glenwood Rd, Brooklyn, NY', 'New York', 4.5, 12000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 40.6350, -73.9180, ARRAY['Halal', 'Late Night', 'Street Food'], false, 'pending', false, 'Standard Halal', 'none', true),

-- TORONTO: MISSISSAUGA POWERHOUSE
('Wahan Chilli', 'Hakka', 'Mississauga, ON', 'Toronto', 4.2, 5200, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 43.5890, -79.6440, ARRAY['Halal', 'Hakka', 'Spicy'], false, 'pending', false, 'Certified Supply', 'none', true),
('The Fry (Mississauga)', 'Korean Fried Chicken', 'Mississauga, ON', 'Toronto', 4.3, 8500, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 43.5900, -79.6450, ARRAY['Halal Options', 'Korean', 'Wings'], false, 'pending', false, 'Halal Chicken Certified', 'low', true)
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
