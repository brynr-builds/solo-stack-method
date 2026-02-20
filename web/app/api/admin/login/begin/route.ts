/**
 * POST /api/admin/login/begin
 * Returns authentication options for passkey login.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  generateAuthenticationOptions,
  type AuthenticatorTransportFuture,
} from '@simplewebauthn/server'
import { getAdminEnv } from '@/lib/admin/env'
import { query } from '@/lib/admin/storage/db'
import { checkRateLimit } from '@/lib/admin/rate-limit'

function getClientIdentifier(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const env = getAdminEnv()
    if (!env.isConfigured) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }

    const rl = checkRateLimit(
      getClientIdentifier(request),
      'login-begin',
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

    if (!email || email !== env.allowedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const userRows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    const userId = userRows[0]!.id

    const credRows = await query<{ credential_id: string; transports: string | null }>(
      'SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = $1',
      [userId]
    )

    const allowCredentials = credRows.map((c) => ({
      id: c.credential_id,
      transports: c.transports ? (JSON.parse(c.transports) as AuthenticatorTransportFuture[]) : undefined,
    }))

    const options = await generateAuthenticationOptions({
      rpID: env.rpId,
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
      userVerification: 'required',
    })

    const challenge = options.challenge
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await query(
      `INSERT INTO webauthn_challenges (user_id, challenge, type, expires_at)
       VALUES ($1, $2, 'authentication', $3)`,
      [userId, challenge, expiresAt]
    )

    return NextResponse.json(options)
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
