/*
 * DEV NOTES (2026-06-09):
 * - Why: Seal the user's GitHub OAuth token into an encrypted, httpOnly cookie. The token can
 *   create repos in their account, so it's high-value — we ENCRYPT it (jose JWE, A256GCM), not
 *   just sign it, so the cookie value is opaque even if exfiltrated. httpOnly + Secure + SameSite
 *   keep it out of JS and off cross-site requests.
 * - Key: derived from BUILD_SESSION_SECRET via SHA-256 → 32 bytes for A256GCM.
 */

import { EncryptJWT, jwtDecrypt } from 'jose'
import { createHash } from 'crypto'

export const GH_COOKIE = 'ssm_gh'

function keyFrom(secret: string): Uint8Array {
  return new Uint8Array(createHash('sha256').update(secret).digest())
}

export async function sealToken(token: string, secret: string): Promise<string> {
  return await new EncryptJWT({ tok: token })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .encrypt(keyFrom(secret))
}

export async function openToken(jwe: string, secret: string): Promise<string | null> {
  try {
    const { payload } = await jwtDecrypt(jwe, keyFrom(secret))
    const tok = (payload as any).tok
    return typeof tok === 'string' ? tok : null
  } catch {
    return null
  }
}

/** Cookie options for the sealed GitHub token. */
export function ghCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
