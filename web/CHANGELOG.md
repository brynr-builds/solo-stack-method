# Changelog — Solo Stack Method™ Web App

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
