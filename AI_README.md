# AI_README.md — Solo Stack Method™

> **For AI Agents:** Start here. This file orients you to this codebase.

---

## What Is This Repo?

This repository contains the **Solo Stack Method™** — a governance framework and automation system designed for solo developers working with AI agents.

**Core components:**
- **AI_CONTRACT.md** — The binding rules ALL AI agents must follow
- **CURSOR_RULES.md** — Guidelines for Cursor stabilization passes
- **Stack Pulse** — Automated tool update ingestion system
- **Workflows** — Step-by-step guides for common tasks

---

## Before You Do Anything

1. **Read `AI_CONTRACT.md` first** — This is non-negotiable
2. **Understand the Scoped Approval Gateway** — Know what you can/cannot do
3. **Check `/workflows/` for task-specific guidance**

---

## Quick Reference

| Task | Start Here |
|------|------------|
| Understand the rules | `AI_CONTRACT.md` |
| Add a new feature | `/workflows/02-new-feature.md` |
| Fix a bug | `/workflows/03-bug-fix.md` |
| Deploy to production | `/workflows/04-deploy-to-production.md` |
| Run a stabilization pass | `CURSOR_RULES.md` + `/workflows/06-stabilization-pass.md` |
| Returning after time away | `/workflows/05-return-after-time-away.md` |
| Add a tool source | `/PROMPTS/add-tool-source.md` |

---

## Folder Structure

```
/
├── AI_CONTRACT.md          ← MUST READ FIRST
├── AI_README.md            ← You are here
├── CURSOR_RULES.md         ← Stabilization pass rules
├── SOLO_STACK_MANIFESTO.md ← Philosophy and principles
├── README.md               ← HAI_README.mduman-facing readme
├── SUPABASE_MIGRATION.sql  ← Database schema
├── .github/workflows/      ← GitHub Actions (Stack Pulse cron)
├── /workflows/             ← Step-by-step task guides
├── /docs/                  ← Technical documentation
└── /PROMPTS/               ← Reusable prompts for AI agents
```

---

## The Golden Rules (Summary)

1. **Repo-as-Truth™** — If it's not in the repo, it doesn't exist
2. **Explainability Before Execution™** — Explain what you'll do before doing it
3. **Intent-Preserving Code™** — Add developer notes for non-trivial logic
4. **The Not-Psychic Rule™** — If it's ambiguous, ask
5. **Scoped Approval Gateway™** — Know your permission level

---

## When In Doubt

- **Ask** — Don't guess
- **Commit small** — Reversible changes only
- **Reference the contract** — `AI_CONTRACT.md` is the source of truth

---

*Governed by AI_CONTRACT.md; contract takes precedence.*
