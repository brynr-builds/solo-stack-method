// INTENT: Protected API route to refresh auto-tracked pulse data from public APIs.
// Called daily by the Netlify scheduled function (netlify/functions/pulse-refresh.mts).
// Can also be triggered manually: POST /api/pulse/refresh
// with Authorization: Bearer {PULSE_REFRESH_SECRET}
//
// Only updates tools with source_type = 'npm'. Manual tools (AI models, IDEs)
// remain unchanged and are updated via migration seeds or the admin panel.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { fetchAutoSources } from '@/lib/pulse-sources'

export async function POST(req: NextRequest) {
  // Auth check
  const secret = process.env.PULSE_REFRESH_SECRET
  const auth = req.headers.get('authorization') ?? ''
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    )
  }

  // Fetch latest versions from npm registry
  const results = await fetchAutoSources()

  const successes: string[] = []
  const failures: string[] = []

  for (const result of results) {
    if (!result.version) {
      failures.push(result.tool)
      continue
    }

    const { error } = await supabase
      .from('stack_pulse_updates')
      .upsert(
        {
          tool: result.tool,
          version: result.version,
          updated: new Date().toISOString().split('T')[0],
          last_checked_at: new Date().toISOString(),
        },
        { onConflict: 'tool' }
      )

    if (error) {
      failures.push(result.tool)
    } else {
      successes.push(result.tool)
    }
  }

  return NextResponse.json({
    refreshed_at: new Date().toISOString(),
    updated: successes,
    failed: failures,
  })
}
