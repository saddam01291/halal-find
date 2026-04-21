-- Update places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE places ADD COLUMN IF NOT EXISTS email text;

-- Update verification_requests table
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS email text;
