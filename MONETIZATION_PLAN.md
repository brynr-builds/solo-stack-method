# Solo Stack Method™ → Autonomous Affiliate Engine — Master Plan

> Deep review + monetization strategy. Prepared 2026-06-08.
> Folds in: the affiliate research pipeline (`~/projects/affiliate-research`), live
> commission verification, and 2025–2026 market/SEO/compliance research.
> Companion to `COMPLETION_STATUS.md` and `IMPROVEMENT_PLAN.md`.

---

## ✅ BUILD STATUS (updated 2026-06-09) — Phase 0–2 shipped to the working tree

What's **done and verified** (uncommitted in `~/projects/solostackmethod`; review → commit → push):
- **Corrected data.** `web/lib/tools/programs.json` rebuilt from the hand-verified portfolio (25
  honest programs). Dead/non-programs removed (Jasper, GitHub, Cloudflare, ChatGPT, Coinbase,
  Robinhood, DataCamp-75%). The live Top Picks are now the real recurring set.
- **Revenue wired.** New `affiliateUrl`/`network`/`caveat` fields; `/go/[slug]` redirect logs the
  click (Vercel KV when configured) and 302s to the tracking link (or merchant fallback). All
  links route through `/go` so published content never needs editing.
- **One-line revenue switch.** `web/lib/tools/affiliate-links.json` + `node scripts/set-link.mjs
  <slug> <url>` — paste a tracking link, that program earns. Verified end-to-end.
- **Content engine.** Markdown-based (`web/content/{guides,compare}/*.md`) → `lib/content.ts` +
  `/guides` & `/compare` routes + `ArticleLayout` (disclosure above first link, monetized "Tools
  mentioned" box). **Two cornerstone articles written** as the quality bar.
- **Deploy fixed.** Removed the Netlify SPA-fallback redirect that was hijacking dynamic routes.
- **Autonomous Hermes pipeline.** Skill `solo-stack-content` (quinn) + `~/.hermes/pipelines/
  solo-stack-content.sh` launcher + `content-pipeline/topics.json` (10-topic backlog). Draft →
  audit (riley) → Gate-4 merge. Dry-run + task-creation verified.
- **Operator pack.** `OPERATOR-APPLY.md` — ordered network signups + copy-paste answers + the
  `set-link.mjs` flow.

**Still needs YOU (non-delegable):** apply to the programs (Gate 3 — see `OPERATOR-APPLY.md`),
paste tracking links back, approve published content (Gate 4). Plus the one model decision in §10.

---

## 0. TL;DR — the one thing to understand

**Solo Stack Method already *is* a curated toolchain for non-technical people who build
real software with AI.** That makes contextual, trustworthy affiliate recommendations the
single most natural revenue model you have — far more realistic near-term than the unbuilt
$20/mo SaaS. You started wiring it (the new `/tools` "The Stack" page + 85-program corpus +
FTC disclosure shipped today). But right now the engine **earns $0**, and worse, the live
"Top Picks" are **actively wrong**. This plan fixes the data, wires real revenue, and turns
the Hermes agent team into an autonomous research→write→audit→publish→optimize loop — with
exactly two things only *you* can do (apply to programs; approve what goes live).

**The money path, in one line:**
`Fix the data → apply to ~6 networks (you) → wire real tracking links → publish dogfooded
"the stack I use" + comparison content (agents) → SEO traffic compounds → recurring
commissions stack.`

**Two blunt truths up front:**
1. **Your live site is currently recommending a dead program and two non-programs.** The
   `/tools` "Top Picks" lead with **Jasper** (closed to new affiliates Jan 2025), **GitHub**
   and **Cloudflare** (no usable affiliate program for individuals), plus **Coinbase/Robinhood**
   (off-brand finance). Meanwhile the genuinely lucrative recurring tools your audience needs
   (Kit, GetResponse, Cloudways, Webflow, ClickFunnels, Teachable) are buried in Tier 2.
   This is a credibility *and* FTC risk and is **P0 to fix** — and it needs no signups.
2. **No link on the site is a tracking link.** Every "Visit →" button points at the program's
   *signup page*, not your affiliate deeplink. Until you apply (Gate 3) and we add an
   `affiliateUrl` field, traffic converts to $0.

---

## 1. Deep review — what Solo Stack Method actually is today

### Canonical location
`~/projects/solostackmethod` (today's working copy; older mirrors live in `~/Documents/...`
and `~/Documents/Software_Projects/...` — treat those as archives). Public repo
`github.com/brynr-builds/solo-stack-method`, live at **solostackmethod.io** (Netlify
auto-deploy on push to `main`). 334+ commits, real history.

### It's a two-layer product
**Layer 1 — the governance framework (markdown + YAML).** A documented opinion on how a solo
dev should work with AI agents: "Repo-as-Truth™", "Explainability Before Execution™", six
trademarked principles, a binding `AI_CONTRACT.md`, a dual-audit loop (Claude builds, ChatGPT
audits, enforced by `agents/agent-profiles.yaml`), reusable `PROMPTS/`, `workflows/`, and a
**working** weekly GitHub Action (`agent-pulse-weekly.yml`, Fridays 09:00 UTC).

**Layer 2 — the Next.js 14 web app (`web/`).** ~50 source files, App Router, TypeScript +
Tailwind. Surfaces:
- `app/page.tsx` — marketing homepage. Headline (locked): *"Build real software with AI —
  without losing control."* Sells a **$20/mo** subscription. Differentiation block
  (governance-first / context-as-artifact / exit-ready) + "Microsoft Takeover Test."
- `app/tools/` + `app/tools/[slug]/` — **"The Stack"** (NEW today): renders 85 affiliate
  programs from `lib/tools/programs.json`, Tier-1 "Top Picks," by-category, per-program detail
  pages with structured data, FTC `AffiliateDisclosure`. Deliberately data-dense to dodge
  Google's thin-content penalties.
- `app/pulse/` — **Stack Pulse** (tool-update monitor). **Mock data**, hardcoded 2024 dates.
  Has a newsletter signup that stores nothing.
- `app/audit-score/`, `app/content-hub/`, `app/support/`, `app/dashboard/`, `app/steps/{1..7}/`
  — product scaffolds, all mock data.
- `app/admin/*` — owner-only dashboard with **real, well-built WebAuthn passkey auth** (the
  one genuinely production-grade subsystem: registration, login, backup codes, rate-limit,
  `jose` JWT sessions, Postgres schema with rollbacks).

### What's actually live vs. aspirational
| Thing | State | Implication |
|---|---|---|
| Marketing site | ✅ live | Traffic surface works |
| `/tools` "The Stack" | ✅ live, ❌ wrong data, ❌ no tracking links | Earns $0; recommends dead programs |
| $20/mo subscription | ❌ **not wired** — `SubscriptionGate` is Phase-1.2 UI only, **no Stripe, no user auth** | Cannot charge anyone today |
| Stack Pulse | ❌ mock data, no Edge Function | Not a live product yet |
| Admin auth | ✅ real, polished | Owner login works |
| Newsletter capture | ❌ logs to console, stores nothing | No email list = no compounding asset |

**Strategic read:** the subscription is the *aspirational* product (needs real auth + Stripe +
a product people will pay $20/mo for — none of which exists). **The affiliate engine is the
revenue you can realistically turn on now**, and it reinforces the brand instead of competing
with it. Lead with affiliate + free content + email capture; keep the subscription as a later
optional upsell (or retire it).

---

## 2. The monetization thesis — why affiliate fits this brand perfectly

Your audience = **non-technical founders / solopreneurs shipping real software with AI.** To do
that, they *must buy*: AI writing, design, hosting, a domain, email marketing, a funnel/landing
builder, maybe a course platform, SEO, a VPN. **That shopping list is the affiliate shortlist.**
This is not random affiliate spam bolted onto a blog — it's the literal tool budget of the exact
person you already teach. Recommending "the stack" *is* the product's natural job.

Three structural advantages most affiliate sites can't fake:
1. **A real public GitHub repo that dogfoods the tools.** Google's 2025–2026 enforcement
   explicitly rewards *demonstrable first-hand experience* (the first "E" in E-E-A-T) and buries
   templated listicles. "We deploy this site on Cloudways — here's the actual config in the repo"
   is a ranking + conversion asset competitors structurally cannot copy.
2. **Stack Pulse = a legitimate freshness engine.** A real, updated tool-monitor proves ongoing
   hands-on engagement and earns honest recency signals — and every monitored tool is an
   affiliate link.
3. **A governance method you can apply to the *content itself*.** "Claude drafts, ChatGPT audits,
   human approves" is exactly the human-editorial-pass workflow that survives the scaled-content
   penalties — and it's already your brand.

---

## 3. Current affiliate engine — what's built and the two gaps

**Built (today's commit `9be069b`):**
- `web/lib/tools/programs.json` — 85 programs (11 marked tier 1, 74 tier 2). Real structured
  fields: commission model/rate/cookie/approval/niche/score/sourceUrl/verified.
- `web/lib/tools/index.ts` — typed loader (`programs`, `tier1`, `programsByNiche`, `commissionLabel`).
- `web/app/tools/page.tsx` — Top Picks + by-category grid.
- `web/app/tools/[slug]/page.tsx` — per-program SEO page, `generateStaticParams` pre-renders all.
- `web/components/AffiliateDisclosure.tsx` — FTC disclosure, full + compact.

**Gap A — no revenue wiring.** `Program` has no `affiliateUrl`. The "Visit →" button uses
`sourceUrl` (the program's *signup* page). Even with traffic, $0. Needs: a tracking-URL field +
a `/go/[slug]` redirect that (a) injects your real deeplink and (b) logs the click.

**Gap B — wrong data (the credibility problem).** `programs.json` was generated from the
**uncorrected auto-rank** (riley's `ranked-shortlist.md`), *not* the hand-verified
`reports/FINAL-shortlist.md`. Consequences live on the site right now:
- **Jasper AI** — listed as the #1 Top Pick; its affiliate program **closed to new affiliates
  Jan 2025** (conflicting signals say a PartnerStack 25%/12mo plan exists — **must verify before
  featuring**).
- **GitHub, Cloudflare** — Top Picks; **no usable individual affiliate program.** (Authority/content
  value only.)
- **Coinbase, Robinhood** — Top Picks; **off-brand finance**, flat fee, regulatory/geo baggage.
- **DataCamp** — still carries the hallucinated **"75% recurring"** (real: ~15–20% annual, one-time).
- **Udemy** — "Tier 1," but real terms are ~**8–10%, 7-day cookie** — weak.

---

## 4. The corrected, verified portfolio (fold this into `programs.json`)

Verified against each program's official affiliate/legal page, June 2026. **Lead with the
recurring + on-brand set; use flat-fee tools for near-term cash.** Cookie windows marked
"≈" rest on secondary sources — label them "approx." on the site for defensibility.

### Tier 1 — the compounding base (recurring, on-brand) → feature these
| Program | Niche | Commission (verified) | Cookie | Network | Approval | Signup |
|---|---|---|---|---|---|---|
| **Kit** (ConvertKit) | Email | 50% recurring 12mo (then 10–20% if Bronze+) | ≈60–90d | PartnerStack | Moderate | kit.com/affiliate |
| **GetResponse** | Email | 40% recurring/mo 12mo (→50/60% at volume) | 90–120d | PartnerStack | Easy–mod | getresponse.com/affiliate-programs |
| **MailerLite** | Email | 30% recurring **lifetime** | 45d | Trackdesk | Easy (new-site OK) | mailerlite.com/affiliate |
| **ClickFunnels** | Funnels | 30% recurring (→40%) | 45d sticky | In-house | Easy | clickfunnels.com/affiliates |
| **Leadpages** | Landing | 10%→up to 50% recurring (by volume) | 90d | PartnerStack | Easy–mod | ap.leadpages.com |
| **Teachable** | Courses | 30% recurring up to 12mo | 30d | PartnerStack | Easy | teachable.com/partners |
| **Thinkific** | Courses | 30% recurring **lifetime** (or $150/mo flat) | 90d | PartnerStack | Easy | thinkific.com/affiliates |
| **Cloudways** | Hosting | $30 + **7% lifetime** (hybrid) OR slab $50–125 | 90d | In-house | Moderate | cloudways.com/.../web-hosting-affiliate-program.php |
| **Kinsta** | Hosting | $50–500 one-time + **10% lifetime** | 60d | In-house | Moderate | kinsta.com/affiliates |
| **Webflow** | Site builder | 50% of first-year (12mo) | 90d | Impact | Moderate | webflow.com/solutions/affiliates |
| **Copy.ai** | AI writing | **45% recurring 12mo** (lead AI with this) | 60d | PartnerStack | Moderate | copy.ai → PartnerStack |
| **NordVPN** | VPN | up to 100% (1-mo) / 40% (1–2yr) / **30% recurring renewals** | 30d | In-house/Impact | Moderate | nordvpn.com/affiliate |

### Tier 1b — near-term cash (flat/one-time, high value) → fund the build
| Program | Commission | Cookie | Network | Notes |
|---|---|---|---|---|
| **Semrush** | **$200 CPA** + $10/trial | 120d | Impact | One-time; high value, high search demand |
| **WP Engine** | $200 or 100% first month | **180d** (excellent) | ShareASale | One-time, no renewals |
| **Bluehost** | $65+ one-time | 30d | Impact | Very easy, new-site-friendly; entry hosting |
| **Canva** | ≈$36 one-time (Pro) | 30d | Impact | One-time; high volume, broad appeal |
| **Surfshark** | 40% first payment | 30d | CJ/Impact/Awin | $100 payout min |

### Do NOT feature (remove from Top Picks / corpus)
| Program | Why |
|---|---|
| **Jasper** | Program closed to new affiliates Jan 2025 — verify directly; do not feature until confirmed |
| **GitHub**, **Cloudflare** | No usable individual affiliate program — authority/content links only, never "earn" |
| **ChatGPT Plus** | No affiliate program exists (anything claiming one is illegitimate) |
| **Coinbase, Robinhood** | Off-brand finance, flat fee, regulatory/geo baggage |
| **DataCamp "75%"** | Hallucinated — real ≈15–20% annual; correct or drop |
| **Udemy "40%"** | Real ≈8–10%, 7-day cookie — too weak to feature |

**Corrections to the corpus's other figures:** DigitalOcean = 10% recurring 12mo (not 100%);
Buffer = 25% recurring 12mo (not 50%). Both already fixed in the wired data; DataCamp is not.

### Register once to unlock most of the list
- **PartnerStack** → Kit, GetResponse, Leadpages, Teachable, Thinkific, Copy.ai
- **Impact** → Semrush, Bluehost, Webflow, Canva, (NordVPN regionally)
- **ShareASale** → WP Engine
- **In-house** → Cloudways, Kinsta, ClickFunnels, NordVPN, MailerLite(Trackdesk)

Applying to **PartnerStack + Impact** alone unlocks ~half the Tier-1 list.

---

## 5. Market research & positioning (2025–2026)

### The wave is real and at peak momentum
"Vibe coding" was Collins' 2025 Word of the Year; ~51% of GitHub-committed code is now
AI-assisted; Claude Code / Lovable / Bolt / Replit Agent / Cursor / v0 ship real apps from plain
English. Low-code/no-code is tracked from ~$27B (2023) toward ~$65B (2027); ~80% of low-code
users sit outside IT. The narrative your audience buys: "idea → working product" collapsed from
months/$10Ks to days/$100s-a-month.

### Who already monetizes this exact audience
- **Greg Isenberg** (Late Checkout / Startup Ideas) — the most influential adjacent voice;
  creator+course+affiliate flywheel.
- **Ben Tossell / Ben's Bites** (166K+ subs) — self-described "vibe-coder" publishing mini
  tool-tutorials for non-technical builders. **The cleanest template for your newsletter + tool
  recommendation model.**
- **Indie Hackers** — canonical "build profitable without a tech background" hub.
- **Tool-roundup/affiliate sites** that rank for "best [category]": managedwpguide.com (hosting +
  a "which host" quiz), webhostingcat.com ("X vs Y (Month 2026)" dated pages), getlasso.co
  (clean per-niche commission tables), diggitymarketing.com (recurring-program roundups).

The *educators* sell courses and lightly affiliate; the *review farms* do pure affiliate. Solo
Stack Method's wedge is the **credible gap between them**: a dogfooded, governed, repo-as-truth
method with a public repo.

### Content formats that rank AND convert (use all five)
1. **"X vs Y vs Z" comparisons** with a date in the title, refreshed monthly (Stack Pulse feeds this).
2. **Decision quiz / "which one for *you*"** — captures undecided buyers, great link hub.
3. **"The exact stack I use to build [X]"** — your strongest native format; ties to the repo.
4. **In-workflow tutorials** ("how I deploy a Lovable app to Cloudways") — seeds multiple links.
5. **Pricing/deal breakdowns** ("Cloudways pricing explained," "Kit free vs Creator") — bottom-funnel.

### Highest-intent keyword clusters → program (★ = low-competition "unfair advantage" wins)
| Angle | Monetizes | Comp |
|---|---|---|
| best email marketing for creators / solo founders | Kit, GetResponse, MailerLite | High |
| Kit vs GetResponse vs MailerLite | all three | Med |
| ★ best hosting for an AI-built / Lovable / Bolt / Claude Code app | Cloudways, Kinsta | **Low** |
| ★ where to deploy a no-code / vibe-coded SaaS | Cloudways, Kinsta | **Low** |
| Cloudways vs WP Engine · Cloudways vs Kinsta | both | Med |
| best AI tools to build a SaaS solo (no code) | Copy.ai + funnel/hosting | Med |
| Lovable vs Bolt vs Cursor for non-technical founders | top-of-funnel magnet | Med |
| Leadpages vs ClickFunnels · best funnel builder for solopreneurs | both recurring | High/Med |
| best course platform for a solo creator · Teachable vs Thinkific | both recurring | High/Med |
| Webflow vs [no-code] for a real site | Webflow | Med |
| is Semrush worth it for solo founders | Semrush ($200) | High |
| best AI writing tool for marketing copy 2026 | Copy.ai | High |
| best VPN for indie hackers / remote founders | NordVPN, Surfshark | High |
| ★ MailerLite vs Kit for a small newsletter | both | **Low** |
| ★ the complete no-code founder stack (tools + cost) | bundles 6–8 programs | **Low** |
| ★ how much does it cost to build a SaaS with AI | hosting+email+funnel bundle | **Low** |

The ★ cluster — "I built an app with AI, **where do I put it / what does the stack cost**" — is the
wedge the listicle farms don't own and your repo proves you actually do.

### Recurring-revenue math (be honest)
Blended realistic recurring commission ≈ **$10–22 per *active* customer / month** (email + funnel +
course skew high; hosting low). Illustrative, **100 retained paying referrals**:
- Conservative (~$10): **~$1,000/mo (~$12K/yr)**
- Mid (~$16): **~$1,600/mo (~$19K/yr)**
- Optimistic (~$22): **~$2,200/mo (~$26K/yr)**

Caveats that make or break it: "100 referred" ≠ "100 active forever" (SaaS churn decays the stream
3–6%/mo unless backfilled); short cookies (MailerLite 7d for some tracking, Surfshark) hurt; getting
to 100 *active* recurring typically means 300–600+ raw signups and 12–24 months of credibility-first
traffic. **Flat-fee tools (Semrush $200, WP Engine $200, Bluehost, Canva) pay the bills now; recurring
tools build the annuity.**

### Compliance (non-negotiable)
- **FTC:** disclose clearly and conspicuously, **above the fold / before the first affiliate link**,
  in plain language ("We earn a commission if you buy through our links"), every page, every time.
  Your `AffiliateDisclosure` component is good — make sure it renders *before* the first link, not
  only in the footer. Penalties up to ~$50K/violation.
- **Google scaled-content-abuse:** AI content is *not* penalized for being AI; *volume without added
  value* is. Rules: human editorial pass on every page; one original first-party asset per page
  (screenshot / repo link / your own benchmark / your own pricing math); cap publishing velocity —
  depth over volume; keep comparisons genuinely dated/updated; balanced pros/cons. Your governed
  "Claude drafts → ChatGPT audits → human approves" workflow is *exactly* the survival profile.

---

## 6. Gap analysis — what's missing to make it a *machine*

| # | Gap | Impact | Fix owner |
|---|---|---|---|
| G1 | No tracking-link field/redirect | Earns $0 | Code (me) + you (Gate 3 to get the links) |
| G2 | Wrong Top Picks (dead/non-programs) | Credibility + FTC risk | Code (me) — no signup needed |
| G3 | Not applied to any program | No links exist to wire | **You only (Gate 3)** |
| G4 | No content/tutorials (just data tables) | No SEO traffic, low conversion | Agents (write) + you (Gate 4 approve) |
| G5 | No click/conversion analytics | Can't optimize | Code (me) |
| G6 | Newsletter stores nothing | No compounding email asset | Code + you pick ESP (dogfood Kit/MailerLite) |
| G7 | Deploy ambiguity (Netlify SPA-fallback redirect breaks Next dynamic routes) | Site may be broken | Code (me) — see IMPROVEMENT_PLAN P0.2 |
| G8 | Subscription half-present, confuses positioning | Split message | Decision (you) — recommend: demote/retire for now |
| G9 | Disclosure placement | FTC exposure | Code (me) |

---

## 7. Build roadmap (phased)

### Phase 0 — Truth & plumbing (no signups required; do now)
- **Rebuild `programs.json` from `FINAL-shortlist.md` + §4 verified data.** Drop Jasper/GitHub/
  Cloudflare/ChatGPT/Coinbase/Robinhood from Top Picks; fix DataCamp/Udemy; promote the recurring
  Tier-1 set. Add `verified` honestly.
- **Add `affiliateUrl` to the `Program` type** (nullable). When null, button → merchant's *normal*
  site with `rel="sponsored nofollow"` (useful, honest, $0); when set, button → `/go/[slug]`.
- **Add `/go/[slug]` redirect route** that 302s to `affiliateUrl` and logs the click (timestamp,
  slug, referrer) — even to a flat file / KV to start. This is your analytics + the seam where
  deeplinks get injected after Gate 3.
- **Fix the deploy** (IMPROVEMENT_PLAN P0.2): drop the `/* → /index.html` redirect from
  `web/netlify.toml` (it hijacks Next dynamic routes), or move to Vercel with `vercel.json`.
- **Move `AffiliateDisclosure` above the first affiliate link** on `/tools` and every `[slug]`.

### Phase 1 — Apply & wire revenue (you + me)
- **You (Gate 3):** create accounts at **PartnerStack** and **Impact** first (unlocks ~half), then
  **ShareASale** (WP Engine) and the in-house ones (Cloudways, Kinsta, ClickFunnels, NordVPN,
  MailerLite). Application *drafts* already exist in `~/projects/affiliate-research/reports/applications/`
  and `/drafts/` — I'll refresh them to match the corrected portfolio.
- **Me:** as each approval lands, drop the real deeplink into `affiliateUrl`. The site instantly
  starts earning with no other change.

### Phase 2 — Content engine (the traffic flywheel)
- Build **3 cornerstone pages** by hand first (set the quality bar): (a) "The Solo Stack — the exact
  tools we use to ship, and what they cost," (b) one ★ low-comp piece ("Where to deploy an app you
  built with Claude Code / Lovable"), (c) one high-intent comparison ("Kit vs GetResponse vs
  MailerLite for solo founders"). Each: real screenshots, a repo link, balanced pros/cons, disclosure
  above the first link, one clear winner + a runner-up.
- **Wire newsletter capture** to a real ESP (dogfood **Kit** or **MailerLite** — earns the affiliate
  *and* gives you the compounding list). Email lets you re-promote recurring-commission tools forever.
- Stand up **Stack Pulse for real** (even a small cron that refreshes a handful of tools) — it's your
  freshness/E-E-A-T engine and every entry is an affiliate link.

### Phase 3 — Autonomy & scale (the machine)
- Productionize the agent loop in §8 so content compounds without you writing it.
- Add comparison/quiz hubs; internal-link everything to the canonical "Solo Stack" page.
- Monthly: agents refresh dated comparisons + re-verify commission figures (terms drift); you
  approve (Gate 4).

---

## 8. The autonomous "money machine" architecture (Hermes agents)

You already have the team and the pattern (`~/projects/affiliate-research`, the SDLC pipeline,
the kanban DAG launcher). Extend it from *research-only* into a full publishing loop:

```
            ┌─────────────────────────────────────────────────────────────┐
            │  WEEKLY / ON-DEMAND  (kanban board: solo-stack-content)       │
            └─────────────────────────────────────────────────────────────┘
 sam-scout        → discover/refresh programs + trending tools + keyword gaps
   │                (existing affiliate-research discovery, re-pointed at the corpus)
   ▼
 cassidy-security → re-verify commission terms + legitimacy (catches drift like Jasper closing)
   │                ALWAYS emits machine-readable _vetted.jsonl  ← (autonomy-hardening TODO)
   ▼
 riley-reviewer   → score/dedupe/tier → regenerate web/lib/tools/programs.json (corrected)
   │
   ▼
 quinn-copywriter → DRAFT content (comparisons, "stack I use", tutorials) from REAL corpus data,
   │                disclosure baked in, one original asset required per page
   ▼
 ChatGPT auditor  → audit content against the AI_CONTRACT + scaled-content rules (the dual-audit
   │                loop, applied to content) → PR
   ▼
 [Gate 4: YOU]    → approve PR → merge → Netlify publishes → click logs flow back to sam-scout
                     to prioritize next round (close the loop on what's converting)
```

Cost is ~free (local/your-own models: Gemma, glm-4.5-air, 35B, Qwen-Coder). The only human
touch-points are **Gate 3 (apply — legal/credentials/tax)** and **Gate 4 (approve publish —
brand/compliance)**. Everything else runs autonomously.

**Autonomy-hardening carried over from the affiliate-research lessons** (apply here too): make
vetting *always* emit `_vetted.jsonl` so scoring consumes corrected data; never swap a profile's
model mid-run; add a completion nudge so glm workers reliably call `kanban_complete`; restart both
gateways so the per-profile concurrency cap actually holds.

---

## 9. Operator action list — the things only YOU can do

In priority order. Items 1–2 unlock the most.

1. **Apply to PartnerStack** (partnerstack.com) — unlocks Kit, GetResponse, Leadpages, Teachable,
   Thinkific, Copy.ai. Use solostackmethod.io as your site; describe the audience honestly.
2. **Apply to Impact** (impact.com) — unlocks Semrush, Bluehost, Webflow, Canva.
3. **Apply to ShareASale** → WP Engine.
4. **Apply in-house:** Cloudways, Kinsta, ClickFunnels, NordVPN, MailerLite (Trackdesk).
5. **As each approves,** paste the affiliate deeplink to me (or into a `affiliateUrl` field) — the
   site earns immediately.
6. **Decide the model** (see §10) — affiliate-first vs keep $20/mo vs both.
7. **Approve published content** (Gate 4) before it goes live — voice + disclosure.
8. **Tax/payment:** confirm W-9 vs W-8BEN, set PayPal/Wise/bank per network, track income per
   program. (Agents leave `[[OPERATOR: ...]]` placeholders; never submit for you.)

I (or the agents) will draft every application, write every page, fix the data, and wire the code.
You apply, you approve. That's the division of labor.

---

## 10. The one decision to make (my recommendation)

**Affiliate-first, content-led, email-compounding. Demote the $20/mo subscription** until there's a
real product behind it (real user auth + Stripe + something worth $20/mo/month that isn't built).
Reasons: the subscription can't be charged today; the affiliate engine *can* earn and *reinforces*
the "here's the trustworthy stack" brand instead of fragmenting it; and the free content + email list
is the asset that compounds and can upsell a paid tier later from a position of trust.

If you'd rather keep both: make the homepage primary CTA "Explore The Stack" (free, earns), and keep
"$20/mo" as a secondary "Pro method" CTA — but don't let an uncharged subscription be the only path.

---

## 11. Honest expectations

- **Near-term (weeks):** fixing the data + wiring links + 3 cornerstone pages = a *correct*, earning
  site. Early income is mostly the **flat-fee** tools (Semrush $200, WP Engine $200, Bluehost, Canva).
- **Medium (3–9 months):** content + SEO compound; recurring streams begin (email/funnel/course/hosting).
- **Annuity (12–24 months):** if the content engine runs and traffic builds, the recurring base is what
  turns this into a real machine — realistically ~$1–2K/mo recurring per ~100 retained customers, on top
  of flat-fee spikes.
- This is a **credibility-first, compounding** asset, not a get-rich-quick scheme. The moat — and the
  reason it survives Google — is that you actually build with these tools in public. Lean into that.

---

*Sources: `~/projects/affiliate-research/reports/FINAL-shortlist.md` + live verification (Kit,
GetResponse, MailerLite, Cloudways, Kinsta, WP Engine, Bluehost, Semrush, Copy.ai, Webflow, Leadpages,
ClickFunnels, Teachable, Thinkific, NordVPN, Surfshark, Canva official affiliate pages); market/SEO
research June 2026 (Collins WOTY, GitHub AI-code stats, low-code market sizing, Greg Isenberg, Ben's
Bites, Indie Hackers, managedwpguide/webhostingcat/getlasso/diggitymarketing, FTC Endorsement Guides,
Google scaled-content-abuse guidance 2025).*
