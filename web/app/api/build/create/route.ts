/* DEV NOTES (2026-06-09): Create the user's repo from the solo-stack-starter template.
 * Requires a connected GitHub account (sealed token cookie). Returns the new repo URL. */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBuildEnv } from '../../../../lib/build/env'
import { GH_COOKIE, openToken } from '../../../../lib/build/session'
import { getViewer, createFromTemplate, sanitizeRepoName } from '../../../../lib/build/github'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const env = getBuildEnv()
  if (!env.configured) {
    return NextResponse.json({ error: 'GitHub connection not configured.' }, { status: 503 })
  }

  const jwe = (await cookies()).get(GH_COOKIE)?.value
  const token = jwe ? await openToken(jwe, env.sessionSecret!) : null
  if (!token) return NextResponse.json({ error: 'Connect your GitHub account first.' }, { status: 401 })

  const viewer = await getViewer(token)
  if (!viewer) return NextResponse.json({ error: 'GitHub session expired — reconnect.' }, { status: 401 })

  let name = ''
  try {
    const body = await req.json()
    name = sanitizeRepoName(String(body?.name ?? ''))
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const result = await createFromTemplate({
    token,
    templateRepo: env.templateRepo,
    owner: viewer.login,
    name,
  })

  if (!result.ok) {
    // 422 from GitHub usually means the repo name already exists.
    const status = result.status === 422 ? 409 : 502
    return NextResponse.json({ error: result.message, repoName: name }, { status })
  }

  return NextResponse.json({ ok: true, url: result.htmlUrl, fullName: result.fullName })
}
