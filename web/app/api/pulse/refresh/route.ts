// INTENT: Protected endpoint that fetches live versions from all configured
// sources (npm, Anthropic API, OpenAI API, Google AI, Mistral, GitHub) and
// upserts into Supabase. Called daily by the Netlify scheduled function.
// Can also be triggered manually for testing.
//
// Auth: Authorization: Bearer {PULSE_REFRESH_SECRET}
// Skipped tools (missing API key) retain their last DB value — never cleared.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { fetchAllSources, TOOL_SOURCES } from '@/lib/pulse-sources'

export async function POST(req: NextRequest) {
  const secret = process.env.PULSE_REFRESH_SECRET
  const auth = req.headers.get('authorization') ?? ''
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const results = await fetchAllSources()

  const updated: string[] = []
  const skipped: string[] = []
  const failed: string[] = []

  for (const result of results) {
    if (result.skipped) {
      skipped.push(result.tool)
      continue
    }
    if (!result.version) {
      failed.push(result.tool)
      continue
    }

    // Look up source metadata for this tool
    const source = TOOL_SOURCES.find((s) => s.tool === result.tool)

    const { error } = await supabase
      .from('stack_pulse_updates')
      .upsert(
        {
          tool: result.tool,
          registry: source?.registry ?? '',
          category: source?.category ?? '',
          source_type: source?.source_type ?? 'npm',
          source_key: source?.source_key ?? null,
          version: result.version,
          status: 'stable',
          updated: new Date().toISOString().split('T')[0],
          last_checked_at: new Date().toISOString(),
        },
        { onConflict: 'tool' }
      )

    if (error) {
      failed.push(result.tool)
    } else {
      updated.push(result.tool)
    }
  }

  return NextResponse.json({
    refreshed_at: new Date().toISOString(),
    updated,
    skipped,
    failed,
  })
}
