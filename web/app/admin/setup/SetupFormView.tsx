import Link from 'next/link'
import { WebAuthnAbortService } from '@simplewebauthn/browser'

export function SetupFormView({
  email,
  setupSecret,
  setSetupSecret,
  loading,
  error,
  handleSubmit
}: {
  email: string
  setupSecret: string
  setSetupSecret: (secret: string) => void
  loading: boolean
  error: string
  handleSubmit: (e: React.FormEvent) => void
}) {
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
