/*
 * DEV NOTES (2026-06-09):
 * - Why: Public Stack Pulse — now LIVE. Server component fetches real latest versions + release
 *   dates for the stack (lib/pulse) and revalidates hourly (ISR), so it stays current
 *   automatically. The pulse-refresh GitHub Action also refreshes the committed snapshot on a
 *   schedule (push -> Netlify autodeploy), as a resilient fallback + to dogfood the upgrade loop.
 * - Replaces the old hardcoded mock array (which showed 2024 dates).
 */

import Link from 'next/link'
import { getPulse, pulseCategories } from '../../lib/pulse'
import PulseBoard from '../../components/PulseBoard'

export const revalidate = 3600 // refresh the page's data hourly

export const metadata = {
  title: 'Stack Pulse — live tool versions for solo builders | Solo Stack Method',
  description: 'Live release tracking for the tools in your stack — current versions and how fresh they are, refreshed automatically.',
}

export default async function PulsePage() {
  const { items, generatedAt } = await getPulse()
  const updated = new Date(generatedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-solo-accent font-medium">Stack Pulse</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Start Building</Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-solo-primary mb-4">Stack Pulse</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Live release tracking for the tools in your stack — the current version and how fresh it
            is, so a dependency never breaks your project by surprise.
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Live from the npm registry &amp; nodejs.org · refreshed automatically · last checked {updated}
          </p>
        </div>
      </section>

      <PulseBoard items={items} categories={pulseCategories} />

      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-gray-600 mb-6">Stop watching. Start shipping with governed AI execution.</p>
          <Link href="/signup" className="btn-primary">Start Your First Project</Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Solo Stack Method™</span>
          <Link href="/" className="hover:text-solo-primary">← Back to Home</Link>
        </div>
      </footer>
    </div>
  )
}
