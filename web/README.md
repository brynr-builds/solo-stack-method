# Solo Stack Method™ — Web Application

**Build real software with AI — without losing control, from idea to deployment.**

## Positioning

### Sellable Software Package
This isn't just about building apps or websites. Solo Stack Method helps you create **sellable software packages** — codebases that companies can acquire and operate without depending on you.

### Enterprise Takeover Ready
If Microsoft (or any dev team) acquired your project tomorrow, could they take over without you? With Solo Stack Method, the answer is yes:
- **Repo is truth** — all context lives in the repository
- **DEV NOTES everywhere** — every file explains why it exists
- **Audit trail** — decisions documented in PR history
- **Prompt evolution** — AI guidance is versioned
- **Explicit context** — no tribal knowledge required

### Sustain the Stack (Optional)
After shipping successfully, users can optionally contribute to keep the project sustainable.
- Never required for execution
- Never unlocks features
- Never affects audit scores

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Supabase Auth (Phase 2)
- **Styling:** Tailwind CSS
- **Deployment:** Netlify
- **Language:** TypeScript

## Project Structure

```
web/
├── app/
│   ├── page.tsx           # Marketing homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Tailwind + custom styles
│   ├── pulse/             # Public Stack Pulse
│   ├── login/             # Auth UI scaffold
│   ├── signup/            # Auth UI scaffold
│   ├── dashboard/         # 7-step navigation
│   ├── audit-score/       # Local audit placeholder
│   ├── content-hub/       # Content hub scaffold
│   └── steps/             # 7 step pages
│       ├── 1/
│       │   ├── page.tsx
│       │   └── intent.md  # Context anchor
│       ├── 2-7/           # Same structure
├── components/
│   └── StepPageLayout.tsx # Shared step layout + governance banner
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── netlify.toml
├── CHANGELOG.md
└── DEV_NOTES.md
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Phase 1 Scope

**Included:**
- ✅ Marketing homepage (locked copy)
- ✅ Stack Pulse page (mock data)
- ✅ Auth UI scaffolds
- ✅ Dashboard with 7-step navigation
- ✅ All step pages with governance banner
- ✅ Step intent artifacts (intent.md)
- ✅ Audit score placeholder

**Not Included (Phase 2+):**
- ❌ Supabase Auth integration
- ❌ Stripe payments
- ❌ Claude/ChatGPT API calls
- ❌ GitHub OAuth
- ❌ Live Stack Pulse data
- ❌ Local audit CLI

## Governance

- **Builder:** Claude
- **Auditor:** ChatGPT
- All changes go through branch → PR → audit
- Main branch = production

---

Built with Solo Stack Method™
