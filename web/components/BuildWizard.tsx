/*
 * DEV NOTES (2026-06-09):
 * - Why: The Model A build flow. Walks a non-technical user through: connect GitHub → create their
 *   repo from the solo-stack-starter template → connect a deploy host → direct their agent.
 *   The 4 stages map onto the Method's 7 steps (labeled in the UI).
 * - All GitHub work happens server-side via /api/build/* (the token never reaches the browser).
 */
'use client'

import { useEffect, useState } from 'react'

type Me = { configured: boolean; connected: boolean; login?: string; avatar?: string }

const STAGES = ['Connect', 'Create', 'Deploy', 'Direct'] as const
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
      if (!res.ok) {
        setError(data.error || 'Could not create the repo.')
      } else {
        setRepo({ url: data.url, fullName: data.fullName })
        setStage('Deploy')
      }
    } catch {
      setError('Network error — try again.')
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

  if (me === null) {
    return <p className="text-center text-gray-500 py-12">Loading…</p>
  }

  if (!me.configured) {
    return (
      <div className="card max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-solo-primary mb-2">Almost ready</h3>
        <p className="text-gray-600 mb-3">
          The GitHub connection isn&rsquo;t set up on this deployment yet. The site owner needs to
          create a GitHub OAuth App and set three environment variables.
        </p>
        <p className="text-sm text-gray-500">
          Setup guide: <code>docs/solo-stack/BUILD_FLOW_SETUP.md</code> in the repo.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Stepper current={stage} connected={me.connected} hasRepo={!!repo} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">{error}</div>
      )}

      {/* Connect */}
      {stage === 'Connect' && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Steps 1–2 · Repo + stack</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Connect your GitHub</h3>
          <p className="text-gray-600 mb-5">
            We&rsquo;ll create a new website repository in <em>your</em> GitHub account from the
            Solo Stack starter. You own it — we only need permission to create the public repo.
          </p>
          <a href="/api/build/login" className="btn-primary inline-flex items-center gap-2">
            <GitHubMark /> Connect GitHub
          </a>
          <p className="text-xs text-gray-400 mt-3">Scope: create public repos only. Disconnect anytime.</p>
        </div>
      )}

      {/* Create */}
      {stage === 'Create' && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wide text-solo-accent">Steps 1–3 · Create your repo</div>
            {me.login && (
              <button onClick={disconnect} className="text-xs text-gray-400 hover:text-gray-600">
                @{me.login} · disconnect
              </button>
            )}
          </div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Name your site</h3>
          <p className="text-gray-600 mb-4">
            This becomes your repository name (and the start of your URL). You can rename later.
          </p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-portfolio"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-accent/40"
            />
            <button onClick={createRepo} disabled={creating || !name.trim()} className="btn-primary disabled:opacity-50">
              {creating ? 'Creating…' : 'Create my repo'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">From template: <code>{templateRepo}</code></p>
        </div>
      )}

      {/* Deploy */}
      {stage === 'Deploy' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 7 · Deploy</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Your repo is live 🎉</h3>
          <p className="text-gray-600 mb-4">
            Created <a href={repo.url} target="_blank" rel="noreferrer" className="text-solo-accent font-medium underline">{repo.fullName}</a>.
            Now connect it to a host so every push auto-deploys:
          </p>
          <ul className="space-y-3 mb-5 text-gray-700">
            <li>• <strong>Netlify:</strong> <a className="text-solo-accent underline" href="https://app.netlify.com/start" target="_blank" rel="noreferrer">New site from Git</a> → pick this repo → Deploy (no build settings needed).</li>
            <li>• <strong>Vercel / Cloudflare Pages:</strong> import the repo, framework preset “Other / None”.</li>
          </ul>
          <button onClick={() => setStage('Direct')} className="btn-primary">Next: build it with your agent →</button>
        </div>
      )}

      {/* Direct */}
      {stage === 'Direct' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Steps 4–6 · Build &amp; audit</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Direct your agent</h3>
          <p className="text-gray-600 mb-4">
            Open your repo in an AI editor (Claude Code or Cursor) and follow the copy-paste prompts
            in <a className="text-solo-accent underline" href={`${repo.url}/blob/main/BUILD.md`} target="_blank" rel="noreferrer">BUILD.md</a>.
            Your repo already contains the rules (<code>AGENTS.md</code>) so the agent works the right way.
          </p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-sm overflow-x-auto mb-4"><code>git clone {repo.url}.git
cd {repo.fullName.split('/')[1]}
# then open it in Claude Code / Cursor and paste the Step 1 prompt from BUILD.md</code></pre>
          <a href={repo.url} target="_blank" rel="noreferrer" className="btn-primary">Open my repo →</a>
        </div>
      )}
    </div>
  )
}

function Stepper({ current, connected, hasRepo }: { current: Stage; connected: boolean; hasRepo: boolean }) {
  const idx = STAGES.indexOf(current)
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
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
    case 'not_configured': return 'GitHub connection isn’t set up on this deployment yet.'
    case 'bad_state': return 'Security check failed (expired link). Please try connecting again.'
    case 'token_exchange': return 'GitHub sign-in failed. Please try again.'
    default: return 'Something went wrong. Please try again.'
  }
}
