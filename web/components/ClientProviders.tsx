/*
 * DEV NOTES / Intent:
 * - Why: Wraps client-side providers (subscription, auth) for the app
 * - Phase 1.2: SubscriptionProvider for gating state
 * - Phase 2+: Add Supabase auth, Stripe context
 * 
 * Compatibility:
 * - 'use client' required for context providers
 * - Does not affect server components
 * - Children render normally
 */

'use client'

import { ReactNode } from 'react'
import { SubscriptionProvider } from './SubscriptionGate'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SubscriptionProvider>
      {children}
    </SubscriptionProvider>
  )
}
