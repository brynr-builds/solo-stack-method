/**
 * POST /api/admin/identify
 * Validates email, checks admin_users, returns next route.
 */

import { NextResponse } from 'next/server'
import { getAdminEnv } from '@/lib/admin/env'
import { query } from '@/lib/admin/storage/db'

export async function POST(request: Request) {
  try {
    const env = getAdminEnv()
    if (!env.isConfigured) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }

    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    if (email !== env.allowedEmail) {
      return NextResponse.json({ next: 'denied' })
    }

    const rows = await query<{ id: string }>(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json({ next: 'setup' })
    }

    return NextResponse.json({ next: 'login' })
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
