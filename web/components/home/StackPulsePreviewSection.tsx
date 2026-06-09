import Link from 'next/link'

export function StackPulsePreviewSection() {
  return (
    <section className="py-20 px-6 bg-solo-primary text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Stack Pulse</h2>
        <p className="text-center text-gray-300 mb-8">
          Know when your tools change before they break your project
        </p>
        <div className="card bg-white/10 backdrop-blur border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Next.js", version: "14.1.0", status: "stable", updated: "2 days ago" },
              { name: "Supabase", version: "2.39", status: "update", updated: "1 day ago" },
              { name: "Tailwind", version: "3.4.1", status: "stable", updated: "5 days ago" },
              { name: "Claude API", version: "2024-01", status: "stable", updated: "3 days ago" },
              { name: "Netlify", version: "latest", status: "stable", updated: "1 week ago" },
              { name: "TypeScript", version: "5.3", status: "stable", updated: "2 weeks ago" },
            ].map(({ name, version, status, updated }) => (
              <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium">{name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    status === 'stable' ? 'bg-green-500/20 text-green-300' :
                    status === 'update' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {status}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{updated}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mb-6 mt-6">
          Viewing is free. Acting requires a subscription.
        </p>
        <div className="text-center">
          <Link href="/pulse" className="inline-block bg-white text-solo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View Full Stack Pulse →
          </Link>
        </div>
      </div>
    </section>
  )
}
