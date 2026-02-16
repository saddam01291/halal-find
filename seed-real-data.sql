-- ============================================
-- Real Global Halal Restaurant Data
-- Run this in Supabase SQL Editor
-- ============================================

-- Inserting real data citywise
insert into places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, added_by) values
  -- LONDON
  ('Berenjak', 'Persian', '1 Bedale Street, London SE1 9AL', 'London', 4.6, 1250, 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=800', 51.5054, -0.0906, ARRAY['Persian', 'Kebab', 'Mezze', 'Fine Dining'], true, 'community'),
  ('Gymkhana', 'Indian', '42 Albemarle Street, Mayfair, London W1S 4JH', 'London', 4.8, 2100, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 51.5097, -0.1423, ARRAY['Indian', 'Michelin Star', 'Fine Dining', 'Curry'], true, 'community'),
  ('Ramo Ramen', 'Filipino-Japanese', 'Fitzrovia, London', 'London', 4.5, 450, 'https://images.unsplash.com/photo-1557872246-7a79da53f630?w=800', 51.5204, -0.1384, ARRAY['Ramen', 'Fusion', 'Filipino', 'Japanese'], true, 'community'),
  
  -- NEW YORK
  ('Al Badawi', 'Palestinian', '151 Atlantic Ave, Brooklyn, NY 11201', 'New York', 4.7, 890, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 40.6901, -73.9922, ARRAY['Palestinian', 'Middle Eastern', 'Authentic', 'Dine-in'], true, 'community'),
  ('Hen House', 'Lebanese-Canadian', '120 1st Ave, New York, NY 10009', 'New York', 4.4, 320, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=800', 40.7285, -73.9855, ARRAY['Lebanese', 'Burgers', 'Poutine', 'Fast Casual'], true, 'community'),
  ('Rasa', 'Malaysian', '25 W 8th St, New York, NY 10011', 'New York', 4.5, 560, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800', 40.7322, -73.9985, ARRAY['Malaysian', 'Satay', 'Noodles', 'Curry'], true, 'community'),

  -- DUBAI
  ('Bosporus Turkish Cuisine', 'Turkish', 'The Dubai Mall, Waterfront, Dubai', 'Dubai', 4.4, 3400, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 25.1972, 55.2797, ARRAY['Turkish', 'Kebab', 'Baklava', 'The Dubai Mall'], true, 'community'),
  ('Al Khayma Heritage Restaurant', 'Emirati', 'Al Fahidi, Bur Dubai, Dubai', 'Dubai', 4.9, 5200, 'https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?w=800', 25.2632, 55.3005, ARRAY['Emirati', 'Traditional', 'Seafood', 'Cultural'], true, 'community'),
  ('Dar Habak', 'Lebanese', 'Jumeirah 1, Dubai', 'Dubai', 4.6, 890, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 25.2338, 55.2614, ARRAY['Lebanese', 'Mezze', 'Shisha', 'Outdoor'], true, 'community'),

  -- SINGAPORE
  ('Positano Risto', 'Italian', '66 Bussorah St, Singapore 199479', 'Singapore', 4.7, 1850, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', 1.3006, 103.8596, ARRAY['Italian', 'Pasta', 'Pizza', 'Romantic'], true, 'community'),
  ('Zam Zam Restaurant', 'Indian-Muslim', '697-699 North Bridge Rd, Singapore 198675', 'Singapore', 4.5, 4200, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 1.3023, 103.8587, ARRAY['Murtabak', 'Indian', 'Bestseller', 'Historic'], true, 'community'),
  ('Charr''d Steakhouse', 'Wagyu Steakhouse', '324F Changi Rd, Singapore 419799', 'Singapore', 4.8, 670, 'https://images.unsplash.com/photo-1558030006-450675393462?w=800', 1.3204, 103.9080, ARRAY['Wagyu', 'Steak', 'Premium', 'A5 Wagyu'], true, 'community');
