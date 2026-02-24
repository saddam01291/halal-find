-- INDIA DEEP SCALE: Part 1 (250+ Milestone)
-- Focus: Delhi (Jamia, Okhla), Hyderabad (Charminar), Mumbai (Mohammad Ali Rd), Bangalore, Chennai, Kozhikode.

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status, serves_alcohol, halal_source, contamination_risk, is_mixed_neighborhood)
VALUES
-- DELHI: OLD DELHI & JAMIA NAGAR (High Density)
('Aslam Chicken', 'Mughlai', 'Matia Mahal Rd, Jama Masjid, Delhi 110006', 'Delhi', 4.1, 15000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 28.6470, 77.2340, ARRAY['Halal', 'Legendary', 'Butter Chicken'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al Jawahar', 'Mughlai', 'Opposite Jama Masjid Gate No. 1, Delhi 110006', 'Delhi', 4.2, 12000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 28.6472, 77.2338, ARRAY['Halal', 'Mughlai', 'Old Delhi'], false, 'pending', false, 'Certified Supply', 'none', false),
('Qureshi Kabab Corner', 'Kebabs', 'Gate No 1, Jama Masjid, Delhi 110006', 'Delhi', 4.4, 8500, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', 28.6471, 77.2335, ARRAY['Halal', 'Kebabs', 'Street Food'], false, 'pending', false, 'Standard Supply', 'none', false),
('Haji Mohd. Hussain', 'Fried Fish/Chicken', 'Matia Mahal, Jama Masjid, Delhi 110006', 'Delhi', 4.3, 5200, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 28.6468, 77.2342, ARRAY['Halal', 'Fried Food', 'Old Delhi'], false, 'pending', false, 'Standard Supply', 'none', false),
('Kallu Nihari', 'Nihari', '180, Chatta Lal Mian, Daryaganj, Delhi 110002', 'Delhi', 4.5, 3100, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80', 28.6410, 77.2380, ARRAY['Halal', 'Nihari', 'Late Night'], false, 'pending', false, 'Hand Slaughtered', 'none', false),
('Changezi Chicken', 'Mughlai', 'Daryaganj, New Delhi 110002', 'Delhi', 4.0, 9500, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 28.6430, 77.2390, ARRAY['Halal', 'Spicy', 'Famous'], false, 'pending', false, 'Standard Supply', 'none', false),
('Ghalib Kabab Corner', 'Kebabs', 'Nizamuddin Basti, Delhi 110013', 'Delhi', 4.3, 2800, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 28.5910, 77.2430, ARRAY['Halal', 'Nizamuddin', 'Kebabs'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al-Nawaz (Zakir Nagar)', 'Mughlai', 'Zakir Nagar, Okhla, New Delhi 110025', 'Delhi', 4.2, 5800, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 28.5610, 77.2880, ARRAY['Halal', 'Jamia', 'Mughlai'], false, 'pending', false, 'Certified Halal', 'none', false),
('Zaika E Nizamuddin', 'Traditional', 'Nizamuddin Basti, New Delhi 110013', 'Delhi', 4.4, 1200, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80', 28.5915, 77.2425, ARRAY['Halal', 'Authentic', 'Women Led'], false, 'pending', false, 'Homemade/Local', 'none', false),
('Tahir Kabab Corner', 'Kebabs', 'Zakir Nagar Main Rd, Delhi 110025', 'Delhi', 4.1, 3500, 'https://images.unsplash.com/photo-1593560708920-61dd04e46a4e?auto=format&fit=crop&q=80', 28.5615, 77.2885, ARRAY['Halal', 'Rolls', 'Street Food'], false, 'pending', false, 'Standard Supply', 'none', false),

-- HYDERABAD: CHARMINAR & OLD CITY
('Hotel Shadab', 'Biryani', 'High Court Rd, Madina Circle, Hyderabad 500002', 'Hyderabad', 4.4, 65000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 17.3680, 78.4790, ARRAY['Halal', 'Legacy', 'Biryani'], false, 'pending', false, 'Shadab Central Supply', 'none', false),
('Hotel Nayab', 'Hyderabadi', 'Opposite Madina Building, Hyderabad 500002', 'Hyderabad', 4.3, 12000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 17.3685, 78.4795, ARRAY['Halal', 'Breakfast', 'Paya'], false, 'pending', false, 'Standard Supply', 'none', false),
('Pista House (Charminar)', 'Biryani/Haleem', 'Shahalibanda Rd, Hyderabad 500002', 'Hyderabad', 4.2, 35000, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80', 17.3590, 78.4750, ARRAY['Halal', 'Haleem', 'Iconic'], false, 'pending', false, 'Pista House Certified', 'none', false),
('Shah Ghouse Cafe', 'Mughlai', 'Shahalibanda Rd, Hyderabad 500002', 'Hyderabad', 4.3, 28000, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 17.3595, 78.4755, ARRAY['Halal', 'Haleem', 'Tea'], false, 'pending', false, 'Standard Supply', 'none', false),

-- MUMBAI: MOHAMMAD ALI ROAD
('Noor Mohammadi Hotel', 'Mughlai', '179, Wazir Building, Abdul Hakim Chowk, Mumbai 400003', 'Mumbai', 4.1, 15000, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 18.9560, 72.8340, ARRAY['Halal', 'Legendary', 'Sanju Baba Chicken'], false, 'pending', false, 'Heritage Supply', 'none', false),
('Surti Bara Handi', 'Nihari', 'Gujarati Ln, Mohammad Ali Rd, Mumbai 400003', 'Mumbai', 4.4, 8200, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80', 18.9565, 72.8345, ARRAY['Halal', 'Bara Handi', 'Early Morning'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al Rehmani Restaurant', 'Mughlai', 'Near JJ Hospital, Mohammad Ali Rd, Mumbai 400003', 'Mumbai', 4.0, 5200, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', 18.9580, 72.8350, ARRAY['Halal', 'Kebabs', 'Street Food'], false, 'pending', false, 'Standard Supply', 'none', false),

-- BANGALORE: SHIVAJINAGAR & FRAZER TOWN
('New Hilal Restaurant', 'Mughlai', 'HKP Road, Shivajinagar, Bangalore 560001', 'Bangalore', 4.2, 5800, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 12.9850, 77.6050, ARRAY['Halal', 'Shivajinagar', 'Old School'], false, 'pending', false, 'Standard Supply', 'none', false),
('Chichabas Taj', 'Mughlai', 'Mosque Road, Frazer Town, Bangalore 560005', 'Bangalore', 4.3, 12000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 12.9980, 77.6150, ARRAY['Halal', 'Frazer Town', 'Heritage'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al-Bek (Shivajinagar)', 'Mughlai', 'Tasker Town, Shivajinagar, Bangalore 560001', 'Bangalore', 4.0, 9500, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 12.9855, 77.6045, ARRAY['Halal', 'Shivajinagar', 'Kebab Hub'], false, 'pending', false, 'Standard Supply', 'none', false),

-- CHENNAI & KERALA
('Zaitoon', 'Arabian', 'Nungambakkam High Rd, Chennai 600034', 'Chennai', 4.2, 18000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 13.0600, 80.2450, ARRAY['Halal', 'Arabian', 'Family'], false, 'pending', false, 'Arabian Certified', 'none', true),
('Rahmath Hotel', 'Kerala/Beef', 'Near Railway Station, Kozhikode 673001', 'Kozhikode', 4.6, 25000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 11.2500, 75.7800, ARRAY['Halal', 'Legendary', 'Beef Biryani'], false, 'pending', false, 'Kerala Local Supply', 'none', false),
('Paragon Restaurant', 'Kerala', 'Kozhikode Bypass, Kerala 673001', 'Kozhikode', 4.5, 45000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 11.2510, 75.7810, ARRAY['Halal Options', 'Top Rated', 'Malabar'], false, 'pending', false, 'Certified Supply', 'low', true),

-- DELHI: ADDITIONAL NEIGHBORHOOD SPOTS (Zakir Nagar & Okhla)
('Al-Yamin', 'Mughlai', 'Zakir Nagar Main Rd, Delhi 110025', 'Delhi', 4.1, 3200, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 28.5620, 77.2890, ARRAY['Halal', 'Platters', 'Jamia'], false, 'pending', false, 'Standard Supply', 'none', false),
('Dil Pasand Biryani Point', 'Biryani', 'Chitli Qabar, Old Delhi 110006', 'Delhi', 4.0, 4800, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 28.6480, 77.2350, ARRAY['Halal', 'Bade ki Biryani', 'Old Delhi'], false, 'pending', false, 'Standard Supply', 'none', false),
('Al-Aziz Restaurant', 'Mughlai', 'Batla House, Jamia Nagar, Delhi 110025', 'Delhi', 4.2, 2100, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 28.5630, 77.2910, ARRAY['Halal', 'Family', 'Jamia'], false, 'pending', false, 'Standard Supply', 'none', false),
('Kit Care Kebab Corner', 'Kebabs', 'Nizamuddin Basti, Delhi 110013', 'Delhi', 4.3, 1800, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 28.5920, 77.2440, ARRAY['Halal', 'Butter Chicken', 'Nizamuddin'], false, 'pending', false, 'Standard Supply', 'none', false),

-- HYDERABAD: HI-TECH CITY & GACHIBOWLI (Mixed Neighborhoods)
('Hotel Royal Landscape', 'Indo-Chinese', 'Gachibowli Main Rd, Hyderabad 500032', 'Hyderabad', 4.1, 4500, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 17.4410, 78.3480, ARRAY['Halal', 'Late Night', 'Gachibowli'], false, 'pending', false, 'Standard Supply', 'low', true),
('Al Biryani Cafe', 'Biryani', 'Telecom Nagar, Gachibowli, Hyderabad 500032', 'Hyderabad', 4.0, 3200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 17.4420, 78.3490, ARRAY['Halal', 'Gachibowli', 'Authentic'], false, 'pending', false, 'Standard Supply', 'none', true),
('Tovo Restaurant', 'Fusion Grill', 'Siddhi Vinayak Nagar, Gachibowli, Hyderabad 500032', 'Hyderabad', 4.4, 1500, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80', 17.4440, 78.3510, ARRAY['Halal', 'Gachibowli', 'Modern'], false, 'pending', false, 'Hand Slaughtered', 'none', true),

-- BANGALORE: INDIRANAGAR & KORAMANGALA (Deep Mixed Neighborhoods)
('Empire Restaurant (Indiranagar)', 'Arabian/South Indian', 'HAL 2nd Stage, Indiranagar, Bangalore 560038', 'Bangalore', 4.2, 45000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 12.9710, 77.6410, ARRAY['Halal', 'Legacy', 'Indiranagar'], false, 'pending', false, 'Empire Central Supply', 'low', true),
('Sharief Bhai (Indiranagar)', 'Mughlai', '100 Feet Rd, Indiranagar, Bangalore 560038', 'Bangalore', 4.3, 15000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 12.9720, 77.6420, ARRAY['Halal', 'Sharief Bhai', 'Authentic'], false, 'pending', false, 'Certified Supply', 'none', true),
('Meghana Foods (Indiranagar)', 'Andhra', '100 Feet Rd, Indiranagar, Bangalore 560038', 'Bangalore', 4.5, 35000, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 12.9730, 77.6430, ARRAY['Halal Options', 'Top Rated', 'Biryani'], false, 'pending', false, 'Halal Certified Poultry', 'low', true),

-- PUNE: CAMP & KONDHWA (High Density)
('Blue Nile', 'Mughlai/Persian', 'Bund Garden Rd, Camp, Pune 411001', 'Pune', 4.1, 12000, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 18.5280, 73.8740, ARRAY['Halal', 'Legacy', 'Irani'], false, 'pending', false, 'Standard Supply', 'none', false),
('George Restaurant', 'Mughlai', 'East Street, Camp, Pune 411001', 'Pune', 4.3, 15000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 18.5220, 73.8780, ARRAY['Halal', 'Legacy', 'Mughlai'], false, 'pending', false, 'Standard Supply', 'none', false),
('Café Good Luck', 'Mughlai', 'Fergusson College Rd, Pune 411004', 'Pune', 4.5, 25000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 18.5240, 73.8410, ARRAY['Halal Options', 'Iconic', 'Bun Maska'], false, 'pending', false, 'Hand Slaughtered', 'none', true),
('Shahi Dawat', 'Mughlai', 'Kausar Baugh, Kondhwa, Pune 411048', 'Pune', 4.2, 5200, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 18.4750, 73.8950, ARRAY['Halal', 'Kausar Baugh', 'Family'], false, 'pending', false, 'Standard Supply', 'none', false),

-- AHMEDABAD: OLD CITY & SARKHEJ
('Food Inn', 'Mughlai', 'Lal Darwaja, Ahmedabad 380001', 'Ahmedabad', 4.0, 5800, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 23.0250, 72.5850, ARRAY['Halal', 'Old City', 'Budget'], false, 'pending', false, 'Standard Supply', 'none', false),
('I Love Biryani', 'Biryani', 'Sarkhej Road, Ahmedabad 380055', 'Ahmedabad', 4.1, 3200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80', 22.9980, 72.5350, ARRAY['Halal', 'Sarkhej', 'Biryani'], false, 'pending', false, 'Standard Supply', 'none', false),
('Baghdad Fry Centre', 'Fried Food', 'Manek Chowk, Ahmedabad 380001', 'Ahmedabad', 4.3, 2100, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80', 23.0240, 72.5890, ARRAY['Halal', 'Street Food', 'Manek Chowk'], false, 'pending', false, 'Standard Supply', 'none', false)
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
