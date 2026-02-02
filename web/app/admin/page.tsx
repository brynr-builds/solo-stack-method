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
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import AdminGuard from '../../components/AdminGuard'
import {
  MOCK_SYSTEM_HEALTH,
  MOCK_PROCESS_METRICS,
  MOCK_PRODUCT_ANALYTICS,
} from '../../components/MockData'

// "Ask the System" example prompts
const INSIGHT_PROMPTS = [
  'Why are users failing Step 4?',
  'What changed after Prompt v1.4?',
  'Where should I improve next?',
  'Which users are most at risk of churning?',
  'What is the most common governance failure?',
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'health' | 'process' | 'analytics' | 'insights'>('health')
  const [insightQuery, setInsightQuery] = useState('')
  const [insightResult, setInsightResult] = useState<string | null>(null)

  const health = MOCK_SYSTEM_HEALTH
  const process = MOCK_PROCESS_METRICS
  const analytics = MOCK_PRODUCT_ANALYTICS

  const handleInsightQuery = () => {
    if (!insightQuery.trim()) return
    // Phase 1.3: Simulated AI response
    setInsightResult(
      `[Phase 1.3 Placeholder]\n\nAnalysis for: "${insightQuery}"\n\n` +
      `Based on current mock data:\n` +
      `• ${health.activeUsers} active users across ${Object.keys(health.usersByStep).length} steps\n` +
      `• Drop-off is highest at Step 3 (${process.dropOffByStep[3]}% leave)\n` +
      `• Top governance failure: "${process.topGovernanceFailures[0].reason}" (${process.topGovernanceFailures[0].count} occurrences)\n` +
      `• Audit pass rate: ${health.auditPassRate}%\n\n` +
      `Recommendation: Focus on reducing Step 3 friction and improving DEV NOTES compliance.\n\n` +
      `[This is a simulated response. Real AI analysis coming in Phase 2.]`
    )
  }

  return (
    <AdminGuard>
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

          {/* ============ SYSTEM HEALTH TAB ============ */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-primary">{health.activeUsers}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Users</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-success">{health.shippedAtLeastOnce}</div>
                  <div className="text-sm text-gray-600 mt-1">Shipped At Least Once</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-accent">{health.auditPassRate}%</div>
                  <div className="text-sm text-gray-600 mt-1">Audit Pass Rate</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-gray-700">{Math.round((health.shippedAtLeastOnce / health.totalUsers) * 100)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Ship Rate</div>
                </div>
              </div>

              {/* Users by Step */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Step</h3>
                <div className="space-y-3">
                  {Object.entries(health.usersByStep).map(([step, count]) => (
                    <div key={step} className="flex items-center gap-4">
                      <span className="w-20 text-sm text-gray-600">Step {step}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className="bg-solo-accent rounded-full h-6 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((count / health.activeUsers) * 100, 8)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ PROCESS EFFECTIVENESS TAB ============ */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Drop-off by Step */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Drop-off by Step (%)</h3>
                  <div className="space-y-3">
                    {Object.entries(process.dropOffByStep).map(([step, pct]) => (
                      <div key={step} className="flex items-center gap-4">
                        <span className="w-20 text-sm text-gray-600">Step {step}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                          <div
                            className="bg-red-400 rounded-full h-5 flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(pct * 2, 8)}%` }}
                          >
                            <span className="text-xs text-white font-medium">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avg Time per Step */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Avg Time per Step</h3>
                  <div className="space-y-3">
                    {Object.entries(process.avgTimePerStep).map(([step, time]) => (
                      <div key={step} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600">Step {step}</span>
                        <span className="text-sm font-mono font-medium text-gray-900">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Governance Failures */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Top Governance Failures</h3>
                  <span className="text-sm text-gray-500">Avg audit iterations: {process.avgAuditIterations}</span>
                </div>
                <div className="space-y-3">
                  {process.topGovernanceFailures.map((failure, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-gray-800">{failure.reason}</span>
                      <span className="text-sm font-bold text-red-600">{failure.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ PRODUCT ANALYTICS TAB ============ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-primary">{analytics.dau}</div>
                  <div className="text-sm text-gray-600 mt-1">DAU</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-accent">{analytics.wau}</div>
                  <div className="text-sm text-gray-600 mt-1">WAU</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-solo-success">{analytics.freeToConversion}%</div>
                  <div className="text-sm text-gray-600 mt-1">Free → Paid</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl font-bold text-gray-700">{analytics.promptGenerationCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">Prompts Generated</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Daily Signups */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Signups (Last 7 Days)</h3>
                  <div className="space-y-2">
                    {analytics.signupsDaily.map(day => (
                      <div key={day.date} className="flex items-center gap-4">
                        <span className="w-24 text-xs text-gray-500 font-mono">{day.date.slice(5)}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                          <div
                            className="bg-solo-accent rounded-full h-5"
                            style={{ width: `${(day.count / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{day.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Score Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Audit Score Distribution</h3>
                  <div className="space-y-2">
                    {analytics.auditScoreDistribution.map(bucket => (
                      <div key={bucket.range} className="flex items-center gap-4">
                        <span className="w-16 text-xs text-gray-500">{bucket.range}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                          <div
                            className="bg-solo-success rounded-full h-5"
                            style={{ width: `${(bucket.count / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{bucket.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Signups */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Signups</h3>
                <div className="flex items-end gap-4 h-40">
                  {analytics.signupsWeekly.map(week => (
                    <div key={week.week} className="flex-1 flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-700 mb-1">{week.count}</span>
                      <div
                        className="w-full bg-solo-accent rounded-t-lg"
                        style={{ height: `${(week.count / 80) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{week.week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ ASK THE SYSTEM TAB ============ */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ask the System</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Query your system data using natural language. AI summarizes — never executes or mutates.
                </p>
                <p className="text-xs text-amber-600 mb-4">
                  Phase 1.3: Simulated responses. Real AI integration in Phase 2.
                </p>

                {/* Example prompts */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500 block mb-2">Try these:</span>
                  <div className="flex flex-wrap gap-2">
                    {INSIGHT_PROMPTS.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => setInsightQuery(prompt)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Query input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={insightQuery}
                    onChange={(e) => setInsightQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInsightQuery()}
                    placeholder="Ask about your system..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
                  />
                  <button
                    onClick={handleInsightQuery}
                    className="px-6 py-3 bg-solo-primary text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ask
                  </button>
                </div>
              </div>

              {/* Result */}
              {insightResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">AI Analysis</h4>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">
                    {insightResult}
                  </pre>
                  <p className="text-xs text-gray-400 mt-3">
                    This output is read-only. No actions were taken. No data was modified.
                  </p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </AdminGuard>
  )
}
