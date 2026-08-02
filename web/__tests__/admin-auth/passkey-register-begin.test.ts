import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })
    const res = await mod.POST(req)
    expect(res.status).toBe(503)
    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 401 if session is not present or invalid', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue(null)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })
    const res = await mod.POST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 400 if user is not found in db', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue({ sub: 'user-123' } as any)

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([])

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })
    const res = await mod.POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('returns registration options on successful flow', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValue({
      isConfigured: true,
      sessionSecret: 'secret',
      rpName: 'Test RP',
      rpId: 'localhost'
    } as any)

    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValue({ sub: 'user-123' } as any)

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([{ email: 'test@example.com' }])

    const { generateRegistrationOptions } = await import('@simplewebauthn/server')
    const mockOptions = { challenge: 'test-challenge', rp: { id: 'localhost', name: 'Test RP' }, user: { id: 'user-123', name: 'test@example.com', displayName: 'test@example.com' }, pubKeyCredParams: [] }
    vi.mocked(generateRegistrationOptions).mockResolvedValue(mockOptions as any)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })
    const res = await mod.POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockOptions)

    // Check if challenge is inserted into DB
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO webauthn_challenges'),
      expect.arrayContaining(['user-123', 'test-challenge'])
    )
  })

  it('returns 500 on internal error', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockImplementation(() => { throw new Error('Boom') })

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })
    const res = await mod.POST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Internal error')
  })
})
