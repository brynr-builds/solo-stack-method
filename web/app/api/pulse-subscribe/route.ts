import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, watch } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!Array.isArray(watch)) {
      return NextResponse.json({ error: 'Watch list must be an array' }, { status: 400 })
    }

    const token = crypto.randomUUID()
    const payload = { email, watch }

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(`pulse-pref:${token}`, JSON.stringify(payload))
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error in pulse-subscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
