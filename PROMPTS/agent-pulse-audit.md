# Agent Pulse Audit Prompt

> **Intent (Dev Notes):**  
> This prompt is used during weekly Agent Capability Pulse reviews to analyze agent performance and recommend role assignments.  
> It combines internal metrics with verified external updates to produce evidence-based recommendations.

---

## Role

You are analyzing agent performance for the Solo Stack Method™ weekly pulse review.

Your goal is to:
1. Assess each agent's performance based on internal signals
2. Incorporate verified external model updates
3. Recommend role assignment changes (if any)
4. Maintain objectivity and evidence-based reasoning

---

## Input Required

Before running this analysis, gather:

### Internal Signals (Past Week)

```yaml
# Fill in for each agent
internal_signals:
  Claude:
    prs_completed: [number]
    prs_approved_first_try: [number]
    audit_verdicts_given: [number]
    audit_verdicts_correct: [number]  # Held up post-merge
    issues_introduced: [number]
    average_iterations: [number]
    notable_events: [list]
    
  ChatGPT:
    prs_completed: [number]
    prs_approved_first_try: [number]
    audit_verdicts_given: [number]
    audit_verdicts_correct: [number]
    issues_introduced: [number]
    average_iterations: [number]
    notable_events: [list]
```

### Verified External Updates

```yaml
# Only include VERIFIED updates from official sources
external_updates:
  - agent: [name]
    update: [description]
    source: [URL]
    verified: true
    impact: [low/medium/high]
    
# Or: "No verified updates this week"
```

### Current State

```yaml
# From agents/agent-profiles.yaml
current_assignments:
  Builder: [agent]
  Final_Auditor: [agent]
  
current_confidence:
  Claude:
    Builder: [0-100]
    Final_Auditor: [0-100]
  ChatGPT:
    Builder: [0-100]
    Final_Auditor: [0-100]
    
advisory_status:
  Claude:
    Builder: [cycles completed]/5
    Final_Auditor: [cycles completed]/5
  ChatGPT:
    Builder: [cycles completed]/5
    Final_Auditor: [cycles completed]/5
```

---

## Analysis Framework

### Step 1: Calculate Performance Metrics

For each agent, calculate:

```
Completion Rate = prs_approved_first_try / prs_completed
Audit Accuracy = audit_verdicts_correct / audit_verdicts_given
Issue Rate = issues_introduced / prs_completed
```

### Step 2: Confidence Adjustment

Adjust confidence scores based on performance:

| Metric | Adjustment |
|--------|------------|
| Completion Rate > 80% | +5 confidence |
| Completion Rate < 50% | -10 confidence |
| Audit Accuracy > 90% | +5 confidence |
| Audit Accuracy < 70% | -10 confidence |
| Issues Introduced > 0 | -5 per issue |
| Clean week (0 issues) | +2 confidence |

Cap confidence at 0-100.

### Step 3: External Update Impact

If verified external updates exist:

- **Major capability improvement:** Note but do NOT auto-increase confidence
- **Known regression/bug:** May trigger advisory mode reset
- **Neutral updates:** No confidence change

**Critical Rule:**
```
⚠️ UNVERIFIED CLAIMS DO NOT AFFECT CONFIDENCE OR ROLES
```

### Step 4: Role Change Analysis

Consider role changes when:

1. **Confidence divergence** — One agent significantly outperforms another
2. **Regression detected** — Agent shows declining performance
3. **Advisory completion** — Agent completes 5 clean cycles in a role
4. **External impact** — Verified update affects capabilities

---

## Output Format

```markdown
# Agent Pulse Analysis: Week of [DATE]

## Performance Summary

### Claude
- Completion Rate: [%]
- Audit Accuracy: [%]
- Issues Introduced: [count]
- Confidence Adjustment: [+/- amount]
- New Confidence:
  - Builder: [score]
  - Final_Auditor: [score]

### ChatGPT
- Completion Rate: [%]
- Audit Accuracy: [%]
- Issues Introduced: [count]
- Confidence Adjustment: [+/- amount]
- New Confidence:
  - Builder: [score]
  - Final_Auditor: [score]

## External Updates Impact

[Summary of verified updates and their impact, or "No verified updates"]

## Recommendations

### Role Changes
| Agent | Role | Current | Recommended | Reason |
|-------|------|---------|-------------|--------|
| [name] | [role] | [status] | [change] | [evidence] |

*Or: "No role changes recommended this week."*

### Advisory Status Updates
- [Agent]: [Role] - [cycles completed]/5 cycles → [status]

### Confidence Score Updates
- [Agent]: [Role] - [old score] → [new score] ([reason])

## Human Action Required

- [ ] Review recommendations
- [ ] Approve/reject role changes
- [ ] Update agent-profiles.yaml
- [ ] Log decision in pulse-decisions.md

---

*Analysis generated using PROMPTS/agent-pulse-audit.md*
```

---

## Rules

1. **Evidence Only** — Base all analysis on provided data, not assumptions
2. **Verified Updates Only** — Ignore unverified capability claims
3. **Conservative Changes** — When in doubt, recommend no change
4. **Independence Preserved** — Never recommend same agent for Builder + Final Auditor
5. **Human Final Say** — All recommendations require human approval

---

## Edge Cases

### No Activity This Week
```
Recommendation: Maintain current assignments.
Reason: Insufficient data for analysis.
Note: Confidence scores unchanged.
```

### Both Agents Underperforming
```
Recommendation: Flag for human review.
Reason: No clear better choice between agents.
Action: Consider bringing in additional agent or human oversight.
```

### New Agent Added
```
Recommendation: Start in advisory mode for all roles.
Reason: No performance history.
Action: Set advisory_cycles_completed = 0 for all roles.
```

---

*Last updated: Governed by AI_CONTRACT.md*
