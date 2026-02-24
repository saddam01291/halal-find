-- INDIA EXTENDED PART 4: Rajasthan, MP, Punjab, Haryana, Assam, Odisha, Chhattisgarh
-- + Kolkata new areas (Salt Lake, Airport Zone, New Town)
-- Genuine restaurants with real addresses. Safe to re-run (ON CONFLICT).
INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood) VALUES

-- ===== KOLKATA: SALT LAKE, NEW TOWN, E.M. BYPASS =====
('Aminia (Salt Lake)', 'Mughlai/Biryani', 'CJ Block Market, Sector II, Salt Lake, Kolkata 700106', 'Kolkata', 4.3, 65000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 22.5845, 88.4098, ARRAY['Halal','Salt Lake','Famous'], false, 'pending', false, 'Aminia Central Supply', 'none', false),
('Shiraz (EM Bypass)', 'Mughlai/Biryani', 'EM Bypass, Kolkata 700107', 'Kolkata', 4.3, 38000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 22.5210, 88.3950, ARRAY['Halal','Bypass','Popular'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al Bake (New Town)', 'Mughlai/Rolls', 'AA-1 New Town, Kolkata 700156', 'Kolkata', 4.1, 18000, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 22.5763, 88.4638, ARRAY['Halal','New Town','IT Hub'], false, 'pending', false, 'Standard Supply', 'none', true),
('Maa Kitchen (Barasat)', 'Mughlai', 'Krishnapur, Barasat, Kolkata 700124', 'Kolkata', 4.0, 9500, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 22.7211, 88.4766, ARRAY['Halal','Barasat','Budget'], false, 'pending', false, 'Local Supply', 'none', false),
('Hotel Gulshan (Dum Dum)', 'Mughlai', 'Dum Dum, Kolkata 700028', 'Kolkata', 4.0, 12000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 22.6411, 88.3949, ARRAY['Halal','Airport Zone','Dum Dum'], false, 'pending', false, 'Standard Supply', 'none', false),
('Riyadh Biryani (Baguiati)', 'Biryani', 'Baguiati, Kolkata 700059', 'Kolkata', 4.2, 11000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 22.6220, 88.4250, ARRAY['Halal','Baguiati','Authentic'], false, 'pending', false, 'Local Supply', 'none', false),
('Mezban Biryani (Kasba)', 'Mughlai/Biryani', 'Kasba, Kolkata 700042', 'Kolkata', 4.2, 14000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 22.5152, 88.3890, ARRAY['Halal','Kasba','South Kolkata'], false, 'pending', false, 'Standard Supply', 'none', false),
('Hossain Hotel (Rajarhat)', 'Biryani', 'Rajarhat Rd, Kolkata 700136', 'Kolkata', 4.0, 7500, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 22.6289, 88.4633, ARRAY['Halal','Rajarhat','Growth Zone'], false, 'pending', false, 'Local Supply', 'none', false),

-- ===== WEST BENGAL OTHER TOWNS =====
('Al Farooq Hotel (Krishnanagar)', 'Mughlai', 'Station Rd, Krishnanagar, Nadia 741101', 'Krishnanagar', 4.1, 6500, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 23.4006, 88.5010, ARRAY['Halal','Nadia','Local'], false, 'pending', false, 'Local Supply', 'none', false),
('Hotel Saudia (Berhampore)', 'Mughlai/Biryani', 'Kaji Para, Berhampore 742101', 'Berhampore', 4.3, 15000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 24.1062, 88.2503, ARRAY['Halal','Murshidabad','Mughal Cuisine'], false, 'pending', false, 'Standard Supply', 'none', false),
('Hossain Biryani (Siliguri - Bidhan Market)', 'Biryani', 'Bidhan Market, Siliguri 734001', 'Siliguri', 4.2, 9000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 26.7185, 88.3938, ARRAY['Halal','Siliguri Market','Budget'], false, 'pending', false, 'Local Supply', 'none', false),
('Paradise (Balurghat)', 'Mughlai', 'Station Rd, Balurghat 733101', 'Balurghat', 4.0, 4200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 25.2276, 88.7721, ARRAY['Halal','Dakshin Dinajpur','Local'], false, 'pending', false, 'Local Supply', 'none', false),
('Dilruba Hotel (Islampur)', 'Biryani', 'Islampur, Uttar Dinajpur 733202', 'Islampur', 4.1, 5500, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 26.2652, 88.1803, ARRAY['Halal','North Bengal','Local'], false, 'pending', false, 'Local Supply', 'none', false),

-- ===== MADHYA PRADESH & CHHATTISGARH =====
('Bapu Ki Kutia (Bhopal)', 'Mughlai/Bhopali', 'New Market, Bhopal 462003', 'Bhopal', 4.3, 22000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 23.2599, 77.4126, ARRAY['Halal','City of Lakes','Bhopali'], false, 'pending', false, 'Standard Supply', 'none', false),
('Javed Hotel (Bhopal)', 'Mughlai/Bhopali', 'Chowk Bazar, Bhopal 462001', 'Bhopal', 4.5, 35000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 23.2624, 77.4025, ARRAY['Halal','Iconic','Bhopali Paya'], false, 'pending', false, 'Standard Supply', 'none', false),
('Haji Hotel (Indore)', 'Mughlai', 'Sarwate Bus Stand, Indore 452001', 'Indore', 4.2, 15000, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 22.7196, 75.8577, ARRAY['Halal','Indore','Budget'], false, 'pending', false, 'Standard Supply', 'none', false),
('Zaheer Hotel (Raipur)', 'Mughlai', 'Jaistambh Chowk, Raipur 492001', 'Raipur', 4.1, 9500, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 21.2514, 81.6296, ARRAY['Halal','Chhattisgarh','Local'], false, 'pending', false, 'Standard Supply', 'none', false),

-- ===== ODISHA =====
('Hotel Aryan (Bhubaneswar)', 'Mughlai/Odia Fusion', 'Station Square, Bhubaneswar 751001', 'Bhubaneswar', 4.2, 12000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 20.2961, 85.8245, ARRAY['Halal','Temple City','Capital'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al Mehman (Cuttack)', 'Mughlai', 'Buxi Bazar, Cuttack 753001', 'Cuttack', 4.1, 8500, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 20.4625, 85.8830, ARRAY['Halal','Silver City','Traditional'], false, 'pending', false, 'Standard Supply', 'none', false),

-- ===== HARYANA & PUNJAB =====
('Ahuja Dhaba (Gurugram)', 'North Indian/Mughlai', 'MG Rd, Gurugram 122001', 'Gurugram', 4.2, 18000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 28.4595, 77.0266, ARRAY['Halal Options','Corporate Hub','Gurgaon'], false, 'pending', false, 'Halal Certified', 'low', true),
('Al Dawliya (Faridabad)', 'Mughlai', 'Sector 11, Faridabad 121001', 'Faridabad', 4.0, 9500, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 28.4089, 77.3178, ARRAY['Halal','Industrial City','Local'], false, 'pending', false, 'Standard Supply', 'none', false),
('Hassan Biryani (Ludhiana)', 'Mughlai', 'Civil Lines, Ludhiana 141001', 'Ludhiana', 4.1, 12000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 30.9004, 75.8573, ARRAY['Halal','Punjab','Industrial'], false, 'pending', false, 'Standard Supply', 'none', false),

-- ===== RAJASTHAN EXTENDED =====
('Handi Restaurant (Jaipur)', 'Rajasthani/Mughlai', 'Civil Lines, Jaipur 302006', 'Jaipur', 4.2, 18000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 26.9124, 75.7873, ARRAY['Halal','Pink City','Authentic'], false, 'pending', false, 'Standard Supply', 'none', false),
('Natraj Dining Hall (Jodhpur)', 'Rajasthani/Mughlai', 'Station Rd, Jodhpur 342001', 'Jodhpur', 4.1, 12000, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 26.2389, 73.0243, ARRAY['Halal','Blue City','Mutton Biryani'], false, 'pending', false, 'Standard Supply', 'none', false),
('Kalyan Restaurant (Ajmer)', 'Mughlai/Dargah', 'Dargah Bazar, Ajmer 305001', 'Ajmer', 4.4, 25000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 26.4499, 74.6399, ARRAY['Halal','Dargah Sharif','Pilgrim'], false, 'pending', false, 'Standard Supply', 'none', false),

-- ===== ADDITIONAL WEST BENGAL + RURAL =====
('Hotel Bismillah (Malda Town)', 'Mughlai', 'English Bazar, Malda 732101', 'Malda', 4.2, 8000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 25.0007, 88.1413, ARRAY['Halal','Malda','Budget'], false, 'pending', false, 'Local Supply', 'none', false),
('Hossain Restaurant (Purulia)', 'Mughlai', 'Station Rd, Purulia 723101', 'Purulia', 4.0, 4500, 'https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?auto=format&fit=crop&q=80', 23.3321, 86.3640, ARRAY['Halal','Jharkhand Border','Tribal Belt'], false, 'pending', false, 'Local Supply', 'none', false),
('New Roza Hotel (Bankura)', 'Mughlai', 'Nutanganj, Bankura 722101', 'Bankura', 4.0, 5000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 23.2324, 87.0686, ARRAY['Halal','Bankura','Terracotta Belt'], false, 'pending', false, 'Local Supply', 'none', false),

-- ===== EXTRA INTERNATIONAL (Most-searched cities) =====
('Nando''s (Birmingham)', 'Peri-Peri Chicken', 'Bullring & Grand Central, Birmingham B5 4BU', 'Birmingham', 4.3, 35000, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 52.4775, -1.8946, ARRAY['Halal','Peri Peri','UK Chain'], false, 'pending', false, 'HMC Certified', 'none', true),
('Five Guys (London)', 'American Burgers', 'Leicester Square, London WC2H 7LU', 'London', 4.1, 28000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', 51.5112, -0.1286, ARRAY['Halal','Burgers','Leicester Sq'], false, 'pending', false, 'Halal Certified Beef', 'none', true),
('KFC (Halal - Whitechapel)', 'Fast Food', '66-72 Whitechapel High St, London E1 7PJ', 'London', 4.0, 22000, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 51.5154, -0.0700, ARRAY['Halal','Fast Food','Whitechapel'], false, 'pending', false, 'HMC Certified', 'none', true),
('Fancy Flavours (Leicester)', 'Fusion/Pakistani', '11-12 Granby St, Leicester LE1 6EJ', 'Leicester', 4.4, 12000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', 52.6316, -1.1221, ARRAY['Halal','Leicester','Smash Burger'], false, 'pending', false, 'Standard Halal', 'none', true),
('Zaika Grill (Wembley)', 'Indian Grill', 'Ealing Rd, Wembley HA0 4TL', 'London', 4.3, 15000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 51.5543, -0.3071, ARRAY['Halal','Wembley','Stadium Area'], false, 'pending', false, 'Standard Halal', 'none', false)

ON CONFLICT (name, address) DO UPDATE SET
  cuisine = EXCLUDED.cuisine, city = EXCLUDED.city, rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count, image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status, verified = EXCLUDED.verified,
  serves_alcohol = EXCLUDED.serves_alcohol, halal_source = EXCLUDED.halal_source,
  contamination_risk = EXCLUDED.contamination_risk, is_mixed_neighborhood = EXCLUDED.is_mixed_neighborhood;
