'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { startAuthentication, WebAuthnAbortService, WebAuthnError } from '@simplewebauthn/browser'

const AUTH_TIMEOUT_MS = 120_000

function AdminLoginForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') ?? ''
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [useSetupSecret, setUseSetupSecret] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const [setupSecret, setSetupSecret] = useState('')
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    )
  }, [])

  useEffect(() => {
    setEmail(emailParam)
  }, [emailParam])

  useEffect(() => {
    return () => WebAuthnAbortService.cancelCeremony()
  }, [])

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

      const credential = await Promise.race([
        startAuthentication({ optionsJSON: options }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Passkey prompt timed out. Look for TouchID/FaceID—it may be behind the browser window. Try again or use a backup code.')),
            AUTH_TIMEOUT_MS
          )
        ),
      ])

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
      WebAuthnAbortService.cancelCeremony()
      if (err instanceof WebAuthnError) {
        if (err.code === 'ERROR_CEREMONY_ABORTED') {
          setError('Sign-in was cancelled.')
        } else if (err.message?.includes('NotAllowedError') || err.name === 'NotAllowedError') {
          setError('Passkey prompt was dismissed or timed out. Try again or use a backup code.')
        } else {
          setError(err.message || 'Passkey sign-in failed')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Login failed')
      }
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

  const handleSetupSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !setupSecret) {
      setError('Email and setup secret are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login/setup-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, setupSecret }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid setup secret')
      }

      window.location.href = data.redirectTo || '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup secret login failed')
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

          {!useBackup && !useSetupSecret ? (
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
              {loading && (
                <div className="flex flex-col gap-2">
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
              <button
                type="button"
                onClick={() => setUseBackup(true)}
                disabled={loading}
                className="w-full text-sm text-gray-600 hover:text-solo-accent disabled:opacity-50"
              >
                Use backup code instead
              </button>
              {isDev && (
                <button
                  type="button"
                  onClick={() => { setUseSetupSecret(true); setError(''); }}
                  disabled={loading}
                  className="w-full text-sm text-amber-600 hover:text-amber-700 disabled:opacity-50"
                >
                  Passkey not working? Use setup secret (dev only)
                </button>
              )}
            </form>
          ) : useSetupSecret ? (
            <form onSubmit={handleSetupSecretLogin} className="space-y-4">
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
                  placeholder="From web/.env.local"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in with Setup Secret'}
              </button>
              <button
                type="button"
                onClick={() => { setUseSetupSecret(false); setSetupSecret(''); setError(''); }}
                className="w-full text-sm text-gray-600 hover:text-solo-accent"
              >
                ← Back to passkey
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
              {isDev && (
                <button
                  type="button"
                  onClick={() => { setUseBackup(false); setUseSetupSecret(true); setBackupCode(''); setError(''); }}
                  className="w-full text-sm text-amber-600 hover:text-amber-700"
                >
                  Use setup secret (dev only)
                </button>
              )}
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
