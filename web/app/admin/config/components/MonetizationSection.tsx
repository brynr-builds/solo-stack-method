'use client'

import React from 'react'
import { AdminConfig } from '../../../../components/MockData'

interface MonetizationSectionProps {
  config: AdminConfig
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>
}

export function MonetizationSection({ config, setConfig }: MonetizationSectionProps) {
  return (
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
  )
}
