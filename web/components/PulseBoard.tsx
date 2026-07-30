/*
 * DEV NOTES (2026-06-09):
 * - Why: Client-interactive board for Stack Pulse (category filter + watch-list + newsletter UI).
 *   Receives LIVE data (real versions/dates) from the server page; no mock data here.
 * - Newsletter is UI-only for now (logs intent). Phase 2: wire to an ESP (Kit/MailerLite —
 *   which are also affiliate programs, so we'd dogfood the recommendation).
 */
'use client'

import { useState } from 'react'
import type { PulseItem } from '../lib/pulse'

const statusColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  recent: 'bg-amber-100 text-amber-700',
  stable: 'bg-green-100 text-green-700',
  unknown: 'bg-gray-100 text-gray-600',
}

export default function PulseBoard({ items, categories }: { items: PulseItem[]; categories: string[] }) {
  const [selected, setSelected] = useState('All')
  const [email, setEmail] = useState('')
  const [watch, setWatch] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const filtered = selected === 'All' ? items : items.filter((i) => i.category === selected)

  const toggle = (name: string) =>
    setWatch((p) => (p.includes(name) ? p.filter((t) => t !== name) : [...p, name]))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/pulse/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, watch }),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Failed to subscribe:', err)
    }
  }

  return (
    <>
      {/* Filter tabs */}
      <section className="px-6 mb-8">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selected === cat ? 'bg-solo-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-solo-primary">{item.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-mono">{item.version ? `v${item.version}` : '—'}</span>
                <span className="text-gray-400">{item.ago}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.category}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-16 bg-solo-primary text-white">
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">Get Pulse Alerts</h2>
              <p className="text-center text-gray-300 mb-8">
                Pick the tools you care about and we&rsquo;ll flag the updates that matter.
              </p>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Watch:</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => toggle(item.name)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        watch.includes(item.name) ? 'bg-white text-solo-primary' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <form onSubmit={submit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-solo-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button type="submit" className="bg-white text-solo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3 text-center">Free. Unsubscribe anytime.</p>
            </>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re Subscribed!</h2>
              <p className="text-gray-300 mb-4">
                You&apos;ll receive updates for: {watch.join(', ') || 'All tools'}
              </p>
              <p className="text-sm text-gray-400">
                Check your email for a personalized link to return with your preferences saved.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
