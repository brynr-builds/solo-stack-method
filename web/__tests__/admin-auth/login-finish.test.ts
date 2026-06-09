/**
 * Login finish route tests. Uses mock env and DB.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@simplewebauthn/server', () => ({
  verifyAuthenticationResponse: vi.fn(),
}))

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    allowedEmail: 'admin@example.com',
    origin: 'http://localhost',
    rpId: 'localhost',
    sessionSecret: 'secret',
    sessionTtlHours: 24,
    rateLimitPerMinute: 10,
  })),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ ok: true })),
}))

vi.mock('@/lib/admin/session', () => ({
  createSessionToken: vi.fn().mockResolvedValue('session-token-123'),
  COOKIE_NAME: 'admin_session',
}))

describe('POST /api/admin/login/finish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createReq(body: any) {
    return new NextRequest('http://localhost/api/admin/login/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(body),
    })
  }

  it('returns 503 if not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValueOnce({ isConfigured: false } as any)

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({}))
    const data = await res.json()

    expect(res.status).toBe(503)
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 429 if rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: false, retryAfter: 60 } as any)

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({}))
    const data = await res.json()

    expect(res.status).toBe(429)
    expect(data.error).toBe('Too many requests')
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for invalid email', async () => {
    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'wrong@example.com' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Invalid email')
  })

  it('returns 400 for missing response assertion', async () => {
    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Assertion response required')
  })

  it('returns 400 for invalid response (missing id)', async () => {
    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: {} }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Invalid response')
  })

  it('returns 400 if user not found', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([]) // user check

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: { id: 'cred-123' } }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('User not found')
  })

  it('returns 400 if credential not found', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user check
      .mockResolvedValueOnce([]) // cred check

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: { id: 'cred-123' } }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Credential not found')
  })

  it('returns 400 if challenge not found', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user check
      .mockResolvedValueOnce([{ id: 'cred-db-1', credential_id: 'cred-123', public_key: Buffer.from('pk').toString('base64url'), counter: 0 }]) // cred check
      .mockResolvedValueOnce([]) // challenge check

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: { id: 'cred-123' } }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Challenge expired or not found')
  })

  it('returns 400 if verification fails', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user check
      .mockResolvedValueOnce([{ id: 'cred-db-1', credential_id: 'cred-123', public_key: Buffer.from('pk').toString('base64url'), counter: 0 }]) // cred check
      .mockResolvedValueOnce([{ challenge: 'chal-123' }]) // challenge check

    const { verifyAuthenticationResponse } = await import('@simplewebauthn/server')
    vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({ verified: false } as any)

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: { id: 'cred-123' } }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Verification failed')
  })

  it('returns 200 and sets cookie on success', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user check
      .mockResolvedValueOnce([{ id: 'cred-db-1', credential_id: 'cred-123', public_key: Buffer.from('pk').toString('base64url'), counter: 0 }]) // cred check
      .mockResolvedValueOnce([{ challenge: 'chal-123' }]) // challenge check
      .mockResolvedValueOnce([]) // update counter
      .mockResolvedValueOnce([]) // delete challenge
      .mockResolvedValueOnce([]) // insert session

    const { verifyAuthenticationResponse } = await import('@simplewebauthn/server')
    vi.mocked(verifyAuthenticationResponse).mockResolvedValueOnce({
      verified: true,
      authenticationInfo: { newCounter: 1, credentialID: 'cred-123', credentialDeviceType: 'singleDevice', credentialBackedUp: false } as any
    })

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({ email: 'admin@example.com', response: { id: 'cred-123' } }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.redirectTo).toBe('/admin')

    // Check cookie
    const cookie = res.cookies.get('admin_session')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe('session-token-123')

    // Check db queries
    expect(query).toHaveBeenCalledWith(
      `UPDATE webauthn_credentials SET counter = $1, last_used_at = now() WHERE id = $2`,
      [1, 'cred-db-1']
    )
    expect(query).toHaveBeenCalledWith(
      `DELETE FROM webauthn_challenges WHERE user_id = $1 AND type = 'authentication'`,
      ['user-123']
    )
  })

  it('returns 500 on unexpected error', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockImplementationOnce(() => {
      throw new Error('Unexpected')
    })

    const mod = await import('@/app/api/admin/login/finish/route')
    const res = await mod.POST(createReq({}))
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.error).toBe('Internal error')
  })
})
