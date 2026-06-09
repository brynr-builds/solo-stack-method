/*
 * DEV NOTES (2026-06-09):
 * - Why: The Build flow (Model A) — operationalizes the 7 Method steps into a real, working wizard
 *   that produces a GitHub repo from the solo-stack-starter template and connects it to autodeploy.
 * - Server shell + nav; the interactive flow is <BuildWizard> (client). GitHub work is server-side.
 */
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBuildEnv } from '../../lib/build/env'
import BuildWizard from '../../components/BuildWizard'

export const metadata: Metadata = {
  title: 'Build your site — direct an AI agent | Solo Stack Method',
  description: 'Go from idea to a live website in your own GitHub repo by directing an AI agent. The Solo Stack Method, for real.',
}

export default function BuildPage() {
  const { templateRepo } = getBuildEnv()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-gray-600 hover:text-solo-primary transition-colors">Stack Pulse</Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-solo-primary mb-3">Build your site</h1>
          <p className="text-gray-600">
            You don&rsquo;t write code — you <strong>direct an AI agent</strong>. In a few minutes
            you&rsquo;ll have a real website in your own GitHub repo, wired to auto-deploy on every push.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <BuildWizard templateRepo={templateRepo} />
      </section>
    </div>
  )
}
