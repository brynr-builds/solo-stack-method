import { NextResponse } from 'next/server'
import { query } from '../../../../lib/admin/storage/db'

export async function POST(req: Request) {
  try {
    const { email, selectedTools } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const tools = Array.isArray(selectedTools) ? selectedTools : []

    // Upsert subscription into Postgres via pg pool
    await query(
      `
      INSERT INTO newsletter_subscriptions (email, selected_tools, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (email)
      DO UPDATE SET
        selected_tools = $2,
        updated_at = now()
      `,
      [email, tools]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
