/*
 * DEV NOTES (2026-06-09):
 * - Why: Config for the "Build" flow (Model A): connect GitHub → create a repo from the
 *   solo-stack-starter template → deploy. Reads the GitHub OAuth App creds the OPERATOR sets.
 * - IMPORTANT: never throws at import. If unconfigured, `configured` is false and the /build
 *   page shows a setup notice instead of crashing. (The operator must create a GitHub OAuth App
 *   and set the env vars — see docs/solo-stack/BUILD_FLOW_SETUP.md.)
 */

export type BuildEnv = {
  clientId: string | null
  clientSecret: string | null
  sessionSecret: string | null
  templateRepo: string // owner/name of the GitHub template
  configured: boolean
}

export function getBuildEnv(): BuildEnv {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID || null
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET || null
  const sessionSecret = process.env.BUILD_SESSION_SECRET || null
  const templateRepo = process.env.GITHUB_TEMPLATE_REPO || 'brynr-builds/solo-stack-starter'
  return {
    clientId,
    clientSecret,
    sessionSecret,
    templateRepo,
    configured: Boolean(clientId && clientSecret && sessionSecret),
  }
}

/** The OAuth callback URL, derived from the incoming request origin (must match the OAuth App). */
export function callbackUrl(origin: string): string {
  return `${origin}/api/build/callback`
}
