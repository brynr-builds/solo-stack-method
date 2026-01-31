/*
 * DEV NOTES: Step 7 - Enable Pulse + Maintenance Loop
 * Phase 1: UI scaffold | Phase 2+: Real Stack Pulse integration
 */
import StepPageLayout from '@/components/StepPageLayout'

export default function Step7Page() {
  return (
    <StepPageLayout
      stepNumber={7}
      title="Enable Pulse + Maintenance Loop"
      description="Stay updated as your tools evolve. Get alerts when dependencies change and maintain your project over time."
      agent="You"
      agentRole="Configuration"
      tasks={[
        'Connect your project to Stack Pulse monitoring',
        'Configure alerts for tools you depend on',
        'Set up maintenance schedule preferences',
        'Learn the governed update workflow',
      ]}
      initialMessage="Congratulations on shipping your first feature! Now let's set up ongoing maintenance. Stack Pulse will monitor the AI tools and frameworks your project depends on. When something changes, you'll be notified and can decide whether to update. What tools would you like to monitor?"
    />
  )
}
