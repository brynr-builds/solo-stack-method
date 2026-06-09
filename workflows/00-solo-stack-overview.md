# Solo Stack Overview

> *Governed by `AI_CONTRACT.md`; the contract takes precedence.*

## What Is the Solo Stack Method?

A methodology for building real software with AI agents while staying in control. It ensures:

- **Repo-as-Truth** — everything important lives in the repo
- **Explainability Before Execution** — plain English before action
- **Intent-Preserving Code** — notes (and ADRs) explain the *why*
- **The Not-Psychic Rule** — ask when unclear
- **Scoped Approval Gateway** — tiered, enforced permissions
- **Builder ≠ Auditor** — deterministic gates, then an independent review

## Core Components

| Component | Purpose |
|-----------|---------|
| `AGENTS.md` | Orientation every agent reads first (open standard) |
| `AI_CONTRACT.md` | Binding rules for all AI agents |
| `.claude/settings.json` | Scoped Approval Gateway (enforced) |
| `CURSOR_RULES.md` | Stabilization-pass guidelines |
| `agents/agent-profiles.yaml` | Role assignments + capability table |
| `/workflows/` | Step-by-step task guides |
| `/docs/` | Documentation, ADRs, templates |
| `/PROMPTS/` | Reusable AI prompts |

## Working Principles

1. **Spec before build** — for non-trivial features, write the spec/plan first.
2. **Creative-first, then stabilize** — move fast to a working thing, then harden it.
3. **Small, reversible changes** — every commit should be easy to undo.

## When to Use Each Workflow

| Situation | Workflow |
|-----------|----------|
| Spec & plan a feature | [`01-spec-and-plan.md`](01-spec-and-plan.md) |
| Building a feature | [`02-new-feature.md`](02-new-feature.md) |
| Fixing a bug | [`03-bug-fix.md`](03-bug-fix.md) |
| Deploying to production | [`04-deploy-to-production.md`](04-deploy-to-production.md) |
| Returning after time away | [`05-return-after-time-away.md`](05-return-after-time-away.md) |
| Cleaning up code | [`06-stabilization-pass.md`](06-stabilization-pass.md) |
| Weekly capability pulse | [`07-agent-pulse-review.md`](07-agent-pulse-review.md) |

## Next Steps

1. Read `AGENTS.md`, then `AI_CONTRACT.md`.
2. Pick the workflow that matches your task.
3. Follow it step by step.
4. Ask if anything is unclear.
