/* DEV NOTES (2026-06-09): GitHub OAuth callback. Verifies CSRF state, exchanges the code for a
 * token, seals it into an encrypted httpOnly cookie, and returns the user to /build. */
import { NextResponse } from 'next/server'
import { getBuildEnv, callbackUrl } from '../../../../lib/build/env'
import { exchangeCodeForToken } from '../../../../lib/build/github'
import { GH_COOKIE, sealToken, ghCookieOptions } from '../../../../lib/build/session'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const env = getBuildEnv()
  const url = new URL(req.url)
  const origin = url.origin
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const expectedState = req.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('ssm_gh_state='))
    ?.split('=')[1]

  const back = (q: string) => NextResponse.redirect(`${origin}/build?${q}`)

  if (!env.configured) return back('error=not_configured')
  if (!code || !state || !expectedState || state !== expectedState) return back('error=bad_state')

  const token = await exchangeCodeForToken({
    clientId: env.clientId!,
    clientSecret: env.clientSecret!,
    code,
    redirectUri: callbackUrl(origin),
  })
  if (!token) return back('error=token_exchange')

  const sealed = await sealToken(token, env.sessionSecret!)
  const res = back('connected=1')
  res.cookies.set(GH_COOKIE, sealed, ghCookieOptions())
  res.cookies.set('ssm_gh_state', '', { path: '/', maxAge: 0 }) // clear CSRF cookie
  return res
}
