/*
 * DEV NOTES / Intent:
 * - Why: Root layout wraps all pages, provides global context
 * - Phase 1: Basic HTML structure, metadata, global CSS
 * - Phase 1.2: Added ClientProviders for subscription state
 * - Phase 2+: Add auth provider, analytics
 * 
 * Compatibility:
 * - Metadata stays server-side (Next.js requirement)
 * - Client providers handle subscription/auth state
 * - All child routes inherit this layout
 */

import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '../components/ClientProviders'

export const metadata: Metadata = {
  title: 'Solo Stack Method™ — Build real software with AI',
  description: 'Build real software with AI — without losing control, from idea to deployment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
