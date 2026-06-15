import { query } from '@/lib/admin/storage/db'
import Link from 'next/link'

export default async function PreferencesPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-solo-primary">Invalid Link</h1>
          <p className="text-gray-600 mb-6">This personalized link is missing or invalid.</p>
          <Link href="/pulse" className="btn-primary inline-block">Return to Pulse</Link>
        </div>
      </div>
    )
  }

  const rows = await query<{ email: string; tools: string[] }>(
    'SELECT email, tools FROM newsletter_preferences WHERE token = $1',
    [token]
  )

  const prefs = rows[0]

  if (!prefs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-solo-primary">Link Expired</h1>
          <p className="text-gray-600 mb-6">This personalized link could not be found or has expired.</p>
          <Link href="/pulse" className="btn-primary inline-block">Return to Pulse</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-solo-accent font-medium">Stack Pulse</Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-solo-primary text-center">Your Preferences</h1>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Managing alerts for <strong>{prefs.email}</strong>
          </p>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Currently Watching:</h2>
            {prefs.tools.length > 0 ? (
              <ul className="space-y-2">
                {prefs.tools.map((t) => (
                  <li key={t} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 border border-gray-100">
                    <span className="text-green-500">✓</span> {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-100">
                You are currently watching all tools.
              </p>
            )}
          </div>

          <div className="text-center">
             <Link href="/pulse" className="btn-primary w-full block mb-3 text-center">Return to Pulse Board</Link>
             <p className="text-xs text-gray-400">
                (Updating preferences via this page is coming in a future update)
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
