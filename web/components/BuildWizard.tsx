/*
 * DEV NOTES (2026-06-09):
 * - Why: The Model A build flow, written for a GENUINELY non-technical user. Each stage explains
 *   the free account it needs, sets it up, and confirms the cost is $0. No jargon ("repository",
 *   "clone", terminal commands) — the final step uses Cursor's no-terminal GUI clone.
 *   The 4 stages map onto the Method's 7 steps (labeled in the UI).
 * - All GitHub work happens server-side via /api/build/* (the token never reaches the browser).
 */
'use client'

import { useEffect, useState } from 'react'

type Me = { configured: boolean; connected: boolean; login?: string; avatar?: string }

const STAGES = ['Connect', 'Create', 'Publish', 'Build'] as const
type Stage = (typeof STAGES)[number]

export default function BuildWizard({ templateRepo }: { templateRepo: string }) {
  const [me, setMe] = useState<Me | null>(null)
  const [stage, setStage] = useState<Stage>('Connect')
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [repo, setRepo] = useState<{ url: string; fullName: string } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error')) setError(humanizeError(params.get('error')!))
    fetch('/api/build/me')
      .then((r) => r.json())
      .then((data: Me) => {
        setMe(data)
        if (data.connected) setStage('Create')
      })
      .catch(() => setMe({ configured: false, connected: false }))
  }, [])

  async function createRepo() {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/build/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Could not create your site.')
      else {
        setRepo({ url: data.url, fullName: data.fullName })
        setStage('Publish')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setCreating(false)
    }
  }

  async function disconnect() {
    await fetch('/api/build/logout', { method: 'POST' })
    setMe({ configured: true, connected: false })
    setStage('Connect')
    setRepo(null)
  }

  if (me === null) return <p className="text-center text-gray-500 py-12">Loading…</p>

  if (!me.configured) {
    return (
      <div className="card max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-solo-primary mb-2">Almost ready</h3>
        <p className="text-gray-600 mb-3">
          The GitHub connection isn&rsquo;t set up on this site yet. The site owner needs to add a
          GitHub OAuth App and three settings (a one-time, 5-minute step).
        </p>
        <p className="text-sm text-gray-500">Setup guide: <code>docs/solo-stack/BUILD_FLOW_SETUP.md</code>.</p>
      </div>
    )
  }

  const siteName = repo?.fullName.split('/')[1]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Persistent free reassurance */}
      <p className="text-center text-sm text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 inline-block w-full mb-6">
        Everything here is <strong>free</strong> — no credit card. (A custom web address later is optional, ~$10/yr.)
      </p>

      <Stepper current={stage} connected={me.connected} hasRepo={!!repo} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">{error}</div>
      )}

      {/* 1 — Connect (free accounts) */}
      {stage === 'Connect' && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 1 · Your free account</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">First, connect GitHub</h3>
          <p className="text-gray-600 mb-4">
            GitHub is a free service that stores your website&rsquo;s files — think of it like Google
            Drive, but for a website. Your site lives in <em>your</em> account, so it&rsquo;s always yours.
            When you click below you&rsquo;ll sign in, or make a free account in about a minute.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5">
            <p className="font-semibold text-gray-800 mb-2 text-sm">What you&rsquo;ll need — all free, no card:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ A <strong>GitHub</strong> account — created on the next click (stores your site)</li>
              <li>✓ A <strong>Netlify</strong> account — free hosting, we&rsquo;ll set it up in step 3</li>
              <li>✓ The free <strong>Cursor</strong> app — to change your site by chatting (step 4)</li>
            </ul>
          </div>

          <a href="/api/build/login" className="btn-primary inline-flex items-center gap-2">
            <GitHubMark /> Connect or create my free GitHub
          </a>
          <p className="text-xs text-gray-400 mt-3">
            We only ask permission to create one public site for you — nothing private. Disconnect anytime.
          </p>
        </div>
      )}

      {/* 2 — Create */}
      {stage === 'Create' && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wide text-solo-accent">Step 2 · Create your site</div>
            {me.login && (
              <button onClick={disconnect} className="text-xs text-gray-400 hover:text-gray-600">
                signed in as @{me.login} · disconnect
              </button>
            )}
          </div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Name your site</h3>
          <p className="text-gray-600 mb-4">
            We&rsquo;ll make your own free copy of the starter website, saved to your GitHub. Pick any
            name — your name, your business, your idea. You can change it later. (Use letters,
            numbers and dashes.)
          </p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-portfolio"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-accent/40"
            />
            <button onClick={createRepo} disabled={creating || !name.trim()} className="btn-primary disabled:opacity-50">
              {creating ? 'Creating…' : 'Create my site'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Free. Makes a copy of the Solo Stack starter in your account.</p>
        </div>
      )}

      {/* 3 — Publish (deploy) */}
      {stage === 'Publish' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 3 · Put it online (free)</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Your site is created 🎉</h3>
          <p className="text-gray-600 mb-4">
            It&rsquo;s saved to your GitHub as{' '}
            <a href={repo.url} target="_blank" rel="noreferrer" className="text-solo-accent font-medium underline">{repo.fullName}</a>.
            Now let&rsquo;s put it on the internet — for free — so anyone can visit it.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Netlify</strong> hosts your site free and re-publishes it automatically whenever
            you change it. Click below, sign in with GitHub (free), and click through the prompts —
            about a minute. There are <em>no settings to change</em>.
          </p>
          <a
            href={`https://app.netlify.com/start/deploy?repository=${encodeURIComponent(repo.url)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-block"
          >
            Publish free on Netlify →
          </a>
          <p className="text-xs text-gray-400 mt-3">
            Prefer Vercel or Cloudflare Pages? They&rsquo;re free too — import the same site. Want to do this later? You can skip and come back.
          </p>
          <div className="mt-5">
            <button onClick={() => setStage('Build')} className="text-solo-accent font-medium hover:underline">
              Done (or skip) → next: make it yours
            </button>
          </div>
        </div>
      )}

      {/* 4 — Build (direct the agent, no terminal) */}
      {stage === 'Build' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 4 · Make it yours by chatting</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Now change it just by talking to an AI</h3>
          <p className="text-gray-600 mb-4">
            You won&rsquo;t write any code. You&rsquo;ll use a free app called <strong>Cursor</strong> and
            simply <em>tell it</em> what you want — &ldquo;change my name to…&rdquo;, &ldquo;make it
            blue&rdquo;, &ldquo;add a contact section&rdquo; — and it edits your site for you.
          </p>
          <ol className="space-y-3 text-gray-700 mb-5">
            <li><strong>1.</strong> Download <strong>Cursor</strong> (free): <a className="text-solo-accent underline" href="https://cursor.com" target="_blank" rel="noreferrer">cursor.com</a> — it&rsquo;s a normal app you install.</li>
            <li><strong>2.</strong> Open Cursor → choose <strong>&ldquo;Clone repo&rdquo;</strong> → pick <code>{siteName}</code>. (No typing commands — it&rsquo;s a button.)</li>
            <li><strong>3.</strong> Open <a className="text-solo-accent underline" href={`${repo.url}/blob/main/BUILD.md`} target="_blank" rel="noreferrer">BUILD.md</a> and copy the <strong>Step 1</strong> prompt into Cursor&rsquo;s chat box. Keep going through the prompts.</li>
          </ol>
          <p className="text-gray-600 mb-5">
            Every change you approve is saved automatically and your live site updates on its own.
            That&rsquo;s the whole loop — your site, your words, no code.
          </p>
          <a href={repo.url} target="_blank" rel="noreferrer" className="btn-primary">Open my site on GitHub →</a>
          <details className="mt-4 text-sm text-gray-500">
            <summary className="cursor-pointer">Comfortable with a terminal? (optional)</summary>
            <p className="mt-2">You can use Claude Code instead: <code>git clone {repo.url}.git</code>, then open it and run Claude Code. Cursor above is the no-terminal route.</p>
          </details>
        </div>
      )}
    </div>
  )
}

function Stepper({ current, connected, hasRepo }: { current: Stage; connected: boolean; hasRepo: boolean }) {
  const idx = STAGES.indexOf(current)
  return (
    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {STAGES.map((s, i) => {
        const done = i < idx || (s === 'Connect' && connected) || (s === 'Create' && hasRepo)
        const active = s === current
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                active ? 'bg-solo-accent text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {done && !active ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${active ? 'text-solo-primary font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < STAGES.length - 1 && <span className="text-gray-300 mx-1">—</span>}
          </div>
        )
      })}
    </div>
  )
}

function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function humanizeError(code: string): string {
  switch (code) {
    case 'not_configured': return 'GitHub connection isn’t set up on this site yet.'
    case 'bad_state': return 'That link expired. Please try connecting again.'
    case 'token_exchange': return 'GitHub sign-in didn’t complete. Please try again.'
    default: return 'Something went wrong. Please try again.'
  }
}
