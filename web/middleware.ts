/**
 * Admin auth middleware.
 * Protects /admin/* and /api/admin/* server-side.
 * Allows /admin/enter-email, /admin/login, /admin/setup, and auth API routes without session.
 * Unauthenticated users redirect to /admin/enter-email (email bootstrap flow).
 * Uses JWT in HttpOnly cookie (Edge-compatible; no pg in middleware).
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from './lib/admin/session'
import { getAdminEnv } from './lib/admin/env'

const ADMIN_ENTER_EMAIL = '/admin/enter-email'
const ADMIN_LOGIN = '/admin/login'
const ADMIN_SETUP = '/admin/setup'

function isAllowedWithoutSession(pathname: string): boolean {
  if (pathname === ADMIN_ENTER_EMAIL || pathname === ADMIN_LOGIN || pathname === ADMIN_SETUP) return true
  if (pathname.startsWith('/api/admin/setup/')) return true
  if (pathname.startsWith('/api/admin/login/')) return true
  if (pathname === '/api/admin/identify') return true
  if (pathname === '/api/admin/logout') return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminPath) return NextResponse.next()

  if (isAllowedWithoutSession(pathname)) return NextResponse.next()

  let env
  try {
    env = getAdminEnv()
  } catch (err) {
    return NextResponse.json(
      { error: 'Admin auth not configured' },
      { status: 503 }
    )
  }

  if (!env.isConfigured) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }
    return NextResponse.redirect(new URL(ADMIN_ENTER_EMAIL, request.url))
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  const payload = token ? await verifySessionToken(token, env.sessionSecret) : null

  if (payload) {
    const res = NextResponse.next()
    return res
  }

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.redirect(new URL(ADMIN_ENTER_EMAIL, request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
