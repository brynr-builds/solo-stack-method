/*
 * DEV NOTES:
 * - Why: Step 2 - Connect AI agents to the project
 * - Phase 1: UI scaffold
 * - Phase 2+: OAuth connections to Claude API, ChatGPT API
 */

import StepPageLayout from '../../../components/StepPageLayout'

export default function Step2Page() {
  return (
    <StepPageLayout
      stepNumber={2}
      title="Connect Agents"
      description="Link your AI agents to the project. Claude builds, ChatGPT audits, and Cursor (optional) stabilizes."
      agent="You"
      agentRole="Configuration"
      tasks={[
        'Connect Claude API for building features',
        'Connect ChatGPT API for audit reviews',
        'Optionally connect Cursor for code stabilization',
        'Verify all connections work correctly',
      ]}
      initialMessage="This step requires you to configure your AI agent connections. You'll need API keys for Claude and ChatGPT. Would you like me to guide you through the process?"
    />
  )
}
