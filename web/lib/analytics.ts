/*
 * DEV NOTES (2026-06-09):
 * - Why: measurement. You can't evaluate market readiness or optimize the funnel blind. This is a
 *   tiny, provider-AGNOSTIC layer: the <Analytics> component loads whatever script you point it at
 *   via env (Umami / Plausible / Cloudflare / PostHog — all privacy-friendly, all have free tiers),
 *   and track() fires custom funnel events to whichever provider is loaded. No env set → no-op.
 * - The funnel we care about: home view → /build view → plan_started → plan_completed → connect_github
 *   → (affiliate /go clicks, already logged server-side). That tells us if traffic actually converts.
 */

declare global {
  interface Window {
    umami?: { track: (name: string, props?: Record<string, unknown>) => void }
    plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void
    posthog?: { capture: (name: string, props?: Record<string, unknown>) => void }
  }
}

/** Fire a custom funnel event to whichever analytics provider is loaded. Safe no-op otherwise. */
export function track(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    if (window.umami?.track) window.umami.track(name, props)
    else if (window.plausible) window.plausible(name, props ? { props } : undefined)
    else if (window.posthog?.capture) window.posthog.capture(name, props)
  } catch {
    /* never let analytics break the UI */
  }
}
