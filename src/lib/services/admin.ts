import { Herb } from '@/types/herbs'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'

export async function getHerbs(): Promise<Herb[]> {
  const client = supabase()
  const { data, error } = await client
    .from('herbs')
    .select('id, name, scientific_name, description, benefits, category, preparation_methods, image_url, is_premium, created_at')

  if (error) {
    throw new Error(`Error fetching herbs: ${error.message}`)
  }

  return data || []
}

export async function createHerb(herb: Omit<Herb, 'id' | 'created_at'>) {
  const client = supabase()
  const { data, error } = await client
    .from('herbs')
    .insert([{
      ...herb,
      benefits: Array.isArray(herb.benefits) ? herb.benefits : [],
      preparation_methods: Array.isArray(herb.preparation_methods) ? herb.preparation_methods : []
    }])
    .select()

  if (error) {
    throw new Error(`Error creating herb: ${error.message}`)
  }

  return data?.[0]
}

export async function updateHerb(id: number, herb: Partial<Herb>) {
  const client = supabase()
  const { error } = await client
    .from('herbs')
    .update({
      ...herb,
      benefits: Array.isArray(herb.benefits) ? herb.benefits : undefined,
      preparation_methods: Array.isArray(herb.preparation_methods) ? herb.preparation_methods : undefined
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating herb: ${error.message}`)
  }
}

export async function deleteHerb(id: number) {
  const client = supabase()
  const { error } = await client
    .from('herbs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Error deleting herb: ${error.message}`)
  }
}

export async function uploadHerbImage(file: File): Promise<string> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 5MB.');
  }

  // Generate a clean filename
  const fileExt = file.type.split('/')[1];
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `${timestamp}-${randomString}.${fileExt}`;
  const filePath = `herb-images/${fileName}`;

  // Upload to Supabase storage
  const client = supabase()
  const { error: uploadError } = await client.storage
    .from('herbs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = client.storage
    .from('herbs')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadHerbsFromCSV(file: File): Promise<{ success: number; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const results = {
      success: 0,
      errors: [] as string[],
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const herbs = results.data as any[]
        
        for (const herb of herbs) {
          try {
            // Convert string arrays to actual arrays
            herb.benefits = herb.benefits?.split(',').map((b: string) => b.trim()) || []
            herb.preparation_methods = herb.preparation_methods?.split(',').map((m: string) => m.trim()) || []
            
            const client = supabase()
            const { error } = await client
              .from('herbs')
              .insert([herb])

            if (error) {
              results.errors.push(`Error inserting ${herb.name}: ${error.message}`)
            } else {
              results.success++
            }
          } catch (error) {
            results.errors.push(`Error processing ${herb.name}: ${(error as Error).message}`)
          }
        }
        
        resolve(results)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}
