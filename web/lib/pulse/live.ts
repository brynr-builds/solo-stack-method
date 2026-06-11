/*
 * DEV NOTES (2026-06-10):
 * - Why: the moat. Comparison/guide articles can carry LIVE facts that update themselves
 *   from Stack Pulse (hourly ISR + the 6h refresh Action), so pages never go stale —
 *   the thing Google's scaled-content rules reward and AI answer engines cite.
 * - Authors (human or agent) reference tools two ways:
 *     frontmatter `pulse: [next, astro]`  -> renders the LiveFacts panel
 *     inline tokens in prose             -> {{pulse:next.version}} {{pulse:next.released}}
 *   Unknown keys render as em-dash placeholders rather than leaking raw tokens.
 */

import { getPulse, type PulseItem } from './index'

/** Stable short keys for prose tokens + frontmatter (maps to Pulse item names). */
export const PULSE_KEYS: Record<string, string> = {
  next: 'Next.js',
  react: 'React',
  astro: 'Astro',
  tailwind: 'Tailwind CSS',
  typescript: 'TypeScript',
  node: 'Node.js',
  vite: 'Vite',
  vitest: 'Vitest',
  eslint: 'ESLint',
  prisma: 'Prisma',
  supabase: 'Supabase JS',
  anthropic: 'Anthropic SDK',
  openai: 'OpenAI SDK',
  'vercel-ai': 'Vercel AI SDK',
}

export type LiveFact = PulseItem & { key: string }

/** Resolve a list of pulse keys (from article frontmatter) to live items. */
export async function getLiveFacts(keys: string[]): Promise<LiveFact[]> {
  if (!keys.length) return []
  const { items } = await getPulse()
  const facts: LiveFact[] = []
  for (const key of keys) {
    const name = PULSE_KEYS[key]
    const item = name ? items.find((i) => i.name === name) : undefined
    if (item) facts.push({ ...item, key })
  }
  return facts
}

/** Replace {{pulse:key.field}} tokens in rendered article HTML with live values. */
export function injectLiveTokens(html: string, facts: LiveFact[]): string {
  const byKey = new Map(facts.map((f) => [f.key, f]))
  return html.replace(
    /\{\{\s*pulse:([a-z0-9-]+)\.(version|released|ago)\s*\}\}/g,
    (_match, key: string, field: string) => {
      const fact = byKey.get(key)
      if (!fact) return '—'
      if (field === 'version') return fact.version ?? '—'
      if (field === 'ago') return fact.ago
      return fact.date ? fact.date.slice(0, 10) : '—'
    },
  )
}

/** Newest underlying data point — used as the page's honest dateModified. */
export function freshestDate(facts: LiveFact[]): string | null {
  const dates = facts.map((f) => f.date).filter(Boolean) as string[]
  return dates.sort().reverse()[0] ?? null
}
