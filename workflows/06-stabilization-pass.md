# 06 — Stabilization Pass

> *Governed by `AI_CONTRACT.md`; see `CURSOR_RULES.md` for Codebase Surgeon Mode.*

A stabilization pass improves quality **without changing behavior**. Run one after a fast build
sprint (creative-first, then stabilize).

1. **Branch.** `git checkout -b chore/stabilize-<area>`.
2. **Behavior-preserving only.** Lint/format, tighten types, improve error handling and logging,
   reduce duplication, clarify names, add missing `// INTENT:` notes. Any behavior/auth/schema change
   is out of scope — split it into its own approved PR.
3. **Prove no behavior changed.** Tests stay green; typecheck/lint clean. If there are no tests
   around the code you're touching, add characterization tests first.
4. **Small commits.** Each reversible and self-describing.
5. **Audit tier:** behavior-preserving refactors need gates + a builder self-check; if anything
   strays into app logic, escalate to an independent audit.
6. **PR** with the required output: what changed, why, what could break, how to undo, test steps.
