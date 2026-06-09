export function EnterpriseTakeoverSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          Exit-Ready by Design
        </div>
        <h2 className="text-3xl font-bold mb-4">Build Software Companies Can Buy</h2>
        <p className="text-gray-600 mb-8">
          This isn&apos;t just about building apps or websites. You&apos;re creating a <strong>sellable software package</strong> —
          one that a dev team could take over tomorrow without calling you for help.
        </p>

        <div className="bg-slate-800 text-white rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">The Microsoft Takeover Test</h3>
          <p className="text-gray-300 mb-6">
            If Microsoft acquired your project tomorrow, could their engineers take over without you?
            With Solo Stack Method, the answer is <strong>yes</strong> — because:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Repo is truth</strong> — all context lives in the repository, not your head</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>DEV NOTES everywhere</strong> — every file explains why it exists</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Audit trail</strong> — every decision is documented in PR history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Prompt evolution</strong> — how the AI was guided is versioned</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Explicit context</strong> — no tribal knowledge, no &quot;ask the founder&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Standard structure</strong> — follows patterns engineers expect</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-500 text-sm">
          <strong>Note:</strong> This is a method and governance system, not a guarantee of acquisition.
          But if the opportunity comes, you&apos;ll be ready.
        </p>
      </div>
    </section>
  )
}
