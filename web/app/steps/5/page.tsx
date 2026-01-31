/*
 * DEV NOTES: Step 5 - Run Dual Audit + Approve
 * Phase 1: UI scaffold | Phase 2+: Real ChatGPT audit integration
 */
import StepPageLayout from '@/components/StepPageLayout'

export default function Step5Page() {
  return (
    <StepPageLayout
      stepNumber={5}
      title="Run Dual Audit + Approve"
      description="ChatGPT reviews Claude's work. You approve before any code merges to main."
      agent="ChatGPT"
      agentRole="Auditor"
      tasks={[
        'Generate audit packet from Claude\'s changes',
        'ChatGPT reviews code quality and safety',
        'Verify governance rules were followed',
        'Present findings for your final approval',
      ]}
      initialMessage="I'm ChatGPT, your auditor for this project. I've received the changes Claude proposed in the previous step. Let me review them against your AI Contract and governance rules. I'll present my findings and you'll make the final call on whether to approve the merge."
    />
  )
}
