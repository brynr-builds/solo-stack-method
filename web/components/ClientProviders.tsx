/*
 * DEV NOTES / Intent:
 * - Why: Wraps client-side providers (subscription, auth, admin) for the app
 * - Phase 1.2: SubscriptionProvider for gating state
 * - Phase 1.3: Added AdminProvider for admin access control
 * - Phase 2+: Add Supabase auth, Stripe context
 * 
 * Compatibility:
 * - 'use client' required for context providers
 * - Does not affect server components
 * - Children render normally
 * - AdminProvider wraps outside SubscriptionProvider (no dependency)
 */

'use client'

import { ReactNode } from 'react'
import { SubscriptionProvider } from './SubscriptionGate'
import { AdminProvider } from './AdminGuard'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AdminProvider>
      <SubscriptionProvider>
        {children}
      </SubscriptionProvider>
    </AdminProvider>
  )
}
