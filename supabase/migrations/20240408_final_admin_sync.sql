-- ==============================================================
-- FINAL ADMIN SUITE SYNC
-- Fixes missing columns and tables identified during testing.
-- ==============================================================

-- 1. Ensure 'is_non_halal_report' exists on reviews
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='is_non_halal_report') THEN
        ALTER TABLE reviews ADD COLUMN is_non_halal_report BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Ensure admin_settings table exists
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- 3. Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 4. Admin policies for admin_settings
DROP POLICY IF EXISTS "Admins can manage settings" ON admin_settings;
CREATE POLICY "Admins can manage settings" 
ON admin_settings 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 5. Seed initial settings if missing
INSERT INTO admin_settings (key, value) VALUES
('maintenance_mode', 'false'::jsonb),
('auto_approve', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. Grant admin permissions to update/delete reviews (needed for Disputes tab)
-- This is already covered by general admin policies usually, but let's be explicit.
DROP POLICY IF EXISTS "Admin can delete reviews" ON reviews;
CREATE POLICY "Admin can delete reviews"
ON reviews
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
