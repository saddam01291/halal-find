-- ============================================
-- Find Halal - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PLACES TABLE
create table if not exists places (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cuisine text not null,
  address text not null,
  city text default '',
  rating numeric(3,2) default 0,
  review_count int default 0,
  image text default '',
  lat double precision not null,
  lng double precision not null,
  tags text[] default '{}',
  verified boolean default false,
  added_by text default 'community' check (added_by in ('owner', 'community')),
  owner_id uuid references auth.users(id),
  certificate_url text,
  created_at timestamptz default now()
);

-- 2. REVIEWS TABLE
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  place_id uuid references places(id) on delete cascade,
  user_id uuid references auth.users(id),
  user_name text not null,
  user_avatar text,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamptz default now()
);

-- 3. VERIFICATION REQUESTS TABLE
create table if not exists verification_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  owner_name text not null,
  restaurant_name text not null,
  certificate_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- 4. USER PROFILES TABLE (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'owner', 'admin')),
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table places enable row level security;
alter table reviews enable row level security;
alter table verification_requests enable row level security;
alter table profiles enable row level security;

-- PLACES: Anyone can read, authenticated users can insert
create policy "Anyone can view places" on places for select using (true);
create policy "Authenticated users can insert places" on places for insert with check (auth.uid() is not null);
create policy "Owners can update their places" on places for update using (auth.uid() = owner_id);

-- REVIEWS: Anyone can read, authenticated users can insert their own
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Authenticated users can insert reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can delete their own reviews" on reviews for delete using (auth.uid() = user_id);

-- VERIFICATION REQUESTS: Only the owner and admins can see
create policy "Users can view own requests" on verification_requests for select using (auth.uid() = user_id);
create policy "Users can insert requests" on verification_requests for insert with check (auth.uid() = user_id);

-- PROFILES: Anyone can read, users can update their own
create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- ============================================
-- SEED DATA (initial places)
-- ============================================

insert into places (name, cuisine, address, city, rating, review_count, image, lat, lng, tags, verified, added_by) values
  ('Halal Guys', 'Middle Eastern', '53rd & 6th Ave, New York, NY', 'New York', 4.5, 120, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 40.7614, -73.9776, ARRAY['Halal Cart', 'Middle Eastern', 'Fast Food'], true, 'owner'),
  ('Saffron Grill', 'Turkish', '123 Main St, Brooklyn, NY', 'New York', 4.7, 85, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 40.6892, -73.9857, ARRAY['Turkish', 'Kebab', 'Dine-in'], true, 'owner'),
  ('Naan & Curry', 'Pakistani', '456 Oak Ave, Jersey City, NJ', 'Jersey City', 4.3, 62, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 40.7282, -74.0776, ARRAY['Pakistani', 'Biryani', 'Curry'], false, 'community'),
  ('Shawarma King', 'Lebanese', '789 Elm Blvd, Chicago, IL', 'Chicago', 4.6, 95, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', 41.8781, -87.6298, ARRAY['Lebanese', 'Shawarma', 'Fast Casual'], true, 'owner'),
  ('Biryani House', 'Indian', '321 Pine St, Houston, TX', 'Houston', 4.4, 78, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 29.7604, -95.3698, ARRAY['Indian', 'Biryani', 'Dine-in'], false, 'community'),
  ('Istanbul Kebab', 'Turkish', '567 Cedar Rd, Los Angeles, CA', 'Los Angeles', 4.8, 110, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 34.0522, -118.2437, ARRAY['Turkish', 'Kebab', 'Grilled'], true, 'owner');

-- Create a trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
