# Completion Status — solo-stack-method

> Refined status doc for AI agents. Last updated 2026-05-19.
> Supersedes the prior single-score view by separating the two layers.

**Overall score:** 55 / 100
**State:** Active two-layer product. Last code activity 2026-02-20 (auth hardening); 2026-05-19 status-doc commit. Repo is **public** on `brynr-builds/solo-stack-method`.
**Default branch:** `main`.

---

## What this repo actually is (two layers)

This repo bundles two distinct deliverables under one roof. They are conceptually linked but not technically coupled.

### Layer 1 — Solo Stack Method™ governance framework (markdown + YAML)
A documented opinion about how a solo developer should work with AI agents. It ships as:
- `SOLO_STACK_MANIFESTO.md` — philosophy ("Repo-as-Truth™", "Explainability Before Execution™", six trademarked principles)
- `AI_CONTRACT.md` — the binding contract every AI agent must follow (Scoped Approval Gateway, Dual Audit Loop, branch/PR protocol, no-secrets policy)
- `AI_README.md` — orientation file for agents arriving in the repo
- `CURSOR_RULES.md` — Cursor-specific "Codebase Surgeon" stabilization rules
- `agents/agent-profiles.yaml` — source of truth for which agent plays which role (Builder=Claude, Final_Auditor=ChatGPT), with confidence scores, advisory cycles, and independence enforcement
- `agents/pulse-decisions.md` — log of weekly capability-pulse decisions
- `PROMPTS/` — four reusable prompt templates (`agent-pulse-audit`, `chatgpt-audit`, `claude-audit`, `generate-audit-packet`)
- `workflows/` — three workflow guides (`00-solo-stack-overview`, `07-agent-pulse-review`, `README`)
- `docs/agent-capability-pulse.md`, `docs/branching-and-prs.md` — process docs
- `.github/workflows/agent-pulse-weekly.yml` — **working** GitHub Action; cron `0 9 * * 5` (Fridays 09:00 UTC). It prints a checklist, dumps the first 50 lines of `agent-profiles.yaml`, and lists PRs merged in the last week via `gh pr list`. It is intentionally read-only — no automated role changes.
- `logs/prompt-evolution.md` — versioned prompt history (v0 → v1.5 → v2)
- `.github/pull_request_template.md` — enforces audit-packet sections on every PR

### Layer 2 — `web/` Next.js 14 application
A real SaaS-style web app, ~50 source files, app-router. Two surfaces:

**Marketing + product shell (public/customer):**
- `app/page.tsx` — marketing homepage (locked copy: "Build real software with AI — without losing control")
- `app/pulse/page.tsx` — public Stack Pulse view (mock data)
- `app/login`, `app/signup` — auth UI scaffolds (no real auth wired)
- `app/dashboard/page.tsx` — 7-step navigation
- `app/steps/{1..7}/page.tsx` + `intent.md` — the seven product steps with co-located intent artifacts
- `app/audit-score/page.tsx` — Mode A (governance, blocking) + Mode B (advisory) audit UI placeholder
- `app/content-hub/page.tsx`, `app/support/page.tsx` — scaffolds
- `components/PromptGenerator.tsx`, `SubscriptionGate.tsx`, `StepPageLayout.tsx`, `ClientProviders.tsx`, `MockData.ts`, `AdminGuard.tsx` — UI primitives, all consuming mock data (Phase 1.x scope)

**Admin dashboard (owner-only, real auth):**
- `app/admin/page.tsx` — owner dashboard, 4 tabs: System Health / Process Effectiveness / Product Analytics / "Ask the System" (all data mocked)
- `app/admin/clients/page.tsx` — CRM-for-process-intelligence (tag/note/AI blocker summaries; no outbound email or automation by design)
- `app/admin/config/page.tsx` — adjusts step copy, gating, audit thresholds, advisory weights, prompt templates, monetization copy (session-only, no persistence). Also hosts the **"Add a passkey"** flow for session-authenticated re-enrollment.
- `app/admin/enter-email/page.tsx` — bootstrap entry; POSTs to `/api/admin/identify` and routes the user to setup, login, or denied
- `app/admin/setup/page.tsx` — first-time admin claim; requires `ADMIN_SETUP_SECRET`; registers passkey; shows backup codes **once**
- `app/admin/login/page.tsx` — passkey login + backup-code fallback + dev-only setup-secret login (only on localhost)
- `app/admin/layout.tsx` — top-bar nav with logout form posting to `/api/admin/logout`

**Admin auth implementation (real, polished):**
- `middleware.ts` — Edge-runtime guard for `/admin/*` and `/api/admin/*`. JWT in `admin_session` HttpOnly cookie via `jose`. Allowlists `enter-email`, `login`, `setup`, and the identify/login/setup/logout API routes.
- `lib/admin/env.ts` — strict env validation; throws in production if `ADMIN_SETUP_SECRET`, `ADMIN_SESSION_SECRET`, or `DATABASE_URL` are missing
- `lib/admin/session.ts` — `jose` HS256 JWTs, `verifySessionToken`, `createSessionToken`, `getSessionFromRequest`
- `lib/admin/rate-limit.ts` — in-memory per-IP+route limiter (60s window); resets on server restart (documented)
- `lib/admin/storage/db.ts` — single `pg.Pool` with SSL in prod
- `app/api/admin/identify` — email → `{next: 'setup' | 'login' | 'denied'}` based on `ADMIN_ALLOWED_EMAIL` and `admin_users` lookup
- `app/api/admin/setup/{begin,finish}` — `@simplewebauthn/server` registration with setup-secret gating, generates 10 backup codes (hashed with session secret) on first use
- `app/api/admin/login/{begin,finish,backup,setup-secret}` — passkey auth + backup-code path + localhost-only secret-login fallback
- `app/api/admin/passkey/register/{begin,finish}` — session-authenticated passkey **re-enrollment** (add additional credentials post-login)
- `app/api/admin/logout` — clears cookie, redirects to `/admin/enter-email`

**Schema (`web/migrations/`):**
- `001_admin_auth.sql` — five tables: `admin_users`, `webauthn_credentials`, `webauthn_challenges`, `admin_sessions`, `admin_backup_codes` (all UUID PKs, cascade deletes)
- `002_admin_auth_email_bootstrap.sql` — adds `admin_users.email NOT NULL UNIQUE`, `admin_sessions.session_token_hash UNIQUE`
- Both ship with explicit `.rollback.sql` companions

**Dependencies (`web/package.json`):** `next@14.1.0`, `react@18`, `@simplewebauthn/{browser,server}@13.2.2`, `@supabase/{ssr,supabase-js}`, `@vercel/kv@3`, `jose@6`, `pg@8`, `vitest@4`, `tailwindcss@3`. Scripts: `dev`, `build`, `start`, `lint`, `test` (`vitest run`), `test:watch`.

**Test setup:** `web/vitest.config.ts` — node env, globals on, `__tests__/**/*.test.ts` glob, `@` alias to `web/`. **One** test file: `__tests__/admin-auth/identify.test.ts` (3 cases covering denied / setup / login branches with mocked `query` + `getAdminEnv`).

---

## What works

- Layer 1 framework is internally consistent: contract → workflows → prompt templates → weekly pulse Action → agent profiles. The cron Action is wired and reads from `agent-profiles.yaml`.
- Layer 2 admin auth is unusually well-built for an early-stage repo:
  - WebAuthn registration, authentication, backup codes, dev fallback, session-authenticated re-enrollment
  - Edge-compatible middleware via `jose` (no `pg` in middleware)
  - Strict env validation that fails closed in production
  - Per-IP rate limiting on all unauthenticated routes
  - SHA-256 hashed token storage in `admin_sessions`, salted backup-code hashes
  - Migrations have rollback scripts
- Recent commit cadence shows discipline: "Add WebAuthn passkey setup/login + sessions" → "Add rate limiting + tests + docs" → "Harden admin auth UX".

## Known gaps

- **`README.md` is one line.** A stranger landing on the repo has to read four+ markdown files (`AI_README` → `SOLO_STACK_MANIFESTO` → `AI_CONTRACT` → `web/README`) just to understand what the project is.
- **Deploy target is contradictory.** `web/netlify.toml` exists with a Next.js plugin, but it also contains an SPA fallback redirect (`/* → /index.html`) that is wrong for a Next.js App Router app and will break dynamic routes. There is no `vercel.json`. Live deploy state is undocumented.
- **Test coverage is one file deep.** `identify.test.ts` covers three branches of `/api/admin/identify`. None of the WebAuthn ceremony, backup-code path, rate-limit boundaries, or setup-secret guard is tested. This is the load-bearing security surface.
- **`web/README.md` lies about the stack.** It says "Auth: Supabase Auth (Phase 2)" — actual code uses WebAuthn passkeys + a custom Postgres schema. Supabase deps are still in `package.json` but unused for admin auth. Confusing.
- **Repo positioning is mixed.** Layer 1 reads like marketing for a paid product ("Solo Stack Method™ — $20/month"), but Layer 2 is the actual product and is gated to a single admin email (`brynrgarnett@gmail.com`). The framework either markets the web app (and should be a docs site) or it is the product (and the web app is the demo) — the repo presents both as primary.
- **Layer 1 has stale references.** `AI_README.md` lists `/workflows/02-new-feature.md`, `03-bug-fix.md`, `04-deploy-to-production.md`, `05-return-after-time-away.md`, `06-stabilization-pass.md` — only `00-solo-stack-overview.md` and `07-agent-pulse-review.md` actually exist.
- **Markdown blockquote nesting in `SOLO_STACK_MANIFESTO.md` and `CURSOR_RULES.md`** is broken (every list item is wrapped in an extra `>`, producing a wall of nested quotes). This is the public face of the manifesto.
- **One-line `README.md` collides with `AI_README.md`**, which itself contains a folder-structure block where the README entry reads `README.md ← HAI_README.mduman-facing readme` (typo — looks like a botched edit that merged "AI_README.md" into "Human-facing readme").

## Priority improvements

See `IMPROVEMENT_PLAN.md`. P0s:
1. Expand root `README.md` from one line to a real entry-point
2. Add a deploy config (`vercel.json`) — or fix and document Netlify config (drop the SPA-fallback redirect)
3. Expand WebAuthn test coverage beyond `identify.test.ts` (passkey register/finish, setup-secret guard, rate-limit boundaries)

## Notes for AI agents

- **Don't break the passkey flow without tests passing.** It is the only code path in this repo with security implications.
- The `agent-pulse-weekly.yml` Action is harmless (read-only) — safe to leave running.
- If you touch `lib/admin/env.ts`, the prod failure mode (throw on missing required vars) is intentional. Do not weaken it.
- `lib/admin/rate-limit.ts` is in-memory only. Anything you do on Vercel/serverless will reset the counter per cold start — this is documented in the file and `docs/solo-stack/ADMIN_AUTH.md`.
- "Solo Stack Method™" trademark phrasing is treated as locked copy in `web/CHANGELOG.md` — do not rewrite headlines without approval.
- The framework's "Dual Audit Loop" is real governance, not theater: per `AI_CONTRACT.md` the agent that builds a change may not be the final approver, and `agent-profiles.yaml` enforces this with `independence.rule: strict`.
