import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/admin/login/begin/route'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    allowedEmail: 'admin@example.com',
    rpId: 'localhost',
    rateLimitPerMinute: 5,
  })),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ ok: true })),
}))

vi.mock('@simplewebauthn/server', () => ({
  generateAuthenticationOptions: vi.fn(async () => ({ challenge: 'mock-challenge' })),
}))

describe('POST /api/admin/login/begin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockRequest = (body: any) => {
    return new NextRequest('http://localhost/api/admin/login/begin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 503 if not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValueOnce({ isConfigured: false } as any)

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(503)
    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 429 if rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: false, retryAfter: 60 } as any)

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
    const data = await res.json()
    expect(data.error).toBe('Too many requests')
  })

  it('returns 400 for missing email', async () => {
    const req = mockRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email')
  })

  it('returns 400 for invalid email', async () => {
    const req = mockRequest({ email: 'other@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email')
  })

  it('returns 400 if user not found', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([])

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('returns options for user with no credentials', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user lookup
      .mockResolvedValueOnce([]) // credentials lookup
      .mockResolvedValueOnce([]) // insert challenge

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.challenge).toBe('mock-challenge')

    const { generateAuthenticationOptions } = await import('@simplewebauthn/server')
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: undefined,
      userVerification: 'required',
    })
  })

  it('returns options for user with credentials and transports', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }]) // user lookup
      .mockResolvedValueOnce([
        { credential_id: 'cred-1', transports: '["internal", "usb"]' }
      ]) // credentials lookup
      .mockResolvedValueOnce([]) // insert challenge

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.challenge).toBe('mock-challenge')

    const { generateAuthenticationOptions } = await import('@simplewebauthn/server')
    expect(generateAuthenticationOptions).toHaveBeenCalledWith({
      rpID: 'localhost',
      allowCredentials: [
        { id: 'cred-1', transports: ['internal', 'usb'] }
      ],
      userVerification: 'required',
    })
  })

  it('returns 500 on internal error', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockRejectedValueOnce(new Error('DB Error'))

    const req = mockRequest({ email: 'admin@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Internal error')
  })
})
