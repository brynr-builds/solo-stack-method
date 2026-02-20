/**
 * POST /api/admin/setup/finish
 * Verifies registration, stores credential, creates session, generates backup codes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { createHash, randomBytes } from 'crypto'
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

function generateBackupCodes(count: number): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(randomBytes(4).toString('hex').toUpperCase().match(/.{1,4}/g)!.join('-'))
  }
  return codes
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
      'setup-finish',
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
    const response = body?.response

    if (!email || email !== env.allowedEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (setupSecret !== env.setupSecret) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 })
    }

    if (!response) {
      return NextResponse.json({ error: 'Registration response required' }, { status: 400 })
    }

    const userRows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    const userId = userRows[0]!.id

    const challengeRows = await query<{ challenge: string }>(
      `SELECT challenge FROM webauthn_challenges
       WHERE user_id = $1 AND type = 'registration' AND expires_at > now()
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    )
    if (challengeRows.length === 0) {
      return NextResponse.json({ error: 'Challenge expired or not found' }, { status: 400 })
    }
    const expectedChallenge = challengeRows[0]!.challenge

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: env.origin,
      expectedRPID: env.rpId,
      requireUserVerification: true,
    })

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    const { credential } = verification.registrationInfo
    const credentialId = credential.id
    const publicKeyB64 = Buffer.from(credential.publicKey).toString('base64url')
    const counter = credential.counter
    const transports = credential.transports ? JSON.stringify(credential.transports) : null

    await query(
      `INSERT INTO webauthn_credentials (user_id, credential_id, public_key, counter, transports)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, credentialId, publicKeyB64, counter, transports]
    )

    await query(
      `DELETE FROM webauthn_challenges WHERE user_id = $1 AND type = 'registration'`,
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

    const backupCodes = generateBackupCodes(10)
    for (const code of backupCodes) {
      const codeHash = hashBackupCode(code, env.sessionSecret)
      await query(
        `INSERT INTO admin_backup_codes (user_id, code_hash) VALUES ($1, $2)`,
        [userId, codeHash]
      )
    }

    const res = NextResponse.json({
      ok: true,
      redirectTo: '/admin',
      backupCodes,
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
