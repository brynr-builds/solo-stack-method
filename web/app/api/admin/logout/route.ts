/**
 * Admin logout. Clears session cookie and redirects to enter-email.
 */

import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/admin/session'

export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/enter-email', request.url))
  res.cookies.set(COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  })
  return res
}
