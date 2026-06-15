import { NextResponse } from 'next/server'
import { query } from '@/lib/admin/storage/db'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, watch } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const tools = Array.isArray(watch) ? watch : []

    // 1. Generate unique token
    const token = crypto.randomBytes(32).toString('hex')

    // 2. Store in database
    await query(
      `
      INSERT INTO newsletter_preferences (email, token, tools, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (email) DO UPDATE SET
        token = EXCLUDED.token,
        tools = EXCLUDED.tools,
        updated_at = NOW()
      `,
      [email, token, tools]
    )

    // 3. (In a real app, we'd send an email here using Resend or similar)
    // For now, we'll just log it or simulate it, and return success.
    console.log(`[Pulse] Sending preference link to ${email}: /pulse/preferences?token=${token}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Pulse subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
