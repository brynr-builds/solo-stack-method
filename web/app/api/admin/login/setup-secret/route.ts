/**
 * POST /api/admin/login/setup-secret
 * Dev-only: Sign in with setup secret when passkey doesn't work on localhost.
 * Only enabled when ADMIN_RP_ID is "localhost".
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getAdminEnv } from '@/lib/admin/env'
import { query } from '@/lib/admin/storage/db'
import { checkRateLimit } from '@/lib/admin/rate-limit'
import { createSessionToken, COOKIE_NAME } from '@/lib/admin/session'

function getClientIdentifier(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const env = getAdminEnv()
    if (!env.isConfigured) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }

    if (env.rpId !== 'localhost') {
      return NextResponse.json({ error: 'Setup secret login is only available for local development' }, { status: 403 })
    }

    const rl = checkRateLimit(
      getClientIdentifier(request),
      'login-setup-secret',
      env.rateLimitPerMinute
    )
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const setupSecret = typeof body?.setupSecret === 'string' ? body.setupSecret : ''

    if (!email || email !== env.allowedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (setupSecret !== env.setupSecret) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 })
    }

    const userRows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    const userId = userRows[0]!.id

    const sessionToken = await createSessionToken(userId, email, env.sessionSecret, env.sessionTtlHours)
    const tokenHash = hashToken(sessionToken)
    const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000)

    await query(
      `INSERT INTO admin_sessions (user_id, session_token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    )

    const res = NextResponse.json({
      ok: true,
      redirectTo: '/admin',
    })

    res.cookies.set(COOKIE_NAME, sessionToken, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: env.sessionTtlHours * 60 * 60,
    })

    return res
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
