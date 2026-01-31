/*
 * DEV NOTES: Step 6 - Deploy Preview → Production
 * Phase 1: UI scaffold | Phase 2+: Real Netlify/Vercel deployment
 */
import StepPageLayout from '@/components/StepPageLayout'

export default function Step6Page() {
  return (
    <StepPageLayout
      stepNumber={6}
      title="Deploy Preview → Production"
      description="See your changes live in a preview environment before pushing to production."
      agent="Claude"
      agentRole="Builder"
      tasks={[
        'Create preview deployment from your branch',
        'Test functionality in preview environment',
        'Review deployment logs for errors',
        'Promote to production when ready',
      ]}
      initialMessage="Your changes have been approved! Now let's deploy them. I'll create a preview deployment first so you can see everything working before we push to production. This gives you one final chance to catch any issues. Ready to deploy to preview?"
    />
  )
}
