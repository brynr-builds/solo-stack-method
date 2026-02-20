/**
 * POST /api/admin/login/finish
 * Verifies assertion, updates credential, creates session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { WebAuthnCredential } from '@simplewebauthn/server'
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

    const rl = checkRateLimit(
      getClientIdentifier(request),
      'login-finish',
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
    const response = body?.response

    if (!email || email !== env.allowedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!response) {
      return NextResponse.json({ error: 'Assertion response required' }, { status: 400 })
    }

    const credentialId = response.id
    if (!credentialId) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 400 })
    }

    const userRows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    const userId = userRows[0]!.id

    const credRows = await query<{ id: string; credential_id: string; public_key: string; counter: number }>(
      'SELECT id, credential_id, public_key, counter FROM webauthn_credentials WHERE user_id = $1 AND credential_id = $2',
      [userId, credentialId]
    )
    if (credRows.length === 0) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 400 })
    }
    const cred = credRows[0]!

    const challengeRows = await query<{ challenge: string }>(
      `SELECT challenge FROM webauthn_challenges
       WHERE user_id = $1 AND type = 'authentication' AND expires_at > now()
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    )
    if (challengeRows.length === 0) {
      return NextResponse.json({ error: 'Challenge expired or not found' }, { status: 400 })
    }
    const expectedChallenge = challengeRows[0]!.challenge

    const credential: WebAuthnCredential = {
      id: cred.credential_id,
      publicKey: Buffer.from(cred.public_key, 'base64url'),
      counter: cred.counter,
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: env.origin,
      expectedRPID: env.rpId,
      credential,
      requireUserVerification: true,
    })

    if (!verification.authenticationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    const { newCounter } = verification.authenticationInfo

    await query(
      `UPDATE webauthn_credentials SET counter = $1, last_used_at = now() WHERE id = $2`,
      [newCounter, cred.id]
    )

    await query(
      `DELETE FROM webauthn_challenges WHERE user_id = $1 AND type = 'authentication'`,
      [userId]
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
      path: '/',
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
