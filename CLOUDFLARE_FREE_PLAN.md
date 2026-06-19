# Solo Stack × Cloudflare — Maximize the Free Tier

> Goal: run solostackmethod.io **fast, safe, and at $0**, and gain the **affiliate
> click-tracking + link-cloaking infra the site is currently missing** — all on
> Cloudflare's free tier. Written 2026-06-19.
>
> Current stack: Next.js 14 (App Router, `output: standalone`) on **Netlify**.
> Dynamic bits: `/go/<slug>` affiliate redirect, `/api/*`, `/admin/*` (Postgres auth),
> optional KV click logging. Content surface (the SEO/$$ pages): `/guides`, `/compare`,
> `/tools`, `/content-hub`, `/audit-score`, `/pulse`, `/steps`.

Two-line strategy: **Tier 1 fronts the existing Netlify site with Cloudflare today
(zero migration risk).** **Tier 2 migrates hosting onto Cloudflare's free platform**,
which also kills the paid Postgres + paid-KV dependencies and gives you free, fast,
durable affiliate tracking. **Tier 3** wires the AI content engine.

Free-tier numbers below are indicative (early-2026) and drift — confirm on Cloudflare's
pricing pages. The one realistic place "free" runs out is noted explicitly.

---

## TIER 1 — Front the site (do today, no migration, works while on Netlify)

Point the domain's DNS at Cloudflare in "proxied" (orange-cloud) mode. Everything below
then works regardless of where the app is hosted.

- [ ] **Add `solostackmethod.io` to Cloudflare → move nameservers.** This is the on-ramp;
      gives instant **CDN + free SSL + unmetered DDoS + HTTP/3** with no code change.
      *Helps:* faster global TTFB → better Core Web Vitals → better SEO ranking on the
      money pages. `FREE`
- [ ] **SSL/TLS mode → "Full (strict)".** Free auto-renewing cert; encrypts to origin. `FREE`
- [ ] **Bot Fight Mode ON.** Blocks the dumb scrapers that lift your comparison tables
      and tool reviews. *Helps:* protects the content moat. `FREE`
- [ ] **Free Managed WAF ruleset ON.** Shields `/admin/*`, `/api/*`, `/login` from common
      exploits with zero code. `FREE`
- [ ] **Rate-limiting rule** on `/api/*` and `/login` (free tier allows one rule).
      *Helps:* stops brute-force on admin auth + API abuse. `FREE (1 rule)`
- [ ] **Turnstile** on `/signup` and `/support` forms (privacy-friendly CAPTCHA).
      *Helps:* kills spam signups/tickets without annoying real leads. `FREE (unlimited)`
- [ ] **Web Analytics** (drop the beacon, or it's automatic when proxied). Cookie-free.
      *Helps:* see *which* `/compare` and `/tools` pages actually convert — no GA, no
      cookie banner. `FREE`
- [ ] **Cache Rules:** cache `/guides/*`, `/compare/*`, `/tools/*`, `/content-hub/*`
      aggressively (Edge TTL); **bypass cache** for `/go/*`, `/api/*`, `/admin/*`,
      `/dashboard`. *Helps:* near-static speed on the SEO surface, correctness on the
      dynamic bits. `FREE`
- [ ] **Email Routing:** `hello@`, `contact@`, `partners@solostackmethod.io` → your inbox.
      *Helps:* pro addresses for affiliate-program signups + outreach, no mailbox cost. `FREE`
- [ ] **AI Crawl Control:** decide whether GPTBot/Claude/Perplexity etc. may crawl. Block
      to protect content, OR allow to get cited in AI answers (a real traffic source for
      affiliate content). *Decision, not default.* `FREE`
- [ ] **(Optional) Registrar:** transfer the domain to Cloudflare at wholesale cost — no
      renewal markup. `AT-COST`

**Tier 1 outcome:** faster, hardened, spam-free, measurable — still hosted on Netlify, zero risk.

---

## TIER 2 — Migrate hosting to Cloudflare's free platform (kills paid deps)

Move the app off Netlify onto **Cloudflare Workers/Pages** via the **OpenNext Cloudflare
adapter** (`@opennextjs/cloudflare`) — it runs Next.js 14 App Router incl. SSR/API routes.
This is where the site reaches **true $0 hosting** AND gains the missing affiliate infra.

- [ ] **Host on Cloudflare Pages/Workers** (OpenNext adapter). Git-push deploys like Netlify.
      `FREE` — Workers free = 100k requests/day; Pages static = unlimited.
- [ ] **`/go/<slug>` affiliate redirect → Worker.** Cloaks the raw affiliate URL, redirects
      instantly from the edge. *Helps:* clean branded outbound links + central control of
      every affiliate destination (fix a dead program in one place). `FREE`
- [ ] **Click tracking → D1** (one `affiliate_clicks` table: slug, ts, referrer, country).
      *This is the tracking `MONETIZATION_PLAN.md` says you don't have* — now free, durable,
      queryable. `FREE` — D1 free ≈ 5 GB + millions of row-reads/day.
- [ ] **Admin auth DB: Postgres → D1.** Same SQLite-style schema; **drops the paid Postgres
      bill to $0.** `FREE`
- [ ] **Images / OG images / lead magnets → R2.** S3-compatible, **no egress fees** — serve
      downloads and media with no bandwidth cost. `FREE` (≈10 GB).
- [ ] **KV** for hot config / feature flags / cached "Top Picks" payload (read-heavy). `FREE`.

**The one place free can run out (be honest):** if affiliate clicks exceed ~the daily
Workers request / KV-write quotas, upgrade to **Workers Paid = $5/mo** (10M requests/mo).
For a site currently at low traffic, you're comfortably inside free for a long time. Use
**D1 for click logs** (not KV) so per-click writes aren't a bottleneck.

**Tier 2 outcome:** $0 hosting, no Postgres bill, edge-fast, and the affiliate
click-tracking pipeline finally exists.

---

## TIER 3 — Free AI content engine (feeds the affiliate flywheel)

Your `content-pipeline/` + `agents/` produce the tool reviews and comparisons. Run the
cheap/bulk parts on Cloudflare's free AI so the pipeline costs nothing.

- [ ] **AI Gateway** in front of whatever LLM the pipeline calls: caching, logging, cost
      tracking across providers, one dashboard. `FREE`
- [ ] **Workers AI** for first-draft tool blurbs, meta descriptions, comparison summaries,
      schema/JSON-LD generation. `FREE` daily neuron quota.
- [ ] **Vectorize** (optional) for on-site semantic search of the tool directory —
      "find me a tool that does X." `FREE` tier.

---

## Suggested order

1. Tier 1 in full (an afternoon, zero risk) → immediate SEO + security + measurement win.
2. Tier 2 migration on a branch + Cloudflare *preview* deploy; cut over DNS only once the
   preview passes (`/go` redirect works, admin logs in against D1, clicks land in D1).
3. Tier 3 as the content pipeline gets exercised.

## What needs a human vs. what Claude can build

- **You (Cloudflare account actions):** add the domain + change nameservers, toggle
  Bot Fight / WAF / Web Analytics, create the API token, set up Email Routing.
- **Claude (code, on this repo):** wire the OpenNext adapter + `wrangler.toml`, write the
  `/go` Worker + D1 click logger, port the admin schema Postgres→D1, add Turnstile to the
  two forms, add the Cache Rules / `_headers`. All verified against a Cloudflare preview
  deploy before any DNS cutover.
