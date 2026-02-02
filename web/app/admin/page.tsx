/*
 * DEV NOTES / Intent:
 * - Why: Admin dashboard showing system health, process effectiveness, product analytics
 * - What it does NOT do: No real metrics, no external analytics, no background jobs
 * - Phase 1.3: All metrics are mocked, UI shells only
 * - Phase 2+: Supabase queries, real-time analytics, charts library
 *
 * Sections:
 * 1. System Health — active users, step distribution, ship rate, audit pass rate
 * 2. Process Effectiveness — drop-off, avg time, audit iterations, governance failures
 * 3. Product Analytics — signups, DAU/WAU, conversion, prompt count, audit distribution
 * 4. Founder Insight AI — "Ask the System" panel (placeholder)
 *
 * Compatibility:
 * - Uses admin layout (layout.tsx)
 * - Imports from lib/mock-data.ts
 * - No external dependencies added
 */

'use client'

import { SYSTEM_HEALTH, PROCESS_METRICS, PRODUCT_ANALYTICS } from '../../lib/mock-data'
import { useState } from 'react'

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-solo-primary">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

// ─── Bar (simple CSS bar chart) ───────────────────────────
function Bar({ label, value, max, color = 'bg-solo-accent' }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 text-gray-600 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-medium text-gray-700">{value}</span>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-solo-primary">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function AdminDashboard() {
  const [insightQuery, setInsightQuery] = useState('')
  const [insightResult, setInsightResult] = useState<string | null>(null)

  const maxStepUsers = Math.max(...Object.values(SYSTEM_HEALTH.usersByStep))
  const maxDropOff = Math.max(...Object.values(PROCESS_METRICS.dropOffByStep))

  const handleAskSystem = () => {
    // Phase 1.3: Placeholder — no AI API call
    const placeholders: Record<string, string> = {
      'default': 'This is a placeholder response. In Phase 2+, this will query real analytics data and use AI to generate insights. No AI API calls are made in V1.',
    }
    setInsightResult(placeholders['default'])
  }

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-solo-primary">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview — all data is mocked (V1)</p>
      </div>

      {/* ─── SYSTEM HEALTH ─────────────────────────────── */}
      <section>
        <SectionHeader title="System Health" description="User activity and process completion" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Active Users" value={SYSTEM_HEALTH.activeUsers} sub={`of ${SYSTEM_HEALTH.totalUsers} total`} />
          <StatCard label="Shipped ≥1" value={`${Math.round((SYSTEM_HEALTH.shippedAtLeastOnce / SYSTEM_HEALTH.totalUsers) * 100)}%`} sub={`${SYSTEM_HEALTH.shippedAtLeastOnce} users`} />
          <StatCard label="Audit Pass Rate" value={`${SYSTEM_HEALTH.auditPassRate}%`} sub="across all steps" />
          <StatCard label="Avg Step" value={(Object.entries(SYSTEM_HEALTH.usersByStep).reduce((sum, [step, count]) => sum + Number(step) * count, 0) / SYSTEM_HEALTH.totalUsers).toFixed(1)} sub="weighted average" />
        </div>

        {/* Users by Step */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Users by Step</h3>
          <div className="space-y-2">
            {Object.entries(SYSTEM_HEALTH.usersByStep).map(([step, count]) => (
              <Bar key={step} label={`Step ${step}`} value={count} max={maxStepUsers} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS EFFECTIVENESS ─────────────────────── */}
      <section>
        <SectionHeader title="Process Effectiveness" description="Where users struggle and succeed" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Avg Audit Iterations" value={PROCESS_METRICS.avgAuditIterations} sub="per step" />
          <StatCard label="Biggest Drop-off" value="Step 4" sub={`${PROCESS_METRICS.dropOffByStep[4]}% leave`} />
          <StatCard label="Slowest Step" value="Step 4" sub={PROCESS_METRICS.avgTimePerStep[4]} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Drop-off by Step */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Drop-off by Step (%)</h3>
            <div className="space-y-2">
              {Object.entries(PROCESS_METRICS.dropOffByStep).map(([step, pct]) => (
                <Bar key={step} label={`Step ${step}`} value={pct} max={maxDropOff} color="bg-solo-warning" />
              ))}
            </div>
          </div>

          {/* Top Governance Failures */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Top Governance Failures</h3>
            <div className="space-y-3">
              {PROCESS_METRICS.topGovernanceFailures.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{f.rule}</span>
                  <span className="font-mono font-medium text-solo-danger">{f.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT ANALYTICS ─────────────────────────── */}
      <section>
        <SectionHeader title="Product Analytics" description="Growth and engagement metrics (aggregated)" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="DAU" value={PRODUCT_ANALYTICS.dau} />
          <StatCard label="WAU" value={PRODUCT_ANALYTICS.wau} />
          <StatCard label="Free → Paid" value={`${PRODUCT_ANALYTICS.freeToConversion}%`} sub="conversion rate" />
          <StatCard label="Prompts Generated" value={PRODUCT_ANALYTICS.promptGenerationCount} sub="all time" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Daily Signups */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Daily Signups (Last 7 days)</h3>
            <div className="space-y-2">
              {PRODUCT_ANALYTICS.signupsDaily.map(d => (
                <Bar key={d.date} label={d.date.slice(5)} value={d.count} max={10} color="bg-solo-success" />
              ))}
            </div>
          </div>

          {/* Audit Score Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Audit Score Distribution</h3>
            <div className="space-y-2">
              {PRODUCT_ANALYTICS.auditScoreDistribution.map(d => (
                <Bar key={d.range} label={d.range} value={d.count} max={3} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER INSIGHT AI ────────────────────────── */}
      <section>
        <SectionHeader title="Ask the System" description="AI-powered founder insights (placeholder — no API calls in V1)" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <div className="flex gap-2 mb-3 flex-wrap">
              {['Why are users failing Step 4?', 'What changed after Prompt v1.4?', 'Where should I improve next?'].map(q => (
                <button
                  key={q}
                  onClick={() => setInsightQuery(q)}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={insightQuery}
                onChange={e => setInsightQuery(e.target.value)}
                placeholder="Ask about your system, users, or process..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-solo-accent/30 focus:border-solo-accent"
              />
              <button
                onClick={handleAskSystem}
                disabled={!insightQuery.trim()}
                className="px-4 py-2 bg-solo-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Ask
              </button>
            </div>
          </div>

          {insightResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500">AI INSIGHT (PLACEHOLDER)</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{insightResult}</p>
              <p className="text-xs text-gray-400 mt-3">
                Phase 2+: Will query Supabase analytics and generate real insights via AI API.
                No actions are taken. No data is mutated. Read-only analysis only.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
