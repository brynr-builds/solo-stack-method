/*
 * DEV NOTES:
 * - Why: Root layout wraps all pages, provides global context
 * - Phase 1: Basic HTML structure, metadata, global CSS
 * - Phase 2+: Auth provider, context providers, analytics
 */

import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
