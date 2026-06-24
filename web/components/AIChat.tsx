'use client'

import { useState } from 'react'

interface AIChatProps {
  agentName: string
  agentRole?: string
  initialMessage: string
  mockResponse?: string
  stepNumber?: number
}

export default function AIChat({
  agentName,
  agentRole,
  initialMessage,
  mockResponse,
  stepNumber
}: AIChatProps) {
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage }
  ])

  const handleSend = () => {
    if (!chatInput.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: chatInput }])

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: mockResponse || "This is a Phase 1 placeholder. Real AI integration coming in Phase 2."
      }])
    }, 1000)

    setChatInput('')
  }

  return (
    <div className="card flex flex-col h-[500px] p-0 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-solo-accent text-white flex items-center justify-center font-bold">
            {agentName.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{agentName} {agentRole && `(${agentRole})`}</div>
            {stepNumber && <div className="text-xs text-gray-500">Step {stepNumber} Context Only</div>}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
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
      <div className="p-4 border-t border-gray-200 bg-white">
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
        {stepNumber && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            This chat is isolated to Step {stepNumber}. Context resets between steps.
          </p>
        )}
      </div>
    </div>
  )
}
