# Product Blueprint — the Method as an agent-driven build pipeline

> Vision: a user goes through the Method steps on solostackmethod.io, directing an AI agent in
> plain English, and ends up with **a GitHub repo of their website, built on the recommended
> stack, that autodeploys on every push** — and keeps upgrading itself over time. Prepared 2026-06-09.

---

## 0. Why this unifies the whole product

Today the three pieces sit side by side. This vision fuses them:

- **The Method (Layer 1)** becomes the *guided flow* the user walks through.
- **The affiliate Stack** stops being a directory and becomes the *infrastructure their site runs
  on* — so finishing the flow = adopting the stack = honest affiliate revenue (you recommend it
  because their site is literally built on it).
- **Stack Pulse** becomes the *engine that keeps their site upgraded* (detect a tool update →
  agent proposes an upgrade PR → user approves → autodeploys).
- **The $20/mo** finally has a reason to exist: the in-product agent + managed auto-upgrades.

It's also a real wedge vs. Lovable/Bolt/v0/Replit: those lock you into their platform and produce
throwaway code. This produces **your own governed, exit-ready repo on your own stack.**

---

## 1. The end-to-end user journey (the 7 steps, wired to the stack)

| Step | What the user does (directing the agent) | Tool wired in (affiliate) | Output |
|---|---|---|---|
| 1. Create Repo | "Make me a portfolio site" | **GitHub** (substrate) | Real repo from the Solo Stack starter template (ships with `AGENTS.md`, `AI_CONTRACT.md`, governance) |
| 2. Tech Stack | Pick what it's built on | **Namecheap** (domain), **Cloudways/Kinsta** or Netlify/Vercel (deploy), **Kit/MailerLite** (email) | Stack chosen + accounts created via your links |
| 3. Context | Answer a few questions about the project | (the existing `PromptGenerator`) | Their `AGENTS.md` / project context committed to the repo |
| 4. Build | "Add a hero, an about page, a newsletter signup" | **Copy.ai** (AI copy), **Canva** (assets) | Agent edits the repo → branch → PR |
| 5. Test | "Does it work?" | deterministic gates (tests/lint) | Gates run in CI on the PR |
| 6. Audit | (automatic) independent review | second-model audit (the Method's loop) | Audit packet on the PR |
| 7. Deploy | "Ship it" | **Cloudways** / Netlify autodeploy | Live site; push-to-deploy wired |

After step 7 the user keeps directing the agent ("change the headline," "add a blog") → each change
is a governed PR → merge → autodeploy. **Their site, their repo, their stack.**

---

## 2. The Stack-as-infrastructure mapping

Every capability the generated site needs maps to a program we're affiliating with. This is the
honest version of affiliate marketing — you earn because their site *uses* the tool.

| Capability | Program(s) | Recurring? |
|---|---|---|
| Domain | **Namecheap** | one-time-ish |
| Repo / version control | GitHub *(no affiliate program — substrate)* | — |
| Autodeploy (static/Next) | Netlify / Vercel *(free tier, not affiliate)* | — |
| Autodeploy (app / WordPress / PHP, git-based) | **Cloudways**, **Kinsta** | ✅ recurring |
| Email capture / newsletter (baked into the template) | **Kit**, **MailerLite**, **GetResponse** | ✅ recurring |
| Landing pages / funnels | **Leadpages**, **ClickFunnels** | ✅ recurring |
| Sell a course / membership | **Teachable**, **Thinkific**, **Kajabi** | ✅ recurring |
| Storefront | **Shopify** | one-time bounty |
| Visual builder alternative | **Webflow**, **Framer** | ✅ recurring |
| AI copy for their content | **Copy.ai** | ✅ recurring |
| Design assets | **Canva** | one-time |
| SEO / growth | **Semrush** | one-time |
| CRM / automation | **ActiveCampaign** | ✅ recurring |

**Honest note:** the *deploy target* itself (GitHub + Netlify/Vercel) is mostly free and not where
the affiliate money is — the money is in the **surrounding stack** (domain, managed hosting if they
outgrow the free tier, email, funnel, course, AI copy). Don't pretend GitHub pays; it doesn't.

---

## 3. The one architectural fork — how does the agent run?

Everything else follows from this.

### Model A — "Method-guided, bring-your-own-agent" (MVP, buildable now)
The site doesn't run the agent. It **orchestrates**: GitHub OAuth → creates the repo from a real
starter template → wires the deploy hook → and hands the user the exact **director-prompts** for
each step to run in *their own* agent (Claude Code / Cursor in the repo). The Method files we ship
into their repo govern that agent.
- ✅ Buildable in weeks; no server-side agent infra; no inference cost you bear; uses their Claude sub.
- ✅ Truly exit-ready (their repo, their agent).
- ⚠️ Requires the user to run an agent locally — friction for the *most* non-technical users.

### Model B — "In-product agent" (the full magic; the north star)
The user types intent in the browser; a **server-side agent** (Claude via the API + a GitHub App)
edits files in their repo, opens a governed PR (gates + dual-audit), merges, and the deploy provider
rebuilds. They never leave the page.
- ✅ The real non-technical magic; the website *is* the agent harness; this is what the $20/mo funds.
- ⚠️ Substantial build: GitHub App, agent orchestration, sandboxed build/preview, your inference
  cost (passed through via the subscription), security review. Competes directly with Lovable/Bolt —
  win on governance + exit-ready + the real stack, not on being first.

### Recommendation
**Build Model A as the MVP, architect toward Model B.** A's orchestration layer (GitHub OAuth, repo
templating, deploy wiring, the step engine, the stack signups) is *exactly* the substrate Model B
needs — so A is not throwaway, it's the foundation. Add the in-product agent (B) once the flow and
the stack monetization are proven.

---

## 4. The upgrade loop (what "autodeploys updates and upgrades" really means)

- **Updates** = standard CI/CD: push to GitHub → Netlify/Cloudways rebuilds. Free, already how it works.
- **Upgrades** = the differentiated part, and it's what **Stack Pulse** was always for:
  1. Stack Pulse monitors the tools in *their* stack.
  2. A tool releases an update → Pulse flags it.
  3. The agent opens an **upgrade PR** (bump the dep, run the gates, summarize the change).
  4. The user approves in plain English → merge → autodeploy.
- This is a recurring, subscription-worthy value ("your site keeps itself current and never silently
  breaks") and it closes the loop between all three layers.

---

## 5. Honest constraints

- **Build size.** Model A is a real but scoped build (GitHub OAuth/App + repo templating + deploy
  wiring + the step engine). Model B is a *product*, not a feature — weeks-to-months + ongoing cost.
- **You bear inference cost in Model B** — that's the subscription's job; price it to cover tokens.
- **GitHub/Netlify aren't affiliate earners.** Be honest; monetize the surrounding stack.
- **Security.** A GitHub App with write access to user repos is a serious trust surface — scoped
  permissions, audit logging, the no-secrets policy (already in the contract) all apply.
- **Don't out-promise.** "Direct an agent, get a deployed site" is Lovable's pitch too; your honest
  edge is *governed + exit-ready + on a real stack you keep updated* — lead with that, not "magic."

---

## 6. What already exists to build on (this is closer than it looks)

- `web/app/steps/{1..7}/` — the 7-step scaffold is already there.
- `web/components/PromptGenerator.tsx` — already generates director-prompts (Step 3/4).
- `web/components/SubscriptionGate.tsx` — gating logic (needs Stripe for B).
- The Method files (`AGENTS.md`, `AI_CONTRACT.md`, workflows) — the governance to ship into each repo.
- The Stack (`/tools` + `programs.json`) — the stack catalog + the affiliate links.
- A working deploy pattern (Netlify) — the autodeploy substrate.

**MVP scope (Model A) — buildable now:**
1. A **starter template repo** (`brynr-builds/solo-stack-starter`) — a minimal site + the Method
   files + deploy config + a pre-wired newsletter component (Kit/MailerLite).
2. **GitHub OAuth** + "create repo from template" via the GitHub API.
3. Wire the 7 step pages to the real flow: create repo → choose stack (affiliate signups) → generate
   `AGENTS.md` from answers → hand the director-prompts → connect deploy → done.
4. A "connect deploy" step (Netlify deploy button / API, or Cloudways git deploy).
5. Result screen: "here's your live site + your repo + how to keep directing the agent."

---

## 7. The one decision before building

**Which execution model do we build toward first?** (See §3.) The answer sets the entire
architecture. Recommendation: **MVP = Model A (BYO-agent), architected toward Model B (in-product
agent).**
