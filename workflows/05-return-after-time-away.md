# 05 — Returning After Time Away

> *Governed by `AI_CONTRACT.md`.* This is what Repo-as-Truth is *for*: pick up cold, no memory needed.

1. **Re-orient from the repo, not your memory.** Read `AGENTS.md`, then skim `docs/` and recent
   `docs/adr/` entries — the decisions are written down precisely so you don't have to recall them.
2. **Check what moved.** `git log --oneline -20` and any open PRs/branches (`git branch -a`).
3. **Check the tools.** Look at Stack Pulse — did a dependency or model you rely on change while you
   were away? Note anything that needs a Capability Pulse review (`07-agent-pulse-review.md`).
4. **Confirm it still runs.** `cd web && npm install && npm run dev`; load the app; run `npm test`.
5. **Pick up the thread.** Find the in-flight spec (`docs/specs/`) or the next task and resume from
   the plan — not from a blank prompt.

> If returning reveals tribal knowledge that *wasn't* written down, that's a Repo-as-Truth gap —
> capture it (a doc or ADR) before continuing.
