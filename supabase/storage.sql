-- Create storage policies for the herbs bucket
-- Allow public read access to all files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'herbs');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'herbs'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'herbs'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'herbs'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'herbs'
  AND auth.role() = 'authenticated'
);
