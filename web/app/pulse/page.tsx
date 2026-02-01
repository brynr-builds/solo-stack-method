/*
 * DEV NOTES:
 * - Why: Public Stack Pulse page - shows AI tool updates, newsletter signup
 * - Phase 1: Static JSON data, email collection, tool preference selection
 * - Phase 2+: Live data from Edge Function, personalized feeds, email delivery
 * 
 * REQUIREMENTS:
 * - Read-only for public users
 * - Newsletter signup with tool selection
 * - "Viewing is free. Acting requires a subscription."
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock pulse data - Phase 1 uses static JSON
// Phase 2+: Replace with Supabase query to stack_pulse_updates table
const pulseData = [
  { id: 1, tool: 'Claude 3.5 Sonnet', registry: 'anthropic', version: '3.5.20240620', status: 'stable', category: 'AI Model', updated: '2024-01-28' },
  { id: 2, tool: 'GPT-4 Turbo', registry: 'openai', version: '0125-preview', status: 'update', category: 'AI Model', updated: '2024-01-31' },
  { id: 3, tool: 'Cursor', registry: 'cursor', version: '0.42.0', status: 'stable', category: 'IDE', updated: '2024-01-25' },
  { id: 4, tool: 'Next.js', registry: 'npm', version: '14.1.0', status: 'stable', category: 'Framework', updated: '2024-01-29' },
  { id: 5, tool: 'Supabase', registry: 'supabase', version: '2.39.0', status: 'stable', category: 'Backend', updated: '2024-01-30' },
  { id: 6, tool: 'Vercel', registry: 'vercel', version: 'latest', status: 'stable', category: 'Platform', updated: '2024-01-27' },
  { id: 7, tool: 'Tailwind CSS', registry: 'npm', version: '3.4.1', status: 'stable', category: 'Styling', updated: '2024-01-26' },
  { id: 8, tool: 'TypeScript', registry: 'npm', version: '5.3.3', status: 'stable', category: 'Language', updated: '2024-01-20' },
  { id: 9, tool: 'Gemini Pro', registry: 'google', version: '1.0', status: 'update', category: 'AI Model', updated: '2024-01-31' },
  { id: 10, tool: 'Mistral Large', registry: 'mistral', version: 'latest', status: 'new', category: 'AI Model', updated: '2024-01-30' },
  { id: 11, tool: 'v0 by Vercel', registry: 'vercel', version: '0.1', status: 'beta', category: 'AI Tool', updated: '2024-01-29' },
  { id: 12, tool: 'Netlify', registry: 'netlify', version: 'latest', status: 'stable', category: 'Platform', updated: '2024-01-28' },
]

const categories = ['All', 'AI Model', 'AI Tool', 'Framework', 'Backend', 'Platform', 'IDE', 'Styling', 'Language']

export default function PulsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const filteredData = selectedCategory === 'All' 
    ? pulseData 
    : pulseData.filter(item => item.category === selectedCategory)

  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO Phase 2: Store in Supabase, generate personalized link
    console.log('Newsletter signup:', { email, selectedTools })
    setSubmitted(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-700'
      case 'update': return 'bg-amber-100 text-amber-700'
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'beta': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">
            Solo Stack Method™
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-solo-accent font-medium">
              Stack Pulse
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-solo-primary mb-4">Stack Pulse</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time updates across the AI ecosystem. Industry awareness, early warning system, and execution signal feed.
          </p>
          <p className="mt-4 text-sm text-gray-500 bg-amber-50 inline-block px-4 py-2 rounded-full">
            Viewing is free. Acting requires a subscription.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-solo-accent text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pulse Grid */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-solo-primary">{item.tool}</h3>
                    <p className="text-xs text-gray-500">{item.registry}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">v{item.version}</span>
                  <span className="text-gray-400">{item.updated}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="px-6 py-16 bg-solo-primary text-white">
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">Get Pulse Alerts</h2>
              <p className="text-center text-gray-300 mb-8">
                Select the tools you care about and get notified when they update.
              </p>
              
              {/* Tool Selection */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Select tools to watch:</p>
                <div className="flex flex-wrap gap-2">
                  {pulseData.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleToolToggle(item.tool)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTools.includes(item.tool)
                          ? 'bg-white text-solo-primary'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {item.tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-solo-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button 
                  type="submit"
                  className="bg-white text-solo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Free newsletter. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-2">You're Subscribed!</h2>
              <p className="text-gray-300 mb-4">
                You'll receive updates for: {selectedTools.join(', ') || 'All tools'}
              </p>
              <p className="text-sm text-gray-400">
                Check your email for a personalized link to return with your preferences saved.
              </p>
              {/* TODO Phase 2: Generate and store personalized link */}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-gray-600 mb-6">
            Stop watching. Start shipping with governed AI execution.
          </p>
          <Link href="/signup" className="btn-primary">
            Start Your First Project — $20/month
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© 2024 Solo Stack Method™</span>
          <Link href="/" className="hover:text-solo-primary">← Back to Home</Link>
        </div>
      </footer>
    </div>
  )
}
