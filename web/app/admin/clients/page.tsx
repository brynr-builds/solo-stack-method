/*
 * DEV NOTES / Intent:
 * - Why: Lightweight CRM for process intelligence (NOT sales)
 * - Purpose: Understand where users are, what's blocking them, 
 *   and how the process is performing per-user
 * - Phase 1.3: All data mocked, no database, no real users
 * - Phase 2+: Real user data from Supabase
 *
 * What this does NOT do:
 * - No email sending
 * - No automation
 * - No outreach
 * - No lead scoring
 * - No CRM integrations (Hubspot, Salesforce, etc.)
 *
 * Allowed actions (V1):
 * - Tag user (local state only)
 * - Add internal note (local state only)
 * - Ask AI: "Summarize this user's blockers" (placeholder)
 *
 * Compatibility:
 * - New route (/admin/clients), no impact on existing routes
 * - Uses shared MockData
 * - AdminGuard for access control
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import AdminGuard from '../../../components/AdminGuard'
import { MOCK_USERS, MockUser } from '../../../components/MockData'

export default function CRMPage() {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS)
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)
  const [newNote, setNewNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const filteredUsers = filterStatus === 'all'
    ? users
    : users.filter(u => u.subscriptionState === filterStatus)

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedUser) return
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id
        ? { ...u, notes: [...u.notes, newNote] }
        : u
    ))
    setSelectedUser(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : null)
    setNewNote('')
  }

  const handleAddTag = () => {
    if (!newTag.trim() || !selectedUser) return
    if (selectedUser.tags.includes(newTag)) return
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id
        ? { ...u, tags: [...u.tags, newTag] }
        : u
    ))
    setSelectedUser(prev => prev ? { ...prev, tags: [...prev.tags, newTag] } : null)
    setNewTag('')
  }

  const handleAskAI = (user: MockUser) => {
    // Phase 1.3: Simulated AI response
    setAiSummary(
      `[Phase 1.3 Placeholder — AI Blocker Summary for ${user.name}]\n\n` +
      `Current step: ${user.currentStep}/7\n` +
      `Subscription: ${user.subscriptionState}\n` +
      `Last active: ${new Date(user.lastActivity).toLocaleDateString()}\n` +
      `Audit score: ${user.latestAuditScore ?? 'N/A'}\n\n` +
      `Notes: ${user.notes.length > 0 ? user.notes.join('; ') : 'No notes recorded.'}\n\n` +
      (user.currentStep <= 3
        ? `Likely blockers: User appears stuck in early setup. Consider checking if they understand the governance model or need help with Git fundamentals.`
        : user.currentStep <= 5
        ? `Likely blockers: User is in the build/audit cycle. May need clearer prompt generation or audit guidance.`
        : `User is in the deployment phase. Check if Netlify setup or Pulse configuration is causing friction.`) +
      `\n\n[This is a simulated response. Real AI analysis in Phase 2.]`
    )
  }

  const statusColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    churned: 'bg-red-100 text-red-700',
    trial: 'bg-amber-100 text-amber-700',
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-bold text-solo-primary">Solo Stack Method™</Link>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ADMIN</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-gray-600 hover:text-solo-primary">Dashboard</Link>
                <Link href="/admin/clients" className="text-solo-accent font-medium">CRM</Link>
                <Link href="/admin/config" className="text-gray-600 hover:text-solo-primary">Config</Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-solo-primary">← User View</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Intelligence</h1>
            <p className="text-gray-600">Process intelligence — understand where users are and what's blocking them.</p>
            <p className="text-xs text-amber-600 mt-1">Phase 1.3 — All data mocked. No real users. No email. No automation.</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'active', 'free', 'trial', 'churned'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-solo-accent text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status} ({status === 'all' ? users.length : users.filter(u => u.subscriptionState === status).length})
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User List */}
            <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => { setSelectedUser(user); setAiSummary(null) }}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 border-solo-accent'
                      : 'bg-white border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[user.subscriptionState]}`}>
                      {user.subscriptionState}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Step {user.currentStep}/7 • {user.shipped ? '✓ Shipped' : 'Not shipped'}
                  </div>
                </button>
              ))}
            </div>

            {/* User Detail */}
            <div className="lg:col-span-2">
              {selectedUser ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                        <p className="text-sm text-gray-500">{selectedUser.email} • {selectedUser.id}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[selectedUser.subscriptionState]}`}>
                        {selectedUser.subscriptionState}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-500">Step:</span> <span className="font-medium">{selectedUser.currentStep}/7</span></div>
                      <div><span className="text-gray-500">Shipped:</span> <span className="font-medium">{selectedUser.shipped ? 'Yes' : 'No'}</span></div>
                      <div><span className="text-gray-500">Audit:</span> <span className="font-medium">{selectedUser.latestAuditScore ?? '—'}</span></div>
                      <div><span className="text-gray-500">Last active:</span> <span className="font-medium">{new Date(selectedUser.lastActivity).toLocaleDateString()}</span></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedUser.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{tag}</span>
                      ))}
                      {selectedUser.tags.length === 0 && <span className="text-xs text-gray-400">No tags</span>}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add tag..."
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
                      />
                      <button onClick={handleAddTag} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Add</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Internal Notes</h3>
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {selectedUser.notes.map((note, i) => (
                        <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded p-2">{note}</div>
                      ))}
                      {selectedUser.notes.length === 0 && <span className="text-xs text-gray-400">No notes</span>}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        placeholder="Add internal note..."
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
                      />
                      <button onClick={handleAddNote} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Add</button>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-700">AI Blocker Summary</h3>
                      <button
                        onClick={() => handleAskAI(selectedUser)}
                        className="px-3 py-1.5 bg-solo-primary text-white rounded text-sm hover:bg-gray-800 transition-colors"
                      >
                        Summarize Blockers
                      </button>
                    </div>
                    {aiSummary ? (
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans bg-gray-50 rounded-lg p-4">{aiSummary}</pre>
                    ) : (
                      <p className="text-xs text-gray-400">Click "Summarize Blockers" to generate an AI analysis.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <p className="text-gray-500">Select a user to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
