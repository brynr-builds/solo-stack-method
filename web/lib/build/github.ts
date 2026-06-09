/*
 * DEV NOTES (2026-06-09):
 * - Why: Thin GitHub API client for the Build flow. OAuth (authorize + token exchange) and the
 *   "generate repo from template" call. Uses scope `public_repo` — enough to create a PUBLIC repo
 *   in the user's account from the public starter template, without asking for access to private
 *   repos (less scary for non-technical users). Bump to `repo` later if private sites are needed.
 */

export const OAUTH_SCOPE = 'public_repo'

export function authorizeUrl(opts: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const p = new URLSearchParams({
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    scope: OAUTH_SCOPE,
    state: opts.state,
    allow_signup: 'true',
  })
  return `https://github.com/login/oauth/authorize?${p.toString()}`
}

export async function exchangeCodeForToken(opts: {
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
}): Promise<string | null> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
      code: opts.code,
      redirect_uri: opts.redirectUri,
    }),
  })
  if (!res.ok) return null
  const data: any = await res.json()
  return typeof data.access_token === 'string' ? data.access_token : null
}

const GH = 'https://api.github.com'
function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'solo-stack-method',
  }
}

export async function getViewer(token: string): Promise<{ login: string; avatar_url: string } | null> {
  const res = await fetch(`${GH}/user`, { headers: ghHeaders(token), cache: 'no-store' })
  if (!res.ok) return null
  const u: any = await res.json()
  return u?.login ? { login: u.login, avatar_url: u.avatar_url } : null
}

export type CreateResult =
  | { ok: true; htmlUrl: string; fullName: string }
  | { ok: false; status: number; message: string }

/** Create a new repo in the user's account from the template. */
export async function createFromTemplate(opts: {
  token: string
  templateRepo: string // "owner/name"
  owner: string // the user's login
  name: string
  description?: string
}): Promise<CreateResult> {
  const [tplOwner, tplName] = opts.templateRepo.split('/')
  const res = await fetch(`${GH}/repos/${tplOwner}/${tplName}/generate`, {
    method: 'POST',
    headers: ghHeaders(opts.token),
    body: JSON.stringify({
      owner: opts.owner,
      name: opts.name,
      description: opts.description ?? 'Built with the Solo Stack Method',
      private: false,
      include_all_branches: false,
    }),
  })
  if (res.status === 201) {
    const r: any = await res.json()
    return { ok: true, htmlUrl: r.html_url, fullName: r.full_name }
  }
  let message = `GitHub returned ${res.status}`
  try {
    const err: any = await res.json()
    if (err?.message) message = err.message
    if (err?.errors?.length) message += ` — ${err.errors.map((e: any) => e.message || e.code).join(', ')}`
  } catch {
    /* ignore */
  }
  return { ok: false, status: res.status, message }
}

/** Repo names: lowercase, url-safe. */
export function sanitizeRepoName(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'my-solo-stack-site'
  )
}
