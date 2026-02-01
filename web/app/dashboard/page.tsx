/*
 * DEV NOTES:
 * - Why: Main dashboard showing project status and step navigation
 * - Phase 1: Static UI, no real project data
 * - Phase 2+: Real project state from Supabase, progress tracking
 * 
 * REQUIREMENTS:
 * - One project per user (v1 constraint)
 * - 7 practical steps with status indicators
 * - Governance visibility (which agent is acting)
 */

'use client'

import Link from 'next/link'

const steps = [
  { 
    id: 1, 
    title: 'Create Repo + Connect GitHub',
    description: 'Establish your project foundation with version control',
    status: 'current',
    agent: 'Claude',
  },
  { 
    id: 2, 
    title: 'Connect Agents',
    description: 'Link Claude (Builder), ChatGPT (Auditor), and optionally Cursor',
    status: 'locked',
    agent: 'You',
  },
  { 
    id: 3, 
    title: 'Add AI Contract + Guardrails',
    description: 'Define what AI can and cannot do in your project',
    status: 'locked',
    agent: 'Claude',
  },
  { 
    id: 4, 
    title: 'Ship First Feature',
    description: 'Build your Hello World content hub with guided execution',
    status: 'locked',
    agent: 'Claude',
  },
  { 
    id: 5, 
    title: 'Run Dual Audit + Approve',
    description: 'ChatGPT reviews, you approve before any merge',
    status: 'locked',
    agent: 'ChatGPT',
  },
  { 
    id: 6, 
    title: 'Deploy Preview → Production',
    description: 'See it live before pushing to production',
    status: 'locked',
    agent: 'Claude',
  },
  { 
    id: 7, 
    title: 'Enable Pulse + Maintenance Loop',
    description: 'Stay updated as your tools evolve',
    status: 'locked',
    agent: 'You',
  },
]

export default function DashboardPage() {
  const currentStep = steps.find(s => s.status === 'current')
  const completedSteps = steps.filter(s => s.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-solo-primary">
            Solo Stack Method™
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pulse" className="text-gray-600 hover:text-solo-primary text-sm">
              Stack Pulse
            </Link>
            <Link href="/audit-score" className="text-gray-600 hover:text-solo-primary text-sm">
              Audit Score
            </Link>
            <div className="h-8 w-8 rounded-full bg-solo-accent text-white flex items-center justify-center text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-solo-primary mb-2">Your Project</h1>
          <p className="text-gray-600">
            {completedSteps} of {steps.length} steps completed
          </p>
        </div>

        {/* Governance Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-solo-accent text-white flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <div>
            <div className="font-medium text-solo-primary">
              Current Agent: <span className="text-solo-accent">{currentStep?.agent}</span>
            </div>
            <div className="text-sm text-gray-600">
              Context Source: GitHub Repository
            </div>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full font-medium">
              Audit Required
            </span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Link 
              key={step.id}
              href={step.status !== 'locked' ? `/steps/${step.id}` : '#'}
              className={`block bg-white rounded-xl border p-6 transition-all ${
                step.status === 'current'
                  ? 'border-solo-accent shadow-lg'
                  : step.status === 'completed'
                    ? 'border-green-200'
                    : 'border-gray-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step.status === 'completed'
                    ? 'bg-solo-success text-white'
                    : step.status === 'current'
                      ? 'bg-solo-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.status === 'completed' ? '✓' : step.id}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    {step.status === 'current' && (
                      <span className="px-2 py-0.5 bg-solo-accent/10 text-solo-accent text-xs rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Agent: {step.agent}</span>
                    {step.status !== 'locked' && (
                      <span className="text-solo-accent">Click to continue →</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Why Step-Scoped Chat */}
        <div className="mt-12 bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Why Each Step Has Its Own AI Context</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Traditional AI chat accumulates context over time, leading to confusion and errors. 
            Solo Stack Method isolates each step's AI conversation, ensuring the AI only sees 
            what's relevant to that specific task. This prevents context pollution and enables 
            step-specific guardrails that keep AI focused on the immediate goal.
          </p>
        </div>
      </div>
    </div>
  )
}
