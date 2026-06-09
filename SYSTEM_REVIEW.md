# Solo Stack Method — Deep System Review (2026-06-09)

> State of the whole program after the launch integration (PR #38, live on solostackmethod.io).
> Honest status, what works, gaps, and the priority fixes. Companion to `MARKETING_PLAN.md`.

## Verdict
The system is **live, coherent, and works end-to-end as a free-to-run machine.** The loop —
plan → your GitHub repo → autodeploy → curated stack → live Pulse — is real and deployed. But it
**earns $0 and gets ~0 traffic until two operator switches are flipped** (apply to affiliate
programs; create a GitHub OAuth App) and a marketing engine runs. The biggest gaps are not bugs —
they're the *unflipped switches*, *measurement*, and *distribution*.

## Live status (verified today against solostackmethod.io)
| Surface | Live? | Notes |
|---|---|---|
| Homepage | ✅ | Flagship CTA "Build your site → /build"; affiliate-first; no stale $20 copy |
| `/tools` (The Stack) | ✅ | "26 programs, ranked honestly"; correct top picks; dead/non-programs gone |
| `/pulse` (Stack Pulse) | ✅ | **Real live versions** (Astro 6.4.5 today, Next 16.2.7…) — ISR live-fetch working in prod |
| `/build` (flow + Step 1 plan) | ✅ shell + planning | Planning intake works; repo-creation awaits the GitHub OAuth App |
| `/guides`, `/compare` | ✅ | 3 cornerstone articles render |
| `/api/build/me` | ✅ | Returns `{configured:false}` (correct — OAuth not set yet) |
| Admin auth | ✅ (untouched) | WebAuthn passkey admin is the one production-grade subsystem |

## Subsystem review

### 1. Affiliate engine — ✅ built, ❌ not earning
Corrected 26-program corpus, `/go/[slug]` click-logging redirect, `set-link.mjs` one-line switch,
content engine. **Gap:** no program applied to → every link routes to the merchant ($0). **Click
logging needs Vercel KV** (env not set → logs to console only, no durable analytics). **Operator
action:** apply (Impact/PartnerStack/ShareASale/in-house) → `set-link.mjs` per approval.

### 2. Content engine — ✅ built, ⚠️ only 3 articles
`/guides` + `/compare` render markdown; FTC disclosure + monetized CTAs. **Gap:** needs *volume +
the defensible format* — live-data comparison pages off Stack Pulse (the one programmatic-SEO
pattern Google still rewards). The Hermes `solo-stack-content` pipeline can draft these; it hasn't
been run at scale. (See `MARKETING_PLAN.md`.)

### 3. Stack Pulse — ✅ live, ⚠️ under-leveraged
Real versions from npm/nodejs, hourly ISR, cron refresh Action. **This is the moat** (live data =
survives scaled-content penalties + gets cited by AI answer engines) but it's only a *dashboard*
today — its data isn't yet turned into ranking **comparison pages**. Also: 14 dev tools only;
the SaaS stack tools (Cloudways, Kit…) aren't tracked (no version API — needs a changelog/status lane).

### 4. Build flow + Step 1 planning — ✅ built, ❌ repo-creation gated
The planning intake (evidence-based, free, standalone) works live. **Gap:** repo creation + the
SPEC/brief commit need the **GitHub OAuth App** (operator: 5-min setup, `BUILD_FLOW_SETUP.md`).
Until then `/build` is a free planning tool (still valuable as a lead magnet) but can't finish the
loop. The full no-leave-the-browser experience is Model B (deferred — costs money).

### 5. Starter template repo — ✅ live
`brynr-builds/solo-stack-starter` (public, isTemplate). Deploy-anywhere static site + the Method +
director-prompts + newsletter setup. Solid.

### 6. The Method (Layer 1) — ✅ modernized
AGENTS.md standard, spec-first contract, deterministic gates, risk-tiered audit, ADRs, de-pinned
models, fixed markdown/links. **Minor open item:** sanity-check the `capability_table` model names
in `agent-profiles.yaml` before relying on them.

### 7. Hermes pipelines — ✅ built, ⚠️ not running
`solo-stack-content` (content drafting) + the affiliate-research pipeline exist and are proven, but
aren't on a schedule. The autonomous engine is *built but idle*. (Marketing plan turns it on.)

### 8. SEO / discoverability — ❌ real gaps (fixed in this PR)
- **No `robots.txt` / sitemap** (404) — was blocking clean crawl + AI-citation. **Fixed:** added
  `app/robots.ts` (explicitly allows GPTBot/ClaudeBot/PerplexityBot) + `app/sitemap.ts`.
- No structured data / per-page canonical strategy beyond Next defaults — acceptable for now.

### 9. Measurement — ❌ none (priority gap)
No web analytics (no Plausible/GA/PostHog). **You cannot optimize what you can't see** — traffic,
which content converts, which `/go` links get clicked. Click logging needs KV. **Highest-leverage
non-revenue fix:** wire privacy-friendly analytics (Plausible/Umami, free/cheap) + KV for `/go`.

### 10. Loose ends / polish
- Footer links to **`/terms` and `/privacy` that don't exist** (404). Add simple pages (also an
  FTC/affiliate-trust signal).
- Newsletter capture is still **UI-only** (not wired to an ESP — ideally Kit/MailerLite, dogfooding
  the stack + building the owned channel the marketing plan depends on).
- `PRODUCT_BLUEPRINT.md`, `MONETIZATION_PLAN.md`, `METHOD_ASSESSMENT.md`, `OPERATOR-APPLY.md` are in
  the repo as the strategy record. `design/` (STRATA) is an unused visual exploration.

## Top risks
1. **No measurement** → flying blind on everything below.
2. **No traffic engine running** → a correct site nobody visits. (The marketing plan.)
3. **Unflipped revenue switch** (no affiliate programs applied) → $0 even with traffic.
4. **FTC exposure** if affiliate content ships without disclosure baked into every template.
5. **Scaled-content penalty risk** if the content engine is run for volume without per-page data + human edit.

## Priority fixes (ranked)
1. **Wire analytics + KV** (measurement) — can't improve blind. *[code — small]*
2. **Apply to affiliate programs + set-link** (revenue switch). *[operator]*
3. **Run the SEO comparison-page engine off Stack Pulse** (the moat + the marketing flywheel). *[pipeline]*
4. **GitHub OAuth App** (finish the build loop). *[operator, 5 min]*
5. **robots/sitemap** ✅ done · **/terms, /privacy** *[small]* · **newsletter → ESP** *[small + operator key]*
6. Sanity-check `agent-profiles.yaml` model names.
