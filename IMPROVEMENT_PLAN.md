# Improvement Plan — solo-stack-method

> Companion to `COMPLETION_STATUS.md`. Prioritized P0 → P2 with concrete actions, effort estimates, and acceptance criteria.

---

## P0 — Required before next external share

### P0.1 — Expand root `README.md` from one line

**Why:** The repo is public and presents two products (framework + web app) but the README is `# solo-stack-method` plus one tagline. A stranger has to read `AI_README.md` → `SOLO_STACK_MANIFESTO.md` → `AI_CONTRACT.md` → `web/README.md` to figure out what this is. The marketing copy in `web/page.tsx` ("Build real software with AI — without losing control") never appears at the repo entry point.

**Effort:** 1–2 hours.

**Deliverable — draft `README.md`:**

```markdown
# Solo Stack Method™

> Build real software with AI — without losing control, from idea to deployment.

This repo contains two things:

### 1. The Solo Stack Method™ governance framework (this directory)
A documented opinion about how a solo developer should work with AI agents. Six trademarked principles, a binding `AI_CONTRACT.md`, a dual-audit loop, and a weekly capability pulse to keep agent role assignments honest.

- **Start here:** [`AI_README.md`](AI_README.md) — orientation for AI agents and humans
- **The rules:** [`AI_CONTRACT.md`](AI_CONTRACT.md) — non-negotiable; takes precedence over all other instructions
- **The philosophy:** [`SOLO_STACK_MANIFESTO.md`](SOLO_STACK_MANIFESTO.md)
- **Agent roles:** [`agents/agent-profiles.yaml`](agents/agent-profiles.yaml) — who builds, who audits, with independence enforced
- **Workflows:** [`workflows/`](workflows/) — step-by-step process guides
- **Prompts:** [`PROMPTS/`](PROMPTS/) — reusable audit and execution templates

### 2. The Solo Stack Method web app ([`web/`](web/))
A Next.js 14 product that operationalizes the framework: marketing site, 7-step build workflow, Stack Pulse, audit-score system, and an owner-only admin dashboard with WebAuthn passkey auth.

- **Stack:** Next.js 14 App Router · TypeScript · Tailwind · Postgres · `@simplewebauthn` passkeys · `jose` JWT sessions · Vercel KV
- **Run locally:** `cd web && npm install && npm run dev`
- **Test:** `cd web && npm test` (Vitest)
- **Admin setup:** see [`docs/solo-stack/ADMIN_AUTH.md`](docs/solo-stack/ADMIN_AUTH.md)
- **Deploy:** see [`web/README.md`](web/README.md) (Vercel recommended; see `web/vercel.json`)

## How the two layers relate

The framework is the methodology. The web app is the productized version of that methodology for a solo developer to use end-to-end. The framework can be adopted standalone (copy the markdown + GitHub Action into your own repo); the web app cannot run without the framework concepts baked into its UI (governance banner, audit score, dual-audit prompt generator).

## Governance

- **Builder:** Claude · **Final Auditor:** ChatGPT (see `agents/agent-profiles.yaml`)
- All changes flow through branch → PR → audit. No direct commits to `main`.
- See [`docs/branching-and-prs.md`](docs/branching-and-prs.md) and [`.github/pull_request_template.md`](.github/pull_request_template.md).

---

*Solo Stack Method™ — Built for builders who ship alone but refuse to move slow.*
```

**Acceptance:** A reader new to the repo can answer in 60 seconds: (a) what the framework is, (b) what the web app is, (c) how to run the web app, (d) who the framework is for.

---

### P0.2 — Add `web/vercel.json` and fix Netlify ambiguity

**Why:** `web/netlify.toml` exists and references `@netlify/plugin-nextjs`, but it also contains:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
That SPA fallback is wrong for a Next.js App Router app — it will hijack every dynamic route (`/admin/login`, `/api/admin/*`, etc.) and serve `index.html`. Either (a) the app is actually deployed on Vercel and the Netlify config is dead, or (b) it is deployed on Netlify and currently broken. The repo doesn't say.

**Effort:** 1 hour.

**Recommended deliverable — `web/vercel.json`:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "publickey-credentials-get=(self), publickey-credentials-create=(self)" }
      ]
    }
  ],
  "env": {
    "ADMIN_RP_ID": "@admin-rp-id",
    "ADMIN_RP_NAME": "@admin-rp-name",
    "ADMIN_ORIGIN": "@admin-origin",
    "ADMIN_ALLOWED_EMAIL": "@admin-allowed-email",
    "ADMIN_SETUP_SECRET": "@admin-setup-secret",
    "ADMIN_SESSION_SECRET": "@admin-session-secret",
    "ADMIN_SESSION_TTL_HOURS": "@admin-session-ttl-hours",
    "ADMIN_RATE_LIMIT_PER_MINUTE": "@admin-rate-limit-per-minute",
    "DATABASE_URL": "@database-url"
  }
}
```

**Also do:**
- Remove the `[[redirects]]` block from `web/netlify.toml` (it is actively broken). Either delete `netlify.toml` entirely or scope it to a single-target deploy.
- Update `web/README.md` "Deployment" section to state the chosen target. Currently it claims "Netlify" but `web/DEV_NOTES.md` is the only place that justifies that choice.
- Document in `docs/solo-stack/ADMIN_AUTH.md` that production needs `ADMIN_RP_ID` to match the deployed domain exactly (passkeys will silently fail otherwise).

**Acceptance:** `vercel deploy` from `web/` works on a fresh clone with documented env vars set, and the Netlify config either matches the chosen target or is removed.

---

### P0.3 — Expand WebAuthn test coverage beyond `identify.test.ts`

**Why:** The only test file is `web/__tests__/admin-auth/identify.test.ts` (3 cases). The actual security-critical code — passkey registration, passkey authentication, backup-code consumption, setup-secret gating, rate limiting — is untested. `package.json` already has `vitest@4` wired and `vitest.config.ts` is configured.

**Effort:** 4–6 hours.

**Test files to add (follow the mocking pattern from `identify.test.ts` — `vi.mock('@/lib/admin/env')` and `vi.mock('@/lib/admin/storage/db')`):**

1. **`__tests__/admin-auth/setup-finish.test.ts`** — `/api/admin/setup/finish`
   - Mock `verifyRegistrationResponse` from `@simplewebauthn/server` to return `{verified: true, registrationInfo: {credential: {id, publicKey, counter, transports}}}`
   - Rejects when `setupSecret !== env.setupSecret` → 403
   - Rejects when no registration challenge exists for `userId` → 400
   - Happy path: inserts row into `webauthn_credentials`, deletes the challenge, creates `admin_sessions` row, returns 10 unique backup codes, sets `admin_session` cookie with `httpOnly` + `sameSite=lax`
   - Verifies backup codes are stored hashed (the response codes never appear in any DB insert call)

2. **`__tests__/admin-auth/login-finish.test.ts`** — `/api/admin/login/finish`
   - Mock `verifyAuthenticationResponse` to return `{authenticationInfo: {newCounter: 7}}`
   - Rejects when credential not found for `(userId, credentialId)` → 400
   - Rejects when no active authentication challenge → 400
   - Happy path: updates `counter` to `newCounter` and `last_used_at = now()`, deletes the authentication challenge, sets session cookie
   - Counter-regression case: explicitly verify the UPDATE always uses `newCounter` even if it's lower than current (this is `@simplewebauthn`'s responsibility but worth asserting we pass the value through)

3. **`__tests__/admin-auth/setup-secret-guard.test.ts`** — `/api/admin/login/setup-secret`
   - Returns 403 with body `{error: 'Setup secret login is only available for local development'}` when `env.rpId !== 'localhost'`
   - Returns 403 when `setupSecret` doesn't match
   - On localhost happy path: cookie set with `secure: false` (intentional — dev only); session row inserted
   - Asserts this endpoint never works in a "production-like" env (`rpId = 'solostackmethod.io'`)

4. **`__tests__/admin-auth/rate-limit-boundaries.test.ts`** — `lib/admin/rate-limit.ts` direct unit tests + one integration on `/api/admin/login/begin`
   - First request: `{ok: true}`
   - Requests 2..N where `N = limitPerMinute`: still `{ok: true}`
   - Request `N+1` within window: `{ok: false, retryAfter: <= 60}`
   - After advancing fake timers past `windowMs` (60_000): counter resets, request allowed
   - Distinct identifiers/routes don't share counters (compose key correctly)
   - Integration: hammer `/api/admin/login/begin` past the limit, assert 429 with `Retry-After` header set

**Acceptance:** `npm test` from `web/` runs 4 new test files with >15 new test cases. All pass. CI workflow (`web/.github/workflows/test.yml` — also to add) runs them on PR.

---

## P1 — Strategic: repo structure decision

The framework reads like marketing for the web app, but they share a repo. This is a fork in the road. Pick one:

### P1.A — Keep the monorepo, but tighten the seam

**Effort:** 4–8 hours.

- Move framework markdown into `framework/` to mirror the `web/` directory and make the two-layer split visible from `ls`
- Add a top-level `package.json` workspace pointing only at `web/*` so `npm test` works from the root
- Add a `framework/CHANGELOG.md` that versions the framework independently from `web/CHANGELOG.md`
- Update the new `README.md` (P0.1) to reflect the directory split
- Pro: one place to file issues, single audit history, easier to pitch as "the method + the tool"
- Con: framework gets less SEO juice; framework consumers (people who only want the markdown + GitHub Action) have to clone the whole web app

### P1.B — Split: framework becomes a public docs site, web app stays private

**Effort:** 1–2 days.

- New public repo `brynr-builds/solo-stack-method` containing only `framework/*` content rendered as a Docusaurus/Nextra/Mintlify site at `solostackmethod.io/docs`
- Move `web/` to a **private** `brynr-builds/solo-stack-method-app` repo
- Framework site becomes the marketing front (manifesto + contract + workflows) and links to the paid app
- The weekly `agent-pulse-weekly.yml` lives in both repos, scoped to each repo's PRs
- Pro: lets the framework be adopted standalone (copy/fork the docs into any repo); protects the admin auth implementation from public view; clearer pitch ("here's the method, click here for the tool")
- Con: two repos to keep in sync; framework changes that should be reflected in the app's `StepPageLayout` governance banner need a release process; loses the "audit packets reference the framework in the same repo" property that `AI_CONTRACT.md` assumes

**Recommendation to discuss:** the web app is gated to a single admin email and is not multi-tenant. There is no real customer surface in the public repo today, so **P1.B is the higher-leverage move** — it lets the framework be sold/given away to other solo devs while the SaaS implementation stays unpublished. Defer the split until P0.1–P0.3 land, then do it as a clean cutover.

### P1.C — Fix Layer 1 self-consistency (regardless of A vs. B)

**Effort:** 2 hours.

- `AI_README.md` references `workflows/02-new-feature.md`, `03-bug-fix.md`, `04-deploy-to-production.md`, `05-return-after-time-away.md`, `06-stabilization-pass.md` — **none exist**. Either create the missing workflows or remove the references.
- Fix the blockquote-nesting mess in `SOLO_STACK_MANIFESTO.md` (every list item is wrapped in an extra `>`, producing nested quotes) and `CURSOR_RULES.md` (same problem). These render as a wall of nested quotes on GitHub.
- Fix the typo in `AI_README.md`'s folder-structure block: `README.md ← HAI_README.mduman-facing readme` should be `README.md ← Human-facing readme`.
- Update `web/README.md` Tech Stack section: it currently claims "Auth: Supabase Auth (Phase 2)" but the shipped admin auth is WebAuthn + custom Postgres. Either remove Supabase from the stated stack (and from `package.json` if unused) or document why both exist.

### P1.D — Production-grade rate limiting

**Effort:** 3 hours.

`lib/admin/rate-limit.ts` is in-memory and resets on cold start. On Vercel serverless this effectively means **no rate limit**. The repo already depends on `@vercel/kv` — wire the limiter through KV (or Upstash Redis) with the same interface so all existing call sites stay unchanged. Keep the in-memory fallback for local dev.

---

## P2 — Quality of life

- **CI workflow for `web/`.** Add `.github/workflows/web-ci.yml` running `npm ci && npm run lint && npm test` on every PR touching `web/**`. Required to satisfy the "Builder Self-Audit" step that `AI_CONTRACT.md` mandates.
- **Audit-packet generation in CI.** `PROMPTS/generate-audit-packet.md` describes what an audit packet should contain (diff stat, files changed, risks, rollback). Wire a GitHub Action that auto-builds the packet on PR open and pastes it as a comment, so the human doesn't have to assemble it manually for every change.
- **`web/.env.example` cleanup.** It still references Stripe and Stack Pulse (Phase 2+) but lacks the `ADMIN_*` vars that `lib/admin/env.ts` actually requires today. The `docs/solo-stack/ADMIN_AUTH.md` env block is correct — fold it back into `.env.example` so dev setup is one file.
- **Add `web/__tests__/middleware.test.ts`.** The middleware redirects unauth → `/admin/enter-email`, returns 401 JSON for `/api/admin/*`, returns 503 if env unconfigured. None of this is tested. Important because middleware runs on Edge runtime where bugs surface as production-only failures.
- **Database connection pooling on serverless.** `lib/admin/storage/db.ts` instantiates a long-lived `pg.Pool` at module scope — fine on a long-running Node server, problematic on Vercel where connections can exhaust the Postgres limit. Either switch to `@vercel/postgres` (already implied by the `@vercel/kv` dep) or document a connection-limited Postgres provider (Supabase pooler, Neon, etc.).
- **`PROMPTS/agent-pulse-audit.md` should output to a structured format.** Currently free-form; the weekly Action could parse it and post results as a check-run on the next PR.
- **Remove dead deps if Supabase is truly Phase 2.** `@supabase/ssr` and `@supabase/supabase-js` are in `package.json` but no source file imports them. Either pull them out or wire them into the user-facing `app/login` and `app/signup` pages they were intended for.

---

## Out of scope (don't do)

- Don't add real user auth to `app/login`/`app/signup` until product direction is decided — the admin path is the only live auth surface and adding a second one doubles the security review burden.
- Don't replace the WebAuthn implementation with a hosted auth provider (Clerk/Auth0/Supabase Auth). The current implementation is correct, audited, and aligned with the "no tribal knowledge" exit-ready positioning. Swapping it out trades clarity for convenience.
- Don't merge the framework markdown into the web app's pages until P1.A vs. P1.B is decided.
