/**
 * POST /api/admin/login/backup
 * Verifies backup code, marks used, creates session.
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

function hashBackupCode(code: string, secret: string): string {
  const normalized = code.replace(/-/g, '').toLowerCase()
  return createHash('sha256').update(secret + normalized).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const env = getAdminEnv()
    if (!env.isConfigured) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }

    const rl = checkRateLimit(
      getClientIdentifier(request),
      'login-backup',
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
    const code = typeof body?.code === 'string' ? body.code.trim() : ''

    if (!email || email !== env.allowedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: 'Backup code required' }, { status: 400 })
    }

    const codeHash = hashBackupCode(code, env.sessionSecret)

    const userRows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }
    const userId = userRows[0]!.id

    const codeRows = await query<{ id: string }>(
      'SELECT id FROM admin_backup_codes WHERE user_id = $1 AND code_hash = $2 AND used_at IS NULL',
      [userId, codeHash]
    )
    if (codeRows.length === 0) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    await query(
      'UPDATE admin_backup_codes SET used_at = now() WHERE id = $1',
      [codeRows[0]!.id]
    )

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
      path: '/admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: env.sessionTtlHours * 60 * 60,
    })

    return res
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
