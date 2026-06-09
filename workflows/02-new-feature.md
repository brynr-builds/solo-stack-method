# 02 — New Feature

> *Governed by `AI_CONTRACT.md`.* Assumes you have a spec/plan (`01-spec-and-plan.md`).

1. **Branch.** `git checkout -b feat/<description>` off `main`. Never build on `main`.
2. **Load the right context.** Open the spec and the specific files involved — not the whole repo
   (context engineering: the right context, not all of it).
3. **Build in small steps.** One reviewable change at a time. Add `// INTENT:` notes for non-trivial
   logic. New load-bearing decision → an ADR in `docs/adr/`.
4. **Deterministic gates** (must pass before any audit):
   - `cd web && npm test`
   - `npm run lint` · `npx tsc --noEmit`
   - secret scan (no keys in the diff)
5. **Audit (by risk tier — see `AI_CONTRACT.md`):**
   - app code → independent AI audit (a *different* agent than the builder)
   - schema/auth/billing → audit + full audit packet (`PROMPTS/generate-audit-packet.md`) + human sign-off
6. **PR.** Open against `main` with the audit packet in the description. Merge only after gates +
   audit are green.
7. **Update truth.** If the feature changes how the system works, update `AGENTS.md` / `docs/`.
