/*
 * DEV NOTES: Step 4 - Ship First Feature (Hello World Content Hub)
 * Phase 1: UI scaffold | Phase 2+: Real feature building with Claude
 */
import StepPageLayout from '../../../components/StepPageLayout'

export default function Step4Page() {
  return (
    <StepPageLayout
      stepNumber={4}
      title="Ship First Feature"
      description="Build your Hello World content hub — a simple app with public read and private edit capabilities."
      agent="Claude"
      agentRole="Builder"
      tasks={[
        'Create a basic content management structure',
        'Build public-facing read pages',
        'Add authenticated edit functionality',
        'Treat content updates as governed changes',
      ]}
      initialMessage="Time to build your first real feature! The Hello World Content Hub is a simple but complete application: public users can read content, authenticated users can edit it. Every change goes through our governance process. What topic would you like your content hub to focus on?"
    />
  )
}
