'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  defaultImage?: string;
  bucketName?: string;
  folderPath?: string;
  currentImagePath?: string;  
}

export default function ImageUpload({
  onUploadComplete,
  defaultImage = '/placeholder-herb.jpg',
  bucketName = 'herbs',
  folderPath = 'images',
  currentImagePath
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [error, setError] = useState<string | null>(null);

  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const relevantParts = pathParts.slice(5);
      return relevantParts.join('/');
    } catch {
      return null;
    }
  };

  const deleteOldImage = async (imagePath: string) => {
    try {
      const { error } = await supabase()
        .storage
        .from(bucketName)
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting old image:', error);
      }
    } catch (err) {
      console.error('Failed to delete old image:', err);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      // Check if user is authenticated
      const { data: { session }, error: authError } = await supabase().auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error: ' + authError.message);
      }

      if (!session) {
        throw new Error('You must be logged in to upload images');
      }

      console.log('User authenticated:', session.user.id);

      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size should be less than 2MB');
      }

      // Initialize storage bucket
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      try {
        console.log('Initializing storage bucket...');
        const initResponse = await fetch(`${baseUrl}/api/storage/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!initResponse.ok) {
          const errorData = await initResponse.json();
          console.error('Storage initialization failed:', errorData);
          throw new Error(`Failed to initialize storage: ${errorData.error || 'Unknown error'}`);
        }
        console.log('Storage bucket initialized successfully');
      } catch (initError) {
        console.error('Storage initialization error:', initError);
        throw new Error('Failed to initialize storage bucket');
      }

      if (currentImagePath) {
        const oldPath = getPathFromUrl(currentImagePath);
        if (oldPath) {
          await deleteOldImage(oldPath);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError, data } = await supabase()
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        console.error('File details:', {
          name: file.name,
          size: file.size,
          type: file.type,
          bucket: bucketName,
          path: filePath
        });
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase()
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      onUploadComplete?.(publicUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50">
        <Image
          src={imageUrl}
          alt="Herb image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white">Uploading...</div>
          </div>
        )}
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
