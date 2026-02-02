/*
 * DEV NOTES / Intent:
 * - Why: Admin configurability for process, prompts, gating, and monetization copy
 * - Admin changes are VISIBLE and EXPLAINABLE — no hidden settings
 * - Phase 1.3: Local state only, no persistence, no database
 * - Phase 2+: Persist to Supabase, version history, audit trail
 *
 * What this does NOT do:
 * - No real persistence (changes reset on reload)
 * - No API calls
 * - No Stripe configuration
 * - No auth role management
 *
 * What admin CAN adjust (V1):
 * - Step descriptions and order (display only)
 * - Gating copy
 * - Audit thresholds (Mode A: enable/disable checks)
 * - Advisory rules (Mode B: enable/disable, weight adjustment)
 * - Monetization messaging
 * - Prompt templates (view/edit, no versioning yet)
 *
 * Compatibility:
 * - New route (/admin/config), no impact on existing routes
 * - Config changes only affect this session (no persistence)
 * - Uses AdminGuard for access control
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import AdminGuard from '../../../components/AdminGuard'
import { DEFAULT_ADMIN_CONFIG, AdminConfig } from '../../../components/MockData'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG)
  const [activeSection, setActiveSection] = useState<'process' | 'gating' | 'audit' | 'prompts' | 'monetization'>('process')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSave = () => {
    // Phase 1.3: No real persistence
    setSaveMessage('Config saved to session. (Phase 1.3: No persistence — resets on reload.)')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-bold text-solo-primary">Solo Stack Method™</Link>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ADMIN</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-gray-600 hover:text-solo-primary">Dashboard</Link>
                <Link href="/admin/clients" className="text-gray-600 hover:text-solo-primary">CRM</Link>
                <Link href="/admin/config" className="text-solo-accent font-medium">Config</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-solo-primary">← User View</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Configuration</h1>
              <p className="text-gray-600">Adjust process, prompts, gating, and monetization copy.</p>
              <p className="text-xs text-amber-600 mt-1">Phase 1.3 — Changes are session-only. No persistence.</p>
            </div>
            <button onClick={handleSave} className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>

          {saveMessage && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{saveMessage}</div>
          )}

          {/* Section Navigation */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {[
              { id: 'process' as const, label: 'Process' },
              { id: 'gating' as const, label: 'Gating Copy' },
              { id: 'audit' as const, label: 'Audit Rules' },
              { id: 'prompts' as const, label: 'Prompt Templates' },
              { id: 'monetization' as const, label: 'Monetization' },
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-solo-accent text-solo-accent'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* PROCESS SECTION */}
          {activeSection === 'process' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Step Configuration</h2>
              <p className="text-sm text-gray-600 mb-4">Edit step titles and descriptions. Display order only — no structural changes in V1.</p>
              {config.steps.map((step, index) => (
                <div key={step.number} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-solo-accent text-white flex items-center justify-center text-sm font-bold">{step.number}</span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...config.steps]
                        updated[index] = { ...updated[index], title: e.target.value }
                        setConfig({ ...config, steps: updated })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm font-medium"
                    />
                  </div>
                  <textarea
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...config.steps]
                      updated[index] = { ...updated[index], description: e.target.value }
                      setConfig({ ...config, steps: updated })
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-600"
                  />
                </div>
              ))}
            </div>
          )}

          {/* GATING COPY SECTION */}
          {activeSection === 'gating' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Gating Copy</h2>
              <p className="text-sm text-gray-600 mb-4">Adjust the language shown to users when content is gated.</p>
              {Object.entries(config.gatingCopy).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setConfig({ ...config, gatingCopy: { ...config.gatingCopy, [key]: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* AUDIT RULES SECTION */}
          {activeSection === 'audit' && (
            <div className="space-y-6">
              {/* Mode A */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mode A: Governance (Blocking)</h2>
                <p className="text-sm text-gray-600 mb-4">Enable or disable governance checks. Disabled checks will not block progress.</p>
                <div className="space-y-2">
                  {config.auditThresholds.modeA.map((check, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4">
                      <span className="text-sm text-gray-800">{check.name}</span>
                      <button
                        onClick={() => {
                          const updated = [...config.auditThresholds.modeA]
                          updated[i] = { ...updated[i], enabled: !updated[i].enabled }
                          setConfig({ ...config, auditThresholds: { ...config.auditThresholds, modeA: updated } })
                        }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          check.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {check.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode B */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mode B: Quality (Advisory)</h2>
                <p className="text-sm text-gray-600 mb-4">Adjust weights and enable/disable advisory checks. These never block progress.</p>
                <div className="space-y-2">
                  {config.advisoryRules.modeB.map((rule, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-lg border border-gray-100 p-4">
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">{rule.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Weight:</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={rule.weight}
                          onChange={(e) => {
                            const updated = [...config.advisoryRules.modeB]
                            updated[i] = { ...updated[i], weight: parseInt(e.target.value) || 0 }
                            setConfig({ ...config, advisoryRules: { ...config.advisoryRules, modeB: updated } })
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updated = [...config.advisoryRules.modeB]
                          updated[i] = { ...updated[i], enabled: !updated[i].enabled }
                          setConfig({ ...config, advisoryRules: { ...config.advisoryRules, modeB: updated } })
                        }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROMPT TEMPLATES SECTION */}
          {activeSection === 'prompts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Prompt Templates</h2>
              <p className="text-sm text-gray-600 mb-4">
                View and edit execution and audit prompt templates. Changes affect prompt generation for all users.
              </p>
              <p className="text-xs text-amber-600 mb-4">Phase 1.3: No versioning. No active/inactive toggle. Edit-only preview.</p>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Execution Prompt Template (Claude)</h3>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono"
                  defaultValue={`You are Claude, the Builder Agent.\nStep: [STEP_NUMBER] — [STEP_TITLE]\nIntent: [INTENT_SUMMARY]\n\nExecute the following tasks:\n[TASKS]\n\nRules:\n- Work on feature branch only\n- Include DEV NOTES in every file\n- Do not merge to main`}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Audit Prompt Template (ChatGPT)</h3>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono"
                  defaultValue={`You are ChatGPT, the Auditor Agent.\nReview the PR for Step [STEP_NUMBER]: [STEP_TITLE]\n\nCheck:\n- Governance compliance (Mode A)\n- Quality signals (Mode B)\n- No secrets, no overbuild\n- DEV NOTES present\n\nProvide: APPROVE or REJECT with reasoning.`}
                />
              </div>
            </div>
          )}

          {/* MONETIZATION SECTION */}
          {activeSection === 'monetization' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Monetization Copy</h2>
              <p className="text-sm text-gray-600 mb-4">Adjust pricing copy, gating language, and sustain messaging.</p>
              {Object.entries(config.monetizationCopy).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                  {value.length > 80 ? (
                    <textarea
                      rows={3}
                      value={value}
                      onChange={(e) => setConfig({ ...config, monetizationCopy: { ...config.monetizationCopy, [key]: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setConfig({ ...config, monetizationCopy: { ...config.monetizationCopy, [key]: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </AdminGuard>
  )
}
