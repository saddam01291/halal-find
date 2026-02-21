-- Add transparency fields for Mixed Neighborhood safety
ALTER TABLE places ADD COLUMN IF NOT EXISTS serves_alcohol BOOLEAN DEFAULT false;
ALTER TABLE places ADD COLUMN IF NOT EXISTS halal_source TEXT; -- e.g., 'Hand Slaughtered', 'Supplied by X'
ALTER TABLE places ADD COLUMN IF NOT EXISTS contamination_risk TEXT DEFAULT 'low'; -- 'none', 'low', 'moderate', 'high'
ALTER TABLE places ADD COLUMN IF NOT EXISTS is_mixed_neighborhood BOOLEAN DEFAULT false;

-- Add index for mixed neighborhood filtering
CREATE INDEX IF NOT EXISTS idx_places_mixed_risk ON places(is_mixed_neighborhood, contamination_risk);

-- Update comments
COMMENT ON COLUMN places.serves_alcohol IS 'Explicitly track alcohol presence for transparency in mixed areas';
COMMENT ON COLUMN places.contamination_risk IS 'Safety level for shared kitchens: none, low, moderate, high';
