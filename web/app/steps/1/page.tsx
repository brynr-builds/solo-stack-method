/*
 * DEV NOTES:
 * - Why: Individual step page with explanation, diagram placeholder, and AI chat
 * - Phase 1: Static UI scaffold, no real AI integration
 * - Phase 2+: Real AI chat with step-specific context and guardrails
 * 
 * STEP 1: Create Repo + Connect GitHub
 * Agent: Claude (Builder)
 */

import StepPageLayout from '../../../components/StepPageLayout'

export default function Step1Page() {
  const leftColumnContent = (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
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
    </>
  )

  return (
    <StepPageLayout
      stepNumber={1}
      title="Create Repo + Connect GitHub"
      description="Start by creating a GitHub repository. This will be the source of truth for your project."
      agent="Claude"
      agentRole="Builder"
      initialMessage="I'm Claude, your Builder agent for this step. I'll help you create a GitHub repository and connect it to your project. What would you like to name your project?"
      mockResponseMessage="Great choice! I'll create a repository with that name. Before I proceed, I need to explain what I'm about to do:\n\n1. Create a new GitHub repository\n2. Initialize it with a README and .gitignore\n3. Add the Solo Stack governance files\n\nDo you approve this action?"
      leftColumnContent={leftColumnContent}
    />
  )
}
