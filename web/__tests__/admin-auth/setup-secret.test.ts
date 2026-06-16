import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as envLib from '@/lib/admin/env'
import * as dbLib from '@/lib/admin/storage/db'
import * as rlLib from '@/lib/admin/rate-limit'
import * as sessionLib from '@/lib/admin/session'
import { POST } from '@/app/api/admin/login/setup-secret/route'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

vi.mock('@/lib/admin/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}))

vi.mock('@/lib/admin/session', () => ({
  createSessionToken: vi.fn(),
  COOKIE_NAME: 'admin_session',
}))

describe('POST /api/admin/login/setup-secret', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(rlLib.checkRateLimit).mockReturnValue({ ok: true, retryAfter: 0 })
    vi.mocked(envLib.getAdminEnv).mockReturnValue({
      isConfigured: true,
      rpId: 'localhost',
      allowedEmail: 'admin@example.com',
      setupSecret: 'supersecret',
      rateLimitPerMinute: 10,
      sessionSecret: 'sessionsecret',
      sessionTtlHours: 24,
    } as any)
  })

  function createRequest(body: any = {}, headers: Record<string, string> = {}) {
    return new NextRequest('http://localhost/api/admin/login/setup-secret', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...headers,
      }),
      body: JSON.stringify(body),
    })
  }

  it('returns 503 if admin auth not configured', async () => {
    vi.mocked(envLib.getAdminEnv).mockReturnValueOnce({ isConfigured: false } as any)
    const req = createRequest()
    const res = await POST(req)
    expect(res.status).toBe(503)
  })

  it('returns 403 if rpId is not localhost', async () => {
    vi.mocked(envLib.getAdminEnv).mockReturnValueOnce({
      isConfigured: true,
      rpId: 'example.com',
    } as any)
    const req = createRequest()
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('returns 429 if rate limited', async () => {
    vi.mocked(rlLib.checkRateLimit).mockReturnValueOnce({ ok: false, retryAfter: 60 })
    const req = createRequest()
    const res = await POST(req)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for invalid email', async () => {
    const req = createRequest({ email: 'wrong@example.com', setupSecret: 'supersecret' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 403 for invalid setup secret', async () => {
    const req = createRequest({ email: 'admin@example.com', setupSecret: 'wrong' })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('returns 400 if user not found', async () => {
    vi.mocked(dbLib.query).mockResolvedValueOnce([])
    const req = createRequest({ email: 'admin@example.com', setupSecret: 'supersecret' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(dbLib.query).toHaveBeenCalledWith(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      ['admin@example.com']
    )
  })

  it('returns 500 on internal error', async () => {
    vi.mocked(dbLib.query).mockRejectedValueOnce(new Error('DB Error'))
    const req = createRequest({ email: 'admin@example.com', setupSecret: 'supersecret' })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })

  it('successfully logs in and sets cookie', async () => {
    vi.mocked(dbLib.query).mockResolvedValueOnce([{ id: 'user-123' }])
    vi.mocked(sessionLib.createSessionToken).mockResolvedValueOnce('mock-session-token')

    const req = createRequest({ email: 'admin@example.com', setupSecret: 'supersecret' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(data.redirectTo).toBe('/admin')

    expect(dbLib.query).toHaveBeenCalledTimes(2)
    const insertCall = vi.mocked(dbLib.query).mock.calls[1]
    expect(insertCall[0]).toContain('INSERT INTO admin_sessions')
    expect(insertCall[1][0]).toBe('user-123')

    const cookie = res.cookies.get('admin_session')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe('mock-session-token')
  })
})
