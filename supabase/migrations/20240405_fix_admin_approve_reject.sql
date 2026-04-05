-- ==============================================================
-- FIX: Admin cannot approve/reject verification requests
-- Root cause: No UPDATE policy on verification_requests table,
--             and no admin UPDATE policy on places table.
-- ==============================================================

-- 1. Allow admins to UPDATE verification_requests (approve/reject)
DROP POLICY IF EXISTS "Admin can update verification requests" ON verification_requests;
CREATE POLICY "Admin can update verification requests"
  ON verification_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Allow admins to DELETE verification_requests
DROP POLICY IF EXISTS "Admin can delete verification requests" ON verification_requests;
CREATE POLICY "Admin can delete verification requests"
  ON verification_requests
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Allow admins to UPDATE any place (needed when approving a claim)
DROP POLICY IF EXISTS "Admin can update any place" ON places;
CREATE POLICY "Admin can update any place"
  ON places
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Allow admins to DELETE any place
DROP POLICY IF EXISTS "Admin can delete any place" ON places;
CREATE POLICY "Admin can delete any place"
  ON places
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
