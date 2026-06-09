# Solo Stack Method — Market Readiness Scorecard (2026-06-09)

> Honest read on whether this is ready to put in front of the market. Combines the competitive +
> demand research, the live-funnel walk-through, the design critique, and the system review.
> Scale per dimension: 🟢 ready · 🟡 partial · 🔴 blocking gap.

## Bottom line
**Not yet "validated," but right at "ready to start collecting real signal."** The product is built,
live, and coherent. What's missing isn't more building — it's **turning on the switches and getting
the first real humans through the funnel.** You cannot research your way past this point; the next
milestone is *data from real visitors*, which (as of today) you can finally measure — analytics are
now wired, but no traffic has run through them yet.

**Readiness to LAUNCH-for-conversion: ~6/10.** Readiness to **START A REAL TEST: ~8/10** (a few
operator switches away).

## Scorecard

| Dimension | Score | Read |
|---|---|---|
| **Demand** | 🟢 | Real and surging. "Vibe coding gone wrong," "comprehension debt," "exit-ready" are now industry language; 63% of AI-built products started by non-developers (your ICP). The pain is named and people seek solutions. |
| **Competitive position** | 🟡 | A genuine, *unclaimed* niche — solo/non-technical + control + exit-ready + a real planning layer. But the mechanics are commoditized, and the fully-hands-off "type in the browser" magic belongs to Lovable/Bolt/v0 (Model B, which you've deferred). You win on governance + honesty + the plan, not on being the slickest builder. |
| **Positioning / messaging** | 🟡 | Clear and honest, but "build software with AI" is a crowded lane. Your wedge (the planning layer + "own a codebase a dev could take over") is under-leaned-on. Needs a sharper *who-it's-for*. |
| **Funnel / conversion readiness** | 🟡 | The funnel **works** end-to-end and the planning intake is genuinely good UX. BUT the payoff is gated: repo creation needs the GitHub OAuth App (operator), so a real visitor today hits the free planning tool + a "copy your plan" wall, not the full magic. |
| **Monetization readiness** | 🔴 | Engine is built but **earns $0** — no affiliate program applied → links go to merchants, not your tracking links. Nothing converts to money yet. (Pure operator switch.) |
| **SEO / discoverability** | 🟡 | robots/sitemap fixed; AI-crawlers welcomed. But only 3 content articles, the **comparison-page moat isn't built**, and there's no traffic. The engine exists; it hasn't been run. |
| **Measurement** | 🟡 | **Just wired** (this PR) — funnel events + pageviews, provider-agnostic. Zero data yet. Needs an analytics account + env var (operator, free) to start producing ground truth. |
| **Trust / credibility** | 🟡 | Strong bones (public dogfooded repo = real E-E-A-T, FTC disclosure, honest framing). Missing: any social proof, testimonials, or evidence of real usage. Design reads "clean template," not "brand" (see design critique). |
| **Legal / compliance** | 🔴 | FTC affiliate disclosure is present. But **`/terms` + `/privacy` 404** (footer links), and you now collect analytics → you *need* a privacy note. Quick fix, but currently a real gap. |
| **Operational readiness** | 🟢 | The Daily Ops cockpit + the content/marketing draft pipelines mean you can actually *run* this (approve + post in ~30 min/day). Best-prepared dimension. |

## What "market ready" actually requires (and where you are)
1. **Turn on the switches** (operator, mostly free): apply to ~3 affiliate programs + `set-link.mjs`;
   create the GitHub OAuth App; set the analytics env var; add `/terms` + `/privacy`. → *days*.
2. **Run the content engine** for the comparison-page moat (the one durable SEO/AEO play). → *weeks*.
3. **Drive a trickle of real traffic** (the marketing plan: human-posted Reddit/X, agent-drafted). → *weeks*.
4. **Read the funnel data** you can now collect — homepage → /build → `plan_started` → `plan_completed`
   → `connect_github` → first `/go` affiliate clicks. *This* is the validation, not any document.

## The one experiment that tells you if there's a market
Get **~50–100 real visitors** to `/build` (achievable in a few weeks via the marketing plan) and watch:
- **Do they start the plan?** (`plan_started` / homepage-`/build` views) → is the offer compelling.
- **Do they finish it?** (`plan_completed` / `plan_started`) → is the intake good (we believe yes).
- **Do they try to build?** (`connect_github_click`) → is the promise believed.
- **Do they click a tool?** (`/go` clicks) → will the affiliate model convert.

Two of those four trending healthy = there's a there there, and you optimize. All flat = the *offer
or audience* is wrong, not the build — and you'd pivot the positioning, cheaply.

## Honest verdict
You've over-built relative to evidence — which is normal and fixable. **Stop adding features.** The
highest-value work now is the cheap, boring stuff that produces *signal*: flip the switches, publish
a handful of real comparison pages, post honestly in 2–3 communities, and read the funnel. You're
one good month of distribution away from knowing whether this is a business — and you finally have
the instrumentation to know.

*Sources: competitive + demand research (this session); live funnel walk-through; `design-critique`;
`SYSTEM_REVIEW.md`; `MARKETING_PLAN.md`.*
