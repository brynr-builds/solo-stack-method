# Operator Action Pack — apply, then paste links back (the only part that needs *you*)

> Everything else (the engine, the data, the content pipeline) is built. This is the
> non-delegable part: creating accounts, accepting Terms, and entering tax/payment info
> (Gate 3), then approving content (Gate 4). I've made it as close to copy-paste as possible.

---

## Step 1 — Apply to the networks (in this order)

Applying to the first two unlocks ~half the Stack in one go. Use **solostackmethod.io** as your site.

| # | Network | Apply at | Unlocks |
|---|---|---|---|
| 1 | **PartnerStack** | partnerstack.com (sign up as a partner) | Kit, GetResponse, Leadpages, Teachable, Thinkific, Copy.ai |
| 2 | **Impact** | impact.com → "Partners" → sign up | Semrush, Bluehost, Webflow, Canva (+ NordVPN in some regions) |
| 3 | **ShareASale** | shareasale.com/info/affiliates | WP Engine |
| 4 | **In-house** (apply on each site) | links below | Cloudways, Kinsta, ClickFunnels, NordVPN, MailerLite, ActiveCampaign |

**In-house apply links:**
- Cloudways → https://www.cloudways.com/en/web-hosting-affiliate-program.php
- Kinsta → https://kinsta.com/affiliates/
- ClickFunnels → https://www.clickfunnels.com/affiliates
- NordVPN → https://nordvpn.com/affiliate/
- MailerLite → https://www.mailerlite.com/affiliate
- ActiveCampaign → https://www.activecampaign.com/partner/affiliate-program

> Within PartnerStack/Impact, you then "apply to" each brand individually — that's a click each,
> using the same answers below.

---

## Step 2 — Copy-paste application answers

Most applications ask the same handful of questions. These answers fit **every program** on the
list (same site, same audience). Paste and lightly tweak per program.

**Website / platform URL**
> https://solostackmethod.io

**What is your site about? / Describe your platform**
> Solo Stack Method is a content site and methodology for non-technical founders and solo
> builders who ship real software using AI. We publish dogfooded guides, tool comparisons, and a
> curated, research-scored "Stack" of the software these builders actually need — hosting, email,
> funnels, courses, AI tools, and security. Every recommendation is one we use and document in a
> public GitHub repo.

**Who is your audience?**
> Solo founders, indie hackers, creators, and non-technical people building products with AI
> tools (Claude Code, Lovable, Bolt, Cursor). They're actively buying their first hosting, email,
> and funnel tools — high purchase intent, global.

**How will you promote [Program]?**
> Through honest, dogfooded content: in-depth tool comparisons (e.g. "Kit vs GetResponse vs
> MailerLite"), how-to guides (e.g. "where to deploy an app you built with AI"), and a curated
> Stack directory with per-tool detail pages. SEO-led, with an email newsletter (Stack Pulse) for
> ongoing recommendations. All affiliate links carry clear FTC disclosure.

**Monthly traffic / audience size**
> [[YOU: enter your real, current number — be honest. New sites are fine for these programs;
> don't inflate it. If asked and you're just starting, say so — most of these approve new sites.]]

**Promotion methods (checkboxes)**
> Content/blog, SEO, Email newsletter, Comparison/review pages. (Not: paid search on the brand's
> trademark, coupon spam, or incentivized clicks — several programs prohibit these.)

**Tax / payment** — [[YOU: W-9 if US, W-8BEN if non-US]]; set PayPal/Wise/bank per network.
Agents and I draft everything *except* this — credentials, Terms acceptance, and tax forms are
yours by law.

---

## Step 3 — Paste each tracking link back (this is the "on" switch)

The moment you're approved for a program, the network gives you a **tracking link** (often called
a referral/affiliate link, e.g. `https://kit.com/?lmref=AbC123`). To turn that program on, run
**one command** from the repo:

```bash
cd web
node scripts/set-link.mjs <slug> "<your-tracking-link>"
# example:
node scripts/set-link.mjs kit "https://kit.com/?lmref=AbC123"
```

Run it with no arguments to see which programs still need a link:

```bash
node scripts/set-link.mjs
```

Then commit + push (`git add -A && git commit -m "wire <program> affiliate link" && git push`) and
Netlify republishes. Every `/go/<slug>` click for that program now earns. **No content edits, ever.**

**Program slugs** (for the command): `kit`, `getresponse`, `mailerlite`, `clickfunnels`,
`leadpages`, `teachable`, `thinkific`, `cloudways`, `kinsta`, `webflow`, `copy-ai`, `nordvpn`,
`semrush`, `wp-engine`, `bluehost`, `canva`, `surfshark`, `activecampaign`, `kajabi`, `siteground`,
`shopify`, `namecheap`, `hostinger`, `notion`, `framer`.

---

## Step 4 — Approve published content (Gate 4)

The Hermes content pipeline drafts new guides/comparisons into `web/content/` and opens a PR. Before
each goes live, skim it for (a) your voice, (b) accurate claims, (c) disclosure present. Approve →
merge → it's live. (Two cornerstone pieces are already written as the quality bar.)

---

## Priority order if you only do a little

1. **PartnerStack** + **Impact** signups (1–2, biggest unlock).
2. Apply to **Kit, GetResponse, Cloudways, ClickFunnels, Semrush** first — they back the content
   that's already written + the highest-intent keywords.
3. Paste those 5 links back with `set-link.mjs`. That alone turns the lights on.
