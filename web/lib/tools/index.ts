/*
 * DEV NOTES (2026-06-08, updated):
 * - Why: Loader + types for the curated affiliate "Stack" section (/tools).
 * - Data source: programs.json, rebuilt 2026-06-08 from the HAND-VERIFIED portfolio
 *   (see MONETIZATION_PLAN.md §4). Every figure was checked against the program's official
 *   affiliate page. The prior auto-generated corpus shipped a dead program (Jasper) and
 *   non-programs (GitHub, Cloudflare) — those are removed.
 * - REVENUE WIRING: `affiliateUrl` is the real tracking deeplink. It is null until the
 *   operator is approved for the program (Gate 3). `outboundUrl()` returns the /go/<slug>
 *   redirect when we have a tracking link, otherwise the plain merchant URL (honest, $0).
 * - Each program carries REAL structured data (not paraphrased merchant copy) so the pages
 *   clear Google's "genuine per-page differentiation" bar and avoid scaled-content penalties.
 */

import programsRaw from './programs.json'
import affiliateLinks from './affiliate-links.json'

export type Commission = {
  model: string | null            // 'recurring' | 'one-time' | 'hybrid' | 'flat'
  ratePct: number | null
  flatUsd: number | null
  recurringMonths: number | null  // null + model 'recurring' == lifetime
}

export type Program = {
  slug: string
  name: string
  company: string
  niche: string
  nicheLabel: string
  tier: number
  featured: boolean
  rank: number
  score: number | null
  commission: Commission
  cookieDays: number | null
  approval: string | null
  network: string | null
  newSiteFriendly: boolean | null
  payoutCountries: string | null
  demand: string | null
  why: string | null
  applyUrl: string | null         // where the OPERATOR signs up (Gate 3)
  merchantUrl: string | null      // product site — user-facing fallback before tracking link exists
  affiliateUrl: string | null     // the real tracking deeplink — null until approved
  sourceUrl: string | null        // citation (== applyUrl)
  verified: boolean
  caveat: string | null
}

// Merge in real tracking links from affiliate-links.json (the operator's one-file revenue switch).
// A link present there overrides programs.json's affiliateUrl → that program starts earning.
const linkOverrides = affiliateLinks as Record<string, string>
export const programs: Program[] = (programsRaw as Program[]).map((p) => {
  const link = linkOverrides[p.slug]
  return link && typeof link === 'string' && link.startsWith('http')
    ? { ...p, affiliateUrl: link }
    : p
})

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug)
}

export function getNiches(): { niche: string; label: string; count: number }[] {
  const map = new Map<string, { niche: string; label: string; count: number }>()
  for (const p of programs) {
    const existing = map.get(p.niche)
    if (existing) existing.count++
    else map.set(p.niche, { niche: p.niche, label: p.nicheLabel, count: 1 })
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

export function programsByNiche(niche: string): Program[] {
  return programs.filter((p) => p.niche === niche).sort((a, b) => a.rank - b.rank)
}

/** Top Picks: featured programs in curated rank order. */
export const tier1 = programs.filter((p) => p.featured).sort((a, b) => a.rank - b.rank)

/**
 * The link a visitor's "Visit" button should use. ALWAYS routes through /go/<slug>, which:
 *  - logs the click (demand intelligence from day one — before you've even applied), and
 *  - 302s to the real affiliate tracking link if we have one, else the merchant site.
 * The payoff: published content links never change. The moment a tracking link is pasted
 * into programs.json (post Gate-3), every existing /go link on the site starts earning —
 * zero content edits required.
 */
export function outboundUrl(p: Program): string {
  return `/go/${p.slug}`
}

/** True once a real tracking link is wired (operator approved + link pasted in). */
export function isEarning(p: Program): boolean {
  return Boolean(p.affiliateUrl)
}

/** Human-readable commission summary, e.g. "50% recurring (12mo)" or "$200 one-time". */
export function commissionLabel(c: Commission): string {
  const amount =
    c.ratePct != null ? `${c.ratePct}%` : c.flatUsd != null ? `$${c.flatUsd}` : ''
  const model = c.model || ''
  let modelLabel = model
  if (model === 'recurring') {
    modelLabel = c.recurringMonths ? `recurring (${c.recurringMonths}mo)` : 'recurring (lifetime)'
  }
  if (model === 'hybrid') modelLabel = 'upfront + recurring'
  if (!amount) return modelLabel || '—'
  return `${amount} ${modelLabel}`.trim()
}
