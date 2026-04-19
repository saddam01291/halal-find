-- Enable pg_trgm for fuzzy text matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a robust universal search function
CREATE OR REPLACE FUNCTION search_places_v2(
  search_query TEXT,
  user_lat DOUBLE PRECISION DEFAULT NULL,
  user_lng DOUBLE PRECISION DEFAULT NULL,
  radius_km DOUBLE PRECISION DEFAULT 50.0
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  name TEXT,
  cuisine TEXT,
  address TEXT,
  city TEXT,
  rating DOUBLE PRECISION,
  review_count INTEGER,
  image TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  tags TEXT[],
  verified BOOLEAN,
  verification_status TEXT,
  halal_status TEXT,
  halal_source TEXT,
  serves_alcohol BOOLEAN,
  distance_km DOUBLE PRECISION
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cleansed_query TEXT;
BEGIN
  -- 1. Pre-process query: lowercase and remove all spaces for "universal" matching
  cleansed_query := lower(replace(search_query, ' ', ''));

  RETURN QUERY
  SELECT 
    p.id,
    p.created_at,
    p.name,
    p.cuisine,
    p.address,
    p.city,
    p.rating,
    p.review_count,
    p.image,
    p.lat,
    p.lng,
    p.tags,
    p.verified,
    p.verification_status,
    p.halal_status,
    p.halal_source,
    p.serves_alcohol,
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL 
      THEN (6371 * acos(cos(radians(user_lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(p.lat))))
      ELSE NULL
    END as distance_km
  FROM places p
  WHERE 
    -- Match 1: Substring match (Standard)
    p.name ILIKE '%' || search_query || '%' OR
    p.cuisine ILIKE '%' || search_query || '%' OR
    p.city ILIKE '%' || search_query || '%' OR
    p.address ILIKE '%' || search_query || '%' OR
    
    -- Match 2: "Universal" Space-Insensitive Match (Handles "SHIVMANDIR" -> "SHIV MANDIR")
    lower(replace(p.name, ' ', '')) ILIKE '%' || cleansed_query || '%' OR
    lower(replace(p.city, ' ', '')) ILIKE '%' || cleansed_query || '%' OR
    lower(replace(p.address, ' ', '')) ILIKE '%' || cleansed_query || '%' OR
    
    -- Match 3: Trigram Similarity (Fuzzy matching for slight typos)
    similarity(p.name, search_query) > 0.3 OR
    similarity(p.cuisine, search_query) > 0.3 OR
    similarity(p.city, search_query) > 0.3 OR
    
    -- Match 4: Tag matching
    p.tags @> ARRAY[search_query]
  ORDER BY 
    -- Order by verification, then by similarity/relevance, then by rating
    p.verified DESC,
    greatest(
      similarity(p.name, search_query),
      similarity(p.city, search_query),
      CASE WHEN lower(replace(p.name, ' ', '')) ILIKE '%' || cleansed_query || '%' THEN 0.5 ELSE 0 END
    ) DESC,
    p.rating DESC,
    p.review_count DESC
  LIMIT 100;
END;
$$;
