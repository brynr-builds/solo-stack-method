/*
 * DEV NOTES / Intent:
 * - Admin layout wraps all /admin/* routes with navigation
 * - Auth is enforced by middleware (server-side). No client bypass.
 * - Only reached when session is valid (except /admin/login, /admin/setup which have no layout chrome)
 */

'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  if (pathname === '/admin/enter-email' || pathname === '/admin/login' || pathname === '/admin/setup') {
    return <>{children}</>
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
    { href: '/admin/config', label: 'Configure', icon: '⚙️' },
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
            <form action="/api/admin/logout" method="POST" className="inline">
              <button type="submit" className="text-sm text-gray-300 hover:text-white">
                Sign out
              </button>
            </form>
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
