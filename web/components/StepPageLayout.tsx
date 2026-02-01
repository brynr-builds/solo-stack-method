/*
 * DEV NOTES / Intent:
 * - Why: Shared layout for all 7 step pages with consistent structure
 * - Governance visibility is PRODUCT LOGIC, not decoration
 *   → Users must see who builds, who audits, and current state
 *   → This builds trust and teaches the workflow even for non-technical users
 * - Phase 1.2: Added PromptGenerator and SubscriptionGate integration
 * - Phase 2+: Dynamic state from context system
 * 
 * Compatibility: 
 * - Used by all /steps/[n]/page.tsx routes
 * - Props interface supports both simple (children) and task-based usage
 * - PromptGenerator and GatingBanner are optional enhancements
 * - Existing step pages continue to work without modification
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import PromptGenerator from './PromptGenerator'
import { useSubscription, GatingBanner } from './SubscriptionGate'

interface StepPageLayoutProps {
  stepNumber: number
  title: string
  description: string
  children?: React.ReactNode
  // Extended props for task-based steps
  agent?: string
  agentRole?: string
  tasks?: string[]
  initialMessage?: string
  // Phase 1.2: Intent summary for prompt generation
  intentSummary?: string
}

export default function StepPageLayout({ 
  stepNumber, 
  title, 
  description, 
  children,
  agent,
  agentRole,
  tasks,
  initialMessage,
  intentSummary
}: StepPageLayoutProps) {
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage || `I'm ready to help you with ${title}. What would you like to know?` }
  ])
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  // Get subscription state (defaults to false in Phase 1.2)
  const { isSubscribed } = useSubscription()

  const handleSend = () => {
    if (!chatInput.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: chatInput }])
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "This is a Phase 1 placeholder. Real AI integration coming in Phase 2." 
      }])
    }, 500)
    setChatInput('')
  }

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
        {/* Gating Status Banner */}
        <div className="mb-6">
          <GatingBanner />
        </div>

        {/* ============================================
            PROMPT GENERATION SECTION (Phase 1.2)
            Core differentiator - governed AI prompts
            ============================================ */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-solo-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Governed Prompt Generation
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Generate step-scoped prompts for execution (Claude) and audit (ChatGPT). 
            Prompts are versioned, governed, and copy/paste ready.
          </p>
          <PromptGenerator
            stepNumber={stepNumber}
            stepTitle={title}
            intentSummary={intentSummary || description}
            isSubscribed={isSubscribed}
            onSubscriptionRequired={() => setShowSubscriptionModal(true)}
          />
        </div>

        {children ? (
          children
        ) : (
          /* Task-based layout for steps 2-7 */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Info */}
            <div className="space-y-6">
              {/* Agent Info */}
              {agent && (
                <div className="card">
                  <h2 className="text-lg font-semibold mb-2">Current Agent</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-solo-accent text-white flex items-center justify-center font-bold">
                      {agent.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{agent}</div>
                      {agentRole && <div className="text-sm text-gray-500">{agentRole}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks */}
              {tasks && tasks.length > 0 && (
                <div className="card">
                  <h2 className="text-lg font-semibold mb-4">Tasks for this Step</h2>
                  <ul className="space-y-3">
                    {tasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - AI Chat */}
            <div className="card flex flex-col h-[500px]">
              <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      msg.role === 'assistant'
                        ? 'bg-blue-50 text-gray-800'
                        : 'bg-gray-100 text-gray-800 ml-8'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about this step..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-solo-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
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

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Required</h2>
            <p className="text-gray-600 mb-6">
              Viewing is free. Acting requires a subscription.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-solo-primary mb-1">$20</div>
              <div className="text-gray-500 mb-4">per month</div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Full prompt generation access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Audit prompts included</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Audit Score system</span>
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
                onClick={() => setShowSubscriptionModal(false)}
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
