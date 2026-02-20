/*
 * DEV NOTES / Intent:
 * - Why: Admin-only access control for /admin routes
 * - Phase 1.3: Mocked flag (isAdmin state), NO real auth provider
 * - Phase 2+: Replace with Supabase Auth role check
 * 
 * What this does NOT do:
 * - No real authentication
 * - No role-based access control backend
 * - No session management
 * - No JWT/token verification
 *
 * Compatibility:
 * - Uses React context, same pattern as SubscriptionGate
 * - Does not interfere with existing providers
 * - Can be wrapped inside ClientProviders
 */

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Link from 'next/link'

interface AdminContextType {
  isAdmin: boolean
  setAdmin: (value: boolean) => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setAdmin: () => {},
})

export function useAdmin() {
  return useContext(AdminContext)
}

export function AdminProvider({ children }: { children: ReactNode }) {
  // Phase 1.3: Simulated admin state
  const [isAdmin, setAdmin] = useState(false)
  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

interface AdminGuardProps {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, setAdmin } = useAdmin()

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            This area is restricted to the project owner.
          </p>
          <Link
            href="/dashboard"
            className="text-solo-accent hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
