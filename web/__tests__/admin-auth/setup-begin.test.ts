import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    allowedEmail: 'admin@example.com',
    setupSecret: 'super-secret',
    rateLimitPerMinute: 10,
    rpName: 'Test App',
    rpId: 'localhost'
  })),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ ok: true })),
}))

vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(() => ({
    challenge: 'test-challenge',
    rp: { name: 'Test App', id: 'localhost' },
    user: { id: 'user-123', name: 'admin@example.com', displayName: 'admin@example.com' },
    pubKeyCredParams: [],
    timeout: 60000,
    attestation: 'none',
    excludeCredentials: [],
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'required'
    }
  }))
}))

// We need to mock next/server to provide the real NextResponse structure
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual as any,
    NextResponse: {
      json: vi.fn((body, init) => {
        return new Response(JSON.stringify(body), {
          status: init?.status ?? 200,
          headers: init?.headers,
        })
      }),
    },
  }
})

describe('POST /api/admin/setup/begin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper to create Request object
  const makeRequest = (body: any, headers: Record<string, string> = {}) => {
    return new Request('http://localhost/api/admin/setup/begin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }) as any // NextRequest compatible
  }

  it('returns 503 if admin auth is not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValueOnce({ isConfigured: false } as any)

    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(503)
    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 429 if rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: false, retryAfter: 60 })

    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('Too many requests')
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for invalid email', async () => {
    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'wrong@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email')
  })

  it('returns 403 for invalid setup secret', async () => {
    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'wrong-secret' }))

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toBe('Invalid setup secret')
  })

  it('creates new user and returns registration options', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    const { generateRegistrationOptions } = await import('@simplewebauthn/server')

    // First query (find user) returns empty, second (insert user) returns id, third (insert challenge) returns empty
    vi.mocked(query)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 'new-user-123' }])
      .mockResolvedValueOnce([])

    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.challenge).toBe('test-challenge')

    expect(query).toHaveBeenCalledTimes(3)
    expect(query).toHaveBeenNthCalledWith(1, 'SELECT id FROM admin_users WHERE email = $1', ['admin@example.com'])
    expect(query).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO admin_users'), ['admin@example.com'])
    expect(query).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO webauthn_challenges'), ['new-user-123', 'test-challenge', expect.any(Date)])

    expect(generateRegistrationOptions).toHaveBeenCalledWith(expect.objectContaining({
      userName: 'admin@example.com',
      userID: expect.any(Buffer),
    }))
  })

  it('uses existing user and returns registration options', async () => {
    const { query } = await import('@/lib/admin/storage/db')

    // First query (find user) returns id, second (insert challenge) returns empty
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'existing-user-123' }])
      .mockResolvedValueOnce([])

    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.challenge).toBe('test-challenge')

    expect(query).toHaveBeenCalledTimes(2)
    expect(query).toHaveBeenNthCalledWith(1, 'SELECT id FROM admin_users WHERE email = $1', ['admin@example.com'])
    expect(query).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO webauthn_challenges'), ['existing-user-123', 'test-challenge', expect.any(Date)])
  })

  it('returns 500 on internal error', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockRejectedValueOnce(new Error('DB Error'))

    const mod = await import('@/app/api/admin/setup/begin/route')
    const res = await mod.POST(makeRequest({ email: 'admin@example.com', setupSecret: 'super-secret' }))

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Internal error')
  })

  it('correctly handles client IP identifiers', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: true } as any)
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([{ id: 'user-123' }])

    const mod = await import('@/app/api/admin/setup/begin/route')

    // Create a mock NextRequest with headers method
    const mockRequest = {
      json: async () => ({ email: 'admin@example.com', setupSecret: 'super-secret' }),
      headers: {
        get: (key: string) => {
          if (key === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8'
          return null
        }
      }
    } as any

    await mod.POST(mockRequest)

    expect(checkRateLimit).toHaveBeenCalledWith('1.2.3.4', 'setup-begin', 10)
  })

  it('handles x-real-ip identifier', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: true } as any)
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([{ id: 'user-123' }])

    const mod = await import('@/app/api/admin/setup/begin/route')

    const mockRequest = {
      json: async () => ({ email: 'admin@example.com', setupSecret: 'super-secret' }),
      headers: {
        get: (key: string) => {
          if (key === 'x-real-ip') return '9.8.7.6'
          return null
        }
      }
    } as any

    await mod.POST(mockRequest)

    expect(checkRateLimit).toHaveBeenCalledWith('9.8.7.6', 'setup-begin', 10)
  })

  it('handles unknown identifier', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: true } as any)
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([{ id: 'user-123' }])

    const mod = await import('@/app/api/admin/setup/begin/route')

    const mockRequest = {
      json: async () => ({ email: 'admin@example.com', setupSecret: 'super-secret' }),
      headers: {
        get: () => null
      }
    } as any

    await mod.POST(mockRequest)

    expect(checkRateLimit).toHaveBeenCalledWith('unknown', 'setup-begin', 10)
  })
})
