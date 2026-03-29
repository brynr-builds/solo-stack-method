// INTENT: Single source of truth for which tools are tracked on Stack Pulse
// and how their versions are fetched.
//
// source_type:
//   'npm'    — fetched automatically from registry.npmjs.org
//   'manual' — seeded in DB, updated manually (AI models, IDEs, platforms)
//              because they have no stable public version API

export type ToolSource = {
  tool: string
  registry: string
  category: string
  source_type: 'npm' | 'manual'
  source_key: string | null  // npm package name, or null for manual
}

export const TOOL_SOURCES: ToolSource[] = [
  // Auto-tracked via npm registry
  { tool: 'Next.js',       registry: 'npm',       category: 'Framework', source_type: 'npm', source_key: 'next' },
  { tool: 'Tailwind CSS',  registry: 'npm',       category: 'Styling',   source_type: 'npm', source_key: 'tailwindcss' },
  { tool: 'TypeScript',    registry: 'npm',       category: 'Language',  source_type: 'npm', source_key: 'typescript' },
  { tool: 'Supabase JS',   registry: 'npm',       category: 'Backend',   source_type: 'npm', source_key: '@supabase/supabase-js' },

  // Manual — AI models have no public version API
  { tool: 'Claude 3.7 Sonnet', registry: 'anthropic', category: 'AI Model', source_type: 'manual', source_key: null },
  { tool: 'Claude 3.5 Sonnet', registry: 'anthropic', category: 'AI Model', source_type: 'manual', source_key: null },
  { tool: 'GPT-4o',            registry: 'openai',    category: 'AI Model', source_type: 'manual', source_key: null },
  { tool: 'GPT-4o mini',       registry: 'openai',    category: 'AI Model', source_type: 'manual', source_key: null },
  { tool: 'Gemini 2.0 Flash',  registry: 'google',    category: 'AI Model', source_type: 'manual', source_key: null },
  { tool: 'Mistral Large 2',   registry: 'mistral',   category: 'AI Model', source_type: 'manual', source_key: null },

  // Manual — IDEs have no stable public version API
  { tool: 'Cursor',    registry: 'cursor',  category: 'IDE',     source_type: 'manual', source_key: null },
  { tool: 'Windsurf',  registry: 'codeium', category: 'IDE',     source_type: 'manual', source_key: null },

  // Manual — platforms / AI tools
  { tool: 'Vercel',        registry: 'vercel',    category: 'Platform', source_type: 'manual', source_key: null },
  { tool: 'Netlify',       registry: 'netlify',   category: 'Platform', source_type: 'manual', source_key: null },
  { tool: 'v0 by Vercel',  registry: 'vercel',    category: 'AI Tool',  source_type: 'manual', source_key: null },
  { tool: 'Claude Code',   registry: 'anthropic', category: 'AI Tool',  source_type: 'manual', source_key: null },
]

export type FetchResult = {
  tool: string
  version: string | null
  error?: string
}

// INTENT: Fetch the latest published version of an npm package.
// Uses the /latest dist-tag endpoint — fast, no auth required.
async function fetchNpmVersion(packageName: string): Promise<string | null> {
  try {
    const encoded = packageName.startsWith('@')
      ? packageName.replace('/', '%2F')
      : packageName
    const res = await fetch(
      `https://registry.npmjs.org/${encoded}/latest`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.version === 'string' ? data.version : null
  } catch {
    return null
  }
}

// INTENT: Fetch all auto-trackable sources in parallel.
// Only runs for tools with source_type === 'npm'. Manual tools are
// managed via the migration seed and updated through the admin panel.
export async function fetchAutoSources(): Promise<FetchResult[]> {
  const autoSources = TOOL_SOURCES.filter(
    (s) => s.source_type === 'npm' && s.source_key
  )

  const settled = await Promise.allSettled(
    autoSources.map(async (source) => {
      const version = await fetchNpmVersion(source.source_key!)
      return { tool: source.tool, version }
    })
  )

  return settled.map((result, i) =>
    result.status === 'fulfilled'
      ? result.value
      : { tool: autoSources[i].tool, version: null, error: 'fetch failed' }
  )
}
