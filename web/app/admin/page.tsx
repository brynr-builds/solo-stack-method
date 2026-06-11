/*
 * DEV NOTES / Intent:
 * - Why: Admin dashboard for owner visibility into system health, 
 *   process effectiveness, product analytics, and AI insights
 * - Phase 1.3: All data is MOCKED — no database, no analytics provider
 * - Phase 2+: Real data from Supabase, PostHog/Mixpanel, server analytics
 *
 * What this does NOT do:
 * - No real data collection or storage
 * - No external analytics integration
 * - No background processing
 * - No real AI API calls (Ask the System is placeholder)
 *
 * Compatibility:
 * - New route (/admin), does not affect existing routes
 * - Uses AdminGuard for access control (mocked)
 * - Imports MockData for all displayed values
 *
 * Phase 1.3b ADDITIONS (2026-02-02):
 * - Future Local Build Mode: admin-facing placeholder for upcoming local-first analytics
 * - Additive only, no existing content modified
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  MOCK_SYSTEM_HEALTH,
  MOCK_PROCESS_METRICS,
  MOCK_PRODUCT_ANALYTICS,
} from '../../components/MockData'
import { SystemHealthTab } from './components/SystemHealthTab'
import { ProcessEffectivenessTab } from './components/ProcessEffectivenessTab'
import { ProductAnalyticsTab } from './components/ProductAnalyticsTab'
import { AskTheSystemTab } from './components/AskTheSystemTab'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'health' | 'process' | 'analytics' | 'insights'>('health')

  const health = MOCK_SYSTEM_HEALTH
  const process = MOCK_PROCESS_METRICS
  const analytics = MOCK_PRODUCT_ANALYTICS

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-bold text-solo-primary">
                  Solo Stack Method™
                </Link>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ADMIN</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-solo-accent font-medium">Dashboard</Link>
                <Link href="/admin/clients" className="text-gray-600 hover:text-solo-primary">CRM</Link>
                <Link href="/admin/config" className="text-gray-600 hover:text-solo-primary">Config</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-solo-primary">← User View</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">System health, process metrics, and product analytics.</p>
            <p className="text-xs text-amber-600 mt-1">Phase 1.3 — All data is mocked. No real analytics.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {[
              { id: 'health' as const, label: 'System Health' },
              { id: 'process' as const, label: 'Process Effectiveness' },
              { id: 'analytics' as const, label: 'Product Analytics' },
              { id: 'insights' as const, label: 'Ask the System' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-solo-accent text-solo-accent'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ============ TABS CONTENT ============ */}
          {activeTab === 'health' && <SystemHealthTab health={health} />}
          {activeTab === 'process' && <ProcessEffectivenessTab process={process} />}
          {activeTab === 'analytics' && <ProductAnalyticsTab analytics={analytics} />}
          {activeTab === 'insights' && <AskTheSystemTab health={health} process={process} />}

          {/* ================================================
              Phase 1.3b: Future Local Build Mode (admin view)
              ================================================ */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                PLANNED
              </span>
              <h3 className="text-lg font-bold text-gray-900">Future: Local Build Mode</h3>
            </div>
            <p className="text-gray-600 text-sm">
              In a future phase, users will build locally on their own machines and upload projects for 
              audit scoring. Admin analytics will then track upload-to-audit conversion, local build 
              completion rates, and audit pass rates across local vs. hosted builds.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Phase 1.3b placeholder — no implementation yet.
            </p>
          </div>

        </main>
      </div>
  )
}
