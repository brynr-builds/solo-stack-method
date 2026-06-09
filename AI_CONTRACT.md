# AI_CONTRACT.md — Solo Stack Method

> **This document governs all AI work in this repository and takes precedence over every other
> instruction here, including any prompt.** Any AI (Claude, Codex/GPT, Gemini, Copilot, Cursor,
> etc.) working in this repo MUST follow these rules. Orientation lives in [`AGENTS.md`](AGENTS.md);
> the binding rules live here.

---

## Core Principles

### 1. Repo-as-Truth™
Everything important lives in the repository — not in a chat window. Decisions, context, and the
rules agents follow are committed where any agent or future-you can find them.

- The machine-readable entry point is [`AGENTS.md`](AGENTS.md) (the open standard) + tool-specific
  notes (e.g. `CLAUDE.md`).
- Docs → `/docs/`; workflows → `/workflows/`; prompts → `/PROMPTS/`; agent config → `/agents/`;
  decisions → `/docs/adr/`; logs → `/logs/`.
- **Context engineering, not context hoarding.** "In the repo" is necessary, not sufficient. Load
  the *right* context for the task; don't dump everything into the window (long, unfocused context
  measurably degrades output — the "lost in the middle" effect). Point agents at the specific
  files/specs they need.

### 2. Explainability Before Execution
Before any significant action, state in plain English: **what** you'll do, **why**, **what could
break**, and **how to undo it**. For multi-step work, use **plan mode** (or a written plan) and get
it approved before editing.

### 3. Intent-Preserving Code
Capture *why*, at two levels:
- **Local why** — a short note on non-trivial logic:
  ```javascript
  // INTENT: retry exists because the upstream API is flaky under load.
  // 3 attempts, exponential backoff, then fail gracefully.
  ```
- **Architectural why** — a lightweight **ADR** in `/docs/adr/` for load-bearing decisions (chosen
  stack, auth model, data shape). Agents respect documented reasoning more than arbitrary rules.

### 4. Workflow Understanding Over Code Understanding
Understand how work flows through the system before touching code. Start with `/workflows/` and the
architecture overview, not `/src/`.

### 5. The Not-Psychic Rule
If anything is ambiguous, **stop and ask**. Never guess on: which file to modify, what the user
actually wants, whether a change is safe, or anything involving credentials/keys/secrets. Missing
context — not model capability — is the leading cause of bad AI output.

### 6. Scoped Approval Gateway
Permissions are defined once and **enforced in config**, not honored on the honor system. The
machine-readable source of truth is [`.claude/settings.json`](.claude/settings.json); the tiers are
summarized below.

---

## Spec Before Build (non-trivial features)

For anything beyond a small fix, write a short spec/plan *before* code — the durable answer to
vibe-coding. Flow: **Spec → Plan → Tasks → Implement.**

- **Spec** — what we're building and the acceptance criteria (`docs/templates/SPEC_TEMPLATE.md`).
- **Plan** — approach, files touched, risks, rollback (this is "Explainability Before Execution").
- **Tasks** — small, reviewable, independently shippable steps.
- **Implement** — one task per PR-sized change.

See [`workflows/01-spec-and-plan.md`](workflows/01-spec-and-plan.md).

---

## Execution Environment

- **GitHub is the source of truth and the execution environment** for all production changes.
- All changes flow through branches and pull requests (see below).
- Other environments (Replit, local sandboxes, agent IDEs) are fine for *prototyping, teaching, and
  exploration*, but work is not "done" until it's on a branch and through a PR. Don't weld the
  Method to any one vendor — the rules are tool-agnostic.

---

## Branch + PR Protocol

**`main` = production. Never commit directly to `main`.** Every change is made on a branch:

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<description>` | `feat/stack-pulse-edge-function` |
| Fix | `fix/<description>` | `fix/dedupe-key-collision` |
| Docs | `docs/<description>` | `docs/api-reference` |
| Chore | `chore/<description>` | `chore/upgrade-deps` |

All branches land via Pull Request. See `docs/branching-and-prs.md`.

---

## Deterministic Gates First

Before any AI audit signs off, the **deterministic** gates must pass. Machines that don't have an
opinion catch what model-vs-model agreement misses:

- **Tests** relevant to the change pass (`npm test`).
- **Lint + typecheck** clean (`npm run lint`, `tsc --noEmit`).
- **Secret scan** — no credentials/keys in the diff.
- **Dependency/SAST** — no known-vulnerable deps or obvious injection in changed code.

A green AI review on top of red gates is not approval. Gates run in CI on every PR.

---

## The Audit Loop (risk-tiered)

The agent that *builds* a non-trivial change is **not** its final approver. Independence is
non-negotiable — models exhibit self-attribution bias (they rate their own work as more correct).

**Tier the rigor to the risk:**

| Change type | Required |
|---|---|
| Docs, comments, copy, small refactors (behavior-preserving) | Deterministic gates + builder self-check |
| App code, API routes, UI logic | Gates + **independent AI audit** |
| Schema/migrations, auth, billing, security, secrets handling | Gates + **independent AI audit + full audit packet** + human sign-off |

**Independence rule:** the builder may not be the final approver. Prefer a **different provider**
for the audit (different training data → different blind spots; two similar models can agree on the
same wrong answer — consensus is not verification). Use isolated **subagents** for the audit pass so
its context is clean.

**Default assignments:** see `agents/agent-profiles.yaml` (roles, not hard-coded models).

**Audit Packet** (required for the top tier) — generate with `PROMPTS/generate-audit-packet.md`:
change-request summary, acceptance-criteria checklist, files changed, `git diff --stat`, commands
run + outputs, gate/CI status, risks, and rollback plan.

---

## Scoped Approval Gateway — the tiers

Enforced via `.claude/settings.json`. Summary:

**Always allowed (no approval):** `/workflows/`, `/docs/`, `/PROMPTS/`, `/logs/` (no secrets),
markdown, diagrams, comments and intent notes. `/agents/` allowed but requires audit.

**Ask before modifying:** application code (`/src/`, `/app/`, `/lib/`), database schema/migrations,
auth/authz logic, deployment config, API routes, environment-variable structure.

**Never without explicit one-time permission:** production credentials/secrets, billing/payment
logic, domain/DNS, destructive DB ops (`DROP`/`TRUNCATE`/`DELETE *`), third-party API keys,
production user data.

---

## Model Roles (de-pinned)

Roles — **Builder**, **Auditor**, **Documentation** — are resolved from the dated capability table
in `agents/agent-profiles.yaml`, **not** hard-coded to a model. The harness/scaffold matters as much
as the base model, so assignments weigh both. The weekly Agent Capability Pulse keeps the table
current; **unverified claims ("I can do X now") never change roles** — only official releases +
observed performance do. See `docs/agent-capability-pulse.md`.

---

## Commit Message Format

```
type: short description

- detail 1
- detail 2

INTENT: why this change was made
```
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`.

---

## No Secrets Policy

**Never commit secrets** — API keys, tokens, passwords, connection strings, env secrets. If one is
committed: rotate it immediately, purge it from history (BFG/`git filter-repo`), and log the incident.

---

## When In Doubt

1. Read this contract. 2. Check `/workflows/` for the process. 3. Check `/PROMPTS/` for a template.
4. Check `agents/agent-profiles.yaml` for assignments. 5. Ask the human. 6. Document the decision
(an ADR if it's architectural).

---

*Last updated: 2026-06-09 · Canonical source for AI governance in the Solo Stack Method.*
