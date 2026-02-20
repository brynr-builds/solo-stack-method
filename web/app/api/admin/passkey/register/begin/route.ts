/**
 * POST /api/admin/passkey/register/begin
 * Session-authenticated: returns registration options for adding a passkey.
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
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

    const userRows = await query<{ email: string }>(
      'SELECT email FROM admin_users WHERE id = $1',
      [userId]
    )
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    const userEmail = userRows[0]!.email

    const options = await generateRegistrationOptions({
      rpName: env.rpName,
      rpID: env.rpId,
      userName: userEmail,
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
