import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, watch } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const kitApiKey = process.env.KIT_API_KEY
    const kitFormId = process.env.KIT_FORM_ID

    if (kitApiKey && kitFormId) {
       const kitUrl = `https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`

       const response = await fetch(kitUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ api_key: kitApiKey, email, tags: watch }),
       })

       if (!response.ok) {
           throw new Error(`Kit API Error: ${response.status} ${response.statusText}`)
       }
    } else {
       // Fallback for local dev when ESP is not configured
       console.log(`[Pulse Subscribe Mock] Email: ${email}, Watch:`, watch)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscription error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
