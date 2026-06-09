/*
 * DEV NOTES (2026-06-09):
 * - Why: the footer linked to /privacy but the page didn't exist (404). Also now required in
 *   substance: we run privacy-friendly analytics and the /build flow handles a GitHub token.
 * - IMPORTANT: this page is written to be ACCURATE to what the site actually does (analytics
 *   env-gated, /go click logging, encrypted OAuth cookie, localStorage plan). If behavior changes,
 *   update this page in the same PR.
 */
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Solo Stack Method',
  description: 'What we collect (very little), why, and what we never do with it.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">Solo Stack Method™</Link>
          <Link href="/build" className="btn-primary text-sm py-2 px-4">Build your site</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-bold text-solo-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 9, 2026</p>

        <div className="article-body">
          <p>
            Short version: we collect very little, we don&rsquo;t sell anything about you, and the
            site works without an account. Here&rsquo;s the whole picture in plain English.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Anonymous usage analytics.</strong> We use a privacy-friendly analytics tool
              (no cross-site tracking, no ad profiles) to count page views and a few product events
              — like &ldquo;someone started the planning step.&rdquo; It does not identify you.
            </li>
            <li>
              <strong>Outbound link clicks.</strong> When you click a tool link that goes through
              our <code>/go</code> redirect, we log the click (which tool, when, the referring page,
              and a browser user-agent string) so we know which recommendations are useful. No name,
              no account, no profile.
            </li>
            <li>
              <strong>Your build plan.</strong> The planning step saves your answers in{' '}
              <em>your own browser</em> (localStorage) so they survive a page refresh. If you create
              a site repo, your plan is committed into <em>your</em> GitHub repository — which you
              own and control. We don&rsquo;t keep a copy.
            </li>
            <li>
              <strong>GitHub connection (only if you use Build).</strong> If you connect GitHub, we
              receive a token with permission to create a public repository in your account
              (<code>public_repo</code> scope). It is stored <em>encrypted</em> in a secure,
              httpOnly cookie in your browser for up to 7 days, used only server-side to create your
              repo and commit your plan, and never shared. Disconnecting (or waiting 7 days) removes it.
            </li>
            <li>
              <strong>Email (only if you give it).</strong> If you subscribe to updates, we use your
              email to send them. Unsubscribe anytime. We don&rsquo;t sell or rent the list.
            </li>
          </ul>

          <h2>What we don&rsquo;t do</h2>
          <ul>
            <li>No selling or renting personal data. Ever.</li>
            <li>No advertising trackers, no cross-site profiles, no fingerprinting.</li>
            <li>No access to your private repositories — the GitHub permission we request can&rsquo;t see them.</li>
            <li>No accounts, passwords, or payment details collected on this site today.</li>
          </ul>

          <h2>Affiliate links</h2>
          <p>
            Some links on this site are affiliate links — if you sign up for a tool through them we
            may earn a commission at no extra cost to you. That&rsquo;s disclosed where it appears;
            it doesn&rsquo;t involve any of your personal data beyond the anonymous click logging
            described above.
          </p>

          <h2>Third parties we rely on</h2>
          <p>
            The site is hosted on Netlify. GitHub handles the optional repo creation. Our analytics
            provider processes the anonymous usage data described above. Each has its own privacy
            policy.
          </p>

          <h2>Questions or requests</h2>
          <p>
            Email <a href="mailto:hello@solostackmethod.io">hello@solostackmethod.io</a> — including
            if you want any data we hold about you (there&rsquo;s very little) deleted.
          </p>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-500">
          <Link href="/terms" className="text-solo-accent hover:underline">Terms of Use</Link> ·{' '}
          <Link href="/" className="text-solo-accent hover:underline">Home</Link>
        </div>
      </div>
    </div>
  )
}
