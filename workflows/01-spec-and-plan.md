# 01 — Spec & Plan (before you build)

> *Governed by `AI_CONTRACT.md`.* For anything beyond a small fix, spec first. This is the durable
> answer to vibe-coding: **Spec → Plan → Tasks → Implement.**

## 1. Spec — what & why (5 minutes)
Copy `docs/templates/SPEC_TEMPLATE.md` to `docs/specs/<feature>.md` and fill in:
- **Goal** — what this enables, for whom.
- **Acceptance criteria** — the checklist that means "done" (testable statements).
- **Out of scope** — what this explicitly will NOT do.
- **Open questions** — anything ambiguous (resolve via the Not-Psychic Rule before building).

## 2. Plan — how (Explainability Before Execution)
State, in plain English:
- The approach and the files you'll touch.
- What could break, and the rollback.
- Whether it crosses a Scoped Approval Gateway tier (schema/auth/billing → human sign-off).

Use **plan mode** for multi-step work; get the plan approved before editing.

## 3. Tasks — break it down
Split into small, independently shippable, PR-sized tasks. Each task should be reviewable on its own.

## 4. Implement
One task per change → branch → deterministic gates → audit (per risk tier) → PR. See `02-new-feature.md`.

> If a decision is architectural (stack, auth model, data shape), record it as an ADR in
> `docs/adr/` so the *why* survives.
