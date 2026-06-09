/*
 * DEV NOTES (2026-06-08):
 * - Why: The Stack — curated, research-ranked tools for solo builders. Public, indexable.
 * - On-brand framing: these are tools vetted by the same governed method the product teaches.
 * - Data: lib/tools (generated from the vetted+scored affiliate research corpus).
 * - SEO/Google: each program links to its own detail page with real structured data,
 *   avoiding thin-content penalties. No merchant-copy paraphrasing.
 */

import Link from 'next/link'
import type { Metadata } from 'next'
import { programs, tier1, getNiches, programsByNiche, commissionLabel } from '../../lib/tools'
import AffiliateDisclosure from '../../components/AffiliateDisclosure'

export const metadata: Metadata = {
  title: 'The Stack — Curated Tools for Solo Builders | Solo Stack Method',
  description:
    'The software, courses, and services we rank highest for solo builders — scored on commission, approval ease, and reliability using the same method we teach.',
}

function Pill({ children, tone = 'gray' }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return <span className={`text-xs px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>
}

export default function ToolsPage() {
  const niches = getNiches()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">
            Solo Stack Method™
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-solo-accent font-medium">The Stack</Link>
            <Link href="/pulse" className="text-gray-600 hover:text-solo-primary transition-colors">Stack Pulse</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Start Building</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-solo-accent/10 text-solo-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Researched · Scored · Vetted
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-solo-primary leading-tight mb-6">
            The Stack
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The tools we rank highest for solo builders — scored on commission, approval ease,
            payout reliability, and demand using the same governed method we teach. {programs.length} programs,
            ranked honestly.
          </p>
          <div className="max-w-2xl mx-auto">
            <AffiliateDisclosure />
          </div>
        </div>
      </section>

      {/* Top picks */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-solo-primary mb-2">Top Picks</h2>
          <p className="text-gray-600 mb-8">Tier 1 — highest payout with the easiest approval. Where we&rsquo;d start.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tier1.map((p) => (
              <Link key={p.slug} href={`/tools/${p.slug}`} className="card hover:shadow-xl transition-shadow block">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-solo-primary">{p.name}</h3>
                  <Pill tone="green">Tier 1</Pill>
                </div>
                <div className="text-2xl font-bold text-solo-accent mb-1">{commissionLabel(p.commission)}</div>
                <div className="text-sm text-gray-500 mb-3">{p.nicheLabel}</div>
                <div className="flex flex-wrap gap-2">
                  {p.approval && <Pill tone="blue">{p.approval} approval</Pill>}
                  {p.cookieDays && <Pill>{p.cookieDays}d cookie</Pill>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By category */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-solo-primary mb-8">By Category</h2>
          <div className="space-y-12">
            {niches.map((n) => (
              <div key={n.niche}>
                <div className="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-xl font-bold text-gray-900">{n.label}</h3>
                  <span className="text-sm text-gray-500">{n.count} tools</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {programsByNiche(n.niche).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/tools/${p.slug}`}
                      className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-4 py-3 hover:border-solo-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        {p.tier === 1 && <Pill tone="green">Tier 1</Pill>}
                      </div>
                      <span className="text-sm font-semibold text-solo-accent">{commissionLabel(p.commission)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <AffiliateDisclosure compact />
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">© 2026 Solo Stack Method™. All rights reserved.</div>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-gray-500 hover:text-solo-primary">Home</Link>
              <Link href="/tools" className="text-gray-500 hover:text-solo-primary">The Stack</Link>
              <Link href="/pulse" className="text-gray-500 hover:text-solo-primary">Stack Pulse</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
