// INTENT: Server component — fetches pulse data from Supabase at request time.
// Falls back to STATIC_FALLBACK if Supabase is not configured (local dev,
// missing env vars). This ensures the page always renders something useful.
//
// Data is refreshed daily by the Netlify scheduled function (pulse-refresh).
// Interactive parts (filter tabs, newsletter) live in PulseClient.

import { getSupabaseClient } from '@/lib/supabase'
import PulseClient, { PulseEntry } from '@/components/PulseClient'

// Static fallback — shown when Supabase is not configured.
// Updated manually; the live DB is the source of truth in production.
const STATIC_FALLBACK: PulseEntry[] = [
  { id: 1,  tool: 'Claude 3.7 Sonnet', registry: 'anthropic', version: '3.7',          status: 'update', category: 'AI Model',  updated: '2025-02-24' },
  { id: 2,  tool: 'Claude 3.5 Sonnet', registry: 'anthropic', version: '3.5.20241022', status: 'stable', category: 'AI Model',  updated: '2024-10-22' },
  { id: 3,  tool: 'GPT-4o',            registry: 'openai',    version: '2024-11-20',   status: 'stable', category: 'AI Model',  updated: '2024-11-20' },
  { id: 4,  tool: 'GPT-4o mini',       registry: 'openai',    version: '2024-07-18',   status: 'stable', category: 'AI Model',  updated: '2024-07-18' },
  { id: 5,  tool: 'Gemini 2.0 Flash',  registry: 'google',    version: '2.0',          status: 'update', category: 'AI Model',  updated: '2025-02-05' },
  { id: 6,  tool: 'Mistral Large 2',   registry: 'mistral',   version: '2407',         status: 'stable', category: 'AI Model',  updated: '2024-07-24' },
  { id: 7,  tool: 'Cursor',            registry: 'cursor',    version: '0.47.0',       status: 'update', category: 'IDE',       updated: '2025-02-10' },
  { id: 8,  tool: 'Windsurf',          registry: 'codeium',   version: '1.0',          status: 'new',    category: 'IDE',       updated: '2024-11-13' },
  { id: 9,  tool: 'Next.js',           registry: 'npm',       version: '15.1.0',       status: 'update', category: 'Framework', updated: '2024-12-19' },
  { id: 10, tool: 'Supabase JS',       registry: 'npm',       version: '2.47.0',       status: 'stable', category: 'Backend',   updated: '2025-01-15' },
  { id: 11, tool: 'Vercel',            registry: 'vercel',    version: 'latest',       status: 'stable', category: 'Platform',  updated: '2025-03-01' },
  { id: 12, tool: 'Netlify',           registry: 'netlify',   version: 'latest',       status: 'stable', category: 'Platform',  updated: '2025-03-01' },
  { id: 13, tool: 'Tailwind CSS',      registry: 'npm',       version: '4.0.0',        status: 'update', category: 'Styling',   updated: '2025-01-22' },
  { id: 14, tool: 'TypeScript',        registry: 'npm',       version: '5.7.2',        status: 'stable', category: 'Language',  updated: '2024-11-22' },
  { id: 15, tool: 'v0 by Vercel',      registry: 'vercel',    version: 'latest',       status: 'stable', category: 'AI Tool',   updated: '2025-03-01' },
  { id: 16, tool: 'Claude Code',       registry: 'anthropic', version: 'latest',       status: 'new',    category: 'AI Tool',   updated: '2025-02-24' },
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
