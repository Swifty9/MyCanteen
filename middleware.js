import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // No session = redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Get user role
  const role = session.user?.user_metadata?.role
  const pathname = req.nextUrl.pathname

  // Admin route protection
  if (pathname.startsWith('/app/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // User route protection
  if (pathname.startsWith('/app/dashboard') && role !== 'user') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/app/admin/:path*',
    '/app/dashboard/:path*',
    // Add other protected paths here
  ],
}