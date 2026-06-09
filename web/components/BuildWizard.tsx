/*
 * DEV NOTES (2026-06-09):
 * - Why: The build flow, written for a non-technical user. Stages: PLAN → Connect → Create →
 *   Publish → Build. Step 1 (Plan) is the evidence-based intake (PlanIntake) that produces a
 *   plan + SPEC.md + tailored brief; those get committed into the user's repo after it's created,
 *   so their agent builds THEIR plan, not the generic template.
 * - The plan is persisted to localStorage so it survives the GitHub OAuth redirect (which leaves
 *   the page and comes back). All GitHub work is server-side via /api/build/*.
 */
'use client'

import { useEffect, useState } from 'react'
import PlanIntake from './PlanIntake'
import type { Plan } from '../lib/build/plan'
import { track } from '../lib/analytics'

type Me = { configured: boolean; connected: boolean; login?: string }

const STAGES = ['Plan', 'Connect', 'Create', 'Publish', 'Build'] as const
type Stage = (typeof STAGES)[number]
const PLAN_KEY = 'ssm_build_plan'

export default function BuildWizard({ templateRepo }: { templateRepo: string }) {
  const [me, setMe] = useState<Me | null>(null)
  const [stage, setStage] = useState<Stage>('Plan')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [repo, setRepo] = useState<{ url: string; fullName: string } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error')) setError(humanizeError(params.get('error')!))

    let saved: Plan | null = null
    try {
      const raw = localStorage.getItem(PLAN_KEY)
      if (raw) saved = JSON.parse(raw)
    } catch { /* ignore */ }
    if (saved) setPlan(saved)

    fetch('/api/build/me')
      .then((r) => r.json())
      .then((data: Me) => {
        setMe(data)
        if (!saved) setStage('Plan')
        else if (!data.connected) setStage('Connect')
        else setStage('Create')
      })
      .catch(() => setMe({ configured: false, connected: false }))
  }, [])

  function onPlanComplete(p: Plan) {
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(p)) } catch { /* ignore */ }
    setPlan(p)
    setStage('Connect')
  }

  async function createRepo() {
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/build/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Could not create your site.'); setBusy(false); return }
      setRepo({ url: data.url, fullName: data.fullName })
      // Commit the plan into the new repo (best-effort; non-fatal if it fails).
      if (plan) {
        try {
          await fetch('/api/build/spec', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: data.fullName, spec: plan.specMarkdown, brief: plan.briefMarkdown }),
          })
        } catch { /* non-fatal */ }
      }
      setStage('Publish')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function disconnect() {
    await fetch('/api/build/logout', { method: 'POST' })
    setMe({ configured: true, connected: false })
    setStage(plan ? 'Connect' : 'Plan')
    setRepo(null)
  }

  function startOver() {
    try { localStorage.removeItem(PLAN_KEY) } catch { /* ignore */ }
    setPlan(null); setRepo(null); setStage('Plan')
  }

  if (me === null) return <p className="text-center text-gray-500 py-12">Loading…</p>

  // Step 1 — planning works regardless of GitHub config (it's free + valuable on its own).
  if (stage === 'Plan') {
    return <PlanIntake onComplete={onPlanComplete} />
  }

  // GitHub not wired on this deployment: don't dead-end — let them keep their plan.
  if (!me.configured) {
    return <PlanReadyNoGitHub plan={plan} onStartOver={startOver} />
  }

  const siteName = repo?.fullName.split('/')[1]

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-center text-sm text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 inline-block w-full mb-4">
        Everything here is <strong>free</strong> — no credit card. (A custom web address later is optional, ~$10/yr.)
      </p>

      {plan && (
        <div className="text-center text-xs text-gray-400 mb-4">
          ✓ Plan ready: <span className="text-gray-600">{plan.answers.oneLiner || 'your site'}</span>
          <button onClick={startOver} className="ml-2 underline hover:text-gray-600">start over</button>
        </div>
      )}

      <Stepper current={stage} connected={me.connected} hasRepo={!!repo} />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">{error}</div>}

      {stage === 'Connect' && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 2 · Your free account</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Now connect GitHub</h3>
          <p className="text-gray-600 mb-4">
            GitHub is a free service that stores your website&rsquo;s files — like Google Drive, but for a
            website. Your site lives in <em>your</em> account, so it&rsquo;s always yours. Click below to sign in
            or make a free account (about a minute). Your plan is saved.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">What you&rsquo;ll need — all free, no card:</p>
            <ul className="space-y-1">
              <li>✓ A <strong>GitHub</strong> account — next click (stores your site)</li>
              <li>✓ A <strong>Netlify</strong> account — free hosting, step 4</li>
              <li>✓ The free <strong>Cursor</strong> app — to build by chatting, step 5</li>
            </ul>
          </div>
          <a href="/api/build/login" onClick={() => track('connect_github_click')} className="btn-primary inline-flex items-center gap-2"><GitHubMark /> Connect or create my free GitHub</a>
          <p className="text-xs text-gray-400 mt-3">We only ask permission to create one public site for you — nothing private.</p>
        </div>
      )}

      {stage === 'Create' && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wide text-solo-accent">Step 3 · Create your site</div>
            {me.login && <button onClick={disconnect} className="text-xs text-gray-400 hover:text-gray-600">@{me.login} · disconnect</button>}
          </div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Name your site</h3>
          <p className="text-gray-600 mb-4">
            We&rsquo;ll make your own free copy of the starter, saved to your GitHub — and drop your plan
            (<code>SPEC.md</code> + a brief for your AI) right into it. Pick any name; you can change it later.
          </p>
          <div className="flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-portfolio"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-accent/40" />
            <button onClick={createRepo} disabled={busy || !name.trim()} className="btn-primary disabled:opacity-50">
              {busy ? 'Creating…' : 'Create my site'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Free. Copy of the Solo Stack starter, with your plan baked in.</p>
        </div>
      )}

      {stage === 'Publish' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 4 · Put it online (free)</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Your site is created 🎉</h3>
          <p className="text-gray-600 mb-4">
            It&rsquo;s saved as <a href={repo.url} target="_blank" rel="noreferrer" className="text-solo-accent font-medium underline">{repo.fullName}</a>,
            with your plan inside it. Now put it on the internet — free — so anyone can visit.
          </p>
          <p className="text-gray-600 mb-4"><strong>Netlify</strong> hosts it free and re-publishes automatically when you change it. Sign in with GitHub (free), click through — about a minute, no settings to change.</p>
          <a href={`https://app.netlify.com/start/deploy?repository=${encodeURIComponent(repo.url)}`} target="_blank" rel="noreferrer" className="btn-primary inline-block">Publish free on Netlify →</a>
          <p className="text-xs text-gray-400 mt-3">Prefer Vercel or Cloudflare Pages? Free too — import the same site.</p>
          <div className="mt-5"><button onClick={() => setStage('Build')} className="text-solo-accent font-medium hover:underline">Done (or skip) → next: make it yours</button></div>
        </div>
      )}

      {stage === 'Build' && repo && (
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-solo-accent mb-1">Step 5 · Make it yours by chatting</div>
          <h3 className="text-xl font-bold text-solo-primary mb-2">Hand your plan to the AI</h3>
          <p className="text-gray-600 mb-4">
            You won&rsquo;t write code. You&rsquo;ll use a free app called <strong>Cursor</strong> and paste the brief
            we wrote from <em>your</em> plan — it tells the AI exactly what to build.
          </p>
          <ol className="space-y-3 text-gray-700 mb-5">
            <li><strong>1.</strong> Download <strong>Cursor</strong> (free): <a className="text-solo-accent underline" href="https://cursor.com" target="_blank" rel="noreferrer">cursor.com</a>.</li>
            <li><strong>2.</strong> In Cursor → <strong>&ldquo;Clone repo&rdquo;</strong> → pick <code>{siteName}</code>. (A button — no typing commands.)</li>
            <li><strong>3.</strong> Open <a className="text-solo-accent underline" href={`${repo.url}/blob/main/BUILD-BRIEF.md`} target="_blank" rel="noreferrer">BUILD-BRIEF.md</a> and paste it into Cursor&rsquo;s chat. The AI builds your plan, section by section — you approve each change.</li>
          </ol>
          <p className="text-gray-600 mb-5">Your full plan is also saved as <a className="text-solo-accent underline" href={`${repo.url}/blob/main/SPEC.md`} target="_blank" rel="noreferrer">SPEC.md</a> in your repo. Every change you approve auto-updates your live site.</p>
          <a href={repo.url} target="_blank" rel="noreferrer" className="btn-primary">Open my site on GitHub →</a>
          <details className="mt-4 text-sm text-gray-500">
            <summary className="cursor-pointer">Comfortable with a terminal? (optional)</summary>
            <p className="mt-2">Use Claude Code instead: <code>git clone {repo.url}.git</code>, then open it and run Claude Code with the brief.</p>
          </details>
          <PlanPairTools />
        </div>
      )}
    </div>
  )
}

/** Optional, honest affiliate tie-ins that pair with the plan. Route through /go (logs the click,
 *  redirects to the merchant; starts earning once a tracking link is wired). */
function PlanPairTools() {
  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Optional · tools that pair with your plan</div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <a href="/go/taskade" target="_blank" rel="sponsored nofollow noopener noreferrer" className="border border-gray-200 rounded-lg p-3 hover:border-solo-accent transition-colors">
          <div className="font-semibold text-solo-primary">Keep organizing → Taskade</div>
          <div className="text-gray-500">Your plan, tasks &amp; notes in one place. Free tier.</div>
        </a>
        <a href="/go/copy-ai" target="_blank" rel="sponsored nofollow noopener noreferrer" className="border border-gray-200 rounded-lg p-3 hover:border-solo-accent transition-colors">
          <div className="font-semibold text-solo-primary">AI help with copy → Copy.ai</div>
          <div className="text-gray-500">Draft headlines &amp; section text fast. Free tier.</div>
        </a>
      </div>
      <p className="text-xs text-gray-400 mt-2">Affiliate links — same price for you; only tools we&rsquo;d actually use.</p>
    </div>
  )
}

/** When the owner hasn't wired GitHub yet: the plan still has value — let them copy it and use it
 *  in any AI editor, rather than dead-ending. Makes Step 1 a standalone free tool. */
function PlanReadyNoGitHub({ plan, onStartOver }: { plan: Plan | null; onStartOver: () => void }) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (what: string, text: string) => {
    try { navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(null), 1500) } catch { /* ignore */ }
  }
  if (!plan) {
    return (
      <div className="card max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-solo-primary mb-2">Plan your site</h3>
        <p className="text-gray-600">Start with Step 1 to turn your idea into a plan. (Auto-creating the GitHub repo isn&rsquo;t set up on this site yet — but you can still make and keep your plan.)</p>
        <button onClick={onStartOver} className="btn-primary mt-4">Start planning →</button>
      </div>
    )
  }
  return (
    <div className="card max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-solo-primary mb-2">✓ Your plan is ready</h3>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-gray-700 mb-4"
           dangerouslySetInnerHTML={{ __html: plan.summary.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      <p className="text-gray-600 mb-4 text-sm">
        Auto-creating your GitHub repo isn&rsquo;t enabled on this site yet — but your plan is the
        valuable part. Copy it and paste the brief into any AI editor (Cursor, Claude Code, ChatGPT) to build.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => copy('brief', plan.briefMarkdown)} className="btn-primary">{copied === 'brief' ? 'Copied ✓' : 'Copy the build brief'}</button>
        <button onClick={() => copy('spec', plan.specMarkdown)} className="text-sm text-gray-500 hover:text-gray-700 underline px-2">{copied === 'spec' ? 'Copied ✓' : 'Copy the full spec'}</button>
        <button onClick={onStartOver} className="text-sm text-gray-400 hover:text-gray-600 px-2">start over</button>
      </div>
      <PlanPairTools />
    </div>
  )
}

function Stepper({ current, connected, hasRepo }: { current: Stage; connected: boolean; hasRepo: boolean }) {
  const idx = STAGES.indexOf(current)
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
      {STAGES.map((s, i) => {
        const done = i < idx || (s === 'Connect' && connected && idx > 1) || (s === 'Create' && hasRepo)
        const active = s === current
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-solo-accent text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{done && !active ? '✓' : i + 1}</div>
            <span className={`text-sm ${active ? 'text-solo-primary font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < STAGES.length - 1 && <span className="text-gray-300">—</span>}
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
