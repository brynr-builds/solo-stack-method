/**
 * POST /api/admin/setup/begin
 * Validates setup secret + email, creates admin if needed, returns registration options.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  generateRegistrationOptions,
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
      'setup-begin',
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

    let rows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    )

    let userId: string
    if (rows.length === 0) {
      const insert = await query<{ id: string }>(
        `INSERT INTO admin_users (email) VALUES ($1) RETURNING id`,
        [email]
      )
      userId = insert[0]!.id
    } else {
      userId = rows[0]!.id
    }

    const options = await generateRegistrationOptions({
      rpName: env.rpName,
      rpID: env.rpId,
      userName: email,
      userID: Buffer.from(userId.replace(/-/g, ''), 'hex'),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
      },
    })

    const challenge = options.challenge
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await query(
      `INSERT INTO webauthn_challenges (user_id, challenge, type, expires_at)
       VALUES ($1, $2, 'registration', $3)`,
      [userId, challenge, expiresAt]
    )

    return NextResponse.json(options)
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
