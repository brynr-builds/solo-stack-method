/*
 * DEV NOTES / Intent:
 * - Why: Subscription-based execution gating (UI + logic)
 * - FREE: Marketing, Pulse (read-only), explanations, non-executable examples
 * - PAID: Execution prompts, audit prompts, context continuation, prompt history
 * - Phase 1.2: UI + state logic only, NO Stripe integration
 * - Phase 2+: Stripe payment integration
 * 
 * Gating States:
 * - Logged out → view only
 * - Logged in (no sub) → steps visible but locked
 * - Active subscription → execution unlocked
 * 
 * Locked Copy: "Viewing is free. Acting requires a subscription."
 * 
 * Compatibility:
 * - Wraps gated content without breaking layout
 * - Does not depend on external auth (Phase 1.2)
 * - Placeholder for Stripe/Supabase integration
 */

'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import Link from 'next/link'

// Subscription context for app-wide state
interface SubscriptionContextType {
  isLoggedIn: boolean
  isSubscribed: boolean
  setLoggedIn: (value: boolean) => void
  setSubscribed: (value: boolean) => void
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isLoggedIn: false,
  isSubscribed: false,
  setLoggedIn: () => {},
  setSubscribed: () => {}
})

export function useSubscription() {
  return useContext(SubscriptionContext)
}

// Provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // Phase 1.2: Simulated state (localStorage in Phase 2)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [isSubscribed, setSubscribed] = useState(false)

  return (
    <SubscriptionContext.Provider value={{ isLoggedIn, isSubscribed, setLoggedIn, setSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// Gate component props
interface SubscriptionGateProps {
  children: ReactNode
  feature: 'execution-prompt' | 'audit-prompt' | 'context-continuation' | 'prompt-history' | 'audit-score'
  fallback?: ReactNode
}

// Main gate component
export default function SubscriptionGate({ children, feature, fallback }: SubscriptionGateProps) {
  const { isLoggedIn, isSubscribed } = useSubscription()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // If subscribed, show content
  if (isSubscribed) {
    return <>{children}</>
  }

  // Feature-specific messaging
  const featureLabels: Record<string, string> = {
    'execution-prompt': 'Execution Prompts',
    'audit-prompt': 'Audit Prompts',
    'context-continuation': 'Context Continuation',
    'prompt-history': 'Prompt History',
    'audit-score': 'Audit Score Access'
  }

  const handleUnlock = () => {
    setShowUpgradeModal(true)
  }

  return (
    <>
      {/* Gated content with overlay */}
      <div className="relative">
        {/* Blurred/locked content preview */}
        <div className="opacity-50 pointer-events-none select-none">
          {fallback || children}
        </div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{featureLabels[feature]} Locked</h3>
            <p className="text-sm text-gray-600 mb-4">
              Viewing is free. Acting requires a subscription.
            </p>
            <button
              onClick={handleUnlock}
              className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Unlock for $20/month
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Full Access</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-solo-primary mb-1">$20</div>
              <div className="text-gray-500 mb-4">per month</div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Execution prompts for all 7 steps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Audit prompts (ChatGPT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Context continuation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Prompt version history</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Audit Score system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Enterprise-takeover-ready output</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                href="/signup"
                className="block w-full py-3 bg-solo-accent text-white text-center rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Start Building — $20/month
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="block w-full py-3 text-gray-600 text-center hover:text-gray-900 transition-colors"
              >
                Maybe later
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

// Simple lock icon for inline use
export function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

// Gating status banner
export function GatingBanner() {
  const { isLoggedIn, isSubscribed } = useSubscription()

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
        <span className="text-green-700 font-medium">✓ Full access unlocked</span>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <span className="text-amber-700">
          <strong>Viewing mode.</strong> Subscribe to unlock execution.
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
      <span className="text-gray-600">
        Viewing is free. Acting requires a subscription.
      </span>
    </div>
  )
}
