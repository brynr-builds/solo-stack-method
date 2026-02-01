/*
 * DEV NOTES:
 * - Why: Signup page for new users
 * - Phase 1: UI scaffold only, simulated signup
 * - Phase 2+: Supabase Auth, Stripe payment integration
 * 
 * PRICING: $20/month (locked)
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'signup' | 'payment'>('signup')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO Phase 2: Implement Supabase auth
    console.log('Signup attempt:', { email })
    setTimeout(() => {
      setLoading(false)
      setStep('payment')
    }, 1000)
  }

  const handlePayment = async () => {
    setLoading(true)
    // TODO Phase 2: Implement Stripe checkout
    console.log('Payment initiated')
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-solo-primary">
            Solo Stack Method™
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">
            {step === 'signup' ? 'Start Building' : 'Complete Setup'}
          </h1>
          <p className="text-gray-600">
            {step === 'signup' 
              ? 'Create your account to begin'
              : 'Subscribe to access all features'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 'signup' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none transition-colors"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-solo-primary">$20</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-solo-success">✓</span>
                  <span>One active project</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-solo-success">✓</span>
                  <span>7-step guided workflow</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-solo-success">✓</span>
                  <span>Dual AI audit system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-solo-success">✓</span>
                  <span>Stack Pulse monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-solo-success">✓</span>
                  <span>Cancel anytime</span>
                </li>
              </ul>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Subscribe — $20/month'}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Secure payment via Stripe. Cancel anytime.
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-solo-accent font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-solo-primary">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
