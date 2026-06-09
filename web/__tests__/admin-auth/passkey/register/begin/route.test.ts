import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock environment and simplewebauthn/server before importing the route
vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    sessionSecret: 'test-secret',
    rpName: 'Test RP',
    rpId: 'test.example.com',
  })),
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
    vi.mocked(getAdminEnv).mockReturnValueOnce({
      isConfigured: false,
    } as any)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })

    const res = await mod.POST(req)
    expect(res.status).toBe(503)

    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 401 if unauthorized', async () => {
    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce(null)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })

    const res = await mod.POST(req)
    expect(res.status).toBe(401)

    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 400 if user not found', async () => {
    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({ sub: 'user-123' })

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([]) // Empty rows

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })

    const res = await mod.POST(req)
    expect(res.status).toBe(400)

    const data = await res.json()
    expect(data.error).toBe('User not found')
  })

  it('returns registration options and stores challenge on success', async () => {
    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({ sub: 'user-123' })

    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([{ email: 'test@example.com' }]) // User found

    const { generateRegistrationOptions } = await import('@simplewebauthn/server')
    const mockOptions = { challenge: 'test-challenge' }
    vi.mocked(generateRegistrationOptions).mockResolvedValueOnce(mockOptions as any)

    const mod = await import('@/app/api/admin/passkey/register/begin/route')
    const req = new NextRequest('http://localhost/api/admin/passkey/register/begin', {
      method: 'POST',
    })

    const res = await mod.POST(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual(mockOptions)

    // Check if challenge was stored
    expect(query).toHaveBeenCalledTimes(2)
    expect(query).toHaveBeenNthCalledWith(1,
      'SELECT email FROM admin_users WHERE id = $1',
      ['user-123']
    )
    expect(query).toHaveBeenNthCalledWith(2,
      expect.stringContaining('INSERT INTO webauthn_challenges'),
      ['user-123', 'test-challenge', expect.any(Date)]
    )
  })

  it('returns 500 on internal error', async () => {
    const { getSessionFromRequest } = await import('@/lib/admin/session')
    vi.mocked(getSessionFromRequest).mockRejectedValueOnce(new Error('Internal Server Error'))

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
