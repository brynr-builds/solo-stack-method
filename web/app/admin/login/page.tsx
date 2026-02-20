'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { startAuthentication } from '@simplewebauthn/browser'

function AdminLoginForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') ?? ''
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [backupCode, setBackupCode] = useState('')

  useEffect(() => {
    setEmail(emailParam)
  }, [emailParam])

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const beginRes = await fetch('/api/admin/login/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!beginRes.ok) {
        const data = await beginRes.json().catch(() => ({}))
        if (data.error === 'User not found') {
          window.location.href = `/admin/setup?email=${encodeURIComponent(email)}`
          return
        }
        throw new Error(data.error || 'Login failed')
      }
      const options = await beginRes.json()

      const credential = await startAuthentication({ optionsJSON: options })

      const finishRes = await fetch('/api/admin/login/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, response: credential }),
      })
      const finishData = await finishRes.json()

      if (!finishRes.ok) {
        throw new Error(finishData.error || 'Verification failed')
      }

      window.location.href = finishData.redirectTo || '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBackupLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !backupCode) {
      setError('Email and backup code are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: backupCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      window.location.href = data.redirectTo || '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-solo-primary">
            Solo Stack Method™
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in with your passkey</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {!useBackup ? (
            <form onSubmit={handlePasskeyLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in with Passkey'}
              </button>
              <button
                type="button"
                onClick={() => setUseBackup(true)}
                className="w-full text-sm text-gray-600 hover:text-solo-accent"
              >
                Use backup code instead
              </button>
            </form>
          ) : (
            <form onSubmit={handleBackupLogin} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Backup Code</label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none transition-colors font-mono"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Sign in with Backup Code'}
              </button>
              <button
                type="button"
                onClick={() => { setUseBackup(false); setBackupCode(''); setError(''); }}
                className="w-full text-sm text-gray-600 hover:text-solo-accent"
              >
                ← Back to passkey
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/admin/enter-email" className="hover:text-solo-accent">← Back</Link>
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
