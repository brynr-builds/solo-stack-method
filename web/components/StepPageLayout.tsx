/*
 * DEV NOTES / Intent:
 * - Why: Shared layout for all 7 step pages with consistent structure
 * - Governance visibility is PRODUCT LOGIC, not decoration
 *   → Users must see who builds, who audits, and current state
 *   → This builds trust and teaches the workflow even for non-technical users
 * - Phase 1: Static placeholders for agent/audit state
 * - Phase 2+: Dynamic state from context system
 * - Compatibility: Used by all /steps/[n]/page.tsx routes
 *   → Do not change props interface without updating all step pages
 */

'use client'

import Link from 'next/link'

interface StepPageLayoutProps {
  stepNumber: number
  title: string
  description: string
  children: React.ReactNode
}

export default function StepPageLayout({ 
  stepNumber, 
  title, 
  description, 
  children 
}: StepPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-solo-primary">
              Solo Stack Method™
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-solo-primary transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <Link 
                href="/pulse" 
                className="text-gray-600 hover:text-solo-primary transition-colors"
              >
                Stack Pulse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================
          GOVERNANCE VISIBILITY BANNER
          This is product logic, not decoration.
          Users see exactly who builds, who audits,
          and the current state of their work.
          ============================================ */}
      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Builder:</span>
                <span className="font-mono bg-slate-700 px-2 py-0.5 rounded">Claude</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Auditor:</span>
                <span className="font-mono bg-slate-700 px-2 py-0.5 rounded">ChatGPT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Context:</span>
                <span className="font-mono bg-slate-700 px-2 py-0.5 rounded">GitHub Repo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">State:</span>
                <span className="font-mono bg-amber-600 px-2 py-0.5 rounded">Pre-audit (Draft)</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Governance shown so you understand the workflow — even if you don't understand the code.
            </div>
          </div>
        </div>
      </div>

      {/* Step Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-solo-accent text-white text-xl font-bold">
              {stepNumber}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
          
          {/* Step Progress */}
          <div className="flex gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <Link
                key={step}
                href={`/steps/${step}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === stepNumber
                    ? 'bg-solo-accent text-white'
                    : step < stepNumber
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {step < stepNumber ? '✓' : step}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Step Navigation */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            {stepNumber > 1 ? (
              <Link
                href={`/steps/${stepNumber - 1}`}
                className="px-4 py-2 text-gray-600 hover:text-solo-primary transition-colors"
              >
                ← Previous Step
              </Link>
            ) : (
              <div />
            )}
            {stepNumber < 7 ? (
              <Link
                href={`/steps/${stepNumber + 1}`}
                className="px-4 py-2 bg-solo-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next Step →
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Complete ✓
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
