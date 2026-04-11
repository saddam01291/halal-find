-- ==============================================================
-- Add explicit INSERT policy for admin to create places
-- ==============================================================

-- Allow admins to INSERT any place directly
DROP POLICY IF EXISTS "Admin can insert any place" ON places;
CREATE POLICY "Admin can insert any place"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
