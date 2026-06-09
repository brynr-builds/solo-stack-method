/*
 * DEV NOTES (2026-06-09):
 * - Why: Step 1 of the build flow — the planning intake. Turns a vague idea into a structured plan
 *   for a non-technical person. Design follows verified research (NN/g, Yale, Appcues):
 *   one question at a time, tap-don't-type with smart defaults, plain language, a progress bar,
 *   and a live "your plan so far" preview (populated state beats a blank one). Deterministic → free.
 * - Calls onComplete(plan) with the generated plan (summary + SPEC.md + build brief).
 */
'use client'

import { useMemo, useRef, useState } from 'react'
import {
  SITE_TYPES, GOALS, VIBES, sectionsFor, defaultSectionIds, generatePlan,
  type Answers, type SiteType, type Goal, type Vibe,
} from '../lib/build/plan'
import { track } from '../lib/analytics'

const STEPS = ['Type', 'Idea', 'Audience', 'Goal', 'Sections', 'Style', 'Review'] as const

export default function PlanIntake({ onComplete }: { onComplete: (plan: ReturnType<typeof generatePlan>) => void }) {
  const [step, setStep] = useState(0)
  const [siteType, setSiteType] = useState<SiteType | null>(null)
  const [oneLiner, setOneLiner] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState<Goal | null>(null)
  const [sections, setSections] = useState<string[]>([])
  const [vibe, setVibe] = useState<Vibe | null>(null)

  const pct = Math.round((step / (STEPS.length - 1)) * 100)

  const canNext = useMemo(() => {
    switch (step) {
      case 0: return !!siteType
      case 1: return oneLiner.trim().length > 2
      case 2: return true // audience optional
      case 3: return !!goal
      case 4: return sections.length > 0
      case 5: return !!vibe
      default: return true
    }
  }, [step, siteType, oneLiner, goal, sections, vibe])

  const started = useRef(false)
  function pickType(t: SiteType) {
    if (!started.current) { track('plan_started'); started.current = true }
    setSiteType(t)
    setSections(defaultSectionIds(t)) // smart defaults
  }
  function toggleSection(id: string) {
    setSections((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]))
  }

  const previewGoal = GOALS.find((g) => g.id === goal)
  const previewVibe = VIBES.find((v) => v.id === vibe)

  function finish() {
    if (!siteType || !goal || !vibe) return
    track('plan_completed', { siteType, goal })
    const answers: Answers = { siteType, oneLiner, audience, goal, sections, vibe }
    onComplete(generatePlan(answers))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* progress */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
        <span>Step 1 of the Method · <span className="text-solo-primary font-medium">Plan</span></span>
        <span>{STEPS[step]} · {pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-solo-accent transition-all" style={{ width: `${Math.max(pct, 6)}%` }} />
      </div>

      <div className="card">
        {step === 0 && (
          <Q title="What are you making?" hint="Pick the closest — it just sets a sensible starting point.">
            <div className="grid sm:grid-cols-2 gap-3">
              {SITE_TYPES.map((t) => (
                <button key={t.id} onClick={() => pickType(t.id)}
                  className={`text-left border rounded-lg p-3 transition-colors ${siteType === t.id ? 'border-solo-accent bg-solo-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-semibold text-solo-primary">{t.label}</div>
                  <div className="text-sm text-gray-500">{t.blurb}</div>
                </button>
              ))}
            </div>
          </Q>
        )}

        {step === 1 && (
          <Q title="Say it in one line." hint="Plain words. This is the one thing that makes your site yours.">
            <input autoFocus value={oneLiner} onChange={(e) => setOneLiner(e.target.value)}
              placeholder="e.g. A bakery in Austin that makes custom wedding cakes"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-accent/40" />
          </Q>
        )}

        {step === 2 && (
          <Q title="Who's it for?" hint="Your ideal visitor. One short phrase is plenty. (You can skip.)">
            <input autoFocus value={audience} onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. couples planning a wedding"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-solo-accent/40" />
          </Q>
        )}

        {step === 3 && (
          <Q title="What's the ONE thing a visitor should do?" hint="The main goal. Every page will point to this.">
            <div className="grid sm:grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <button key={g.id} onClick={() => setGoal(g.id)}
                  className={`text-left border rounded-lg p-3 transition-colors ${goal === g.id ? 'border-solo-accent bg-solo-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-semibold text-solo-primary">{g.label}</div>
                  <div className="text-sm text-gray-500">button: “{g.cta}”</div>
                </button>
              ))}
            </div>
          </Q>
        )}

        {step === 4 && siteType && (
          <Q title="What should it include?" hint="We pre-picked the usual ones. Tap to add or remove.">
            <div className="grid sm:grid-cols-2 gap-2">
              {sectionsFor(siteType).map((s) => {
                const on = sections.includes(s.id)
                return (
                  <button key={s.id} onClick={() => toggleSection(s.id)}
                    className={`flex items-start gap-2 text-left border rounded-lg p-3 transition-colors ${on ? 'border-solo-accent bg-solo-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] ${on ? 'bg-solo-accent text-white' : 'border border-gray-300'}`}>{on ? '✓' : ''}</span>
                    <span><span className="font-medium text-solo-primary">{s.label}</span><span className="block text-xs text-gray-500">{s.job}</span></span>
                  </button>
                )
              })}
            </div>
          </Q>
        )}

        {step === 5 && (
          <Q title="What's the vibe?" hint="The overall feel. You can change it later.">
            <div className="grid sm:grid-cols-2 gap-3">
              {VIBES.map((v) => (
                <button key={v.id} onClick={() => setVibe(v.id)}
                  className={`flex items-center gap-3 text-left border rounded-lg p-3 transition-colors ${vibe === v.id ? 'border-solo-accent bg-solo-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="w-5 h-5 rounded-full" style={{ background: v.accent }} />
                  <span className="font-medium text-solo-primary">{v.label}</span>
                </button>
              ))}
            </div>
          </Q>
        )}

        {step === 6 && siteType && goal && vibe && (
          <Q title="Here's your plan." hint="This becomes a SPEC.md in your repo + the exact brief for your AI agent.">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-gray-700 space-y-1">
              <div><strong>{oneLiner || 'Your site'}</strong>{audience && <> — for {audience}</>}</div>
              <div>Main action: <strong>{previewGoal?.label}</strong> (button “{previewGoal?.cta}”)</div>
              <div>Sections: {sectionsFor(siteType).filter((s) => sections.includes(s.id)).map((s) => s.label).join(', ')}</div>
              <div>Style: {previewVibe?.label}</div>
            </div>
          </Q>
        )}

        {/* nav */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-0">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext}
              className="btn-primary disabled:opacity-50">{step === 2 && !audience ? 'Skip' : 'Next'} →</button>
          ) : (
            <button onClick={finish} className="btn-primary">Looks good — start building →</button>
          )}
        </div>
      </div>

      {/* live preview (populated state beats blank) */}
      {step > 0 && step < 6 && (
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-gray-400">Your plan so far: </span>
          {siteType && SITE_TYPES.find((t) => t.id === siteType)?.label}
          {oneLiner && <> · “{oneLiner}”</>}
          {previewGoal && <> · goal: {previewGoal.label.toLowerCase()}</>}
          {sections.length > 0 && step >= 4 && <> · {sections.length} sections</>}
        </div>
      )}
    </div>
  )
}

function Q({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-solo-primary mb-1">{title}</h3>
      {hint && <p className="text-sm text-gray-500 mb-4">{hint}</p>}
      {children}
    </div>
  )
}
