/*
 * DEV NOTES (2026-06-09):
 * - Why: the footer linked to /terms but the page didn't exist (404). Plain-language terms that
 *   match what the site actually offers: free content + a free build flow that creates a repo in
 *   the USER'S own GitHub account (they own the output), plus affiliate-link disclosure.
 */
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | Solo Stack Method',
  description: 'Plain-language terms: free to use, you own what you build, no warranties, affiliate links disclosed.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <Link href="/build" className="btn-primary text-sm py-2 px-4">Build your site</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-bold text-solo-primary mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 9, 2026</p>

        <div className="article-body">
          <p>
            Welcome to Solo Stack Method (solostackmethod.io). Using the site means you agree to
            these terms. They&rsquo;re written in plain English on purpose.
          </p>

          <h2>What this site is</h2>
          <p>
            Free educational content, tool recommendations, and a free build flow that helps you
            plan a website and create it in <strong>your own GitHub account</strong>. There is no
            paid product on this site today and no account to create with us.
          </p>

          <h2>You own what you build</h2>
          <p>
            The build flow creates a repository in <em>your</em> GitHub account from our open starter
            template. That repository — and the site you build from it — is <strong>yours</strong>:
            your code, your content, your responsibility. We don&rsquo;t host it, control it, or have
            ongoing access to it. The starter template is provided under its repository&rsquo;s
            license terms on GitHub.
          </p>

          <h2>Affiliate links (how this site is funded)</h2>
          <p>
            Some links on this site are affiliate links — if you sign up for a tool through them we
            may earn a commission at no extra cost to you. We disclose this where it appears, we
            never accept payment for placement, and every recommendation is ranked by our own
            research. <strong>Commission terms, prices, and tool features change often</strong> —
            always confirm current details on the tool&rsquo;s own site before buying.
          </p>

          <h2>No guarantees (the honest part)</h2>
          <ul>
            <li>
              The content, the method, the tool data (including Stack Pulse), and the build flow are
              provided <strong>&ldquo;as is,&rdquo; without warranties</strong> of any kind. We work
              hard to keep information accurate and current, but we can&rsquo;t guarantee it.
            </li>
            <li>
              Nothing here is legal, financial, or professional advice. Building and operating a
              website or business is your decision and your responsibility.
            </li>
            <li>
              Third-party services we link to or integrate with (GitHub, Netlify, the tools in The
              Stack) have their own terms, and we&rsquo;re not responsible for them.
            </li>
            <li>
              To the maximum extent permitted by law, our liability to you for anything arising from
              your use of this free site is zero dollars ($0).
            </li>
          </ul>

          <h2>Acceptable use</h2>
          <p>
            Don&rsquo;t abuse the site: no scraping at disruptive volume, no attempting to break the
            build flow or other people&rsquo;s data, no using the site for anything unlawful.
          </p>

          <h2>Trademarks &amp; content</h2>
          <p>
            &ldquo;Solo Stack Method&rdquo; and &ldquo;Repo-as-Truth&rdquo; are trademarks of this
            site&rsquo;s owner. Site content is ours; feel free to quote with a link back. Tool names
            and logos belong to their respective owners.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms as the product evolves; the date above always reflects the
            current version. Material changes will be visible here.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? <a href="mailto:hello@solostackmethod.io">hello@solostackmethod.io</a>
          </p>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-500">
          <Link href="/privacy" className="text-solo-accent hover:underline">Privacy Policy</Link> ·{' '}
          <Link href="/" className="text-solo-accent hover:underline">Home</Link>
        </div>
      </div>
    </div>
  )
}
