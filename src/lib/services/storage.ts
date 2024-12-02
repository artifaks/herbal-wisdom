import { supabase } from '../supabase'

export async function ensureStorageBucket(bucketName: string = 'herbs') {
  try {
    // Get the base URL from environment variables or use a default for local development
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/storage/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initialize storage')
    }

    return true
  } catch (error) {
    console.error('Error managing storage bucket:', error)
    // Don't throw error, just return null and continue
    return null
  }
}

export async function deleteImage(path: string, bucketName: string = 'herbs') {
  try {
    const { error } = await supabase()
      .storage
      .from(bucketName)
      .remove([path])
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

export async function getPublicUrl(path: string, bucketName: string = 'herbs'): Promise<string | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('Missing Supabase URL')
    }

    // Ensure the path starts with the bucket name and doesn't have leading slashes
    const cleanPath = path.replace(/^\/+/, '').replace(new RegExp(`^${bucketName}/`), '')
    
    // Construct the public URL with the required 'public' path segment
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanPath}`
  } catch (error) {
    console.error('Error generating public URL:', error)
    return null
  }
}
