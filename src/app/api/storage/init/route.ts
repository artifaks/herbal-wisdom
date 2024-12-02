import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// Ensure we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables for Supabase')
}

// Create admin client outside of the handler
const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    const bucketName = 'herbs'

    // First, check if the bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    const bucket = buckets.find(b => b.name === bucketName)
    
    if (!bucket) {
      // Create bucket if it doesn't exist
      console.log('Creating new bucket:', bucketName)
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 1024 * 1024 * 2
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }
    } else {
      // Update existing bucket
      console.log('Updating existing bucket:', bucketName)
      const { error: updateError } = await supabaseAdmin.storage.updateBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 1024 * 1024 * 2
      })

      if (updateError) {
        console.error('Error updating bucket:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Storage bucket initialized successfully' })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
