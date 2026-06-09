/*
 * DEV NOTES (2026-06-08):
 * - Why: Individual program detail page. Renders REAL structured data (commission model,
 *   rate, cookie window, approval ease, payout geography) from the research corpus.
 * - SEO/Google: data-dense, distinct per program — satisfies the "genuine per-page
 *   differentiation" bar that avoids scaled-content-abuse penalties.
 * - generateStaticParams pre-renders every program at build time.
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { programs, getProgram, commissionLabel } from '../../../lib/tools'
import AffiliateDisclosure from '../../../components/AffiliateDisclosure'

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProgram(params.slug)
  if (!p) return { title: 'Not found | Solo Stack Method' }
  return {
    title: `${p.name} Affiliate Program — ${commissionLabel(p.commission)} | Solo Stack Method`,
    description: `${p.name}: ${commissionLabel(p.commission)} commission, ${p.cookieDays ?? '—'}-day cookie, ${p.approval ?? '—'} approval. Where it ranks in our solo-builder tool research.`,
  }
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  )
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  const p = getProgram(params.slug)
  if (!p) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-gray-600 hover:text-solo-primary transition-colors">The Stack</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Start Building</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link href="/tools" className="text-sm text-solo-accent hover:underline">&larr; Back to The Stack</Link>

        <div className="flex items-start justify-between mt-4 mb-2">
          <h1 className="text-4xl font-bold text-solo-primary">{p.name}</h1>
          {p.tier === 1 && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium whitespace-nowrap">
              Tier 1 — apply now
            </span>
          )}
        </div>
        <p className="text-gray-500 mb-6">{p.nicheLabel}{p.company && p.company !== p.name ? ` · ${p.company}` : ''}</p>

        {p.why && (
          <div className="bg-solo-accent/5 border border-solo-accent/20 rounded-lg p-4 mb-8">
            <span className="font-semibold text-solo-primary">Why it ranks: </span>
            <span className="text-gray-700">{p.why}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <Stat label="Commission" value={commissionLabel(p.commission)} />
          <Stat label="Cookie window" value={p.cookieDays ? `${p.cookieDays} days` : '—'} />
          <Stat label="Approval" value={p.approval ?? '—'} />
          <Stat label="New-site friendly" value={p.newSiteFriendly == null ? '—' : p.newSiteFriendly ? 'Yes' : 'No'} />
          <Stat label="Payout reach" value={p.payoutCountries ?? '—'} />
          {p.score != null && <Stat label="Stack score" value={`${p.score}/100`} />}
        </div>

        {p.demand && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Demand signal</h2>
            <p className="text-gray-700">{p.demand}</p>
          </div>
        )}

        <div className="mb-8">
          <AffiliateDisclosure />
        </div>

        {p.sourceUrl && (
          <a
            href={p.sourceUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-primary inline-block"
          >
            Visit {p.name} &rarr;
          </a>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Figures sourced from our research corpus and {p.verified ? 'verified against the program page' : 'pending final verification against the program page'}.
          Commission terms can change — confirm current rates on the program&rsquo;s own site before applying.
        </p>
      </div>
    </div>
  )
}
