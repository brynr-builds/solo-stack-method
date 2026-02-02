/*
 * DEV NOTES / Intent:
 * - Why: AI Customer Support Agent that answers questions using docs, 
 *   steps, and prompt specs — NEVER executes actions or mutates data
 * - Purpose: Protect consistency by having AI handle support instead of
 *   ad-hoc human responses that might contradict governance
 * - Escalation only if: user explicitly requests human, or governance ambiguity
 * - Phase 1.3: Placeholder responses, no real AI API integration
 * - Phase 2+: Real Claude/ChatGPT API for contextual support
 *
 * Why AI handles support (and why this is better):
 * 1. AI answers are consistent — no "it depends" variance between agents
 * 2. Governance rules are always correctly cited
 * 3. Users learn the system by interacting with it
 * 4. Escalation is explicit and traceable
 * 5. Support knowledge scales without hiring
 *
 * What this does NOT do:
 * - No real AI API calls
 * - No data mutation
 * - No account changes
 * - No email or ticket creation
 * - No payment processing
 *
 * Compatibility:
 * - New route (/support), no impact on existing routes
 * - No auth required (support is public)
 * - Stateless conversation (no persistence)
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Common support questions with placeholder answers
const SUPPORT_RESPONSES: Record<string, string> = {
  'pricing': 'Solo Stack Method is $20/month. This includes access to all 7 steps, execution prompts (Claude), audit prompts (ChatGPT), the Audit Score system, and context continuation. You can cancel anytime. Your subscription sustains governance updates, prompt improvements, and audit tooling.',
  'governance': 'The Solo Stack Method uses a dual-audit governance model. Claude acts as the Builder Agent (writes code), and ChatGPT acts as the Auditor (reviews code). Neither agent can approve its own work. All changes go through: branch → PR → audit → merge. This ensures no single AI has unchecked authority over your project.',
  'audit': 'The Audit Score has two modes. Mode A (Governance) is REQUIRED and blocks progress if checks fail — these are non-negotiable like "no secrets in code" and "DEV NOTES present." Mode B (Quality) is ADVISORY only and never blocks progress — it provides quality signals like documentation completeness and enterprise readiness.',
  'steps': 'The 7 steps are: 1) Create Repo + Connect GitHub, 2) Connect Agents, 3) Add AI Contract + Guardrails, 4) Ship First Feature, 5) Run Dual Audit + Approve, 6) Deploy Preview → Production, 7) Enable Pulse + Maintenance Loop. Each step has its own AI context to prevent confusion.',
  'cancel': 'You can cancel your subscription at any time. No questions asked. Your project and all generated prompts remain accessible in read-only mode.',
  'default': 'I can help you understand the Solo Stack Method, its governance model, pricing, steps, and audit system. If your question requires human assistance or involves account-specific issues, I can escalate to the project owner.',
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('price') || lower.includes('cost') || lower.includes('$') || lower.includes('subscription')) {
    return SUPPORT_RESPONSES.pricing
  }
  if (lower.includes('governance') || lower.includes('dual') || lower.includes('agent')) {
    return SUPPORT_RESPONSES.governance
  }
  if (lower.includes('audit') || lower.includes('score') || lower.includes('mode a') || lower.includes('mode b')) {
    return SUPPORT_RESPONSES.audit
  }
  if (lower.includes('step') || lower.includes('process') || lower.includes('how')) {
    return SUPPORT_RESPONSES.steps
  }
  if (lower.includes('cancel') || lower.includes('refund')) {
    return SUPPORT_RESPONSES.cancel
  }
  if (lower.includes('human') || lower.includes('person') || lower.includes('escalat') || lower.includes('talk to')) {
    return '🔁 Escalation requested. In Phase 2+, this would create a support ticket for the project owner. For now, you can reach out via the contact information on the marketing page.'
  }
  return SUPPORT_RESPONSES.default
}

const QUICK_QUESTIONS = [
  'How does governance work?',
  'What are the 7 steps?',
  'How much does it cost?',
  'What is the Audit Score?',
  'Can I cancel anytime?',
  'I need to talk to a human',
]

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m the Solo Stack support assistant. I can help you understand the method, governance model, pricing, and steps. I answer questions using docs and specs — I never execute actions or change your data. How can I help?'
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = (text?: string) => {
    const query = text || input
    if (!query.trim()) return

    const userMsg: Message = { role: 'user', content: query }
    const aiResponse = getAIResponse(query)
    const aiMsg: Message = { role: 'assistant', content: aiResponse }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-solo-primary">
              Solo Stack Method™
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="text-gray-600 hover:text-solo-primary">Dashboard</Link>
              <Link href="/support" className="text-solo-accent font-medium">Support</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Support</h1>
          <p className="text-sm text-gray-600">
            AI-powered support — consistent answers based on docs and governance specs.
          </p>
          <p className="text-xs text-amber-600 mt-1">Phase 1.3: Pattern-matched responses. Real AI integration in Phase 2.</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[400px] max-h-[60vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-solo-accent text-white rounded-br-none'
                    : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
              />
              <button
                onClick={() => handleSend()}
                className="px-6 py-3 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Transparency Notice */}
        <div className="mt-6 bg-slate-50 rounded-lg p-4 text-xs text-gray-500">
          <strong>Why AI handles support:</strong> AI answers are consistent — governance rules are always correctly cited, 
          users learn the system by interacting with it, and escalation to a human is explicit and traceable. 
          This AI never executes actions, never modifies data, and never makes account changes.
        </div>
      </main>
    </div>
  )
}
