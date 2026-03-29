// INTENT: Server component — fetches pulse data from Supabase at request time.
// Falls back to STATIC_FALLBACK if Supabase is not configured (local dev,
// missing env vars). This ensures the page always renders something useful.
//
// Data is refreshed daily by the Netlify scheduled function (pulse-refresh).
// Interactive parts (filter tabs, newsletter) live in PulseClient.

import { getSupabaseClient } from '@/lib/supabase'
import PulseClient, { PulseEntry } from '@/components/PulseClient'

// Static fallback — shown when Supabase is not configured (local dev).
// Versions here are fetched live from public APIs in production.
// Tool names must match TOOL_SOURCES in lib/pulse-sources.ts exactly.
const STATIC_FALLBACK: PulseEntry[] = [
  { id: 1,  tool: 'Claude (Latest)',  registry: 'anthropic', version: 'check provider', status: 'stable', category: 'AI Model',  updated: '—' },
  { id: 2,  tool: 'GPT-4o',          registry: 'openai',    version: 'check provider', status: 'stable', category: 'AI Model',  updated: '—' },
  { id: 3,  tool: 'GPT-4o mini',     registry: 'openai',    version: 'check provider', status: 'stable', category: 'AI Model',  updated: '—' },
  { id: 4,  tool: 'Gemini (Latest)', registry: 'google',    version: 'check provider', status: 'stable', category: 'AI Model',  updated: '—' },
  { id: 5,  tool: 'Mistral Large',   registry: 'mistral',   version: 'check provider', status: 'stable', category: 'AI Model',  updated: '—' },
  { id: 6,  tool: 'Claude Code',     registry: 'npm',       version: 'check provider', status: 'stable', category: 'AI Tool',   updated: '—' },
  { id: 7,  tool: 'v0 by Vercel',    registry: 'npm',       version: 'check provider', status: 'stable', category: 'AI Tool',   updated: '—' },
  { id: 8,  tool: 'Next.js',         registry: 'npm',       version: 'check provider', status: 'stable', category: 'Framework', updated: '—' },
  { id: 9,  tool: 'Tailwind CSS',    registry: 'npm',       version: 'check provider', status: 'stable', category: 'Styling',   updated: '—' },
  { id: 10, tool: 'TypeScript',      registry: 'npm',       version: 'check provider', status: 'stable', category: 'Language',  updated: '—' },
  { id: 11, tool: 'Supabase JS',     registry: 'npm',       version: 'check provider', status: 'stable', category: 'Backend',   updated: '—' },
  { id: 12, tool: 'Vercel CLI',      registry: 'npm',       version: 'check provider', status: 'stable', category: 'Platform',  updated: '—' },
  { id: 13, tool: 'Netlify CLI',     registry: 'npm',       version: 'check provider', status: 'stable', category: 'Platform',  updated: '—' },
  { id: 14, tool: 'Cursor',          registry: 'cursor',    version: 'check provider', status: 'stable', category: 'IDE',       updated: '—' },
  { id: 15, tool: 'Windsurf',        registry: 'codeium',   version: 'check provider', status: 'stable', category: 'IDE',       updated: '—' },
]

async function getPulseData(): Promise<PulseEntry[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return STATIC_FALLBACK

  const { data, error } = await supabase
    .from('stack_pulse_updates')
    .select('id, tool, registry, version, status, category, updated')
    .order('category')
    .order('tool')

  if (error || !data || data.length === 0) return STATIC_FALLBACK

  return data.map((row) => ({
    ...row,
    // Normalize date: Supabase returns ISO string, page expects YYYY-MM-DD
    updated: typeof row.updated === 'string' ? row.updated.split('T')[0] : row.updated,
  }))
}

export default async function PulsePage() {
  const pulseData = await getPulseData()
  return <PulseClient data={pulseData} />
}
