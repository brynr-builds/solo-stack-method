/*
 * DEV NOTES / Intent:
 * - Why: Audit Score system with Mode A (blocking) and Mode B (advisory)
 * - Phase 1.2: Full UI + rubric, no backend, no scoring engine
 * - Mode A checks are REQUIRED and BLOCK progress if failed
 * - Mode B checks are ADVISORY and never block
 * - Explicitly gated by subscription
 * 
 * Compatibility:
 * - New route, does not affect existing routes
 * - Uses SubscriptionGate for access control
 * - Static rubric + placeholders only
 * 
 * Phase 1.3b ADDITIONS (2026-02-02):
 * - Sustain the Stack: optional contribution ask (copy-only, no payment)
 *   Shows only after Mode A passes. Never affects score or features.
 * - Future Local Build Mode: placeholder copy for upcoming local-first workflow
 * - Compatible: additive sections after existing results, no layout changes
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSubscription, GatingBanner } from '../../components/SubscriptionGate'

// Mode A: Governance Compliance (REQUIRED, BLOCKING)
const MODE_A_CHECKS = [
  {
    id: 'repo-exists',
    name: 'Repository Exists',
    description: 'GitHub repository is created and accessible',
    severity: 'critical'
  },
  {
    id: 'branch-used',
    name: 'Branch Workflow',
    description: 'Work done on feature branch, not main',
    severity: 'critical'
  },
  {
    id: 'pr-opened',
    name: 'PR Opened',
    description: 'Pull request created for review',
    severity: 'critical'
  },
  {
    id: 'audit-artifacts',
    name: 'Audit Artifacts Present',
    description: 'Audit packet generated and available',
    severity: 'critical'
  },
  {
    id: 'no-secrets',
    name: 'No Secrets Committed',
    description: 'No API keys, tokens, or passwords in code',
    severity: 'critical'
  },
  {
    id: 'intent-exists',
    name: 'Intent Artifacts Exist',
    description: 'intent.md files present for context',
    severity: 'critical'
  },
  {
    id: 'dev-notes',
    name: 'DEV NOTES Present',
    description: 'All new/modified files have DEV NOTES',
    severity: 'critical'
  },
  {
    id: 'no-direct-main',
    name: 'No Direct Main Commits',
    description: 'Main branch only updated via merged PRs',
    severity: 'critical'
  }
]

// Mode B: Quality & Readiness (ADVISORY)
const MODE_B_CHECKS = [
  {
    id: 'prompt-clarity',
    name: 'Prompt Clarity',
    description: 'Prompts are clear, scoped, and actionable',
    weight: 15
  },
  {
    id: 'dev-notes-quality',
    name: 'DEV NOTES Quality',
    description: 'DEV NOTES explain why, not just what',
    weight: 15
  },
  {
    id: 'compatibility-notes',
    name: 'Compatibility Notes',
    description: 'Compatibility considerations documented',
    weight: 15
  },
  {
    id: 'documentation',
    name: 'Documentation Completeness',
    description: 'README, CHANGELOG, and docs are current',
    weight: 15
  },
  {
    id: 'takeover-ready',
    name: 'Enterprise Takeover Ready',
    description: 'New team could take over without original developer',
    weight: 20
  },
  {
    id: 'code-style',
    name: 'Code Style Consistency',
    description: 'Consistent formatting and naming conventions',
    weight: 10
  },
  {
    id: 'accessibility',
    name: 'Accessibility Basics',
    description: 'Basic accessibility requirements met',
    weight: 10
  }
]

export default function AuditScorePage() {
  const { isSubscribed } = useSubscription()
  const [showRunModal, setShowRunModal] = useState(false)
  const [projectPath, setProjectPath] = useState('')

  // Mock results (Phase 1.2: static placeholders)
  const [hasResults, setHasResults] = useState(false)
  const [modeAResults, setModeAResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({})
  const [modeBResults, setModeBResults] = useState<Record<string, number>>({})

  const handleRunAudit = () => {
    if (!isSubscribed) {
      setShowRunModal(true)
      return
    }
    // Phase 1.2: Simulate audit run
    const mockModeA: Record<string, 'pass' | 'fail' | 'pending'> = {}
    MODE_A_CHECKS.forEach(check => {
      mockModeA[check.id] = Math.random() > 0.2 ? 'pass' : 'fail'
    })
    
    const mockModeB: Record<string, number> = {}
    MODE_B_CHECKS.forEach(check => {
      mockModeB[check.id] = Math.floor(Math.random() * 100)
    })
    
    setModeAResults(mockModeA)
    setModeBResults(mockModeB)
    setHasResults(true)
  }

  const modeAScore = hasResults 
    ? Object.values(modeAResults).filter(v => v === 'pass').length 
    : null
  
  const modeATotal = MODE_A_CHECKS.length
  const modeAPassed = modeAScore === modeATotal

  const modeBScore = hasResults
    ? Math.round(
        MODE_B_CHECKS.reduce((sum, check) => {
          return sum + (modeBResults[check.id] || 0) * (check.weight / 100)
        }, 0)
      )
    : null

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Score</h1>
          <p className="text-gray-600">
            Governance compliance and quality assessment for your project.
          </p>
        </div>

        {/* Gating Banner */}
        <div className="mb-8">
          <GatingBanner />
        </div>

        {/* Mode Explanation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mode A Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  REQUIRED
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Mode A: Governance</h2>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              <strong>BLOCKS progress</strong> if any check fails. These are non-negotiable governance requirements.
            </p>
            <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
              Failing Mode A blocks deployment. Fix all issues before proceeding.
            </div>
          </div>

          {/* Mode B Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                  ADVISORY
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Mode B: Quality</h2>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              <strong>Never blocks</strong> progress. Quality signals help improve your project but are not required.
            </p>
            <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
              Mode B scores are advisory only. Low scores are informational, not blocking.
            </div>
          </div>
        </div>

        {/* Run Audit Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Run Audit</h2>
          <p className="text-gray-600 text-sm mb-4">
            Point to your local project directory to run governance and quality checks.
          </p>
          
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              placeholder="/path/to/your/project"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
            />
            <button 
              onClick={handleRunAudit}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                isSubscribed
                  ? 'bg-solo-accent text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              Run Audit
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Phase 1.2: Simulated audit for demonstration. Local CLI integration coming in Phase 2.
          </p>
        </div>

        {/* Results Section */}
        {hasResults ? (
          <div className="space-y-8">
            {/* Score Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Audit Results</h2>
                <span className="text-xs text-gray-500">
                  Generated: {new Date().toISOString()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Mode A Score */}
                <div className={`p-6 rounded-xl ${modeAPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${modeAPassed ? 'text-green-600' : 'text-red-600'}`}>
                      {modeAScore}/{modeATotal}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Mode A: Governance</div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      modeAPassed 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {modeAPassed ? '✓ PASSED — Ready to proceed' : '✗ BLOCKED — Fix required issues'}
                    </span>
                  </div>
                </div>

                {/* Mode B Score */}
                <div className="p-6 rounded-xl bg-gray-50">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-700 mb-2">
                      {modeBScore}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Mode B: Quality (0-100)</div>
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                      Advisory only — Does not block
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode A Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mode A: Governance Checks</h3>
              <div className="space-y-3">
                {MODE_A_CHECKS.map(check => (
                  <div 
                    key={check.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      modeAResults[check.id] === 'pass' 
                        ? 'bg-green-50' 
                        : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        modeAResults[check.id] === 'pass'
                          ? 'bg-green-200 text-green-700'
                          : 'bg-red-200 text-red-700'
                      }`}>
                        {modeAResults[check.id] === 'pass' ? '✓' : '✗'}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{check.name}</div>
                        <div className="text-sm text-gray-500">{check.description}</div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      modeAResults[check.id] === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {modeAResults[check.id] === 'pass' ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode B Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mode B: Quality Signals</h3>
              <div className="space-y-3">
                {MODE_B_CHECKS.map(check => (
                  <div key={check.id} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{check.name}</div>
                        <div className="text-sm text-gray-500">{check.description}</div>
                      </div>
                      <span className="text-lg font-semibold text-gray-700">
                        {modeBResults[check.id] || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-solo-accent rounded-full h-2 transition-all"
                        style={{ width: `${modeBResults[check.id] || 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Weight: {check.weight}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Prompts</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate prompts to fix issues or request human review of the audit.
              </p>
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-4 py-3 bg-solo-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Generate Fix Prompt (Claude)
                </button>
                <button 
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Generate Review Prompt (ChatGPT)
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Results will be timestamped and logged in future versions.
              </p>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Audit Results Yet</h3>
            <p className="text-gray-500 mb-6">
              Run an audit to see governance compliance and quality scores.
            </p>
            <button
              onClick={handleRunAudit}
              className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Run Your First Audit
            </button>
          </div>
        )}

        {/* ================================================
            Phase 1.3b: Sustain the Stack (post-audit)
            Shows only after results exist. Optional, never
            affects features or scores.
            ================================================ */}
        {hasResults && modeAPassed && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                OPTIONAL
              </span>
              <h3 className="text-xl font-bold text-gray-900">Sustain the Stack</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your project passed governance. If Solo Stack Method helped you ship, 
              consider an optional contribution to keep the tools and governance system maintained.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 space-y-1">
              <p>• This is entirely voluntary — it never unlocks features.</p>
              <p>• It never affects your audit score.</p>
              <p>• It is not required for any functionality.</p>
              <p className="text-xs italic mt-2">Payment integration coming in a future phase. Copy-only placeholder.</p>
            </div>
          </div>
        )}

        {/* ================================================
            Phase 1.3b: Future Local Build Mode placeholder
            ================================================ */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              COMING SOON
            </span>
            <h3 className="text-lg font-bold text-gray-900">Local Build Mode</h3>
          </div>
          <p className="text-gray-600 text-sm">
            In a future version, the build will happen locally on your computer. You'll develop with AI agents 
            on your own machine, then upload your project for audit scoring. This keeps your code private 
            during development and only exposes it during the governed review process.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Phase 1.3b placeholder — no implementation yet.
          </p>
        </div>

        {/* Rubric Documentation */}
        <div className="mt-12 bg-slate-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Audit Rubric</h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <h3 className="text-lg font-semibold text-gray-800">Mode A: Governance (Required)</h3>
            <p>
              Mode A checks are <strong>non-negotiable</strong>. Failing any Mode A check blocks 
              deployment and requires immediate remediation. These checks ensure your project 
              follows the Solo Stack governance model.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6">Mode B: Quality (Advisory)</h3>
            <p>
              Mode B checks are <strong>informational only</strong>. They never block progress. 
              Low Mode B scores indicate areas for improvement but do not prevent deployment. 
              Focus on Mode B after Mode A passes.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6">Scoring</h3>
            <ul>
              <li><strong>Mode A:</strong> Pass/Fail per check. All must pass to proceed.</li>
              <li><strong>Mode B:</strong> 0-100 weighted average. Higher is better but not required.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      {showRunModal && !isSubscribed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Score Access</h2>
            <p className="text-gray-600 mb-6">
              Viewing is free. Acting requires a subscription.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-solo-primary mb-1">$20</div>
              <div className="text-gray-500 mb-4">per month</div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Run unlimited audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Generate fix prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Full execution access</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                href="/signup"
                className="block w-full py-3 bg-solo-accent text-white text-center rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Subscribe Now
              </Link>
              <button
                onClick={() => setShowRunModal(false)}
                className="block w-full py-3 text-gray-600 text-center hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
