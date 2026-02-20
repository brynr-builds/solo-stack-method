/**
 * Admin session JWT helpers.
 * Edge-compatible (jose) for middleware; used by API routes for session creation.
 * Do not log tokens or secrets.
 */

import * as jose from 'jose'

const COOKIE_NAME = 'admin_session'
const ALG = 'HS256'

export { COOKIE_NAME }

export interface SessionPayload {
  sub: string // admin user id
  email?: string // admin email (optional for backwards compat)
  exp: number
  iat: number
  jti: string
}

/**
 * Verify session JWT from cookie. Returns payload or null.
 * Edge-safe (no pg, no Node crypto).
 */
export async function verifySessionToken(token: string, secret: string): Promise<SessionPayload | null> {
  if (!token || !secret) return null
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jose.jwtVerify(token, key, { algorithms: [ALG] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Get session from NextRequest (for API routes). Returns payload or null.
 */
export async function getSessionFromRequest(
  request: { cookies: { get: (name: string) => { value: string } | undefined } },
  secret: string
): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  return token ? verifySessionToken(token, secret) : null
}

/**
 * Create a signed session JWT. Call from API routes (Node runtime).
 */
export async function createSessionToken(
  userId: string,
  email: string,
  secret: string,
  ttlHours: number
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + ttlHours * 3600
  const jti = crypto.randomUUID()
  const key = new TextEncoder().encode(secret)
  return new jose.SignJWT({ sub: userId, email, jti })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(key)
}
