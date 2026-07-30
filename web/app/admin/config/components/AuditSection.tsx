'use client'

import React from 'react'
import { AdminConfig } from '../../../../components/MockData'

interface AuditSectionProps {
  config: AdminConfig
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>
}

export function AuditSection({ config, setConfig }: AuditSectionProps) {
  return (
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
  )
}
