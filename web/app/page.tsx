/*
 * DEV NOTES / Intent:
 * - Why: Public marketing homepage - conversion-focused, explains value
 * - Phase 1: Static content, Stack Pulse preview, pricing, CTA
 * - Phase 2+: Dynamic pulse data, testimonials, case studies
 * 
 * LOCKED COPY:
 * - Headline: "Build real software with AI — without losing control, from idea to deployment."
 * - Pulse gating: "Viewing is free. Acting requires a subscription."
 * - Pricing: $20/month
 * 
 * NEW MARKETING (2026-01-31):
 * - Enterprise takeover readiness positioning
 * - Sellable software package framing
 * - Sustain the Stack (optional contribution)
 * 
 * Compatibility: Root marketing page, no dependencies on other app routes
 */

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-solo-primary">
            Solo Stack Method™
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-gray-600 hover:text-solo-primary transition-colors">
              Stack Pulse
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-solo-primary leading-tight mb-6">
            Build real software with AI — without losing control, from idea to deployment.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A governed workflow for non-technical builders who want to ship real projects using AI as their execution engine.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Start Your First Project — $20/month
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Who This Is For</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold text-solo-success mb-4">✓ This is for you if...</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• You have a product idea but not engineering skills</li>
                <li>• You want real software, not just a demo</li>
                <li>• You understand AI is powerful but chaotic</li>
                <li>• You're willing to follow a process</li>
                <li>• You want to actually ship something</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-red-500 mb-4">✗ This is NOT for you if...</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• You want to "vibe code" with no structure</li>
                <li>• You expect AI to read your mind</li>
                <li>• You're looking for a no-code builder</li>
                <li>• You refuse to learn anything new</li>
                <li>• You want magic, not method</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Step Workflow */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The 7 Practical Steps</h2>
          <p className="text-center text-gray-600 mb-12">
            Every project follows the same governed workflow
          </p>
          <div className="grid md:grid-cols-7 gap-4">
            {[
              { step: 1, title: "Create Repo" },
              { step: 2, title: "Tech Stack" },
              { step: 3, title: "Context" },
              { step: 4, title: "Build" },
              { step: 5, title: "Test" },
              { step: 6, title: "Audit" },
              { step: 7, title: "Deploy" },
            ].map(({ step, title }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-solo-accent text-white flex items-center justify-center text-xl font-bold mb-2">
                  {step}
                </div>
                <div className="text-sm font-medium">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Pulse Preview */}
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
          <p className="text-center text-gray-400 text-sm mb-6">
            Viewing is free. Acting requires a subscription.
          </p>
          <div className="text-center">
            <Link href="/pulse" className="inline-block bg-white text-solo-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Full Stack Pulse →
            </Link>
          </div>
        </div>
      </section>

      {/* Built With Solo Stack */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-solo-accent/10 text-solo-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            Proof of Concept
          </div>
          <h2 className="text-3xl font-bold mb-4">This Product Is Built Using the Same Process It Teaches</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Every feature of Solo Stack Method was built using the governed workflow you'll learn. 
            Claude builds, ChatGPT audits, and every change goes through a pull request.
          </p>
          <Link href="https://github.com/brynr-builds/solo-stack-method" target="_blank" className="btn-secondary">
            View Public Repository →
          </Link>
        </div>
      </section>

      {/* ================================================
          NEW: Enterprise Takeover Ready Section
          ================================================ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Exit-Ready by Design
          </div>
          <h2 className="text-3xl font-bold mb-4">Build Software Companies Can Buy</h2>
          <p className="text-gray-600 mb-8">
            This isn't just about building apps or websites. You're creating a <strong>sellable software package</strong> — 
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
                <span><strong>Explicit context</strong> — no tribal knowledge, no "ask the founder"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Standard structure</strong> — follows patterns engineers expect</span>
              </li>
            </ul>
          </div>
          
          <p className="text-gray-500 text-sm">
            <strong>Note:</strong> This is a method and governance system, not a guarantee of acquisition.
            But if the opportunity comes, you'll be ready.
          </p>
        </div>
      </section>

      {/* ================================================
          NEW: Sustain the Stack Section
          ================================================ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              OPTIONAL
            </span>
            <h2 className="text-3xl font-bold">Sustain the Stack</h2>
          </div>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            After you've shipped successfully, you can optionally contribute to keep this project sustainable.
          </p>
          
          <div className="card max-w-lg mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">What This Is</h3>
            <ul className="text-left space-y-3 text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>A voluntary contribution after success</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Helps maintain Stack Pulse and governance tools</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Shows up only after you've deployed</span>
              </li>
            </ul>
            
            <h3 className="text-xl font-bold mb-4">What This Is NOT</h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span>Never required for execution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span>Never unlocks features</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span>Never affects audit scores</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span>Never pressured or prompted repeatedly</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="card text-center">
            <div className="text-5xl font-bold text-solo-primary mb-2">$20</div>
            <div className="text-gray-500 mb-6">per month</div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>One active project</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Full 7-step guided workflow</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Step-scoped AI chat assistance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Dual audit system (Claude + ChatGPT)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Stack Pulse monitoring</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Enterprise-takeover-ready output</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-solo-success">✓</span>
                <span>Cancel anytime</span>
              </li>
            </ul>
            <Link href="/signup" className="btn-primary w-full block">
              Start Building Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 Solo Stack Method™. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/pulse" className="text-gray-500 hover:text-solo-primary">Stack Pulse</Link>
            <Link href="/audit-score" className="text-gray-500 hover:text-solo-primary">Audit Score</Link>
            <Link href="/terms" className="text-gray-500 hover:text-solo-primary">Terms</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-solo-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
