/*
 * DEV NOTES:
 * - Why: Individual step page with explanation, diagram placeholder, and AI chat
 * - Phase 1: Static UI scaffold, no real AI integration
 * - Phase 2+: Real AI chat with step-specific context and guardrails
 * 
 * STEP 1: Create Repo + Connect GitHub
 * Agent: Claude (Builder)
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Step1Page() {
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I'm Claude, your Builder agent for this step. I'll help you create a GitHub repository and connect it to your project. What would you like to name your project?" }
  ])

  const handleSend = () => {
    if (!chatInput.trim()) return
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: chatInput }])
    
    // TODO Phase 2: Real AI integration with step-specific context
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Great choice! I'll create a repository with that name. Before I proceed, I need to explain what I'm about to do:\n\n1. Create a new GitHub repository\n2. Initialize it with a README and .gitignore\n3. Add the Solo Stack governance files\n\nDo you approve this action?" 
      }])
    }, 1000)
    
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-solo-primary">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Step 1 of 7</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-[14%] h-full bg-solo-accent"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Explanation */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-solo-accent text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h1 className="text-2xl font-bold">Create Repo + Connect GitHub</h1>
              </div>
              
              <p className="text-gray-600 mb-6">
                Every Solo Stack project starts with a GitHub repository. This becomes your 
                source of truth — all context, code, and governance files live here.
              </p>

              <h3 className="font-semibold mb-3">What happens in this step:</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-solo-success mt-1">✓</span>
                  <span>Create a new GitHub repository for your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-solo-success mt-1">✓</span>
                  <span>Initialize with governance files (AI_CONTRACT.md, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-solo-success mt-1">✓</span>
                  <span>Connect your GitHub account to Solo Stack</span>
                </li>
              </ul>

              {/* Governance Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-solo-primary">Active Agent:</span>
                  <span className="px-2 py-0.5 bg-solo-accent text-white text-xs rounded-full">Claude (Builder)</span>
                </div>
                <p className="text-sm text-gray-600">
                  Claude will propose actions and explain each step before execution. 
                  You must approve before any changes are made.
                </p>
              </div>
            </div>

            {/* Diagram Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">How It Works</h3>
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">Diagram: GitHub → Solo Stack → Your Project</p>
                <p className="text-xs text-gray-400 mt-2">
                  [Phase 2: Interactive diagram showing data flow]
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-solo-accent text-white flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <div className="font-medium">Claude (Builder)</div>
                  <div className="text-xs text-gray-500">Step 1 Context Only</div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-solo-accent text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-solo-accent focus:ring-2 focus:ring-solo-accent/20 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-solo-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                This chat is isolated to Step 1. Context resets between steps.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Link href="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
          <button className="btn-primary opacity-50 cursor-not-allowed" disabled>
            Complete Step 1 →
          </button>
        </div>
      </div>
    </div>
  )
}
