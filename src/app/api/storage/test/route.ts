import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Create admin client outside of the handler
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    // List buckets
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    // Get bucket policies
    const bucket = buckets?.find(b => b.name === 'herbs')
    if (!bucket) {
      return NextResponse.json({ error: 'Herbs bucket not found' }, { status: 404 })
    }

    // List files in the bucket
    const { data: files, error: filesError } = await supabaseAdmin.storage
      .from('herbs')
      .list('images')

    if (filesError) {
      return NextResponse.json({ error: filesError.message }, { status: 500 })
    }

    return NextResponse.json({
      bucket,
      files: files || []
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to test storage' },
      { status: 500 }
    )
  }
}
