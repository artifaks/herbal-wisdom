import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

let browserClient: ReturnType<typeof createClientComponentClient<Database>> | null = null
let serverClient: ReturnType<typeof createClient<Database>> | null = null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function supabase(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    // Server-side
    if (!serverClient) {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }

      serverClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT
        },
        global: {
          headers: {
            'Cache-Control': 'no-store'
          }
        }
      })
    }
    return serverClient
  }

  // Client-side
  if (!browserClient) {
    browserClient = createClientComponentClient<Database>({
      options: {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        },
        global: {
          headers: {
            'Cache-Control': 'no-store'
          }
        }
      }
    })
  }
  return browserClient
}

// Ensure we clear the client when the module is hot reloaded in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  if ((module as any).hot) {
    (module as any).hot.dispose(() => {
      browserClient = null
    })
  }
}

// For backward compatibility
export const supabaseClient = supabase
