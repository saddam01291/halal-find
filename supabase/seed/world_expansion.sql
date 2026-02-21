-- GLOBAL VISION: Worldwide Halal Icons
-- Cities: London, Dubai, New York

INSERT INTO places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, verification_status)
VALUES
-- DUBAI: THE MIDDLE EAST HUB
('Al Ustad Special Kabab', 'Persian / Kebabs', 'Mussalla Rd, Al Hamriya, Dubai, UAE', 'Dubai', 4.6, 12500, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', 25.2600, 55.2950, ARRAY['Halal', 'Legendary', 'Dubai Icon'], true, 'community_verified'),
('Ravi Restaurant (Satwa)', 'Pakistani', 'Al Satwa Rd, Dubai, UAE', 'Dubai', 4.4, 18000, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', 25.2280, 55.2750, ARRAY['Halal', 'Budget', 'Pakistani'], true, 'community_verified'),
('Operation: Falafel', 'Arabic Street Food', 'The Beach, JBR, Dubai, UAE', 'Dubai', 4.1, 9500, 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80', 25.0760, 55.1300, ARRAY['Halal', 'Street Food', 'Falafel'], true, 'community_verified'),

-- LONDON: UNITED KINGDOM
('Tayyabs', 'Punjabi / Grill', '83-89 Fieldgate St, London E1 1JU, UK', 'London', 4.3, 22000, 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&q=80', 51.5173, -0.0658, ARRAY['Halal', 'Iconic London', 'Spicy'], true, 'community_verified'),
('Gymkhana', 'Indian Fine Dining', '42 Albemarle St, London W1S 4JH, UK', 'London', 4.6, 5200, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80', 51.5090, -0.1420, ARRAY['Halal Options', 'Michelin Star', 'Luxury'], true, 'community_verified'),
('Dishoom (Shoreditch)', 'Indian Parsi', '7 Boundary St, London E2 7JE, UK', 'London', 4.5, 38000, 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80', 51.5240, -0.0780, ARRAY['Halal Options', 'Iconic', 'Breakfast'], true, 'community_verified'),

-- NEW YORK CITY: USA
('The Halal Guys (Original Cart)', 'Street Food / Platters', '6th Ave & W 53rd St, New York, NY 10019', 'New York', 4.4, 45000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80', 40.7618, -73.9790, ARRAY['Halal', 'Street Legend', 'NYC'], true, 'community_verified'),
('Mamoun''s Falafel', 'Middle Eastern', '119 MacDougal St, New York, NY 10012', 'New York', 4.5, 12000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', 40.7301, -73.9998, ARRAY['Halal', 'Oldest', 'Budget'], true, 'community_verified')
ON CONFLICT (name, address) DO UPDATE 
SET 
  cuisine = EXCLUDED.cuisine,
  city = EXCLUDED.city,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  image = EXCLUDED.image,
  verification_status = EXCLUDED.verification_status,
  verified = EXCLUDED.verified;
