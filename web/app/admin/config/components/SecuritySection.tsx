'use client'

import React from 'react'

interface SecuritySectionProps {
  passkeySuccess: boolean
  passkeyError: string
  passkeyLoading: boolean
  onAddPasskey: () => void
}

export function SecuritySection({
  passkeySuccess,
  passkeyError,
  passkeyLoading,
  onAddPasskey
}: SecuritySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Passkey (Biometrics)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add a passkey to sign in with TouchID, FaceID, or a security key instead of the setup secret.
      </p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md">
        {passkeySuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            Passkey added successfully. You can now sign in with biometrics.
          </div>
        )}
        {passkeyError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {passkeyError}
          </div>
        )}
        <button
          onClick={onAddPasskey}
          disabled={passkeyLoading}
          className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {passkeyLoading ? 'Registering passkey...' : 'Add Passkey'}
        </button>
        {passkeyLoading && (
          <p className="mt-3 text-sm text-gray-500">
            Look for the TouchID/FaceID prompt—it may appear behind this window.
          </p>
        )}
      </div>
    </div>
  )
}
