import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
  if (ok) return NextResponse.next()

  // API routes get a clean 401 rather than an HTML redirect.
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
