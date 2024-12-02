import { createMiddlewareClient } from '@supabase.auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/favorites',
  '/profile',
]

const SUBSCRIPTION_REQUIRED_ROUTES = [
  '/herbs/premium',
  '/guides',
  '/expert-advice',
]

const ADMIN_ROUTES = ['/admin']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle admin routes
  if (ADMIN_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/signin', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  }

  // Handle protected routes
  if (PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/signin', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  // Handle subscription required routes
  if (SUBSCRIPTION_REQUIRED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/signin', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has an active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }

    return res
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/favorites/:path*',
    '/profile/:path*',
    '/herbs/premium/:path*',
    '/guides/:path*',
    '/expert-advice/:path*',
    '/admin/:path*'
  ]
}
