/*
 * DEV NOTES (2026-06-08):
 * - Why: The outbound affiliate redirect. /go/<slug> logs the click then 302s to the
 *   program's real tracking deeplink (program.affiliateUrl). This is the single seam where
 *   affiliate revenue turns on: once the operator is approved (Gate 3) and a tracking link
 *   is pasted into programs.json, every existing link on the site starts earning — no other
 *   code change needed.
 * - Safety: if a program has no tracking link yet, fall back to the merchant site so the
 *   link is still useful (and honest). Logging is fire-and-forget and never blocks the hop.
 * - Not statically generated (dynamic) so click logging runs on every hit.
 */

import { NextResponse } from 'next/server'
import { getProgram } from '../../../lib/tools'
import { logClick } from '../../../lib/tools/clicks'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const program = getProgram(params.slug)

  // Unknown slug → send them to The Stack rather than erroring.
  if (!program) {
    return NextResponse.redirect(new URL('/tools', req.url))
  }

  const target = program.affiliateUrl || program.merchantUrl || program.applyUrl
  if (!target) {
    return NextResponse.redirect(new URL('/tools', req.url))
  }

  // Fire-and-forget click log (never blocks the redirect).
  void logClick({
    slug: program.slug,
    ts: new Date().toISOString(),
    referrer: req.headers.get('referer'),
    ua: req.headers.get('user-agent'),
  })

  return NextResponse.redirect(target, { status: 302 })
}
