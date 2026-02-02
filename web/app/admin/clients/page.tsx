/*
 * DEV NOTES / Intent:
 * - Why: Lightweight CRM for founder process intelligence — NOT sales/lead management
 * - What it does NOT do: No email sending, no automation, no outreach, no Supabase
 * - Phase 1.3: Mocked user data, UI actions (tag, note, AI summary placeholder)
 * - Phase 2+: Real user data from Supabase, AI-powered blockers analysis
 *
 * Purpose: Help the founder understand WHERE users are stuck and WHY,
 *   so they can improve the process — not chase leads.
 *
 * Allowed actions: Tag user, Add internal note, Ask AI for blocker summary
 * Prohibited: Email, automation, outreach, data export, bulk actions
 *
 * Compatibility:
 * - Uses admin layout (layout.tsx)
 * - Imports from lib/mock-data.ts
 * - No external dependencies added
 */

'use client'

import { useState } from 'react'
import { MOCK_USERS, MockUser } from '../../../lib/mock-data'

export default function ClientsPage() {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS)
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)
  const [newNote, setNewNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const handleAddNote = () => {
    if (!selectedUser || !newNote.trim()) return
    const updated = users.map(u =>
      u.id === selectedUser.id ? { ...u, notes: [...u.notes, newNote.trim()] } : u
    )
    setUsers(updated)
    setSelectedUser(updated.find(u => u.id === selectedUser.id) || null)
    setNewNote('')
  }

  const handleAddTag = () => {
    if (!selectedUser || !newTag.trim()) return
    const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-')
    if (selectedUser.tags.includes(tag)) return
    const updated = users.map(u =>
      u.id === selectedUser.id ? { ...u, tags: [...u.tags, tag] } : u
    )
    setUsers(updated)
    setSelectedUser(updated.find(u => u.id === selectedUser.id) || null)
    setNewTag('')
  }

  const handleAskAI = () => {
    // Phase 1.3: Placeholder — no real AI call
    if (!selectedUser) return
    setAiSummary(
      `[PLACEHOLDER] ${selectedUser.name} is currently on Step ${selectedUser.currentStep}. ` +
      `Their latest audit score is ${selectedUser.latestAuditScore ?? 'N/A'}. ` +
      `${selectedUser.shipped ? 'They have shipped at least once.' : 'They have not shipped yet.'} ` +
      `In Phase 2+, this will use AI to analyze the user's actual progress data and identify specific blockers.`
    )
  }

  const subColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-600',
    active: 'bg-green-100 text-green-700',
    churned: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-solo-primary">Client Intelligence</h1>
        <p className="text-gray-500 mt-1">Process intelligence — not sales. All data is mocked (V1).</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-1 space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => { setSelectedUser(user); setAiSummary(null) }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedUser?.id === user.id
                  ? 'border-solo-accent bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">{user.name}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${subColors[user.subscriptionState]}`}>
                  {user.subscriptionState}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Step {user.currentStep} · Score: {user.latestAuditScore ?? '—'} · {user.shipped ? '✅ Shipped' : '⏳ Building'}
              </div>
            </button>
          ))}
        </div>

        {/* User Detail */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-solo-primary">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email} · {selectedUser.id}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Subscription</div>
                  <div className="font-semibold text-sm capitalize">{selectedUser.subscriptionState}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Current Step</div>
                  <div className="font-semibold text-sm">{selectedUser.currentStep} of 7</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Audit Score</div>
                  <div className="font-semibold text-sm">{selectedUser.latestAuditScore ?? 'N/A'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Last Active</div>
                  <div className="font-semibold text-sm">{selectedUser.lastActivity}</div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedUser.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-solo-accent/30"
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                  />
                  <button onClick={handleAddTag} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Add</button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Internal Notes</h3>
                {selectedUser.notes.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selectedUser.notes.map((note, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">{note}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-3">No notes yet.</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add internal note..."
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-solo-accent/30"
                    onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  />
                  <button onClick={handleAddNote} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Add</button>
                </div>
              </div>

              {/* AI Blocker Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Blocker Analysis</h3>
                <button
                  onClick={handleAskAI}
                  className="px-4 py-2 bg-solo-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Summarize this user&apos;s blockers
                </button>
                {aiSummary && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-600 mb-1">AI SUMMARY (PLACEHOLDER)</p>
                    <p className="text-sm text-gray-700">{aiSummary}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400">Select a client to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
