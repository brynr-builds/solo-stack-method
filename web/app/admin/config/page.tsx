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
import { startRegistration, WebAuthnAbortService, WebAuthnError } from '@simplewebauthn/browser'
import { DEFAULT_ADMIN_CONFIG, AdminConfig } from '../../../components/MockData'
import { SecuritySection } from './components/SecuritySection'
import { ProcessSection } from './components/ProcessSection'
import { GatingSection } from './components/GatingSection'
import { AuditSection } from './components/AuditSection'
import { PromptsSection } from './components/PromptsSection'
import { MonetizationSection } from './components/MonetizationSection'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG)
  const [activeSection, setActiveSection] = useState<'security' | 'process' | 'gating' | 'audit' | 'prompts' | 'monetization'>('security')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [passkeyError, setPasskeyError] = useState('')
  const [passkeySuccess, setPasskeySuccess] = useState(false)

  const handleSave = () => {
    // Phase 1.3: No real persistence
    setSaveMessage('Config saved to session. (Phase 1.3: No persistence — resets on reload.)')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleAddPasskey = async () => {
    setPasskeyLoading(true)
    setPasskeyError('')
    setPasskeySuccess(false)
    try {
      const beginRes = await fetch('/api/admin/passkey/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include',
      })
      if (!beginRes.ok) {
        const data = await beginRes.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to start registration')
      }
      const options = await beginRes.json()

      const credential = await startRegistration({ optionsJSON: options })

      const finishRes = await fetch('/api/admin/passkey/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: credential }),
        credentials: 'include',
      })

      if (!finishRes.ok) {
        const data = await finishRes.json().catch(() => ({}))
        throw new Error(data.error || 'Verification failed')
      }

      setPasskeySuccess(true)
    } catch (err) {
      WebAuthnAbortService.cancelCeremony()
      if (err instanceof WebAuthnError) {
        if (err.code === 'ERROR_CEREMONY_ABORTED') {
          setPasskeyError('Registration was cancelled.')
        } else {
          setPasskeyError(err.message || 'Passkey registration failed')
        }
      } else {
        setPasskeyError(err instanceof Error ? err.message : 'Failed to add passkey')
      }
    } finally {
      setPasskeyLoading(false)
    }
  }

  return (
    <>
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
              { id: 'security' as const, label: 'Security' },
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

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <SecuritySection
              passkeySuccess={passkeySuccess}
              passkeyError={passkeyError}
              passkeyLoading={passkeyLoading}
              onAddPasskey={handleAddPasskey}
            />
          )}

          {/* PROCESS SECTION */}
          {activeSection === 'process' && (
            <ProcessSection config={config} setConfig={setConfig} />
          )}

          {/* GATING COPY SECTION */}
          {activeSection === 'gating' && (
            <GatingSection config={config} setConfig={setConfig} />
          )}

          {/* AUDIT RULES SECTION */}
          {activeSection === 'audit' && (
            <AuditSection config={config} setConfig={setConfig} />
          )}

          {/* PROMPT TEMPLATES SECTION */}
          {activeSection === 'prompts' && (
            <PromptsSection />
          )}

          {/* MONETIZATION SECTION */}
          {activeSection === 'monetization' && (
            <MonetizationSection config={config} setConfig={setConfig} />
          )}

        </main>
      </div>
    </>
  )
}
