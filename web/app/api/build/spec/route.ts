/* DEV NOTES (2026-06-09): Commit the planning step's SPEC.md + BUILD-BRIEF.md into the user's new
 * repo, so their AI agent builds from THEIR plan (not the generic template). Requires a connected
 * GitHub account; takes the already-generated markdown from the client (deterministic, no AI). */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBuildEnv } from '../../../../lib/build/env'
import { GH_COOKIE, openToken } from '../../../../lib/build/session'
import { getViewer, putFile } from '../../../../lib/build/github'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const env = getBuildEnv()
  if (!env.configured) return NextResponse.json({ error: 'Not configured.' }, { status: 503 })

  const jwe = (await cookies()).get(GH_COOKIE)?.value
  const token = jwe ? await openToken(jwe, env.sessionSecret!) : null
  if (!token) return NextResponse.json({ error: 'Connect your GitHub account first.' }, { status: 401 })

  const viewer = await getViewer(token)
  if (!viewer) return NextResponse.json({ error: 'GitHub session expired — reconnect.' }, { status: 401 })

  let fullName = ''
  let spec = ''
  let brief = ''
  try {
    const body = await req.json()
    fullName = String(body?.fullName ?? '')
    spec = String(body?.spec ?? '')
    brief = String(body?.brief ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Safety: only write into a repo the connected user owns.
  if (!fullName.startsWith(`${viewer.login}/`)) {
    return NextResponse.json({ error: 'That repo isn’t yours.' }, { status: 403 })
  }
  if (!spec || !brief) return NextResponse.json({ error: 'Missing plan content.' }, { status: 400 })

  const a = await putFile({ token, fullName, path: 'SPEC.md', content: spec, message: 'Add site plan (SPEC.md) from the planning step' })
  const b = await putFile({ token, fullName, path: 'BUILD-BRIEF.md', content: brief, message: 'Add tailored build brief from the planning step' })

  if (!a.ok || !b.ok) {
    return NextResponse.json({ error: `Could not save the plan to the repo (${a.status}/${b.status}).` }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
