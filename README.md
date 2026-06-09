# Solo Stack Method™

> Build real software with AI agents — and keep a codebase a real dev could take over tomorrow.

A methodology + reference implementation for solo developers and non-technical founders who build
with AI and want to stay in control: clear rules agents can't drift from, an independent audit loop,
and a repo that *is* the source of truth — so what you ship stays yours to understand and hand off.

## Two layers in this repo

1. **The Method** — the rules, workflows, and config that keep AI work productive and accountable.
   Adopt it standalone: copy [`AGENTS.md`](AGENTS.md), [`AI_CONTRACT.md`](AI_CONTRACT.md), and
   [`.claude/settings.json`](.claude/settings.json) into any repo.
2. **The web app** ([`web/`](web/)) — a Next.js product that operationalizes the Method (marketing
   site, The Stack, Stack Pulse).

## Start here

- **AI agents:** [`AGENTS.md`](AGENTS.md) → [`AI_CONTRACT.md`](AI_CONTRACT.md) (binding).
- **Humans:** [`SOLO_STACK_MANIFESTO.md`](SOLO_STACK_MANIFESTO.md) (why) → [`workflows/`](workflows/) (how).
- **The web app:** `cd web && npm install && npm run dev`.

## What's distinctive

- **Repo-as-Truth** via the [AGENTS.md](https://agents.md) open standard — context lives in the repo, not a chat.
- **Spec before build** + **deterministic gates first** (tests/lint/secret-scan) — then an
  **independent, cross-provider AI audit** (the builder never approves its own work).
- **Scoped Approval Gateway** enforced in [`.claude/settings.json`](.claude/settings.json), not prose.
- **Exit-ready by default** — intent notes + ADRs + audit trails mean a dev team could take over cold.

---
*Built for builders who ship alone but refuse to move slow.*
