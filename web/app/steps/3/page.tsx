/*
 * DEV NOTES: Step 3 - Add AI Contract + Guardrails
 * Phase 1: UI scaffold | Phase 2+: Real contract generation
 */
import StepPageLayout from '../../../components/StepPageLayout'

export default function Step3Page() {
  return (
    <StepPageLayout
      stepNumber={3}
      title="Add AI Contract + Guardrails"
      description="Define what AI can and cannot do in your project. This becomes the governing document for all AI actions."
      agent="Claude"
      agentRole="Builder"
      tasks={[
        'Generate AI_CONTRACT.md with operational boundaries',
        'Define what actions require human approval',
        'Set up branch protection rules',
        'Create audit requirements for each change type',
      ]}
      initialMessage="I'll help you create an AI Contract that defines the rules for this project. This contract will specify what I can do autonomously vs. what requires your explicit approval. Shall we start with the default Solo Stack contract template?"
    />
  )
}
