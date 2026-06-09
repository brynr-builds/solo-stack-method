/*
 * DEV NOTES (2026-06-09):
 * - Why: Live Stack Pulse data. getPulse() fetches the CURRENT latest version + release date
 *   for each tool in sources.json (npm registry / nodejs.org), so the page is always current —
 *   no more hardcoded mock data. Next caches each fetch for an hour (revalidate), so the page
 *   refreshes automatically without hammering the registries.
 * - Resilience: any source that fails to fetch falls back to the committed snapshot.json
 *   (refreshed on a schedule by scripts/refresh-pulse.mjs + the pulse-refresh Action). So the
 *   page renders correct data even if a registry is briefly unreachable at build/runtime.
 */

import sourcesRaw from './sources.json'
import snapshot from './snapshot.json'

type Source = { name: string; category: string; npm?: string; node?: boolean; url: string }
const sources = sourcesRaw as Source[]

export type PulseItem = {
  name: string
  category: string
  url: string
  version: string | null
  date: string | null
  status: 'new' | 'recent' | 'stable' | 'unknown'
  ago: string
}

const HOUR = 3600

async function fetchNpm(pkg: string): Promise<{ version: string | null; date: string | null }> {
  const res = await fetch(`https://registry.npmjs.org/${pkg}`, { next: { revalidate: HOUR } })
  if (!res.ok) throw new Error(`npm ${pkg} ${res.status}`)
  const data: any = await res.json()
  const version = data['dist-tags']?.latest ?? null
  return { version, date: version ? data.time?.[version] ?? null : null }
}

async function fetchNode(): Promise<{ version: string | null; date: string | null }> {
  const res = await fetch('https://nodejs.org/dist/index.json', { next: { revalidate: HOUR } })
  if (!res.ok) throw new Error(`node ${res.status}`)
  const data: any = await res.json()
  const latest = data[0]
  return { version: String(latest.version).replace(/^v/, ''), date: latest.date ?? null }
}

function daysSince(date: string | null): number | null {
  if (!date) return null
  const ms = Date.now() - new Date(date).getTime()
  if (Number.isNaN(ms)) return null
  return Math.floor(ms / 86_400_000)
}

function statusFor(date: string | null): PulseItem['status'] {
  const d = daysSince(date)
  if (d === null) return 'unknown'
  if (d <= 14) return 'new'
  if (d <= 60) return 'recent'
  return 'stable'
}

function agoFor(date: string | null): string {
  const d = daysSince(date)
  if (d === null) return '—'
  if (d <= 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d} days ago`
  if (d < 60) return '1 month ago'
  if (d < 365) return `${Math.floor(d / 30)} months ago`
  return `${Math.floor(d / 365)}y ago`
}

export async function getPulse(): Promise<{ items: PulseItem[]; generatedAt: string }> {
  const snapItems: any[] = (snapshot as any).items ?? []

  const items = await Promise.all(
    sources.map(async (s): Promise<PulseItem> => {
      let v: { version: string | null; date: string | null } | null = null
      try {
        v = s.node ? await fetchNode() : s.npm ? await fetchNpm(s.npm) : null
      } catch {
        v = null
      }
      if (!v || !v.version) {
        const snap = snapItems.find((i) => i.name === s.name)
        if (snap) v = { version: snap.version, date: snap.date }
      }
      const date = v?.date ?? null
      return {
        name: s.name,
        category: s.category,
        url: s.url,
        version: v?.version ?? null,
        date,
        status: statusFor(date),
        ago: agoFor(date),
      }
    }),
  )

  // Newest first, then by name.
  items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.name.localeCompare(b.name))
  return { items, generatedAt: new Date().toISOString() }
}

export const pulseCategories = ['All', ...Array.from(new Set(sources.map((s) => s.category)))]
