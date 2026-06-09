# 04 — Deploy to Production

> *Governed by `AI_CONTRACT.md`.* Production = the `main` branch. Deploys happen by merging a PR.

## Pre-merge checklist
- [ ] Deterministic gates green in CI (tests, lint, typecheck, secret scan)
- [ ] Audit complete for the change's risk tier
- [ ] `cd web && npm run build` succeeds locally (or in CI)
- [ ] Required env vars documented (`web/.env.example`, `docs/solo-stack/ADMIN_AUTH.md`) and set in
      the host (Netlify/Vercel dashboard)
- [ ] Rollback plan written in the PR

## Deploy
1. Merge the PR to `main`. The host auto-builds and publishes (Netlify runs `npm run build`).
2. **Smoke-test the live site** — load the changed routes, check the console/network, confirm the
   thing you shipped actually works in production.

## If it breaks
- Revert the merge commit (`git revert -m 1 <merge-sha>`) → push → the site rolls back on the next
  build. This is why every change is small and reversible.
- Log the incident (`logs/`); if a secret leaked, rotate it immediately (No Secrets Policy).
