-- First, remove any existing policies for the herbs bucket to start fresh
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own files" ON storage.objects;

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a single policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON storage.objects
FOR ALL
USING (
    bucket_id = 'herbs'
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
)
WITH CHECK (
    bucket_id = 'herbs'
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Grant usage on necessary schemas
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO service_role;

-- Grant access to the objects table
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO service_role;

-- Grant access to buckets table
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO service_role;
