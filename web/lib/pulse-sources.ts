// INTENT: Fully autonomous pulse data fetching. Every tool has a programmatic
// source — no manual updates ever. Sources:
//
//   npm          — registry.npmjs.org (no auth)
//   anthropic    — api.anthropic.com/v1/models (ANTHROPIC_API_KEY)
//   openai       — api.openai.com/v1/models    (OPENAI_API_KEY)
//   google-ai    — generativelanguage.googleapis.com (GOOGLE_AI_API_KEY)
//   mistral      — api.mistral.ai/v1/models    (MISTRAL_API_KEY)
//   github       — api.github.com releases     (GITHUB_TOKEN optional)
//
// If a key is missing, that source is skipped silently and the DB retains
// the last known value. One-time key setup in Netlify → autonomous forever.

export type SourceType = 'npm' | 'anthropic' | 'openai' | 'google-ai' | 'mistral' | 'github'

export type ToolSource = {
  tool: string
  registry: string
  category: string
  source_type: SourceType
  // npm: package name | github: "owner/repo" | ai: model family pattern to match
  source_key: string
}

export const TOOL_SOURCES: ToolSource[] = [
  // ── AI Models ────────────────────────────────────────────────────────────
  // Fetched from provider APIs — returns newest model in each family
  { tool: 'Claude (Latest)',     registry: 'anthropic', category: 'AI Model', source_type: 'anthropic', source_key: 'claude-3' },
  { tool: 'GPT-4o',             registry: 'openai',    category: 'AI Model', source_type: 'openai',    source_key: 'gpt-4o' },
  { tool: 'GPT-4o mini',        registry: 'openai',    category: 'AI Model', source_type: 'openai',    source_key: 'gpt-4o-mini' },
  { tool: 'Gemini (Latest)',     registry: 'google',    category: 'AI Model', source_type: 'google-ai', source_key: 'gemini' },
  { tool: 'Mistral Large',       registry: 'mistral',   category: 'AI Model', source_type: 'mistral',   source_key: 'mistral-large' },

  // ── AI Tools (npm) ───────────────────────────────────────────────────────
  { tool: 'Claude Code',         registry: 'npm',       category: 'AI Tool',  source_type: 'npm',       source_key: '@anthropic-ai/claude-code' },
  { tool: 'v0 by Vercel',        registry: 'npm',       category: 'AI Tool',  source_type: 'npm',       source_key: 'v0' },

  // ── Frameworks & Languages (npm) ─────────────────────────────────────────
  { tool: 'Next.js',             registry: 'npm',       category: 'Framework', source_type: 'npm',      source_key: 'next' },
  { tool: 'Tailwind CSS',        registry: 'npm',       category: 'Styling',   source_type: 'npm',      source_key: 'tailwindcss' },
  { tool: 'TypeScript',          registry: 'npm',       category: 'Language',  source_type: 'npm',      source_key: 'typescript' },

  // ── Backend (npm) ────────────────────────────────────────────────────────
  { tool: 'Supabase JS',         registry: 'npm',       category: 'Backend',   source_type: 'npm',      source_key: '@supabase/supabase-js' },

  // ── Platforms (CLI on npm — tracks the CLI release cadence) ─────────────
  { tool: 'Vercel CLI',          registry: 'npm',       category: 'Platform',  source_type: 'npm',      source_key: 'vercel' },
  { tool: 'Netlify CLI',         registry: 'npm',       category: 'Platform',  source_type: 'npm',      source_key: 'netlify-cli' },

  // ── IDEs (GitHub releases) ───────────────────────────────────────────────
  { tool: 'Cursor',              registry: 'cursor',    category: 'IDE',       source_type: 'github',   source_key: 'getcursor/cursor' },
  { tool: 'Windsurf',            registry: 'codeium',   category: 'IDE',       source_type: 'github',   source_key: 'Exafunction/windsurf-releases' },
]

// ── Fetch helpers ──────────────────────────────────────────────────────────

async function safeFetch(url: string, init?: RequestInit): Promise<unknown | null> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function fetchNpm(packageName: string): Promise<string | null> {
  const encoded = packageName.startsWith('@')
    ? packageName.replace('/', '%2F')
    : packageName
  const data = await safeFetch(`https://registry.npmjs.org/${encoded}/latest`) as Record<string, unknown> | null
  return typeof data?.version === 'string' ? data.version : null
}

async function fetchAnthropic(familyPrefix: string): Promise<{ version: string; name: string } | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null

  const data = await safeFetch('https://api.anthropic.com/v1/models?limit=100', {
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
  }) as { data?: Array<{ id: string; display_name?: string; created_at?: string }> } | null

  if (!data?.data) return null

  const models = data.data
    .filter((m) => m.id.startsWith(familyPrefix))
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))

  const latest = models[0]
  if (!latest) return null

  const datePart = latest.id.match(/(\d{8})$/)?.[1]
  const version = datePart
    ? `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)}`
    : latest.id

  return { version, name: latest.display_name ?? latest.id }
}

async function fetchOpenAI(modelPrefix: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const data = await safeFetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  }) as { data?: Array<{ id: string; created?: number }> } | null

  if (!data?.data) return null

  const models = data.data
    .filter((m) => m.id.startsWith(modelPrefix) && /\d{4}-\d{2}-\d{2}/.test(m.id))
    .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))

  const latest = models[0]
  if (!latest) return null

  const datePart = latest.id.match(/(\d{4}-\d{2}-\d{2})/)?.[1]
  return datePart ?? latest.id
}

async function fetchGoogleAI(familyPrefix: string): Promise<string | null> {
  const key = process.env.GOOGLE_AI_API_KEY
  if (!key) return null

  const data = await safeFetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  ) as { models?: Array<{ name: string; displayName?: string }> } | null

  if (!data?.models) return null

  const models = data.models.filter((m) =>
    m.name.toLowerCase().includes(familyPrefix.toLowerCase())
  )

  // Prefer flash/pro variants, pick the first match
  const latest = models.find((m) => m.name.includes('flash')) ?? models[0]
  if (!latest) return null

  // Extract version from name like "models/gemini-2.0-flash"
  return latest.name.replace('models/', '')
}

async function fetchMistral(modelPrefix: string): Promise<string | null> {
  const key = process.env.MISTRAL_API_KEY
  if (!key) return null

  const data = await safeFetch('https://api.mistral.ai/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  }) as { data?: Array<{ id: string; created?: number }> } | null

  if (!data?.data) return null

  const models = data.data
    .filter((m) => m.id.startsWith(modelPrefix))
    .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))

  return models[0]?.id ?? null
}

async function fetchGitHub(ownerRepo: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const data = await safeFetch(
    `https://api.github.com/repos/${ownerRepo}/releases/latest`,
    { headers }
  ) as { tag_name?: string } | null

  return data?.tag_name?.replace(/^v/, '') ?? null
}

// ── Main orchestrator ──────────────────────────────────────────────────────

export type FetchResult = {
  tool: string
  version: string | null
  skipped?: boolean  // true when API key missing — don't overwrite DB value
}

export async function fetchAllSources(): Promise<FetchResult[]> {
  const results = await Promise.allSettled(
    TOOL_SOURCES.map(async (source): Promise<FetchResult> => {
      let version: string | null = null

      switch (source.source_type) {
        case 'npm':
          version = await fetchNpm(source.source_key)
          break
        case 'anthropic': {
          const result = await fetchAnthropic(source.source_key)
          version = result?.version ?? null
          if (version === null && !process.env.ANTHROPIC_API_KEY) {
            return { tool: source.tool, version: null, skipped: true }
          }
          break
        }
        case 'openai':
          version = await fetchOpenAI(source.source_key)
          if (version === null && !process.env.OPENAI_API_KEY) {
            return { tool: source.tool, version: null, skipped: true }
          }
          break
        case 'google-ai':
          version = await fetchGoogleAI(source.source_key)
          if (version === null && !process.env.GOOGLE_AI_API_KEY) {
            return { tool: source.tool, version: null, skipped: true }
          }
          break
        case 'mistral':
          version = await fetchMistral(source.source_key)
          if (version === null && !process.env.MISTRAL_API_KEY) {
            return { tool: source.tool, version: null, skipped: true }
          }
          break
        case 'github':
          version = await fetchGitHub(source.source_key)
          break
      }

      return { tool: source.tool, version }
    })
  )

  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { tool: TOOL_SOURCES[i].tool, version: null }
  )
}
