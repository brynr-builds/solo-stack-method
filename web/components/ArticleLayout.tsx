/*
 * DEV NOTES (2026-06-08):
 * - Why: Shared layout for SEO content (guides + comparisons). Enforces the content rules
 *   from MONETIZATION_PLAN.md: FTC disclosure ABOVE the first affiliate link, a "Tools
 *   mentioned" box that monetizes via /go redirects, and a last-updated date (freshness/E-E-A-T).
 * - Server component: takes already-rendered article HTML + the program slugs to surface.
 */

import Link from 'next/link'
import type { Metadata } from 'next'
import type { Article } from '../lib/content'
import { getProgram, outboundUrl, commissionLabel } from '../lib/tools'
import AffiliateDisclosure from './AffiliateDisclosure'

export default function ArticleLayout({ article }: { article: Article }) {
  const mentioned = article.programs.map((s) => getProgram(s)).filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-gray-600 hover:text-solo-primary transition-colors">The Stack</Link>
            <Link href="/guides" className="text-gray-600 hover:text-solo-primary transition-colors">Guides</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Start Building</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link href={`/${article.type}`} className="text-sm text-solo-accent hover:underline">
          &larr; {article.type === 'compare' ? 'All comparisons' : 'All guides'}
        </Link>

        <h1 className="text-4xl font-bold text-solo-primary mt-4 mb-3 leading-tight">{article.title}</h1>
        {article.description && <p className="text-xl text-gray-600 mb-4">{article.description}</p>}
        <div className="text-sm text-gray-400 mb-6">
          {article.author && <span>By {article.author}</span>}
          {article.author && article.updated && <span> · </span>}
          {article.updated && <span>Updated {article.updated}</span>}
        </div>

        {/* FTC: disclosure ABOVE the first affiliate link */}
        <div className="mb-8"><AffiliateDisclosure /></div>

        {mentioned.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 mb-8">
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Tools mentioned</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {mentioned.map((p) => (
                <div key={p!.slug} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2">
                  <div>
                    <Link href={`/tools/${p!.slug}`} className="font-semibold text-solo-primary hover:underline">{p!.name}</Link>
                    <div className="text-xs text-solo-accent">{commissionLabel(p!.commission)}</div>
                  </div>
                  <a href={outboundUrl(p!)} target="_blank" rel="noopener noreferrer sponsored nofollow"
                     className="text-sm font-medium text-white bg-solo-accent px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-blue-600 transition-colors">
                    Visit →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />

        <div className="mt-12 border-t border-gray-100 pt-6">
          <AffiliateDisclosure compact />
        </div>
      </article>
    </div>
  )
}

export function articleMetadata(article: Article): Metadata {
  return {
    title: `${article.title} | Solo Stack Method`,
    description: article.description || article.excerpt || article.title,
  }
}
