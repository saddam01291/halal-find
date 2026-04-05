-- ============================================
-- FIX: Missing Admin RLS Policies 
-- Run this in your Supabase SQL Editor
-- ============================================

-- Allow admins to update places (for approving verifications)
DROP POLICY IF EXISTS "Admins can update places" ON places;
CREATE POLICY "Admins can update places" ON places 
FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to update verification requests
DROP POLICY IF EXISTS "Admins can update verification requests" ON verification_requests;
CREATE POLICY "Admins can update verification requests" ON verification_requests 
FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to delete verification requests
DROP POLICY IF EXISTS "Admins can delete verification requests" ON verification_requests;
CREATE POLICY "Admins can delete verification requests" ON verification_requests 
FOR DELETE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
