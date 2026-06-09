import Link from 'next/link'

export function PricingSection() {
  return (
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
  )
}
