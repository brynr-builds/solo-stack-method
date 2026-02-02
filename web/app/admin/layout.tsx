/*
 * DEV NOTES / Intent:
 * - Why: Admin layout wraps all /admin/* routes with navigation and access control
 * - What it does NOT do: No real auth check — uses mocked isAdmin flag
 * - Phase 1.3: UI shell only, admin state is simulated via React state
 * - Phase 2+: Replace with Supabase auth role check
 *
 * Compatibility:
 * - 'use client' for interactive admin nav
 * - Children render inside admin chrome
 * - Does not affect non-admin routes
 */

'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Phase 1.3: Mocked admin flag — no real auth
  const [isAdmin] = useState(true)
  const pathname = usePathname()

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">Admin access required.</p>
          <Link href="/dashboard" className="text-solo-accent hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
    { href: '/admin/configure', label: 'Configure', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Bar */}
      <nav className="bg-solo-primary text-white border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">
              SSM Admin
            </Link>
            <div className="flex gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    pathname === item.href
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
              V1 — Mocked Data
            </span>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">
              ← Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
