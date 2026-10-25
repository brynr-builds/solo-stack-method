import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(),
}))

vi.mock('@/lib/admin/session', () => ({
  getSessionFromRequest: vi.fn(),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: vi.fn(),
}))

describe('POST /api/admin/passkey/register/begin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 503 if admin auth is not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: false } as any)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new Request('http://localhost/api/admin/passkey/register/begin', { method: 'POST' })
    const res = await mod.POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(503)
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 401 if not authenticated', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue(null)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new Request('http://localhost/api/admin/passkey/register/begin', { method: 'POST' })
    const res = await mod.POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 400 if user is not found in db', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue({ sub: 'user-123' })

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([])

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new Request('http://localhost/api/admin/passkey/register/begin', { method: 'POST' })
    const res = await mod.POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('User not found')
  })

  it('returns 200 and options on success', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      sessionSecret: 'secret',
      rpName: 'Test RP',
      rpId: 'test.com'
    } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue({ sub: 'user-123' })

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockImplementation(async (sql: string) => {
      if (sql.includes('SELECT email')) {
        return [{ email: 'admin@test.com' }]
      }
      return []
    })

    const { generateRegistrationOptions } = await import('@simplewebauthn/server')
    vi.mocked(generateRegistrationOptions).mockResolvedValue({ challenge: 'mock-challenge' } as any)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new Request('http://localhost/api/admin/passkey/register/begin', { method: 'POST' })
    const res = await mod.POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.challenge).toBe('mock-challenge')

    // Verify challenge is saved
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO webauthn_challenges'),
      expect.arrayContaining(['user-123', 'mock-challenge', expect.any(Date)])
    )
  })

  it('returns 500 on internal error', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockImplementation(() => {
      throw new Error('Unexpected')
    })

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new Request('http://localhost/api/admin/passkey/register/begin', { method: 'POST' })
    const res = await mod.POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.error).toBe('Internal error')
  })
})
