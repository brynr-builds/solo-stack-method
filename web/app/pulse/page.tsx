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
import { pulseData } from './data'
import { FilterTabs } from './components/FilterTabs'
import { PulseGrid } from './components/PulseGrid'
import { NewsletterSignup } from './components/NewsletterSignup'

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

      <FilterTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <PulseGrid filteredData={filteredData} />

      <NewsletterSignup
        email={email}
        setEmail={setEmail}
        selectedTools={selectedTools}
        handleToolToggle={handleToolToggle}
        submitted={submitted}
        handleSubmit={handleSubmit}
      />

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
