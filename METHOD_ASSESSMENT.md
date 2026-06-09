# Solo Stack Method™ — Methodology Assessment & Market Analysis

> Is the method correct? How do we improve it? Is there a market, and who do we sell it to?
> Prepared 2026-06-09. Folds in a best-practices benchmark + market research (both web-sourced,
> cited). Companion to `MONETIZATION_PLAN.md` (the affiliate layer) — this doc is about the
> **methodology product itself** (Layer 1).

---

## 0. Verdict in one paragraph

**The method is directionally right but dated.** Its instincts are genuinely good — several were
*ahead of the curve* for a solo methodology (repo-as-context, ask-don't-guess, plan-before-act,
tiered permissions, and especially "the builder may not be its own auditor" cross-model review).
But it predates the 2025–2026 standardization wave: it **reinvents principles the ecosystem has
since crystallized into concrete, machine-read artifacts** (AGENTS.md, spec-driven dev, plan mode,
subagents, MCP, CI eval gates), it **leans on LLM-vs-LLM agreement where deterministic gates are
needed**, and — most damning — it **ships a config pinned to `claude-3`/`gpt-4`**, which quietly
proves its own "weekly Agent Capability Pulse" was never actually run. The bones are sound; the
flesh is two years stale and the public-facing files are visibly broken. **Fixable in a focused
pass.** The market for the *outcome* it sells is real and surging; the market for a *branded
methodology* is unproven but has genuine, unclaimed whitespace.

---

## 1. Is it correct? — practice-by-practice

Benchmarked against today's conventions (AGENTS.md, CLAUDE.md/rules files, plan mode, permission
allowlists, ADRs, conventional commits, multi-agent review).

| SSM practice | Current convention it maps to | Verdict |
|---|---|---|
| **Repo-as-Truth** | The **AGENTS.md** open standard (60k+ repos, now under the Linux Foundation's Agentic AI Foundation) + CLAUDE.md | ✅ Right principle — but names no artifact. And "put *everything* in the repo" is the 2024 model; 2026 is *context engineering* (load the **right** context; dumping all of it measurably hurts via lost-in-the-middle). |
| **Explainability Before Execution** | Plan mode / Spec-Kit `/plan` / change-request+rollback | ✅ Correct instinct, expressed as a manual ritual. SOTA bakes it into a *mode*, not etiquette. |
| **Intent-Preserving Code (`// INTENT:`)** | "why" comments + **ADRs** (Architecture Decision Records, now used as AI context) | ✅ Good but under-powered — inline comments capture *local* why; architectural why needs ADRs. |
| **Workflow Understanding > Code Understanding** | "orient before diving" / architecture-overview section | ⚠️ Right instinct, idiosyncratic mechanism. Mandating a bespoke `/workflows` dir that no tool reads; an AGENTS.md "architecture" section is portable and does the same. |
| **The Not-Psychic Rule (ask, don't guess)** | The canonical "ask don't guess"; missing context is the #1 dev complaint (65%, ranked above hallucination) | ✅✅ One of its best rules — targets the dominant real failure mode. |
| **Scoped Approval Gateway (allow/ask/never)** | Claude Code permission modes + settings.json allow/ask/deny + hooks | ✅ Maps ~1:1 — but should be **machine-enforced config**, not honor-system prose. |
| **Dual Audit Loop (builder ≠ approver)** | Cross-model review; CodeRabbit; Claude Code `/review` + review subagents; LLM-as-judge | ✅✅ Genuinely good and was early — see §2. Over-ceremonial for *trivial* diffs. |
| **Branch+PR, conventional commits, no-secrets** | Universal baseline | ✅ Correct, uncontroversial, not differentiating. |
| **Weekly Agent Capability Pulse** | How CodeRabbit/ensembles dynamically pick models; "the scaffold matters as much as the model" | ✅ Great instinct — ironically self-incriminating: the config is pinned to `claude-3`/`gpt-4`, proving the Pulse never ran. |

### The dual-model audit pattern — is it real? Yes, with caveats.
"One model builds, a *different* model reviews" is a **real, recommended 2026 pattern** (Anthropic
shipped a multi-agent code-review tool for Claude Code; CodeRabbit markets "a different engine =
different perspective"). Evidence backs the core claim: models exhibit **self-attribution bias**
(they rate their *own* patches as more correct), so builder≠approver is exactly right; cross-*provider*
review catches "meaningfully different categories of bugs." **But** SSM underweights three things:
(1) the **popularity trap** — two LLMs trained on similar data agree on the same wrong answer, so
"consensus ≠ correctness"; (2) **cost/latency/friction** make a full audit packet unsustainable on
*trivial* solo diffs; (3) a green AI review invites **over-trust** (single-pass tools still miss
~half of real runtime bugs). Verdict: keep it, but **risk-tier it** and **back it with deterministic
gates** (tests, linters, secret/SAST scans), since LLM-vs-LLM agreement is not independent verification.

---

## 2. The defects (what's actually broken right now)

Beyond "dated," these are concrete, observable problems hurting credibility today:

1. **Stale model config.** `agents/agent-profiles.yaml` says `model_family: "claude-3"` / `"gpt-4"`
   and "Last updated: Initial configuration." Two generations out of date (mid-2026 frontier is
   Opus 4.x / GPT-5.x Codex / Gemini 3.x). This *disproves the Capability Pulse* on its own.
2. **Broken workflow links.** `AI_README.md` and `workflows/00-solo-stack-overview.md` route users
   to `01`–`06` (`02-new-feature.md`, `03-bug-fix.md`, `04-deploy-to-production.md`,
   `05-return-after-time-away.md`, `06-stabilization-pass.md`) — **none exist** (only `00` and `07`
   do). A reader following the README hits dead ends immediately. The two index files even disagree
   on what `01` is (`01-project-init` vs `01-idea-to-change`).
3. **Broken markdown rendering.** `SOLO_STACK_MANIFESTO.md`, `CURSOR_RULES.md`, and
   `workflows/00-solo-stack-overview.md` all have the same bug — every list item is wrapped in an
   extra `>` with incrementing numbers, so on GitHub they render as a wall of nested block-quotes.
   This is the public face of the brand.
4. **README typo.** `AI_README.md` folder block reads `README.md ← HAI_README.mduman-facing readme`
   — a botched merge of two strings.
5. **Dated "Replit teaches; GitHub ships" framing.** Hard-codes a specific 2024 tool split; Replit
   is now a serious agentic platform. The methodology shouldn't be welded to two named vendors.
6. **Over-trademarked.** ™ on every coined term ("Repo-as-Truth™", "The Not-Psychic Rule™", …).
   To a builder/dev audience this reads as info-product/LinkedIn-guru and *undercuts* genuinely good
   content. (See §4 — keep 1–2 hero terms, drop ~90% of the glyphs.)

---

## 3. How to improve it — prioritized

### P0 — Fix the broken/dated (unambiguous, do first)
- Repair the nested-blockquote markdown in the manifesto, CURSOR_RULES, and the overview.
- Either **create** workflows `02`–`06` or **remove the references** and align the two index files.
- Fix the `HAI_README.md…` typo.
- **De-pin the models:** rewrite `agent-profiles.yaml` to reference *roles* ("primary builder,"
  "auditor") resolved from a **dated capability table**, not hard-coded `claude-3`/`gpt-4`; set a
  real "last updated." Then the Capability Pulse has something true to maintain.

### P1 — Modernize to 2026 (the credibility upgrade)
- **Adopt the AGENTS.md standard as the literal artifact** for Repo-as-Truth (+ keep `CLAUDE.md`
  for Claude-specific notes). Stop inventing parallel filenames; converge on what every agent reads.
- **Add a spec-driven layer.** A lightweight `spec → plan → tasks → implement` step (Spec-Kit / Kiro
  style) — the dominant 2026 answer to vibe-coding, and the natural home for "Explainability Before
  Execution."
- **Bind principles to real mechanisms:** plan mode + **subagents** (isolated context, own
  permissions) for the builder/auditor split, instead of prose rituals.
- **Make safety deterministic-first.** Tests/evals + secret/SAST/dependency scanning as *blocking
  merge gates*, with the dual-model audit layered on top and **risk-tiered** (full packet only for
  app-code/schema/auth/billing; lightweight for docs/refactors).
- **Express the Scoped Approval Gateway as config** (`settings.json` allow/ask/deny + hooks), not
  prose — so it's enforced, not honored.
- **Add ADRs** alongside `// INTENT:` comments for architectural decisions.
- **Reframe Repo-as-Truth as context engineering:** curate/retrieve the *right* context; manage the
  window. Mention **MCP** as the tool/data-access standard.

### P2 — Strategic (positioning, see §4–5)
- Drop the "governance" register and heavy ™ for the builder audience; keep the memorable names.
- Lead with the demonstrable **Dual-Audit Loop** and the **comprehension-debt / exit-ready** hooks.
- Make the public repo genuinely best-in-class (real example audit packet, real permission config,
  copy-paste AGENTS.md) — it *is* the funnel.

---

## 4. Is there a market? — yes, and the pain is surging

**The pain is loud, named, and people actively seek solutions.** "Vibe coding" is now a documented
failure mode: surveys put "AI output almost-right-but-not-quite" as the #1 dev frustration (~66%),
and ~45% say debugging AI code takes *longer*. Viral "after 6 months of vibe coding my codebase is
a mess" posts (340% more tech debt); WIRED (2026) reported 5,000+ vibe-coded apps with almost no
auth, ~40% leaking data. The exact vocabulary SSM sells against is now industry language —
**"comprehension debt," "verification debt," "bus factor of zero."** And **63% of AI-built products
are started by non-developers** — SSM's exact ICP.

**The solution-adjacent categories are exploding** (the strongest demand signal): AGENTS.md (60k+
repos), GitHub Spec Kit (93k+ stars), "context engineering" displacing "prompt engineering," paid
`.cursorrules`/`CLAUDE.md` packs selling well.

**But:** demand for a *branded named methodology* is unproven — today people solve this by grabbing
**free** rules files and reading blog posts. And **every individual ingredient SSM uses (rules files,
spec discipline, independent AI review, audit packets) already exists for free.** So the product is
**the synthesis + the brand + the hand-holding**, not novel mechanics. You'd be *educating a
category*, not just capturing existing search demand.

### Competitors / comparables
- **AGENTS.md** (free standard) · **CLAUDE.md/.cursorrules** (free, default practice) ·
  **GitHub Spec Kit** (free, 93k★, the "do it properly" gorilla) · **Amazon Kiro** (spec-driven IDE)
  · **BMAD-Method** (free multi-agent roles — closest *philosophical* competitor) ·
  **context-engineering repos** (free templates) · **CodeRabbit/Qodo/Greptile** (the "audit" half as
  a product) · **enterprise AI-governance frameworks** (right concept, *wrong altitude* — corporate/$$$)
  · **paid creator courses/communities** (Greg Isenberg et al. — teach you to *build fast*, explicitly
  not how to *stay in control / hand off cleanly*).
- **The whitespace is real:** nobody owns **"solo / non-technical builder + control + exit-ready
  handoff."** Spec-Kit/BMAD are dev-tool-flavored and intimidating for non-coders; courses teach
  speed not control; enterprise governance is corporate. That gap is SSM's wedge.

---

## 5. Who to market it to + how

### Audience, ranked by fit × reachability
1. **Indie hackers / solo devs adopting agentic workflows** *(best overall)* — technical enough to
   value governance, feel the pain firsthand, congregate in obvious places, and already buy
   tools/courses/rules-packs. **Where:** X/Twitter, Indie Hackers, r/vibecoding, r/ClaudeAI, dev.to,
   builder newsletters. **Language that lands:** "ship without the codebase turning to mush,"
   "PR-sized steps," "rollback," "comprehension debt." Anti-corporate, concrete.
2. **Non-technical founders building with AI** *(highest pain + willingness to pay, harder to reach)*
   — the "bus factor of zero" nightmare is theirs. **Where:** no-code/Lovable/Bolt communities,
   founder Twitter, "build a SaaS with AI" YouTube. **Language:** "you don't need a $150k dev — but
   don't end up with a product no dev will touch," **"exit-ready," "what happens when you hire your
   first engineer."** Fear-of-the-handoff is the emotional hook.
- Secondary: small agencies/consultancies (repeatable client handoff — a real B2B2C angle where
  "governance" *is* the right word and the premium tier lives).

### Positioning (important)
- **"Governance" is the riskiest word** for the builder audience — it reads corporate/compliance,
  the opposite of why they vibe-code. Keep "governance" only for the agency/B2B tier. **"Method/
  framework" is fine and on-trend.**
- **Lead with outcome + control + the handoff**, not governance. Candidate one-liners:
  - *"Build real software with AI agents — and keep a codebase a real dev could take over tomorrow."*
  - *"The discipline that turns vibe-coded prototypes into exit-ready software."*
  - *"Your AI builds. A second AI audits. You stay in control."* (leads with the most differentiated,
    demonstrable mechanic).
- **On the ™:** liability as currently dosed. Keep 1–2 hero terms (good recall); drop ~90% of the
  glyphs. Credibility for this crowd comes from **working code in a public repo**, not legal symbols.

### Channels / GTM (realistic solo-creator sequence)
1. **Repo-as-flywheel** — the public repo must be excellent and useful standalone (templates, a real
   audit packet, a permission config, a copy-paste AGENTS.md). Devs vet you by your repo. Aim for the
   `awesome-*` lists.
2. **Build in public on X** — daily concrete artifacts ("here's a real audit packet that caught a bug
   Claude introduced"); thread the failure-mode stories (they get engagement).
3. **Reddit + Indie Hackers** honest build logs (now out-converting Product Hunt for early signups).
4. **One long-form anchor per pillar** (Dual-Audit, Repo-as-Truth, comprehension debt) for SEO
   against surging "context engineering / spec-driven / AI tech debt" searches.
5. **Claim an unowned ritual:** a recurring **"Agent Capability Pulse"** newsletter/X-thread
   (which-model-for-which-role is genuinely useful + shareable, and nobody owns it). Your repeatable
   content engine — and, conveniently, a credible affiliate surface *if kept independent*.
6. **Product Hunt later** as an amplifier, not the launch.
- **Reality check:** with no existing audience, expect **6–12 months of build-in-public** before
  traction. The repo + a consistent POV are the only durable moats; mechanics are copyable.

### Monetization (and fit with the affiliate layer)
- **Now:** free framework + repo (audience engine) → **paid templates/audit-packet pack** (easiest
  first dollar) → **paid community** as the recurring core (the product is *judgment/discipline*,
  which benefits from peer support + updates as models change; the weekly Pulse gives a reason to
  stay subscribed).
- **Later:** a **light open-core SaaS** (audit-packet generator / Pulse automation) — biggest
  defensible revenue, but only after PMF. **Course** as a one-time cash injection / lead magnet.
- **The affiliate layer (`MONETIZATION_PLAN.md`) complements this** — but two caveats: (1) the
  Dual-Audit's "independence" promise depends on being **vendor-neutral**; don't shill one model/tool
  so hard it undermines the framework's credibility. (2) Affiliate is a **passive layer beneath**
  community/templates/SaaS, not the engine.

---

## 6. Bottom line

- **Correct?** Directionally yes — and ahead of its time on the audit loop — but **dated and
  visibly broken** in ways that are quick to fix.
- **Improve it?** P0: fix the broken markdown, dead workflow links, and stale model config. P1:
  adopt AGENTS.md, add a spec/plan layer + deterministic test/scan gates, risk-tier the audit,
  express permissions as config. P2: de-corporate the positioning, trim the ™.
- **Market?** The pain is real and surging; the **solo + control + exit-ready** whitespace is
  genuinely unclaimed — but the mechanics are commoditized, so **you win on synthesis, brand, repo
  quality, and community**, marketed first to **indie hackers/solo devs** (reach) and **non-technical
  founders** (pain/$), led by the **exit-ready / comprehension-debt** hook and the demonstrable
  **dual-audit**, *not* by "governance."

*Sources: best-practices benchmark + market research (web, June 2026) — AGENTS.md / Agentic AI
Foundation, GitHub Spec Kit, Amazon Kiro, BMAD-Method, Claude Code subagents/review docs, CodeRabbit/
Qodo, Stack Overflow 2025 survey, context-engineering literature, Indie Hackers / r/vibecoding
community data, Greg Isenberg GTM. Full URLs in the research threads.*
