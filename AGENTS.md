# AGENTS.md — Solo Stack Method

> The orientation file every AI agent reads first. This is the [AGENTS.md open standard](https://agents.md)
> (a "README for machines"). It points to the binding rules; it does not replace them.
> **`AI_CONTRACT.md` takes precedence over everything here.**

## What this repository is

The **Solo Stack Method** — a methodology + reference implementation for building real software with
AI agents while staying in control. Two layers live here:

1. **The Method** (this directory) — the rules, workflows, prompts, and agent config that keep AI
   work productive and accountable. Adoptable standalone: copy `AGENTS.md` + `AI_CONTRACT.md` +
   `.claude/settings.json` into any repo.
2. **The web app** ([`web/`](web/)) — a Next.js 14 product that operationalizes the Method.

## Read order for any agent arriving here

1. **This file** — orientation.
2. **[`AI_CONTRACT.md`](AI_CONTRACT.md)** — the binding rules. Non-negotiable. Read before acting.
3. **[`workflows/`](workflows/)** — pick the guide matching your task.
4. **[`agents/agent-profiles.yaml`](agents/agent-profiles.yaml)** — who builds, who audits.

## The rules in one screen (full detail in AI_CONTRACT.md)

- **Repo-as-Truth.** If it matters, it's committed — decisions, context, config. Not chat-only.
- **Explainability before execution.** State what / why / what-could-break / how-to-undo before
  any significant action. Use plan mode for multi-step work.
- **Ask, don't guess.** Ambiguous file, intent, safety, or anything touching secrets → stop and ask.
- **Spec before build** (non-trivial features) — see [`workflows/01-spec-and-plan.md`](workflows/01-spec-and-plan.md).
- **Builder ≠ auditor.** The agent that writes a non-trivial change is not the one that approves it.
- **Deterministic gates first.** Tests, lint/typecheck, and secret scans must pass *before* an AI
  audit signs off. LLM agreement is not verification.
- **Permissions are config, not vibes.** See [`.claude/settings.json`](.claude/settings.json) and the
  Scoped Approval Gateway in `AI_CONTRACT.md`. Never touch secrets, prod data, or billing without
  explicit one-time permission.
- **Branch + PR.** Never commit to `main`. Conventional commits.

## Project layout

```
AGENTS.md                ← you are here (open-standard orientation)
AI_CONTRACT.md           ← binding rules (precedence over all)
SOLO_STACK_MANIFESTO.md  ← the philosophy
.claude/settings.json    ← Scoped Approval Gateway, machine-enforced
agents/agent-profiles.yaml ← role assignments + capability table
workflows/               ← step-by-step task guides
docs/adr/                ← architecture decision records
docs/templates/          ← spec template, etc.
PROMPTS/                 ← reusable prompt templates
web/                     ← the Next.js product (has its own AGENTS.md context)
```

## Build / test / run (web app)

```bash
cd web && npm install && npm run dev      # local dev
cd web && npm test                        # vitest
cd web && npm run build                   # production build (Netlify runs this)
```

## Tooling notes

- Agents reach tools/data via **MCP** where available; prefer dedicated tools over shell.
- Tool permissions are governed by `.claude/settings.json` (allow / ask / deny tiers).

---
*Governed by `AI_CONTRACT.md`. This file follows the AGENTS.md standard so any agent — Claude,
Codex, Cursor, Copilot, Gemini — gets oriented the same way.*
