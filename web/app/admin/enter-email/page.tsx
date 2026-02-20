'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminEnterEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [denied, setDenied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setDenied(false)
    try {
      const res = await fetch('/api/admin/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (data.next === 'setup') {
        window.location.href = `/admin/setup?email=${encodeURIComponent(email.trim().toLowerCase())}`
        return
      }
      if (data.next === 'login') {
        window.location.href = `/admin/login?email=${encodeURIComponent(email.trim().toLowerCase())}`
        return
      }
      if (data.next === 'denied') {
        setDenied(true)
      }
    } catch {
      setDenied(true)
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
          <h1 className="text-2xl font-bold mt-6 mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter your email to continue</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {denied && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Access denied. This email is not authorized for admin.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-solo-accent">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
