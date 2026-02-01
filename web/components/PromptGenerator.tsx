/*
 * DEV NOTES / Intent:
 * - Why: Core differentiator - governed AI prompt generation system
 * - Prompts are TEXT ARTIFACTS, copy/paste executable, versioned, governed
 * - NO auto-execution - human copy/paste is intentional and preferred
 * - Phase 1.2: Static prompt templates with intent.md integration
 * - Phase 2+: Dynamic prompt assembly from context system
 * 
 * Prompt Lifecycle:
 * Intent → Draft Prompt → User Approval → Executable Prompt → Audit Packet → Hardened Prompt
 * 
 * Compatibility: 
 * - Used by StepPageLayout and individual step pages
 * - Does not depend on external APIs
 * - Gated by SubscriptionGate component
 */

'use client'

import { useState } from 'react'

interface PromptGeneratorProps {
  stepNumber: number
  stepTitle: string
  intentSummary: string
  isSubscribed?: boolean
  onSubscriptionRequired?: () => void
}

// Prompt templates for each step
const EXECUTION_PROMPTS: Record<number, string> = {
  1: `# Execution Prompt — Step 1: Create Repo + Connect GitHub
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Initialize a governed repository that serves as the single source of truth for the entire project.

### CONSTRAINTS
- Repository MUST be created before any code is written
- Never commit secrets (API keys, passwords, tokens)
- Main branch is production — never commit directly
- All work happens on feature branches
- Repo-as-Truth™: context, prompts, and governance live in-repo

### COMPATIBILITY CHECK (REQUIRED)
Before making any changes:
- Compare against existing code
- Do not break routes, connectors, or deployment
- Preserve all imports and layouts

### TASKS
1. Create a new GitHub repository with appropriate name
2. Initialize with README documenting project intent
3. Add .gitignore for Node.js/Next.js projects
4. Set up branch protection rules for main
5. Create initial feature branch for development

### OUTPUT REQUIRED
- Repository URL
- Branch protection confirmation
- Initial commit hash
- Screenshot or link showing setup complete

### WORKFLOW
1. Create branch (if repo exists) or initialize repo
2. Make changes in logical commits
3. Open PR targeting main
4. Generate Audit Packet
5. STOP — await Final Auditor review

DO NOT MERGE without audit approval.`,

  2: `# Execution Prompt — Step 2: Choose Your Tech Stack
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Select appropriate technologies based on project requirements, not trend-chasing.

### CONSTRAINTS
- Decisions must be documented with reasoning
- Trade-offs must be explicit
- Stack must be compatible with solo developer capacity
- Consider deployment target (Netlify, Vercel, etc.)

### COMPATIBILITY CHECK (REQUIRED)
Before making any changes:
- Compare against existing code
- Do not break routes, connectors, or deployment
- Preserve all imports and layouts

### TASKS
1. Document tech stack choices in DEV_NOTES.md
2. Explain trade-offs for each major decision
3. Set up package.json with dependencies
4. Configure TypeScript if applicable
5. Verify deployment compatibility

### OUTPUT REQUIRED
- DEV_NOTES.md with stack justification
- package.json with dependencies
- Configuration files created
- Compatibility confirmation

### WORKFLOW
1. Create feature branch
2. Document decisions before coding
3. Commit configuration files
4. Open PR with rationale
5. STOP — await Final Auditor review

DO NOT MERGE without audit approval.`,

  3: `# Execution Prompt — Step 3: Create Context Anchors
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Establish explicit context documents that AI agents and human auditors can reference.

### CONSTRAINTS
- Context must be human-readable
- Context must be diffable (version-controlled)
- Context must be auditable
- No hidden context — everything explicit in repo

### COMPATIBILITY CHECK (REQUIRED)
Before making any changes:
- Compare against existing code
- Do not break routes, connectors, or deployment
- Preserve all imports and layouts

### TASKS
1. Create intent.md files for each component/feature
2. Document key decisions with rationale
3. Establish context anchors for AI agents
4. Ensure context is sufficient for handoff

### OUTPUT REQUIRED
- intent.md files created
- Decision log updated
- Context sufficient for takeover test
- All files have DEV NOTES

### WORKFLOW
1. Create feature branch
2. Create context documents
3. Commit with clear messages
4. Open PR
5. STOP — await Final Auditor review

DO NOT MERGE without audit approval.`,

  4: `# Execution Prompt — Step 4: Build Features
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Implement features through governed AI-assisted development with proper separation of duties.

### CONSTRAINTS
- Builder agent (Claude) writes code
- All changes go through branch → PR pattern
- DEV NOTES required for every new/modified file
- No direct commits to main

### COMPATIBILITY CHECK (REQUIRED)
Before making any changes:
- Read existing files fully
- Compare against existing code
- Do not break routes, connectors, or deployment
- Preserve all imports and layouts
- Test that existing functionality still works

### TASKS
1. Create feature branch with descriptive name
2. Implement feature in logical commits
3. Add DEV NOTES to every new/modified file
4. Test locally before committing
5. Open PR with full description

### OUTPUT REQUIRED
- Feature branch created
- Code implemented with DEV NOTES
- Local testing confirmed
- PR opened with description
- Audit Packet generated

### WORKFLOW
1. Create feature branch
2. Build incrementally with commits
3. Test thoroughly
4. Open PR
5. Generate Audit Packet
6. STOP — await Final Auditor review

DO NOT MERGE without audit approval.`,

  5: `# Execution Prompt — Step 5: Test & Validate
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Verify that built features work correctly and meet requirements.

### CONSTRAINTS
- Testing must happen before audit
- Both automated and manual validation
- Edge cases should be considered
- Accessibility basics should be checked

### COMPATIBILITY CHECK (REQUIRED)
Before making any changes:
- Compare against existing code
- Do not break routes, connectors, or deployment
- Verify all routes still accessible

### TASKS
1. Run build process (npm run build)
2. Test all routes manually
3. Check for console errors
4. Verify responsive design
5. Document test results

### OUTPUT REQUIRED
- Build output (success/failure)
- Route testing checklist
- Console error report
- Responsive design confirmation
- Test summary document

### WORKFLOW
1. Run full build
2. Execute test checklist
3. Document findings
4. Fix any issues found
5. STOP — await Final Auditor review

DO NOT MERGE without audit approval.`,

  6: `# Execution Prompt — Step 6: Final Audit
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are acting as the Final Auditor in Solo Stack Method™.

### INTENT
Independent verification by a different AI agent (separation of duties).

### YOUR ROLE
- You did NOT build this code
- You verify it independently
- You cite evidence for all findings
- You can APPROVE or REQUEST CHANGES

### AUDIT CHECKLIST
1. Contract Compliance
   - All requirements from prompt met?
   - No unauthorized additions?
   
2. Scope Compliance
   - Built only what was specified?
   - No overbuild?
   
3. Governance Compliance
   - DEV NOTES in all files?
   - Compatibility confirmed?
   - No secrets committed?
   
4. Quality Check
   - Code is readable?
   - Documentation complete?
   - Tests pass?

### OUTPUT REQUIRED
- Audit verdict: APPROVE or CHANGES REQUESTED
- Evidence for each finding (file paths, line numbers)
- If CHANGES REQUESTED: specific issues to fix

### WORKFLOW
1. Review all changed files
2. Check against requirements
3. Verify compatibility
4. Document findings
5. Issue verdict

DO NOT APPROVE without evidence.
Builder cannot audit their own work.`,

  7: `# Execution Prompt — Step 7: Deploy
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: Claude (Builder)

You are acting as the Builder Agent in Solo Stack Method™.

### INTENT
Ship the audited, approved changes to production.

### CONSTRAINTS
- Only deploy after audit approval
- Merge PR to main (main = production)
- Monitor for deployment errors
- Have rollback plan ready

### PRE-DEPLOYMENT CHECKLIST
- [ ] Audit verdict is APPROVE
- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Deployment config valid

### TASKS
1. Confirm audit approval received
2. Merge PR to main
3. Monitor deployment
4. Verify production site
5. Document deployment

### OUTPUT REQUIRED
- Audit approval confirmation
- Merge commit hash
- Deployment status
- Production URL verification
- Rollback plan documented

### WORKFLOW
1. Confirm audit approval
2. Merge PR
3. Monitor deployment
4. Verify live site
5. Document completion

ONLY DEPLOY with audit approval.`
}

const AUDIT_PROMPTS: Record<number, string> = {
  1: `# Audit Prompt — Step 1: Create Repo + Connect GitHub
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Claude built this. You verify independently.

### VERIFY
1. Repository exists and is accessible
2. Main branch has protection rules
3. .gitignore is appropriate
4. README documents project intent
5. No secrets committed

### EVIDENCE REQUIRED
- Repository URL
- Screenshot of branch protection
- .gitignore contents
- README contents

### VERDICT OPTIONS
- APPROVE: All checks pass
- CHANGES REQUESTED: List specific issues`,

  2: `# Audit Prompt — Step 2: Tech Stack
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Claude built this. You verify independently.

### VERIFY
1. Tech stack documented with reasoning
2. Trade-offs explained
3. Dependencies appropriate
4. Deployment compatible

### EVIDENCE REQUIRED
- DEV_NOTES.md contents
- package.json review
- Configuration files

### VERDICT OPTIONS
- APPROVE: All checks pass
- CHANGES REQUESTED: List specific issues`,

  3: `# Audit Prompt — Step 3: Context Anchors
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Claude built this. You verify independently.

### VERIFY
1. intent.md files exist
2. Context is human-readable
3. Decisions documented
4. Sufficient for handoff

### EVIDENCE REQUIRED
- List of intent.md files
- Sample content review
- Decision log

### VERDICT OPTIONS
- APPROVE: All checks pass
- CHANGES REQUESTED: List specific issues`,

  4: `# Audit Prompt — Step 4: Build Features
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Claude built this. You verify independently.

### VERIFY
1. Feature branch used
2. PR opened with description
3. DEV NOTES in all files
4. Compatibility preserved
5. No overbuild

### EVIDENCE REQUIRED
- PR link
- File diff review
- DEV NOTES check
- Route testing

### VERDICT OPTIONS
- APPROVE: All checks pass
- CHANGES REQUESTED: List specific issues`,

  5: `# Audit Prompt — Step 5: Test & Validate
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Claude built this. You verify independently.

### VERIFY
1. Build passes
2. All routes work
3. No console errors
4. Responsive design
5. Test documentation

### EVIDENCE REQUIRED
- Build output
- Route test results
- Console log
- Test summary

### VERDICT OPTIONS
- APPROVE: All checks pass
- CHANGES REQUESTED: List specific issues`,

  6: `# Audit Prompt — Step 6: Self-Check
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

This step IS the audit. No separate audit prompt needed.

Use the Execution Prompt for Step 6 to perform the audit.`,

  7: `# Audit Prompt — Step 7: Deploy
## Prompt Version: v1.0
## Generated: {{TIMESTAMP}}
## Agent: ChatGPT (Auditor)

You are the Final Auditor. Verify deployment readiness.

### VERIFY
1. Audit approval exists
2. All tests pass
3. No merge conflicts
4. Config valid

### EVIDENCE REQUIRED
- Audit verdict
- Test results
- Merge status
- Deployment config

### VERDICT OPTIONS
- APPROVE TO DEPLOY: Ready for production
- HOLD: Issues to resolve first`
}

export default function PromptGenerator({
  stepNumber,
  stepTitle,
  intentSummary,
  isSubscribed = false,
  onSubscriptionRequired
}: PromptGeneratorProps) {
  const [showExecutionPrompt, setShowExecutionPrompt] = useState(false)
  const [showAuditPrompt, setShowAuditPrompt] = useState(false)
  const [copied, setCopied] = useState<'execution' | 'audit' | null>(null)

  const timestamp = new Date().toISOString()

  const getPrompt = (type: 'execution' | 'audit') => {
    const template = type === 'execution' 
      ? EXECUTION_PROMPTS[stepNumber] 
      : AUDIT_PROMPTS[stepNumber]
    return template?.replace('{{TIMESTAMP}}', timestamp) || 'Prompt not available'
  }

  const handleCopy = async (type: 'execution' | 'audit') => {
    const prompt = getPrompt(type)
    await navigator.clipboard.writeText(prompt)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleGenerateExecution = () => {
    setShowExecutionPrompt(true)
    setShowAuditPrompt(false)
  }

  const handleGenerateAudit = () => {
    if (!isSubscribed) {
      onSubscriptionRequired?.()
      return
    }
    setShowAuditPrompt(true)
    setShowExecutionPrompt(false)
  }

  return (
    <div className="space-y-4">
      {/* Prompt Generation Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerateExecution}
          className="px-4 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Execution Prompt
        </button>
        
        <button
          onClick={handleGenerateAudit}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            isSubscribed 
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Generate Audit Prompt
          {!isSubscribed && <span className="text-xs">(Subscription Required)</span>}
        </button>
      </div>

      {/* Prompt Lifecycle Info */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>Prompt Lifecycle:</span>
        <span className="font-mono">Intent → Draft → Approval → Execute → Audit → Harden</span>
      </div>

      {/* Execution Prompt Display */}
      {showExecutionPrompt && (
        <div className="bg-slate-900 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Execution Prompt — Step {stepNumber}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('execution')}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                {copied === 'execution' ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setShowExecutionPrompt(false)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300 max-h-96 overflow-y-auto">
            {getPrompt('execution')}
          </pre>
          <div className="mt-4 p-3 bg-amber-900/50 rounded-lg text-amber-200 text-sm">
            <strong>Instructions:</strong> Copy this prompt and paste it into Claude. 
            Do NOT auto-execute. Human review is required before each step.
          </div>
        </div>
      )}

      {/* Audit Prompt Display */}
      {showAuditPrompt && isSubscribed && (
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Audit Prompt — Step {stepNumber}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('audit')}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                {copied === 'audit' ? '✓ Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setShowAuditPrompt(false)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300 max-h-96 overflow-y-auto">
            {getPrompt('audit')}
          </pre>
          <div className="mt-4 p-3 bg-blue-900/50 rounded-lg text-blue-200 text-sm">
            <strong>Instructions:</strong> Copy this prompt and paste it into ChatGPT (not Claude). 
            The auditor must be different from the builder.
          </div>
        </div>
      )}
    </div>
  )
}
