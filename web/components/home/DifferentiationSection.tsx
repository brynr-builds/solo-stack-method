export function DifferentiationSection() {
  return (
    <section className="py-20 px-6 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Why This Is Different</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Most AI builder tools let you ship fast. Solo Stack Method lets you ship <strong>right</strong>.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-solo-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-solo-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Governance-First</h3>
            <p className="text-gray-600 text-sm">
              Dual-audit workflow with evidence-based decision trails. Every change goes through a PR,
              every PR gets audited by a second AI. Not &quot;just vibe and ship.&quot;
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-solo-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-solo-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Context Is a First-Class Artifact</h3>
            <p className="text-gray-600 text-sm">
              Your project context lives in-repo — versioned, auditable, and portable.
              Not a one-time prompt that disappears after generation.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-solo-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-solo-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Exit-Ready Packaging</h3>
            <p className="text-gray-600 text-sm">
              DEV NOTES, audit trails, and prompt evolution baked in. A dev team
              can take over your project without ever talking to you. Enterprise takeover readiness from day one.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
