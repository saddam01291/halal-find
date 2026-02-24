-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read and write
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

-- Seed initial settings
INSERT INTO admin_settings (key, value) VALUES
('maintenance_mode', 'false'::jsonb),
('auto_approve', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
