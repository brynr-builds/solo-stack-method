import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from '@/middleware'
import { NextResponse } from 'next/server'
import { getAdminEnv } from '@/lib/admin/env'
import { verifySessionToken } from '@/lib/admin/session'

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({ type: 'next' })),
    json: vi.fn((body, init) => ({ type: 'json', body, init })),
    redirect: vi.fn((url) => ({ type: 'redirect', url: url.toString() })),
  }
}))

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn()
}))

vi.mock('@/lib/admin/session', () => ({
  verifySessionToken: vi.fn(),
  COOKIE_NAME: 'admin_session'
}))

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createReq = (pathname: string, cookies: Record<string, string> = {}) => ({
    nextUrl: { pathname },
    url: `http://localhost${pathname}`,
    cookies: {
      get: vi.fn((name) => cookies[name] ? { value: cookies[name] } : undefined)
    }
  } as any)

  it('passes non-admin paths', async () => {
    const req = createReq('/public/path')
    const res = await middleware(req)
    expect(res).toEqual({ type: 'next' })
  })

  it('passes paths allowed without session', async () => {
    const req = createReq('/admin/enter-email')
    const res = await middleware(req)
    expect(res).toEqual({ type: 'next' })

    const req2 = createReq('/api/admin/setup/something')
    const res2 = await middleware(req2)
    expect(res2).toEqual({ type: 'next' })
  })

  it('returns 503 JSON if getAdminEnv throws', async () => {
    vi.mocked(getAdminEnv).mockImplementation(() => { throw new Error('DB error') })
    const req = createReq('/admin/dashboard')
    const res = await middleware(req) as any
    expect(res.type).toBe('json')
    expect(res.body).toEqual({ error: 'Admin auth not configured' })
    expect(res.init.status).toBe(503)
  })

  it('returns 503 JSON for API routes if not configured', async () => {
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: false } as any)
    const req = createReq('/api/admin/users')
    const res = await middleware(req) as any
    expect(res.type).toBe('json')
    expect(res.body).toEqual({ error: 'Admin auth not configured' })
    expect(res.init.status).toBe(503)
  })

  it('redirects to enter-email for non-API routes if not configured', async () => {
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: false } as any)
    const req = createReq('/admin/dashboard')
    const res = await middleware(req) as any
    expect(res.type).toBe('redirect')
    expect(res.url).toBe('http://localhost/admin/enter-email')
  })

  it('passes if valid session token is provided', async () => {
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)
    vi.mocked(verifySessionToken).mockResolvedValue({ id: 'user-1' } as any)

    const req = createReq('/admin/dashboard', { admin_session: 'valid-token' })
    const res = await middleware(req)
    expect(res).toEqual({ type: 'next' })
    expect(verifySessionToken).toHaveBeenCalledWith('valid-token', 'secret')
  })

  it('returns 401 JSON for API routes with invalid/no session', async () => {
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)
    vi.mocked(verifySessionToken).mockResolvedValue(null)

    const req = createReq('/api/admin/users', { admin_session: 'invalid-token' })
    const res = await middleware(req) as any
    expect(res.type).toBe('json')
    expect(res.body).toEqual({ error: 'Unauthorized' })
    expect(res.init.status).toBe(401)
  })

  it('redirects to enter-email for non-API routes with invalid/no session', async () => {
    vi.mocked(getAdminEnv).mockReturnValue({ isConfigured: true, sessionSecret: 'secret' } as any)
    vi.mocked(verifySessionToken).mockResolvedValue(null)

    const req = createReq('/admin/dashboard')
    const res = await middleware(req) as any
    expect(res.type).toBe('redirect')
    expect(res.url).toBe('http://localhost/admin/enter-email')
  })
})
