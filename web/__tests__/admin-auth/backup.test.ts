import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    allowedEmail: 'admin@example.com',
    sessionSecret: 'super-secret-key-123',
    sessionTtlHours: 8,
    rateLimitPerMinute: 20,
  })),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ ok: true })),
}))

vi.mock('@/lib/admin/session', () => ({
  createSessionToken: vi.fn(() => 'mocked-session-token'),
  COOKIE_NAME: 'admin_session',
}))

describe('POST /api/admin/login/backup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: any) {
    return new NextRequest('http://localhost/api/admin/login/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 503 if auth is not configured', async () => {
    const { getAdminEnv } = await import('@/lib/admin/env')
    vi.mocked(getAdminEnv).mockReturnValueOnce({ isConfigured: false } as any)

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({}))

    expect(res.status).toBe(503)
    const data = await res.json()
    expect(data.error).toBe('Admin auth not configured')
  })

  it('returns 429 if rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/admin/rate-limit')
    vi.mocked(checkRateLimit).mockReturnValueOnce({ ok: false, retryAfter: 60 } as any)

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({}))

    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('Too many requests')
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for invalid email', async () => {
    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'wrong@example.com', code: '123' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid email')
  })

  it('returns 400 for missing code', async () => {
    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'admin@example.com', code: '' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Backup code required')
  })

  it('returns 400 if user not found', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValueOnce([])

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'admin@example.com', code: '123-456' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid code')
  })

  it('returns 400 if backup code is invalid or used', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }])
      .mockResolvedValueOnce([])

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'admin@example.com', code: '123-456' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid code')
  })

  it('handles successful backup code login', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query)
      .mockResolvedValueOnce([{ id: 'user-123' }])
      .mockResolvedValueOnce([{ id: 'code-456' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'admin@example.com', code: '123-456' }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(data.redirectTo).toBe('/admin')

    const cookie = res.cookies.get('admin_session')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe('mocked-session-token')

    expect(query).toHaveBeenCalledTimes(4)
    expect(query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE admin_backup_codes SET used_at = now()'), ['code-456'])
    expect(query).toHaveBeenNthCalledWith(4, expect.stringContaining('INSERT INTO admin_sessions'), ['user-123', expect.any(String), expect.any(Date)])
  })

  it('handles internal errors', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockRejectedValueOnce(new Error('DB Error'))

    const mod = await import('@/app/api/admin/login/backup/route')
    const res = await mod.POST(createRequest({ email: 'admin@example.com', code: '123-456' }))

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Internal error')
  })
})
