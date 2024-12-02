import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Client-side Supabase instance (for components)
export const supabaseClient = createClientComponentClient()

// Server-side Supabase instance (for API routes)
export const supabaseServer = createClient(
  'https://ptkbqrpxyoxfsigolskz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a2JxcnB4eW94ZnNpZ29sc2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MjAwNzIsImV4cCI6MjA0ODQ5NjA3Mn0.RyE3iJiVv4h3CrwdfDYF_-DZys_7V7gUEvmmJf_S6DM',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
