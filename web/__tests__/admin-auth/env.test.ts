import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Admin Env Configuration', () => {
  beforeEach(() => {
    vi.resetModules()

    // Stub env for process.env
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ADMIN_SETUP_SECRET', '')
    vi.stubEnv('ADMIN_SESSION_SECRET', '')
    vi.stubEnv('DATABASE_URL', '')
    vi.stubEnv('ADMIN_ALLOWED_EMAIL', '')
    vi.stubEnv('ADMIN_SESSION_TTL_HOURS', '')
    vi.stubEnv('ADMIN_RATE_LIMIT_PER_MINUTE', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws an error in production if required vars are missing', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { getAdminEnv } = await import('@/lib/admin/env')

    expect(() => getAdminEnv()).toThrowError(/Missing required env var:/)
  })

  it('throws specifically when databaseUrl is missing but other vars exist', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'setup_secret')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session_secret')
    // Missing DATABASE_URL
    const { getAdminEnv } = await import('@/lib/admin/env')

    expect(() => getAdminEnv()).toThrowError(/Missing required env var: DATABASE_URL/)
  })

  it('does not throw in production if all required vars are present', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'setup_secret')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session_secret')
    vi.stubEnv('DATABASE_URL', 'postgres://user:pass@localhost:5432/db')
    const { getAdminEnv } = await import('@/lib/admin/env')

    expect(() => getAdminEnv()).not.toThrow()
    const env = getAdminEnv()
    expect(env.isConfigured).toBe(true)
  })

  it('returns false for isAdminAuthConfigured if required vars missing', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { isAdminAuthConfigured } = await import('@/lib/admin/env')

    expect(isAdminAuthConfigured()).toBe(false)
  })

  it('returns true for isAdminAuthConfigured if required vars present', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'setup_secret')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session_secret')
    vi.stubEnv('DATABASE_URL', 'postgres://user:pass@localhost:5432/db')
    const { isAdminAuthConfigured } = await import('@/lib/admin/env')

    expect(isAdminAuthConfigured()).toBe(true)
  })

  it('returns default allowed email if not set', async () => {
    vi.unstubAllEnvs() // To ensure env vars are completely gone
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()
    expect(env.allowedEmail).toBe('brynrgarnett@gmail.com')
  })

  it('returns provided allowed email if set', async () => {
    vi.stubEnv('ADMIN_ALLOWED_EMAIL', 'custom@example.com')
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()
    expect(env.allowedEmail).toBe('custom@example.com')
  })

  it('returns configured default values for integers', async () => {
    vi.unstubAllEnvs()
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()
    expect(env.sessionTtlHours).toBe(8)
    expect(env.rateLimitPerMinute).toBe(20)
  })

  it('parses configured values for integers', async () => {
    vi.stubEnv('ADMIN_SESSION_TTL_HOURS', '12')
    vi.stubEnv('ADMIN_RATE_LIMIT_PER_MINUTE', '30')
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()
    expect(env.sessionTtlHours).toBe(12)
    expect(env.rateLimitPerMinute).toBe(30)
  })

  it('falls back to default if configured values for integers are invalid', async () => {
    vi.stubEnv('ADMIN_SESSION_TTL_HOURS', 'invalid')
    vi.stubEnv('ADMIN_RATE_LIMIT_PER_MINUTE', 'invalid')
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()
    expect(env.sessionTtlHours).toBe(8)
    expect(env.rateLimitPerMinute).toBe(20)
  })

  it('caches the environment config', async () => {
    vi.unstubAllEnvs()
    const { getAdminEnv } = await import('@/lib/admin/env')
    const env1 = getAdminEnv()

    // Change env var, but shouldn't affect the second call
    vi.stubEnv('ADMIN_ALLOWED_EMAIL', 'changed@example.com')

    const env2 = getAdminEnv()
    expect(env1).toBe(env2)
    expect(env2.allowedEmail).toBe('brynrgarnett@gmail.com')
  })
})
