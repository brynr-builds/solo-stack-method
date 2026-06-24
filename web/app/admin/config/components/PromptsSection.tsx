'use client'

import React from 'react'

export function PromptsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Prompt Templates</h2>
      <p className="text-sm text-gray-600 mb-4">
        View and edit execution and audit prompt templates. Changes affect prompt generation for all users.
      </p>
      <p className="text-xs text-amber-600 mb-4">Phase 1.3: No versioning. No active/inactive toggle. Edit-only preview.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Execution Prompt Template (Claude)</h3>
        <textarea
          rows={6}
          className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono"
          defaultValue={`You are Claude, the Builder Agent.\nStep: [STEP_NUMBER] — [STEP_TITLE]\nIntent: [INTENT_SUMMARY]\n\nExecute the following tasks:\n[TASKS]\n\nRules:\n- Work on feature branch only\n- Include DEV NOTES in every file\n- Do not merge to main`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Audit Prompt Template (ChatGPT)</h3>
        <textarea
          rows={6}
          className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono"
          defaultValue={`You are ChatGPT, the Auditor Agent.\nReview the PR for Step [STEP_NUMBER]: [STEP_TITLE]\n\nCheck:\n- Governance compliance (Mode A)\n- Quality signals (Mode B)\n- No secrets, no overbuild\n- DEV NOTES present\n\nProvide: APPROVE or REJECT with reasoning.`}
        />
      </div>
    </div>
  )
}
