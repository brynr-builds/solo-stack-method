# AI_CONTRACT.md — Solo Stack Method™

> **Governed by this contract. This document takes precedence over all other instructions in this repository.**
>
> This contract defines how AI agents must operate within this codebase. Any AI (Claude, GPT, Copilot, Cursor, etc.) working in this repo MUST follow these rules.

---

## Core Principles

### 1. Repo-as-Truth™
Everything important must live in the repository. No "it's in chat only" — if it matters, commit it.

- Documentation belongs in `/docs/` or `/workflows/`
- Prompts belong in `/PROMPTS/`
- Agent configurations belong in `/agents/`
- Logs belong in `/logs/`
- Code changes require commits with clear messages
- Decisions should be documented, not just discussed

### 2. Explainability Before Execution™
Before any major action, explain in plain English:
- **What** you're about to do
- **Why** you're doing it
- **What could break**
- **How to undo it**

### 3. Intent-Preserving Code™
Add developer notes explaining the intent for any non-trivial logic.

```javascript
// INTENT: This retry logic exists because the API is flaky during high traffic.
// It retries 3 times with exponential backoff before failing gracefully.
```

### 4. Workflow Understanding Over Code Understanding™
Understanding the workflows (how work flows through the system) is more important than understanding every line of code. Start with `/workflows/` before diving into `/src/`.

### 5. The Not-Psychic Rule™
If anything is ambiguous, **stop and ask**. Never guess on:
- Which file to modify
- What the user actually wants
- Whether a change is safe
- Credentials, keys, or sensitive data

---

## GitHub-First Execution Policy

> **"Replit teaches; GitHub ships."**

### Execution Environment

- **GitHub is the execution environment** for all production changes
- All changes flow through branches and pull requests
- The repository is the source of truth for code, docs, and governance

### Replit Usage Policy (Cost Control)

Replit is allowed ONLY for:
- Teaching and demonstrations
- Quick prototyping and exploration
- Learning new concepts

Replit is NOT allowed for:
- Production code changes
- Documentation updates
- Workflow modifications
- Any changes intended for main branch

If work starts in Replit, it must be properly transferred to GitHub via branch + PR before it's considered complete.

---

## Branch + PR Protocol

### Main = Production

The `main` branch represents the current production state. **Never commit directly to main.**

### All Work Happens on Branches

Every change must be made on a feature or chore branch:

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<description>` | `feat/stack-pulse-edge-function` |
| Fix | `fix/<description>` | `fix/dedupe-key-collision` |
| Docs | `docs/<description>` | `docs/api-reference` |
| Chore | `chore/<description>` | `chore/dual-audit-pulse-system` |

### PRs Are Mandatory

All branches must land via Pull Request. See `docs/branching-and-prs.md` for full protocol.

---

## Dual Audit Loop Requirement

### Overview

For non-trivial changes, two independent audits are required:

1. **Builder Self-Audit** (Prompt v1.5) — The agent that built the change verifies their own work
2. **Final Audit** (Prompt v2) — A different agent reviews for quality, security, and compliance

### Independence Rule

**The agent that builds a change may NOT be the final approver.**

This is non-negotiable. If the same agent attempts both roles, the process is invalid.

### Default Assignments

- **Builder:** Claude
- **Final Auditor:** ChatGPT

See `agents/agent-profiles.yaml` for current assignments.

### Prompt Evolution Chain

```
Prompt v0   → Change Request (intent + acceptance criteria)
Prompt v1.5 → Builder Pass + Self Audit (execution-hardened)
Prompt v2   → Final Audit Approved (clean, ready to merge)
```

Only Prompt v2 may be used to merge changes into main.

### Audit Packet Requirement

All non-trivial PRs must include an Audit Packet containing:
- Change Request summary
- Acceptance Criteria checklist
- Files changed with descriptions
- git diff --stat
- Commands run + outputs
- CI status
- Risks and rollback plan

Use `PROMPTS/generate-audit-packet.md` to generate.

---

## Agent Capability Pulse (Weekly)

### Purpose

The Agent Capability Pulse is a weekly assessment to evaluate and adjust agent role assignments based on evidence.

### Hybrid Approach

The pulse combines:
1. **Internal signals** — Performance metrics from actual work
2. **Verified external updates** — Confirmed model releases from official sources

### Critical Rule

**Unverified claims do NOT change roles.**

An agent saying "I can do X now" is not sufficient. Only official documentation counts.

### Advisory Period

New roles start in advisory mode:
- **Duration:** 5 cycles (weeks) per role per agent
- **During advisory:** Human makes final call on assignments
- **After advisory:** Auto-assignment may be enabled (human opt-in)

### Regression Handling

If an agent shows performance regression:
- Role reverts to advisory mode
- Advisory counter resets to 0
- Requires 5 clean cycles before auto-assignment

See `docs/agent-capability-pulse.md` for full documentation.

---

## Dynamic Role Assignment

### Role Independence

Builder and Final Auditor must always be different agents. This ensures:
- Independent verification of changes
- Reduced risk of blind spots
- Audit trail integrity

### Assignment Updates

Role assignments are updated:
- Weekly during Agent Capability Pulse
- When verified model updates affect capabilities
- When performance metrics indicate change is needed

All assignment changes require human approval.

---

## Scoped Approval Gateway™

### Always Allowed (No Approval Needed)
- `/workflows/` — workflow documentation
- `/docs/` — documentation
- `/PROMPTS/` — prompt templates
- `/agents/` — agent configurations (requires audit)
- `/logs/` — log entries (no secrets)
- Markdown files (`.md`)
- Diagrams and images
- Comments and developer notes

### Ask Before Modifying
- Application code (`/src/`, `/app/`, `/lib/`)
- Database schema or migrations
- Authentication/authorization logic
- Deployment configurations
- API routes and endpoints
- Environment variable structure

### Never Touch Without Explicit One-Time Permission
- Production credentials or secrets
- Billing or payment logic
- Domain/DNS ownership
- Destructive database operations (DROP, TRUNCATE, DELETE *)
- Third-party API keys
- User data in production

---

## Cursor Usage (Codebase Surgeon Mode)

Cursor is an approved tool for **Stabilization Passes** to improve code quality.

**Allowed:**
- Small refactors that preserve behavior
- Lint/format/type tightening
- Improved error handling and logs
- Adding intent-preserving developer notes

**Rules:**
- Cursor edits MUST preserve documented intent
- If the change affects behavior, auth, permissions, database schema, or deployment, approval required
- Prefer small commits or a PR with a clear summary
- After changes, provide: plain-English explanation, test steps, rollback instructions

---

## Commit Message Format

Use clear, conventional commit messages:

```
type: short description

- Detailed change 1
- Detailed change 2

INTENT: Why this change was made
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`

---

## No Secrets Policy

**Never commit secrets to the repository.**

This includes:
- API keys and tokens
- Passwords and credentials
- Database connection strings
- Environment secrets
- Personal access tokens

If secrets are accidentally committed:
1. Rotate the secret immediately
2. Use `git filter-branch` or BFG to remove from history
3. Document the incident in logs

---

## When In Doubt

1. Read this contract first
2. Check `/workflows/` for relevant process
3. Review `/PROMPTS/` for applicable templates
4. Check `/agents/agent-profiles.yaml` for current assignments
5. Ask the human if still unclear
6. Document your decision

---

*Last updated: 2025-01-30 | This is the canonical source for AI governance in Solo Stack Method™*
