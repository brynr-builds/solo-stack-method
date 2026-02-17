# Task Pack: [Task Name]

> **Governed by AI_CONTRACT.md; contract takes precedence.**

**Author:** [Cursor / Human]
**Date:** [ISO 8601]
**Spec:** [Link to spec in `docs/specs/`]
**Risk Level:** L0 | L1 | L2 | L3

---

## Objective

[What the agent must build. 1-2 sentences.]

## Scope (Allowed Paths/Files)

- `path/to/file-1`
- `path/to/file-2`

## Out of Scope

- [File or area the agent must NOT touch]

## Constraints (Must Not Change)

- [Existing behavior, API contract, or file that must remain unchanged]

---

## Inputs / Context

- **Spec:** `docs/specs/[spec-name].md`
- **Key files:** [List files the agent should read for context]
- **Related docs:** [Links to relevant docs or workflows]

---

## Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Commands to Run

```bash
# Tests
npm test          # or equivalent

# Lint
npm run lint      # or equivalent

# Build
npm run build     # or equivalent

# Typecheck
npm run typecheck # or equivalent
```

---

## Deliverables

- [ ] Branch: `feature/<name>-tasks/<task#>`
- [ ] Summary of changes (plain English)
- [ ] List of files changed with descriptions

## Required Gates

| Gate | Required? | Status |
|------|-----------|--------|
| CI passes | Yes | ☐ |
| Intermediate audit (Claude) | [Per risk level] | ☐ |
| Final audit (ChatGPT) | [Per risk level] | ☐ |
| Human approval | [Per risk level] | ☐ |

---

## "Stop and Ask" Triggers

If you encounter any of the following, **stop work and ask the Orchestrator**:

- Ambiguity in the spec or acceptance criteria
- Need to modify files outside the allowed scope
- Auth, permissions, or data-boundary changes required
- Schema changes not covered in the spec
- Any "Ask Before Modifying" or "Never Touch" item per `AI_CONTRACT.md`

---

*Generated from `docs/task-packs/_template.md`*
