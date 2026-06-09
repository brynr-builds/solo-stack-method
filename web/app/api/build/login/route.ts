/* DEV NOTES (2026-06-09): Start GitHub OAuth. Sets a short-lived CSRF state cookie and redirects
 * to GitHub's authorize page. 503 (with guidance) if the operator hasn't configured the OAuth App. */
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getBuildEnv, callbackUrl } from '../../../../lib/build/env'
import { authorizeUrl } from '../../../../lib/build/github'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const env = getBuildEnv()
  if (!env.configured) {
    return NextResponse.json(
      { error: 'GitHub connection is not configured yet. See docs/solo-stack/BUILD_FLOW_SETUP.md.' },
      { status: 503 },
    )
  }
  const origin = new URL(req.url).origin
  const state = randomBytes(16).toString('hex')
  const url = authorizeUrl({ clientId: env.clientId!, redirectUri: callbackUrl(origin), state })

  const res = NextResponse.redirect(url)
  res.cookies.set('ssm_gh_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  })
  return res
}
