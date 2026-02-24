-- Create verification_requests table if not exists with improved schema
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    certificate_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    user_id UUID REFERENCES auth.users(id),
    place_id UUID REFERENCES places(id), -- Link to existing place if it's a claim
    type TEXT DEFAULT 'new_place' CHECK (type IN ('new_place', 'claim')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Admins can view all verification requests" ON verification_requests;
CREATE POLICY "Admins can view all verification requests" ON verification_requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can update verification requests" ON verification_requests;
CREATE POLICY "Admins can update verification requests" ON verification_requests
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Users can view their own verification requests" ON verification_requests;
CREATE POLICY "Users can view their own verification requests" ON verification_requests
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert verification requests" ON verification_requests;
CREATE POLICY "Users can insert verification requests" ON verification_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add delete policy for admins (previously requested)
DROP POLICY IF EXISTS "Admins can delete verification requests" ON verification_requests;
CREATE POLICY "Admins can delete verification requests" ON verification_requests
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Grant permissions
GRANT ALL ON verification_requests TO authenticated;
GRANT SELECT ON verification_requests TO anon;
