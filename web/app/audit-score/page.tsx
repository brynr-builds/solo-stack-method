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
import { ModeCards } from './components/ModeCards'
import { RunAuditSection } from './components/RunAuditSection'
import { AuditResults } from './components/AuditResults'
import { EmptyState } from './components/EmptyState'
import { RubricDocumentation } from './components/RubricDocumentation'
import { SubscriptionModal } from './components/SubscriptionModal'

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
        <ModeCards />

        {/* Run Audit Section */}
        <RunAuditSection
          projectPath={projectPath}
          setProjectPath={setProjectPath}
          handleRunAudit={handleRunAudit}
          isSubscribed={isSubscribed}
        />

        {/* Results Section */}
        {hasResults ? (
          <AuditResults
            modeAPassed={modeAPassed}
            modeAScore={modeAScore}
            modeATotal={modeATotal}
            modeBScore={modeBScore}
            modeAResults={modeAResults}
            modeBResults={modeBResults}
            MODE_A_CHECKS={MODE_A_CHECKS}
            MODE_B_CHECKS={MODE_B_CHECKS}
          />
        ) : (
          /* Empty State */
          <EmptyState handleRunAudit={handleRunAudit} />
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
            In a future version, the build will happen locally on your computer. You&apos;ll develop with AI agents
            on your own machine, then upload your project for audit scoring. This keeps your code private 
            during development and only exposes it during the governed review process.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Phase 1.3b placeholder — no implementation yet.
          </p>
        </div>

        {/* Rubric Documentation */}
        <RubricDocumentation />
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        showRunModal={showRunModal}
        isSubscribed={isSubscribed}
        setShowRunModal={setShowRunModal}
      />
    </div>
  )
}
