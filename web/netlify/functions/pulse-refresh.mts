// INTENT: Netlify scheduled function that triggers the pulse refresh daily.
// Calls POST /api/pulse/refresh with the PULSE_REFRESH_SECRET.
// Runs at midnight UTC every day. Netlify handles the scheduling.
//
// Docs: https://docs.netlify.com/functions/scheduled-functions/

import type { Config } from '@netlify/functions'

export const config: Config = {
  schedule: '@daily',
}

export default async () => {
  const siteUrl = process.env.URL ?? process.env.DEPLOY_URL
  const secret = process.env.PULSE_REFRESH_SECRET

  if (!siteUrl || !secret) {
    console.error('[pulse-refresh] Missing URL or PULSE_REFRESH_SECRET env var')
    return
  }

  const res = await fetch(`${siteUrl}/api/pulse/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
  })

  const body = await res.json()
  if (res.ok) {
    console.log('[pulse-refresh] Success:', JSON.stringify(body))
  } else {
    console.error('[pulse-refresh] Failed:', res.status, JSON.stringify(body))
  }
}
