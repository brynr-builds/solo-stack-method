/*
 * DEV NOTES (2026-06-09):
 * - Why: loads the privacy-friendly analytics script you choose, via env. No env → renders nothing
 *   (so dev/local stays clean and a missing config never breaks the build).
 * - Set in your host (Netlify) + web/.env.local:
 *     Umami:      NEXT_PUBLIC_ANALYTICS_SRC=https://cloud.umami.is/script.js  NEXT_PUBLIC_ANALYTICS_ID=<website-id>
 *     Plausible:  NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js  NEXT_PUBLIC_ANALYTICS_DOMAIN=solostackmethod.io
 *     Cloudflare: NEXT_PUBLIC_ANALYTICS_SRC=https://static.cloudflareinsights.com/beacon.min.js  NEXT_PUBLIC_ANALYTICS_ID=<token>
 */
import Script from 'next/script'

export default function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC
  if (!src) return null
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN
  return (
    <Script
      src={src}
      strategy="afterInteractive"
      defer
      {...(id ? { 'data-website-id': id } : {})}
      {...(domain ? { 'data-domain': domain } : {})}
    />
  )
}
