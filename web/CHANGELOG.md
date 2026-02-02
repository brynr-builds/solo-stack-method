# Changelog — Solo Stack Method™ Web App

## [Phase 1.3] - 2026-02-02 (Admin + Analytics + CRM + Support)

### Added
- **Admin Dashboard** (`/admin`) — Owner-only UI with:
  - System Health: active users, users by step, ship rate, audit pass rate
  - Process Effectiveness: drop-off by step, avg time, governance failures
  - Product Analytics: DAU/WAU, signups, conversion, audit score distribution
  - "Ask the System" panel: natural language queries with simulated AI responses
- **CRM** (`/admin/clients`) — Process intelligence, NOT sales:
  - Per-user view: step, subscription, audit score, shipped status
  - Tagging, internal notes, AI blocker summaries
  - No email, no automation, no outreach
- **Admin Config** (`/admin/config`) — Adjustable settings for:
  - Step titles/descriptions
  - Gating copy
  - Audit thresholds (Mode A enable/disable)
  - Advisory rules (Mode B weights)
  - Prompt templates (execution + audit)
  - Monetization copy
- **AI Support Agent** (`/support`) — Pattern-matched support:
  - Answers questions using docs, governance specs, and step info
  - Never executes actions, never mutates data
  - Explicit escalation path to human
- **AdminGuard component** — Admin-only access control (mocked flag)
- **AdminProvider** — React context for admin state
- **MockData module** — Centralized mock data for all admin features

### Modified
- **ClientProviders** — Added AdminProvider wrapper

### Phase 1.3 Constraints (V1-Light)
- All data is mocked (no database, no analytics provider)
- No Stripe, no Supabase Auth, no external APIs
- No background jobs, webhooks, or email
- Config changes are session-only (no persistence)
- AI responses are pattern-matched (no API calls)

## [Phase 1.2] - 2026-02-01 (Prompt + Gating + Audit)

### Added
- **PromptGenerator component** — Core differentiator: governed AI prompt generation
  - Execution prompts for steps 1-7 (Claude)
  - Audit prompts for steps 1-7 (ChatGPT, subscription-gated)
  - Copy/paste executable, versioned, no auto-execution
- **SubscriptionGate component** — Subscription-based execution gating
  - GatingBanner for subscription status
  - ClientProviders wrapper for app-wide state
- **Enhanced Audit Score page** — Full rubric with Mode A (blocking) and Mode B (advisory)
  - 8 governance checks (Mode A)
  - 7 quality signals (Mode B)
  - Simulated audit demonstration
  - Fix/Review prompt generation buttons

### Changed
- `StepPageLayout` now includes prompt generation and gating
- `layout.tsx` wraps app with ClientProviders
- All step pages now show gating status and prompt generation UI

### New Files
| File | Purpose |
|------|--------|
| `components/PromptGenerator.tsx` | Step-scoped prompt generation |
| `components/SubscriptionGate.tsx` | Subscription gating |
| `components/ClientProviders.tsx` | Client providers wrapper |

### Modified Files
| File | Changes |
|------|--------|
| `app/layout.tsx` | ClientProviders integration |
| `app/audit-score/page.tsx` | Full rubric + enhanced UI |
| `components/StepPageLayout.tsx` | Prompt generation + gating |
| `DEV_NOTES.md` | Phase 1.2 documentation |

---

## [Phase 1.1] - 2026-01-31 (Push-Ready Update)

### Added
- **Governance visibility banner** in StepPageLayout (product logic, not decoration)
- **Intent artifacts** (intent.md) for all 7 steps — context anchors for future prompts
- **Audit Score page** (/audit-score) — UI placeholder for local build workflow
- **Enterprise takeover section** on homepage — sellable software positioning
- **Sustain the Stack section** on homepage — optional contribution framing

### Changed
- Homepage updated with new marketing copy
- Dashboard navigation now includes Audit Score link
- Footer now includes Audit Score link
- Pricing section includes "Enterprise-takeover-ready output"
- Copyright updated to 2026

### Removed
- Accidental `app/steps/{3,4,5,6,7}/` directory artifact

### Files Changed (27 total)

#### Configuration (7 files)
| File | Status |
|------|--------|
| `package.json` | existing |
| `tsconfig.json` | existing |
| `tailwind.config.ts` | existing |
| `postcss.config.js` | existing |
| `next.config.js` | existing |
| `netlify.toml` | existing |
| `.env.example` | existing |

#### Pages (13 files)
| File | Status |
|------|--------|
| `app/layout.tsx` | existing |
| `app/globals.css` | existing |
| `app/page.tsx` | **MODIFIED** — new marketing sections |
| `app/pulse/page.tsx` | existing |
| `app/login/page.tsx` | existing |
| `app/signup/page.tsx` | existing |
| `app/dashboard/page.tsx` | **MODIFIED** — audit-score link |
| `app/content-hub/page.tsx` | existing |
| `app/audit-score/page.tsx` | **NEW** |
| `app/steps/1/page.tsx` | existing |
| `app/steps/2/page.tsx` | existing |
| `app/steps/3-7/page.tsx` | existing |

#### Components (1 file)
| File | Status |
|------|--------|
| `components/StepPageLayout.tsx` | **MODIFIED** — governance banner |

#### Intent Artifacts (7 files) — NEW
| File | Purpose |
|------|---------|
| `app/steps/1/intent.md` | Create Repo context anchor |
| `app/steps/2/intent.md` | Tech Stack context anchor |
| `app/steps/3/intent.md` | Context Anchors context anchor |
| `app/steps/4/intent.md` | Build Features context anchor |
| `app/steps/5/intent.md` | Test & Validate context anchor |
| `app/steps/6/intent.md` | Final Audit context anchor |
| `app/steps/7/intent.md` | Deploy context anchor |

#### Documentation (4 files)
| File | Status |
|------|--------|
| `README.md` | **MODIFIED** — positioning section |
| `DEV_NOTES.md` | existing |
| `CHANGELOG.md` | **MODIFIED** (this file) |

---

## [Phase 1] - 2026-01-31

### Added (25 files)
Initial Phase 1 build: marketing site + authenticated app shell.

See DEV_NOTES.md for tech stack decisions and V1 constraints.

---

## Locked Copy (DO NOT CHANGE WITHOUT APPROVAL)

- **Headline:** "Build real software with AI — without losing control"
- **Subheadline:** "from idea to deployment"
- **Pricing:** $20/month
- **Pulse gating:** "Viewing is free. Acting requires a subscription."

---

## Reversion Instructions

To revert Phase 1.1 changes:
```bash
git revert <commit-hash>
```

To revert specific files:
```bash
git checkout <previous-commit> -- web/app/page.tsx
git checkout <previous-commit> -- web/components/StepPageLayout.tsx
```

To remove all intent.md files:
```bash
rm web/app/steps/*/intent.md
```

---

## Compatibility Notes

- All existing routes preserved
- No changes to imports or layouts
- Netlify deployment config unchanged
- StepPageLayout props interface unchanged (all step pages compatible)
