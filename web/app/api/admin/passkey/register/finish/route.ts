/**
 * POST /api/admin/passkey/register/finish
 * Session-authenticated: verifies registration and stores credential.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { getAdminEnv } from '@/lib/admin/env'
import { getSessionFromRequest } from '@/lib/admin/session'
import { query } from '@/lib/admin/storage/db'

export async function POST(request: NextRequest) {
  try {
    const env = getAdminEnv()
    if (!env.isConfigured) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }

    const session = await getSessionFromRequest(request, env.sessionSecret)
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.sub

    const body = await request.json()
    const response = body?.response

    if (!response) {
      return NextResponse.json({ error: 'Registration response required' }, { status: 400 })
    }

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

    return NextResponse.json({ ok: true, message: 'Passkey added successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
