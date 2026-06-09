/* DEV NOTES (2026-06-08): Index of guides (web/content/guides/*.md). */
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticles } from '../../lib/content'

export const metadata: Metadata = {
  title: 'Guides — Build with AI | Solo Stack Method',
  description: 'Dogfooded guides for solo builders shipping real software with AI: what to use, where to deploy, and what it costs.',
}

export default function GuidesIndex() {
  const guides = getArticles('guides')
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-gray-600 hover:text-solo-primary transition-colors">The Stack</Link>
            <Link href="/compare" className="text-gray-600 hover:text-solo-primary transition-colors">Comparisons</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Start Building</Link>
          </div>
        </div>
      </nav>
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl font-bold text-solo-primary mb-3">Guides</h1>
        <p className="text-xl text-gray-600 mb-10">Built with the same governed method we teach — every recommendation is one we actually run.</p>
        {guides.length === 0 ? (
          <p className="text-gray-500">New guides are on the way.</p>
        ) : (
          <div className="space-y-4">
            {guides.map((a) => (
              <Link key={a.slug} href={`/guides/${a.slug}`} className="card block hover:shadow-xl transition-shadow">
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
