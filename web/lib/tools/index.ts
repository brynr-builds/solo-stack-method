/*
 * DEV NOTES (2026-06-08):
 * - Why: Loader + types for the curated affiliate "Stack" section (/tools).
 * - Data source: programs.json, generated from the vetted + scored research corpus
 *   (~/projects/affiliate-research). Each program carries REAL data (commission model,
 *   rate, cookie window, approval ease) — not paraphrased merchant copy. This is
 *   deliberate: Google's scaled-content-abuse policy penalizes thin AI affiliate pages,
 *   so every page renders verifiable, structured facts.
 * - Phase 1: Static JSON read at build time. Phase 2+: move to Supabase if it needs
 *   live editing from the admin console.
 */

import programsRaw from './programs.json'

export type Commission = {
  model: string | null
  ratePct: number | null
  flatUsd: number | null
  recurringMonths: number | null
}

export type Program = {
  slug: string
  name: string
  company: string
  niche: string
  nicheLabel: string
  tier: number
  score: number | null
  commission: Commission
  cookieDays: number | null
  approval: string | null
  newSiteFriendly: boolean | null
  payoutCountries: string | null
  demand: string | null
  why: string | null
  sourceUrl: string | null
  verified: boolean
}

export const programs: Program[] = programsRaw as Program[]

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
  return programs.filter((p) => p.niche === niche)
}

export const tier1 = programs.filter((p) => p.tier === 1)

/** Human-readable commission summary, e.g. "50% recurring (12mo)" or "$150 one-time". */
export function commissionLabel(c: Commission): string {
  const parts: string[] = []
  if (c.ratePct != null) parts.push(`${c.ratePct}%`)
  else if (c.flatUsd != null) parts.push(`$${c.flatUsd}`)
  const model = c.model || ''
  let modelLabel = model
  if (model === 'recurring' && c.recurringMonths) modelLabel = `recurring (${c.recurringMonths}mo)`
  if (parts.length === 0) return modelLabel || '—'
  return `${parts[0]} ${modelLabel}`.trim()
}
