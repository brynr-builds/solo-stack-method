import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, tags } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const kitApiKey = process.env.KIT_API_KEY
    const kitFormId = process.env.KIT_FORM_ID
    const mailerliteToken = process.env.MAILERLITE_TOKEN
    const mailerliteGroupId = process.env.MAILERLITE_GROUP_ID

    if (kitApiKey && kitFormId) {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: kitApiKey,
          email,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe via Kit')
      }
      return NextResponse.json({ success: true, provider: 'kit' })
    }

    if (mailerliteToken && mailerliteGroupId) {
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteToken}`,
        },
        body: JSON.stringify({
          email,
          groups: [mailerliteGroupId],
          fields: {
            tags: tags?.join(', '),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe via MailerLite')
      }
      return NextResponse.json({ success: true, provider: 'mailerlite' })
    }

    // Phase 2 fallback: no ESP configured
    console.log('No ESP configured. Simulated subscription:', { email, tags })
    return NextResponse.json({ success: true, provider: 'simulated' })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
