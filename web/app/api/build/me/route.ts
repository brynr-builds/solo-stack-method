/* DEV NOTES (2026-06-09): Build-flow status. Tells the wizard whether GitHub is configured and
 * whether this visitor has connected their account. No secrets in the response. */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBuildEnv } from '../../../../lib/build/env'
import { GH_COOKIE, openToken } from '../../../../lib/build/session'
import { getViewer } from '../../../../lib/build/github'

export const dynamic = 'force-dynamic'

export async function GET() {
  const env = getBuildEnv()
  if (!env.configured) {
    return NextResponse.json({ configured: false, connected: false })
  }
  const jwe = (await cookies()).get(GH_COOKIE)?.value
  if (!jwe) return NextResponse.json({ configured: true, connected: false })

  const token = await openToken(jwe, env.sessionSecret!)
  if (!token) return NextResponse.json({ configured: true, connected: false })

  const viewer = await getViewer(token)
  if (!viewer) return NextResponse.json({ configured: true, connected: false })

  return NextResponse.json({ configured: true, connected: true, login: viewer.login, avatar: viewer.avatar_url })
}
