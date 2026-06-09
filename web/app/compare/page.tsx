/* DEV NOTES (2026-06-08): Index of comparisons (web/content/compare/*.md). */
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticles } from '../../lib/content'

export const metadata: Metadata = {
  title: 'Tool Comparisons for Solo Builders | Solo Stack Method',
  description: 'Head-to-head comparisons of the tools solo founders use — email, hosting, funnels, courses — scored the same way we score our own stack.',
}

export default function CompareIndex() {
  const items = getArticles('compare')
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
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl font-bold text-solo-primary mb-3">Comparisons</h1>
        <p className="text-xl text-gray-600 mb-10">One clear winner for your situation — not a 12-tool dump.</p>
        {items.length === 0 ? (
          <p className="text-gray-500">New comparisons are on the way.</p>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <Link key={a.slug} href={`/compare/${a.slug}`} className="card block hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-solo-primary mb-1">{a.title}</h2>
                <p className="text-gray-600">{a.description || a.excerpt}</p>
                {a.updated && <div className="text-xs text-gray-400 mt-2">Updated {a.updated}</div>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
