'use client'

import React from 'react'
import { AdminConfig } from '../../../../components/MockData'

interface GatingSectionProps {
  config: AdminConfig
  setConfig: React.Dispatch<React.SetStateAction<AdminConfig>>
}

export function GatingSection({ config, setConfig }: GatingSectionProps) {
  return (
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
  )
}
