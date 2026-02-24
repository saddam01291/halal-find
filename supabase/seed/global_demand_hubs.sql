-- GLOBAL DEMAND HUBS: High-Volume Search Hotspots
-- Cities: New York City, Houston, Toronto, Sydney, Melbourne

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status)
VALUES
-- NEW YORK CITY (Highest Volume in N. America)
('The Halal Guys (53rd & 6th)', 'Street Food', 'W 53rd St, New York, NY 10019, USA', 'New York', 4.5, 52000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80', 40.7618, -73.9790, ARRAY['Halal', 'Most Searched', 'NYC Iconic'], false, 'pending'),
('Adel''s Famous Halal Food', 'Street Food', '1221 6th Ave, New York, NY 10020, USA', 'New York', 4.7, 18000, 'https://images.unsplash.com/photo-1599481238640-dfc41b0501d9?auto=format&fit=crop&q=80', 40.7595, -73.9811, ARRAY['Halal', 'Long Queues', 'Trending'], false, 'pending'),
('Ravagh Persian Grill', 'Persian', '11 E 32nd St, New York, NY 10016, USA', 'New York', 4.4, 8500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 40.7470, -73.9830, ARRAY['Halal', 'Fine Dining', 'Persian'], false, 'pending'),

-- HOUSTON (Highest Density in Texas)
('The Halal Guys (Houston)', 'Street Food', '3821 Farnham St, Houston, TX 77098, USA', 'Houston', 4.2, 5800, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', 29.7340, -95.4140, ARRAY['Halal', 'Texas Hub', 'Fast Casual'], false, 'pending'),
('Aga''s Restaurant & Catering', 'Indo-Pak / Mughlai', '11842 Wilcrest Dr, Houston, TX 77031, USA', 'Houston', 4.6, 25000, 'https://images.unsplash.com/photo-1601050690597-df056fb13295?auto=format&fit=crop&q=80', 29.6520, -95.5680, ARRAY['Halal', 'Legendary', 'Mughlai'], false, 'pending'),

-- TORONTO (Highest Volume in Canada)
('Lahore Tikka House', 'Pakistani / BBQ', '1365 Gerrard St E, Toronto, ON M4L 1Z3, Canada', 'Toronto', 4.1, 12500, 'https://images.unsplash.com/photo-1529193591184-b1d58b34ecdf?auto=format&fit=crop&q=80', 43.6720, -79.3220, ARRAY['Halal', 'Canada Hub', 'Authentic'], false, 'pending'),
('Paramount Fine Foods', 'Lebanese', '253 Yonge St, Toronto, ON M5B 1N8, Canada', 'Toronto', 4.0, 9500, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 43.6540, -79.3800, ARRAY['Halal', 'Middle Eastern', 'Yonge St'], false, 'pending'),

-- SYDNEY (Highest Volume in Australia)
('Lal Qila (Surry Hills)', 'Pakistani / Mughlai', '30 Cleveland St, Surry Hills NSW 2010, Australia', 'Sydney', 4.3, 8200, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', -33.8900, 151.2010, ARRAY['Halal', 'Sydney Hub', 'Mughlai'], false, 'pending'),
('Mamak (Sydney CBD)', 'Malaysian', '15 Goulburn St, Sydney NSW 2000, Australia', 'Sydney', 4.4, 15000, 'https://images.unsplash.com/photo-1623341214825-9f4f963a5ccb?auto=format&fit=crop&q=80', -33.8780, 151.2040, ARRAY['Halal Options', 'Iconic', 'Roti Canai'], false, 'pending')
ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified;
