/*
 * DEV NOTES (2026-06-09):
 * - Why: The planning engine for Step 1 of the build flow. Turns a non-technical person's answers
 *   to a short, tap-don't-type questionnaire into (a) a plain-English plan, (b) a SPEC.md, and
 *   (c) a tailored agent build-brief. DETERMINISTIC — no AI/inference, so it's free to run.
 * - Grounded in verified UX/IA research (NN/g, Yale, Appcues, practitioner guides; see chat):
 *   minimal high-signal questions, smart defaults (default = what ~95% pick), one clear CTA per
 *   page, a small page set, and an output that's a buildable sitemap+brief.
 */

export type SiteType = 'portfolio' | 'business' | 'product' | 'store' | 'blog' | 'event'
export type Goal = 'contact' | 'book' | 'buy' | 'subscribe' | 'download' | 'donate'
export type Vibe = 'clean' | 'warm' | 'bold' | 'minimal'

export type Answers = {
  siteType: SiteType
  oneLiner: string
  audience: string
  goal: Goal
  sections: string[] // section ids the user kept
  vibe: Vibe
}

export type Section = { id: string; label: string; job: string; defaultOn: boolean }

export const SITE_TYPES: { id: SiteType; label: string; blurb: string }[] = [
  { id: 'portfolio', label: 'Personal / portfolio', blurb: 'Show your work or yourself' },
  { id: 'business', label: 'Small business / services', blurb: 'Get found and get clients' },
  { id: 'product', label: 'Product or app landing', blurb: 'Explain it and get sign-ups' },
  { id: 'store', label: 'Online store', blurb: 'Sell products' },
  { id: 'blog', label: 'Blog / newsletter', blurb: 'Publish and grow an audience' },
  { id: 'event', label: 'Event / community', blurb: 'Get people to show up or join' },
]

export const GOALS: { id: Goal; label: string; cta: string; action: string }[] = [
  { id: 'contact', label: 'Contact me', cta: 'Get in touch', action: 'opens a contact form / email' },
  { id: 'book', label: 'Book a call or appointment', cta: 'Book a call', action: 'links to a booking page' },
  { id: 'buy', label: 'Buy something', cta: 'Shop now', action: 'goes to the products/checkout' },
  { id: 'subscribe', label: 'Join my email list', cta: 'Subscribe', action: 'submits to the newsletter form' },
  { id: 'download', label: 'Download something', cta: 'Download', action: 'starts the download' },
  { id: 'donate', label: 'Donate / support', cta: 'Support', action: 'goes to the donation link' },
]

export const VIBES: { id: Vibe; label: string; accent: string }[] = [
  { id: 'clean', label: 'Clean & professional', accent: '#2563eb' },
  { id: 'warm', label: 'Warm & friendly', accent: '#ea580c' },
  { id: 'bold', label: 'Bold & modern', accent: '#7c3aed' },
  { id: 'minimal', label: 'Minimal & elegant', accent: '#111827' },
]

// Smart defaults: the section set per site type. "defaultOn" = pre-checked (the ~95% choice).
const SECTIONS: Record<SiteType, Section[]> = {
  portfolio: [
    { id: 'hero', label: 'Intro / hero', job: 'who you are in one line', defaultOn: true },
    { id: 'work', label: 'Work / projects', job: 'show what you’ve made', defaultOn: true },
    { id: 'about', label: 'About', job: 'your story', defaultOn: true },
    { id: 'contact', label: 'Contact', job: 'how to reach you', defaultOn: true },
    { id: 'services', label: 'Services', job: 'what you offer', defaultOn: false },
    { id: 'testimonials', label: 'Testimonials', job: 'social proof', defaultOn: false },
  ],
  business: [
    { id: 'hero', label: 'Hero', job: 'what you do + the main action', defaultOn: true },
    { id: 'services', label: 'Services', job: 'what you offer', defaultOn: true },
    { id: 'about', label: 'About', job: 'who you are, why trust you', defaultOn: true },
    { id: 'testimonials', label: 'Testimonials', job: 'reviews / social proof', defaultOn: true },
    { id: 'contact', label: 'Contact', job: 'how to reach you', defaultOn: true },
    { id: 'pricing', label: 'Pricing', job: 'what it costs', defaultOn: false },
    { id: 'faq', label: 'FAQ', job: 'answer common questions', defaultOn: false },
  ],
  product: [
    { id: 'hero', label: 'Hero', job: 'the promise + main action', defaultOn: true },
    { id: 'features', label: 'Features', job: 'what it does', defaultOn: true },
    { id: 'pricing', label: 'Pricing', job: 'plans / cost', defaultOn: true },
    { id: 'faq', label: 'FAQ', job: 'objections handled', defaultOn: true },
    { id: 'contact', label: 'Contact / sign-up', job: 'the conversion point', defaultOn: true },
    { id: 'testimonials', label: 'Testimonials', job: 'social proof', defaultOn: false },
  ],
  store: [
    { id: 'hero', label: 'Hero', job: 'what you sell + shop button', defaultOn: true },
    { id: 'products', label: 'Products', job: 'the items', defaultOn: true },
    { id: 'about', label: 'About', job: 'your story / brand', defaultOn: true },
    { id: 'contact', label: 'Contact', job: 'support / questions', defaultOn: true },
    { id: 'faq', label: 'FAQ / shipping', job: 'shipping & returns', defaultOn: false },
  ],
  blog: [
    { id: 'hero', label: 'Intro', job: 'what this is about', defaultOn: true },
    { id: 'posts', label: 'Posts', job: 'your writing', defaultOn: true },
    { id: 'subscribe', label: 'Subscribe', job: 'grow the list', defaultOn: true },
    { id: 'about', label: 'About', job: 'who’s behind it', defaultOn: true },
    { id: 'contact', label: 'Contact', job: 'reach you', defaultOn: false },
  ],
  event: [
    { id: 'hero', label: 'Hero', job: 'the event + main action', defaultOn: true },
    { id: 'details', label: 'Details', job: 'what / when / where', defaultOn: true },
    { id: 'schedule', label: 'Schedule', job: 'the agenda', defaultOn: true },
    { id: 'register', label: 'Register / RSVP', job: 'the conversion point', defaultOn: true },
    { id: 'contact', label: 'Contact', job: 'questions', defaultOn: false },
  ],
}

export function sectionsFor(siteType: SiteType): Section[] {
  return SECTIONS[siteType]
}
export function defaultSectionIds(siteType: SiteType): string[] {
  return SECTIONS[siteType].filter((s) => s.defaultOn).map((s) => s.id)
}

export type Plan = {
  answers: Answers
  ctaLabel: string
  accent: string
  selectedSections: Section[]
  summary: string
  specMarkdown: string
  briefMarkdown: string
}

export function generatePlan(answers: Answers): Plan {
  const goal = GOALS.find((g) => g.id === answers.goal) ?? GOALS[0]
  const vibe = VIBES.find((v) => v.id === answers.vibe) ?? VIBES[0]
  const all = sectionsFor(answers.siteType)
  const selected = all.filter((s) => answers.sections.includes(s.id))
  const oneLiner = answers.oneLiner.trim() || 'my site'
  const audience = answers.audience.trim() || 'my visitors'
  const sectionList = selected.map((s) => s.label).join(', ')

  const summary =
    `Here’s your site: **${oneLiner}** — for **${audience}**. ` +
    `The main thing you want visitors to do is **${goal.label.toLowerCase()}** ` +
    `(every page points to a “${goal.cta}” button). ` +
    `It’ll have these sections: **${sectionList}**. Style: **${vibe.label.toLowerCase()}**.`

  const specMarkdown = [
    `# Site Spec — ${oneLiner}`,
    ``,
    `> Generated by the Solo Stack Method planning step. This is the plan your AI agent builds from.`,
    ``,
    `**What it is:** ${oneLiner}`,
    `**Who it’s for:** ${audience}`,
    `**Primary goal (one action):** ${goal.label} → button reads “${goal.cta}” (${goal.action})`,
    `**Style:** ${vibe.label} · accent color ${vibe.accent}`,
    ``,
    `## Sections (top to bottom)`,
    ...selected.map((s, i) => `${i + 1}. **${s.label}** — ${s.job}.`),
    ``,
    `## Acceptance criteria`,
    `- [ ] The hero makes clear, in one glance, what this is and who it’s for.`,
    `- [ ] Every section has a single, obvious next step pointing to “${goal.cta}”.`,
    `- [ ] Real copy (no “lorem ipsum” / placeholder names) for: ${oneLiner}.`,
    `- [ ] Works on mobile; loads with no build step.`,
    `- [ ] No secrets or keys committed.`,
    ``,
    `## Out of scope (for v1)`,
    `- Anything not in the section list above. Ship the simple version first.`,
  ].join('\n')

  const briefMarkdown = [
    `# Build brief — ${oneLiner}`,
    ``,
    `> Paste this to your AI agent (Cursor/Claude Code) as the first instruction. It already has the`,
    `> repo’s AGENTS.md rules. Build one section at a time and show changes before committing.`,
    ``,
    `Build/edit this site. It is **${oneLiner}**, for **${audience}**. The single most important`,
    `action is **${goal.label.toLowerCase()}** — make a clear **“${goal.cta}”** button the obvious`,
    `next step throughout (${goal.action}).`,
    ``,
    `Style: ${vibe.label.toLowerCase()}. Use accent color ${vibe.accent}. Keep it a zero-build static`,
    `site (plain HTML/CSS) — don’t add a framework.`,
    ``,
    `Sections, top to bottom — build them in this order:`,
    ...selected.map((s, i) => `${i + 1}. **${s.label}** — ${s.job}. Write real copy for ${oneLiner}.`),
    ``,
    `After each section: show me what changed, then I’ll approve. Don’t invent facts about my`,
    `business — if you need a detail (price, address, a real testimonial), ask me.`,
  ].join('\n')

  return {
    answers,
    ctaLabel: goal.cta,
    accent: vibe.accent,
    selectedSections: selected,
    summary,
    specMarkdown,
    briefMarkdown,
  }
}
