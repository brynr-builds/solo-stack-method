# AI_README.md — Solo Stack Method

> **For AI agents:** [`AGENTS.md`](AGENTS.md) is the canonical orientation (open standard). This
> file is the friendly version. **`AI_CONTRACT.md` is binding and takes precedence.**

---

## What Is This Repo?

The **Solo Stack Method** — a methodology and reference system for building real software with AI
agents while staying in control.

**Core components:**
- **[`AGENTS.md`](AGENTS.md)** — orientation every agent reads first (the open standard)
- **[`AI_CONTRACT.md`](AI_CONTRACT.md)** — the binding rules ALL AI agents must follow
- **[`.claude/settings.json`](.claude/settings.json)** — the Scoped Approval Gateway, enforced
- **[`CURSOR_RULES.md`](CURSOR_RULES.md)** — guidelines for Cursor stabilization passes
- **Stack Pulse** — tool-update tracking
- **[`workflows/`](workflows/)** — step-by-step task guides

---

## Before You Do Anything

1. **Read `AGENTS.md`, then `AI_CONTRACT.md`** — non-negotiable.
2. **Know the Scoped Approval Gateway** — what you can/can't do (enforced in `.claude/settings.json`).
3. **Check `workflows/` for task-specific guidance.**

---

## Quick Reference

| Task | Start here |
|------|------------|
| Understand the rules | [`AI_CONTRACT.md`](AI_CONTRACT.md) |
| Spec & plan a feature | [`workflows/01-spec-and-plan.md`](workflows/01-spec-and-plan.md) |
| Add a new feature | [`workflows/02-new-feature.md`](workflows/02-new-feature.md) |
| Fix a bug | [`workflows/03-bug-fix.md`](workflows/03-bug-fix.md) |
| Deploy to production | [`workflows/04-deploy-to-production.md`](workflows/04-deploy-to-production.md) |
| Return after time away | [`workflows/05-return-after-time-away.md`](workflows/05-return-after-time-away.md) |
| Run a stabilization pass | [`CURSOR_RULES.md`](CURSOR_RULES.md) + [`workflows/06-stabilization-pass.md`](workflows/06-stabilization-pass.md) |
| Weekly capability pulse | [`workflows/07-agent-pulse-review.md`](workflows/07-agent-pulse-review.md) |

---

## Folder Structure

```
/
├── AGENTS.md               ← READ FIRST (open-standard orientation)
├── AI_CONTRACT.md          ← binding rules (precedence over all)
├── AI_README.md            ← Human-facing readme (you are here)
├── CURSOR_RULES.md         ← stabilization pass rules
├── SOLO_STACK_MANIFESTO.md ← philosophy and principles
├── README.md               ← repo entry point
├── .claude/settings.json   ← Scoped Approval Gateway (enforced)
├── agents/                 ← role assignments + capability table
├── workflows/              ← step-by-step task guides
├── docs/                   ← documentation, ADRs, templates
└── PROMPTS/                ← reusable prompts for AI agents
```

---

## The Golden Rules (summary)

1. **Repo-as-Truth** — if it's not in the repo, it doesn't exist.
2. **Explainability Before Execution** — plan before you act.
3. **Intent-Preserving Code** — note the *why* (comments + ADRs for big decisions).
4. **The Not-Psychic Rule** — if it's ambiguous, ask.
5. **Scoped Approval Gateway** — know your permission level (it's enforced).
6. **Builder ≠ Auditor** — deterministic gates, then an independent review.

---

*Governed by `AI_CONTRACT.md`; the contract takes precedence.*
