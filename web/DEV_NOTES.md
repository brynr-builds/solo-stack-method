# Solo Stack Method™ Web Application

## DEV NOTES

### Phase 1.3 — Admin + Analytics + CRM + Support (V1-Light)

**What was added:**
- Admin Dashboard (`/admin`) with 4 tabs: System Health, Process Effectiveness, Product Analytics, Ask the System
- CRM (`/admin/clients`) for process intelligence — tag, note, AI blocker summaries
- Admin Config (`/admin/config`) for adjusting process, prompts, gating, audit rules, monetization copy
- AI Support Agent (`/support`) with pattern-matched responses and explicit escalation
- AdminGuard + AdminProvider for mocked admin access control
- MockData.ts for centralized mock data models

**What this phase explicitly does NOT do:**
- No real database or persistence (all state resets on reload)
- No real AI API calls (responses are simulated)
- No Stripe or payment integration
- No Supabase Auth or role-based access
- No email, webhooks, background jobs, or automation
- No external analytics (PostHog, Mixpanel, etc.)

**Why mocked data instead of real?**
Governance-first: the UI shells, data shapes, and admin controls must be audited and approved
before connecting real services. This prevents accidental data exposure and ensures the
admin experience is correct before live data flows through it.

---

### Tech Stack Justification

| Technology | Why | Free Tier |
|------------|-----|-----------|
| **Next.js 14** | App Router supports static marketing + dynamic auth routes, excellent Supabase integration | ✓ |
| **Supabase** | Auth, database, Edge Functions - already used for Stack Pulse | ✓ (generous) |
| **Tailwind CSS** | Utility-first, fast iteration, no runtime overhead | ✓ |
| **Netlify** | Free hosting, Edge Function support, easy deployment | ✓ |
| **TypeScript** | Type safety, better DX, catches errors early | ✓ |

### Tradeoffs Considered

1. **Vercel vs Netlify**: Chose Netlify because Supabase Edge Functions already deployed there; keeps infrastructure simple.

2. **Auth0/Clerk vs Supabase Auth**: Chose Supabase Auth for simplicity - one less service, already using Supabase for data.

3. **Styled Components vs Tailwind**: Chose Tailwind for faster iteration in Phase 1. Can refactor later if needed.

---

## Phase 1 Scope

### What IS Built
- ✅ Public marketing homepage with locked copy
- ✅ Public Stack Pulse (read-only) with newsletter signup
- ✅ Login/Signup pages (UI only)
- ✅ Dashboard with 7-step navigation
- ✅ All 7 step pages with:
  - Explanation text
  - Diagram placeholder
  - Step-scoped AI chat UI placeholder
  - Governance visibility
- ✅ Content Hub scaffold
- ✅ Netlify deployment config

### What is NOT Built (Phase 2+)
- ❌ Real Supabase Auth integration
- ❌ Stripe payment processing
- ❌ Actual AI chat with Claude/ChatGPT APIs
- ❌ GitHub OAuth and repo creation
- ❌ Real-time Stack Pulse data
- ❌ Email newsletter delivery
- ❌ Context system (GitHub as source of truth)
- ❌ Dual audit enforcement
- ❌ PR generation and approval workflow

---

## Phase 1.1 Additions (2026-01-31)

### New Features
- **Governance visibility banner** — StepPageLayout now shows Builder/Auditor/Context/State
- **Intent artifacts** — Each step has intent.md for context anchoring
- **Audit Score page** — Placeholder for local build audit workflow
- **Enterprise takeover positioning** — Homepage explains sellable software concept
- **Sustain the Stack** — Optional contribution messaging (never required)

### New Files
- `app/audit-score/page.tsx` — Local audit UI placeholder
- `app/steps/1-7/intent.md` — Context anchors for each step

### Modified Files
- `app/page.tsx` — New marketing sections
- `app/dashboard/page.tsx` — Audit Score nav link
- `components/StepPageLayout.tsx` — Governance banner

---

## Directory Structure

```
web/
├── app/
│   ├── page.tsx              # Marketing homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── pulse/page.tsx        # Public Stack Pulse
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── dashboard/page.tsx    # User dashboard
│   ├── audit-score/page.tsx  # Local audit placeholder (NEW)
│   ├── content-hub/page.tsx  # Hello World scaffold
│   └── steps/
│       ├── 1/
│       │   ├── page.tsx      # Create Repo + Connect GitHub
│       │   └── intent.md     # Context anchor (NEW)
│       ├── 2/
│       │   ├── page.tsx      # Connect Agents
│       │   └── intent.md     # Context anchor (NEW)
│       ├── 3-7/              # Same structure (page.tsx + intent.md)
├── components/
│   └── StepPageLayout.tsx    # Shared layout + governance banner
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── netlify.toml
├── CHANGELOG.md              # Version history
└── DEV_NOTES.md              # This file
```

---

## Running Locally

```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

---

## Deployment

Netlify auto-deploys from the `web/` directory when connected to the repo.

Environment variables needed for Phase 2:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## Locked Copy (DO NOT CHANGE)

**Headline:**
> Build real software with AI — without losing control, from idea to deployment.

**Pulse Gating:**
> Viewing is free. Acting requires a subscription.

**Pricing:**
> $20/month

---

## V1 Constraints (DO NOT VIOLATE)

- One project per user
- Fixed agents only (Claude Builder, ChatGPT Auditor, Cursor optional)
- No team collaboration
- No multi-project switching
- No advanced analytics
- No custom agent creation

---

## Phase 1.2 Additions (2026-02-01)

### Governed AI Prompt Generation System
- **PromptGenerator component** — Core differentiator
  - Step-scoped execution prompts (Claude)
  - Step-scoped audit prompts (ChatGPT, subscription-gated)
  - Prompts are text artifacts, versioned, copy/paste executable
  - Prompt lifecycle enforced: Intent → Draft → Approval → Execute → Audit → Harden
  - NO auto-execution — human copy/paste is intentional

### Subscription Gating Architecture
- **SubscriptionGate component** — Wraps gated content
- **SubscriptionProvider** — App-wide subscription state
- **GatingBanner** — Shows subscription status
- **FREE:** Marketing, Pulse (read-only), explanations
- **PAID:** Execution prompts, audit prompts, Audit Score
- Locked copy: "Viewing is free. Acting requires a subscription."
- Phase 1.2: UI + state logic only, NO Stripe integration

### Audit Score System (Enhanced)
- Mode A: Governance (REQUIRED, BLOCKING)
  - 8 checks: repo exists, branch workflow, PR opened, audit artifacts, no secrets, intent exists, DEV NOTES, no direct main commits
- Mode B: Quality (ADVISORY, never blocks)
  - 7 checks: prompt clarity, DEV NOTES quality, compatibility notes, documentation, takeover readiness, code style, accessibility
- Simulated audit for demonstration
- Generate Fix Prompt (Claude) / Review Prompt (ChatGPT) buttons

### New Files (Phase 1.2)
- `components/PromptGenerator.tsx` — Governed prompt generation
- `components/SubscriptionGate.tsx` — Subscription gating
- `components/ClientProviders.tsx` — Client-side providers wrapper

### Modified Files (Phase 1.2)
- `app/layout.tsx` — Wraps app with ClientProviders
- `app/audit-score/page.tsx` — Full rubric + UI
- `components/StepPageLayout.tsx` — Prompt generation + gating integration

---

*Last updated: Phase 1.2 (2026-02-01)*
