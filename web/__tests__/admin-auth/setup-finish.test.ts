import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mocks
vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}))

vi.mock('@simplewebauthn/server', () => ({
  verifyRegistrationResponse: vi.fn(),
}))

vi.mock('@/lib/admin/session', () => ({
  createSessionToken: vi.fn(),
  COOKIE_NAME: 'admin_session',
}))

describe('POST /api/admin/setup/finish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Basic request helper
  const makeRequest = (body: any) => {
    return new NextRequest('http://localhost/api/admin/setup/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 503 if admin env is not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: false } as any)

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({}))

    expect(res.status).toBe(503)
    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 429 if rate limited', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      rateLimitPerMinute: 10,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: false, retryAfter: 60 } as any)

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({}))

    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for invalid email', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      rateLimitPerMinute: 10,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'wrong@example.com', setupSecret: 'secret' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email')
  })

  it('returns 403 for invalid setup secret', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      setupSecret: 'correct-secret',
      rateLimitPerMinute: 10,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'wrong-secret' }))

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toBe('Invalid setup secret')
  })

  it('returns 400 if user not found in DB', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      setupSecret: 'correct-secret',
      rateLimitPerMinute: 10,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([]) // Empty user rows

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'correct-secret', response: {} }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('returns 400 if challenge expired or not found', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      setupSecret: 'correct-secret',
      rateLimitPerMinute: 10,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const { query } = await import('@/lib/admin/storage/db')
    // First query: user, Second query: challenge
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }])
      .mockResolvedValueOnce([]) // Empty challenge rows

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'correct-secret', response: {} }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Challenge expired or not found')
  })

  it('returns 400 if webauthn verification fails', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      setupSecret: 'correct-secret',
      rateLimitPerMinute: 10,
      origin: 'http://localhost',
      rpId: 'localhost',
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }])
      .mockResolvedValueOnce([{ challenge: 'test-challenge' }])

    const { verifyRegistrationResponse } = await import('@simplewebauthn/server')
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({ verified: false } as any)

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'correct-secret', response: {} }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Verification failed')
  })

  it('successfully finishes setup', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      allowedEmail: 'admin@example.com',
      setupSecret: 'correct-secret',
      rateLimitPerMinute: 10,
      origin: 'http://localhost',
      rpId: 'localhost',
      sessionSecret: 'test-session-secret',
      sessionTtlHours: 24,
    } as any)

    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValue({ ok: true } as any)

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user row
      .mockResolvedValueOnce([{ challenge: 'test-challenge' }]) // challenge row
      .mockResolvedValueOnce([]) // insert credential
      .mockResolvedValueOnce([]) // delete challenge
      .mockResolvedValueOnce([]) // insert session
      // 10 times for insert backup codes
      .mockResolvedValue([])

    const { verifyRegistrationResponse } = await import('@simplewebauthn/server')
    vi.mocked(verifyRegistrationResponse).mockResolvedValueOnce({
      verified: true,
      registrationInfo: {
        credential: {
          id: 'cred-123',
          publicKey: new Uint8Array([1, 2, 3]),
          counter: 0,
          transports: ['internal'],
        },
      },
    } as any)

    const { createSessionToken } = await import('@/lib/admin/session')
    vi.mocked(createSessionToken).mockResolvedValueOnce('test-session-token')

    const mod = await import('@/app/api/admin/setup/finish/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'correct-secret', response: {} }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(data.redirectTo).toBe('/admin')
    expect(data.backupCodes).toHaveLength(10)

    expect(createSessionToken).toHaveBeenCalledWith('user-123', 'admin@example.com', 'test-session-secret', 24)

    // Check if the cookie was set on the response
    const cookieHeader = res.headers.get('Set-Cookie')
    expect(cookieHeader).toContain('admin_session=test-session-token')
  })
})
