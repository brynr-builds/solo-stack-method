'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { startRegistration, WebAuthnAbortService, WebAuthnError } from '@simplewebauthn/browser'

const REGISTRATION_TIMEOUT_MS = 120_000

function AdminSetupForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') ?? ''
  const [email, setEmail] = useState('')
  const [setupSecret, setSetupSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmail(emailParam)
  }, [emailParam])

  useEffect(() => {
    return () => {
      WebAuthnAbortService.cancelCeremony()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !setupSecret) {
      setError('Email and setup secret are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const beginRes = await fetch('/api/admin/setup/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret }),
      })
      if (!beginRes.ok) {
        const data = await beginRes.json().catch(() => ({}))
        throw new Error(data.error || 'Setup failed')
      }
      const options = await beginRes.json()

      const credential = await Promise.race([
        startRegistration({ optionsJSON: options }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Passkey prompt timed out. Look for a TouchID/FaceID or security key prompt—it may be behind the browser window. Try again.')),
            REGISTRATION_TIMEOUT_MS
          )
        ),
      ])

      const finishRes = await fetch('/api/admin/setup/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret, response: credential }),
      })
      const finishData = await finishRes.json()

      if (!finishRes.ok) {
        throw new Error(finishData.error || 'Verification failed')
      }

      if (finishData.backupCodes?.length) {
        setBackupCodes(finishData.backupCodes)
      } else {
        window.location.href = finishData.redirectTo || '/admin'
      }
    } catch (err) {
      WebAuthnAbortService.cancelCeremony()
      if (err instanceof WebAuthnError) {
        if (err.code === 'ERROR_CEREMONY_ABORTED') {
          setError('Passkey registration was cancelled.')
        } else if (err.message?.includes('NotAllowedError') || err.name === 'NotAllowedError') {
          setError('Passkey prompt was dismissed or timed out. Try again and complete the TouchID/FaceID prompt.')
        } else {
          setError(err.message || 'Passkey registration failed')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Setup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToAdmin = () => {
    window.location.href = '/admin'
  }

  const handleCopyCodes = async () => {
    if (!backupCodes) return
    await navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (backupCodes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Backup Codes</h1>
            <p className="text-sm text-gray-600 mb-4">
              Store these codes securely. They cannot be shown again. Each code can only be used once.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1 mb-4">
              {backupCodes.map((code, i) => (
                <div key={i}>{code}</div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyCodes}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleContinueToAdmin}
                className="flex-1 btn-primary"
              >
                Continue to Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-solo-primary">
            Solo Stack Method™
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Create your admin account and register a passkey</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup Secret</label>
              <input
                type="password"
                value={setupSecret}
                onChange={(e) => setSetupSecret(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none transition-colors"
                placeholder="Enter setup secret"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering passkey...' : 'Create Admin + Register Passkey'}
            </button>
            {loading && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm text-gray-500 text-center">
                  Look for the TouchID/FaceID prompt—it may appear behind this window.
                </p>
                <button
                  type="button"
                  onClick={() => WebAuthnAbortService.cancelCeremony()}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Cancel and try again
                </button>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/admin/enter-email" className="hover:text-solo-accent">← Back</Link>
        </p>
      </div>
    </div>
  )
}

export default function AdminSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AdminSetupForm />
    </Suspense>
  )
}
