-- 1. Add unique constraint on (name, city, address) to prevent duplicates
ALTER TABLE places ADD CONSTRAINT unique_place_name_city_address UNIQUE (name, city, address);

-- 2. Add slug column
ALTER TABLE places ADD COLUMN slug text;

-- 3. Function to generate a slug from a string (e.g., "Paradise Biryani" -> "paradise-biryani")
CREATE OR REPLACE FUNCTION generate_base_slug(title text)
RETURNS text AS $$
DECLARE
  base_slug text;
BEGIN
  -- Lowercase and replace non-alphanumeric characters with hyphens
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading and trailing hyphens
  base_slug := trim(both '-' from base_slug);
  RETURN base_slug;
END;
$$ LANGUAGE plpgsql;

-- 4. Function to generate a unique slug for a given place
CREATE OR REPLACE FUNCTION generate_unique_slug_for_place(p_name text, p_city text, p_id uuid)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 1;
  slug_exists boolean;
BEGIN
  base_slug := generate_base_slug(p_name);
  new_slug := base_slug;
  
  LOOP
    -- Check if slug exists in the SAME city for a DIFFERENT record
    -- Coalesce to handle null cities or ids safely if needed, though they shouldn't be null
    SELECT EXISTS (
      SELECT 1 FROM places 
      WHERE slug = new_slug 
      AND (city = p_city OR (city IS NULL AND p_city IS NULL))
      AND (id != p_id OR p_id IS NULL)
    ) INTO slug_exists;
    
    IF NOT slug_exists THEN
      RETURN new_slug;
    END IF;
    
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Backfill existing records with unique slugs
DO $$
DECLARE
  place_record RECORD;
BEGIN
  FOR place_record IN SELECT id, name, city FROM places WHERE slug IS NULL LOOP
    UPDATE places 
    SET slug = generate_unique_slug_for_place(place_record.name, place_record.city, place_record.id)
    WHERE id = place_record.id;
  END LOOP;
END;
$$;

-- 6. Add NOT NULL constraint to slug and Unique constraint on (city, slug)
ALTER TABLE places ALTER COLUMN slug SET NOT NULL;
ALTER TABLE places ADD CONSTRAINT unique_city_slug UNIQUE (city, slug);

-- 7. Trigger to automatically assign unique slug on INSERT or UPDATE (if name changes)
CREATE OR REPLACE FUNCTION trigger_assign_unique_slug()
RETURNS trigger AS $$
BEGIN
  -- Only generate slug if it's a new insert, or if name changed, or if slug is missing
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (NEW.name <> OLD.name OR NEW.slug IS NULL)) THEN
    NEW.slug := generate_unique_slug_for_place(NEW.name, NEW.city, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assign_unique_slug ON places;
CREATE TRIGGER trg_assign_unique_slug
BEFORE INSERT OR UPDATE ON places
FOR EACH ROW
EXECUTE FUNCTION trigger_assign_unique_slug();
