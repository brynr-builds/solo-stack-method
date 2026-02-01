/*
 * DEV NOTES / Intent:
 * - Why: Placeholder for future "local build mode + audit score" workflow
 * - Phase 1: UI only, no backend, no actual audit execution
 * - Phase 2+: Connects to local CLI that runs governance checks
 * - Mode A (Required): Blocks on governance failures
 * - Mode B (Optional): Advisory checks, never blocks progress
 * - Compatibility: New route, does not affect existing routes
 */

'use client'

import Link from 'next/link'

export default function AuditScorePage() {
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
                Dashboard
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Score</h1>
          <p className="text-gray-600">
            Run governance checks on your local build before pushing to GitHub.
          </p>
        </div>

        {/* Mode Explanation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mode A */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-solo-accent">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-solo-accent text-white text-xs font-bold px-2 py-1 rounded">
                REQUIRED
              </span>
              <h2 className="text-xl font-bold text-gray-900">Mode A: Governance</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Blocks progress if governance rules are violated. These checks are non-negotiable.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-red-500">●</span>
                No secrets in code
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">●</span>
                DEV NOTES present in all files
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">●</span>
                No direct commits to main
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">●</span>
                Compatibility confirmed
              </li>
            </ul>
          </div>

          {/* Mode B */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                OPTIONAL
              </span>
              <h2 className="text-xl font-bold text-gray-900">Mode B: Advisory</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Suggestions and best practices. Never blocks progress. Helps improve quality.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-amber-500">●</span>
                Code style consistency
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">●</span>
                Performance suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">●</span>
                Accessibility hints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">●</span>
                Documentation completeness
              </li>
            </ul>
          </div>
        </div>

        {/* Run Audit Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Run Audit</h2>
          <p className="text-gray-600 text-sm mb-4">
            Point to your local project directory to run governance checks.
          </p>
          
          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="/path/to/your/project"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
              disabled
            />
            <button 
              className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
              disabled
            >
              Run Audit
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Phase 1: UI placeholder only. Local audit CLI coming in Phase 2.
          </p>
        </div>

        {/* Mock Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Audit Results</h2>
            <span className="text-xs text-gray-500">
              Last run: (not yet run)
            </span>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400">--</div>
              <div className="text-xs text-gray-500">Mode A Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400">--</div>
              <div className="text-xs text-gray-500">Mode B Score</div>
            </div>
            <div className="flex-1 text-right">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                Awaiting audit
              </span>
            </div>
          </div>

          {/* Findings Placeholder */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Findings</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-sm">
              Run an audit to see findings here.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="flex-1 px-4 py-3 bg-solo-primary text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
              disabled
            >
              Generate Fix Prompt (Claude)
            </button>
            <button 
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold opacity-50 cursor-not-allowed"
              disabled
            >
              Generate Review Prompt (ChatGPT)
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Prompt generation will produce step-scoped, context-aware prompts based on audit findings.
            Results will be timestamped and logged in future versions.
          </p>
        </div>
      </main>
    </div>
  )
}
