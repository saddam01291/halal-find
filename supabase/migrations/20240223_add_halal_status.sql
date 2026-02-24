-- Add halal_status to places table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='places' AND column_name='halal_status') THEN
        ALTER TABLE places ADD COLUMN halal_status TEXT DEFAULT 'Full Halal';
    END IF;
END $$;
