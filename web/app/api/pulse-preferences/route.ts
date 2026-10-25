import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    let prefs = null
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        prefs = await kv.get(`pulse-pref:${token}`)
    }

    if (!prefs) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 404 })
    }

    return NextResponse.json(prefs)
  } catch (error) {
    console.error('Error fetching pulse preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
