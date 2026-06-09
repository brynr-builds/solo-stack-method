# Solo Stack Method — Agentic Marketing Plan (drive traffic, autonomously)

> How to drive people to solostackmethod.io using the Hermes agent team — what runs autonomously,
> what must stay human, and the 90-day plan. Grounded in 2026 market research (sources at bottom).
> Goal: a draft-and-prepare agent back office + a disciplined human front. Budget: ~$0.

## The one hard truth that shapes everything
**AI agents can draft and prepare almost everything; a human must do the *posting* and
relationship work on every platform that matters.** Automating *engagement* (posting, commenting,
liking, following, DMing) on Reddit/X/Hacker News is **the single fastest way to get banned in
2026.** So the agent team is a **back office that drafts at scale**, never an auto-poster. Build
the system around "**AI proposes → human approves → human posts.**"

## Your defensible engine (lead with this)
**Stack Pulse → live-data comparison pages.** Google's 2026 updates killed thin AI listicles
(50–80% traffic drops) but explicitly *spared* comparison pages built on **live data with "last
updated" timestamps** — which is literally what Stack Pulse is. This is also the exact structure
**AI answer engines cite** (ChatGPT/Perplexity/AI Overviews). It is the one programmatic-SEO play
that both survives Google *and* gets you recommended by AI. **Everything else supports it.**

## Channels — and how autonomous each can be
| Channel | Fit | Autonomy ceiling | Agent does | Human does |
|---|---|---|---|---|
| **SEO / comparison + guide pages** | ★ highest long-term | **High** | Drafts data-backed pages off Stack Pulse | Adds first-hand testing, edits, publishes |
| **Reddit** (r/SideProject, r/SaaS, r/indiehackers, r/vibecoding) | ★ #1 for signups (3–8× Product Hunt) | **Low** — human-must-post | Finds threads, drafts comments/posts | Ages account, participates, posts (90/10 rule) |
| **X build-in-public** | ★ trust + audience | **Draft-only** | Drafts threads (real numbers) | Posts/schedules on own account |
| **Email newsletter** | ★ owned, compounding | **High** | Drafts weekly issue | Approves voice; (sending automatable) |
| **Launch directories / listicles** | ◐ backlinks + AI-citation signals | **High** | Drafts submissions | Submits (CAPTCHA) |
| **Hacker News (Show HN) / Discords** | ◐ high-variance reach | **Human-only** | Drafts the post | Posts; HN/Discord punish anything automated |
| **Product Hunt** | ◐ one-time event, not a channel | Prep auto, launch human | Builds launch kit | Runs the day |
| **YouTube / shorts** | ◐ human-heavy | Repurpose-only | 1 recording → many clips/posts | Records |

## The autonomous marketing system (Hermes)
Extend the existing `solo-stack-content` pipeline into a marketing back office. Same HITL pattern as
the affiliate research: **agents draft → ChatGPT/riley audits → operator approves (Gate) → operator
posts.** Every "publish/post/send" is a **gated step the agent cannot execute** — it only drafts.

```
[weekly, board: solo-stack-marketing]
 sam-scout      → find ranking gaps + live thread/keyword opportunities (SearXNG)
   ▼
 quinn-copywriter → DRAFT: comparison pages (off Stack Pulse data) · guides · X threads ·
   │                Reddit value-post drafts · newsletter issue · directory submissions
   ▼
 ChatGPT/riley  → audit: FTC disclosure present? data-differentiated? scaled-content-safe? on-voice?
   ▼
 [Gate A] OPERATOR approves content → merge to repo (SEO pages publish via Netlify)
 [Gate B] OPERATOR posts the social/Reddit drafts HIMSELF (never the agent) on aged accounts
```
- **FTC is baked into every template** (article footer near links; X above-the-fold; Reddit
  comment) so no approval step can forget it. Penalty is ~$51k/violation and the brand shares it.
- **Provenance:** SEO pages are repo-as-truth (governed, audited) → they publish via the normal
  branch→PR→Netlify path; social drafts go to `marketing/drafts/` for the operator to copy-paste.

## SEO / AEO playbook (for the agents' templates)
- **Every page: a 40–80-word direct answer up top**, then context, question-style subheads, a
  **comparison table**, a clear **"our pick for X"**, and an FAQ. (This is what AI engines quote.)
- **Mandatory per page: one column/section of unique data no competitor has** (live Pulse numbers,
  your own test, your own cost math) + a **100–150-word human synthesis.** No template mad-libs.
- **Freshness = citation signal:** "last updated" + keep Pulse-fed pages current (cron already does this).
- **Don't blend intents:** definitional / process / **comparison** / decision — your money pages are
  comparison + process ("build X with AI").
- **Entity consistency** across site + directories + profiles (same brand name, author bio, category
  language) → AI engines trust consistent entities. Build unlinked brand mentions.
- **Allow AI crawlers** (GPTBot/ClaudeBot/PerplexityBot) — fixed in this PR (`app/robots.ts` + sitemap).
  ~68% of SaaS sites accidentally block them.

## Guardrails (hold these all 90 days)
- **No automated engagement on any platform.** Agents draft; humans post. (Reddit shadowbans link
  drops in ~5 subs/day "within minutes"; X suspends auto follow/like/reply/DM.)
- **Reddit 90/10 rule**, age accounts 2–4 weeks + ~30 substantive comments before any product mention.
- **FTC disclosure in every affiliate-bearing post**, in the post, above the fold, plain language.
- **Per-page data + human edit** before any SEO page ships (scaled-content line).
- **Progressive autonomy:** start everything human-gated; widen agent authority only on proven-safe
  draft tasks (SEO, repurposing) — never on posting.

## 90-day plan (solo + agent team, ~$0)
**Highest-leverage first:** (1) Stack Pulse → comparison pages; (2) human-fronted Reddit; (3) newsletter loop.

**Days 1–30 — Foundation (agents build, human seeds):**
- Agents draft 6–10 data-backed comparison pages (off Pulse) + 4–6 "build X with AI" guides, each
  with answer-lead + table + FAQ + human synthesis. Draft 30+ Reddit comments + a directory batch.
- Human: **post nothing promotional** — genuinely participate on Reddit/X/HN to age accounts; submit
  directories; write first-hand testing notes the agents fold in. Wire analytics + newsletter ESP.
- Cadence: 2–3 articles/wk approved; ~15–20 min/day human community participation.

**Days 31–60 — Distribution (semi-autonomous):**
- Agents: keep content cadence; draft X build-in-public threads (real numbers → 4–6× follower lift)
  + Reddit value-posts + weekly newsletter; repurpose one recording → clips.
- Human: post the drafted threads on a schedule; share honest Reddit updates (numbers, a failure, no
  forced CTA) within 90/10; send approved outreach.
- Cadence: 2–3 articles, 3–4 X posts, 1–2 Reddit posts, 1 newsletter/wk — agent-drafted, human-posted.

**Days 61–90 — Compounding + AEO:**
- Agents: refresh top comparison pages (currency = citation); generate original-data pieces (Pulse
  trends) for digital-PR/AEO; expand directories; draft a Product Hunt + Show HN launch kit.
- Human: run the launch as an *event*; pursue 2–3 unlinked brand mentions; monitor AI-answer presence
  ("are we cited for *best X for Y*?") and referral quality — not vanity metrics.

## Division of labor (the deal)
- **Agents (autonomous, free local compute):** research gaps, draft all content + social/Reddit
  drafts, audit for FTC/quality, keep Pulse pages fresh, write the weekly report.
- **You (non-delegable):** post on platforms, build relationships, add first-hand data, approve every
  publish/send, run launches. ~30–60 min/day.

## What I'm setting up in this PR
- `app/robots.ts` + `app/sitemap.ts` (crawlable + AI-citable — the SEO foundation).
- `content-pipeline/marketing-topics.json` — the priority comparison/guide backlog (the SEO moat).
- A `marketing-drafts` capability + launcher so the agent team drafts social/Reddit/newsletter into
  `marketing/drafts/` for you to approve and post.

*Sources: 2026 web research — Prems AI indie-hacker playbook; Reddit/X automation-rule guides
(Redship, OpenTweet, Unfollr); Digital Applied (programmatic SEO after the March 2026 scaled-content
update); n8n human-in-the-loop; ALM/Frase/PoweredBySearch (AEO); FTC Disclosures 101; Indie Hackers
channel data. Full URLs in the research thread.*
