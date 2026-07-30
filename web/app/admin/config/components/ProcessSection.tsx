'use client'

import React from 'react'
import { AdminConfig } from '../../../../components/MockData'

interface ProcessSectionProps {
  config: AdminConfig
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>
}

export function ProcessSection({ config, setConfig }: ProcessSectionProps) {
  return (
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
  )
}
