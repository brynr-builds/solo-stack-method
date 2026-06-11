/*
 * DEV NOTES (2026-06-10): the visible "this page maintains itself" panel.
 * Renders current versions/release recency for the tools an article covers,
 * sourced live from Stack Pulse (hourly revalidate + 6h refresh Action).
 */

import type { LiveFact } from '../lib/pulse/live'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  recent: 'bg-blue-100 text-blue-800',
  stable: 'bg-gray-100 text-gray-600',
  unknown: 'bg-gray-100 text-gray-500',
}

export default function LiveFacts({ facts }: { facts: LiveFact[] }) {
  if (!facts.length) return null
  return (
    <aside className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-solo-primary m-0">
          Live facts <span aria-hidden>·</span> auto-checked hourly
        </h2>
        <a href="/pulse" className="text-xs text-solo-accent underline">
          from Stack Pulse →
        </a>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {facts.map((f) => (
            <tr key={f.key} className="border-t border-gray-200">
              <td className="py-1.5 pr-3 font-medium text-solo-primary">{f.name}</td>
              <td className="py-1.5 pr-3 tabular-nums">{f.version ? `v${f.version}` : '—'}</td>
              <td className="py-1.5 pr-3 text-gray-600">released {f.ago}</td>
              <td className="py-1.5 text-right">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[f.status]}`}>
                  {f.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3 mb-0">
        These numbers update themselves — this page is re-checked against the registries every
        hour, so what you read here reflects today, not the day it was written.
      </p>
    </aside>
  )
}
