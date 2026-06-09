import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Admin Env Configuration', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns default values when minimal env vars are provided', async () => {
    // In dev mode (default test env), it doesn't throw if vars are missing
    vi.stubEnv('NODE_ENV', 'development')

    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()

    expect(env.allowedEmail).toBe('brynrgarnett@gmail.com')
    expect(env.rpId).toBe('localhost')
    expect(env.rpName).toBe('Solo Stack Method')
    expect(env.origin).toBe('http://localhost:3000')
    expect(env.sessionTtlHours).toBe(8)
    expect(env.rateLimitPerMinute).toBe(20)
    expect(env.isConfigured).toBe(false)
  })

  it('reads and parses environment variables correctly', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ADMIN_ALLOWED_EMAIL', 'test@example.com')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'secret123')
    vi.stubEnv('ADMIN_RP_ID', 'example.com')
    vi.stubEnv('ADMIN_RP_NAME', 'Test RP')
    vi.stubEnv('ADMIN_ORIGIN', 'https://example.com')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session123')
    vi.stubEnv('ADMIN_SESSION_TTL_HOURS', '12')
    vi.stubEnv('ADMIN_RATE_LIMIT_PER_MINUTE', '50')
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/db')

    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()

    expect(env.allowedEmail).toBe('test@example.com')
    expect(env.setupSecret).toBe('secret123')
    expect(env.rpId).toBe('example.com')
    expect(env.rpName).toBe('Test RP')
    expect(env.origin).toBe('https://example.com')
    expect(env.sessionSecret).toBe('session123')
    expect(env.sessionTtlHours).toBe(12)
    expect(env.rateLimitPerMinute).toBe(50)
    expect(env.databaseUrl).toBe('postgres://localhost/db')
    expect(env.isConfigured).toBe(true)
  })

  it('falls back to default integer when env var is invalid number', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ADMIN_SESSION_TTL_HOURS', 'not-a-number')

    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()

    expect(env.sessionTtlHours).toBe(8)
  })

  it('returns cached env object on subsequent calls', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const { getAdminEnv } = await import('@/lib/admin/env')
    const env1 = getAdminEnv()
    const env2 = getAdminEnv()

    expect(env1).toBe(env2)
  })

  it('throws an error in production when required vars are missing', async () => {
    vi.stubEnv('NODE_ENV', 'production')

    const { getAdminEnv } = await import('@/lib/admin/env')

    expect(() => getAdminEnv()).toThrowError(/Missing required env var/)
  })

  it('throws specifically when required auth variables are missing but other vars are present in prod', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_ALLOWED_EMAIL', 'test@example.com')

    // We mock getEnv so that it doesn't throw early on individual missing vars
    // Wait, the actual implementation throws early inside getEnv if isProd && !value && !defaultValue
    // If ADMIN_SETUP_SECRET is missing, it will throw inside getEnv first!

    const { getAdminEnv } = await import('@/lib/admin/env')
    expect(() => getAdminEnv()).toThrowError('Missing required env var: ADMIN_SETUP_SECRET. Admin auth will not work in production.')
  })

  it('does not throw in production if all required vars are set', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'secret123')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session123')
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/db')

    const { getAdminEnv } = await import('@/lib/admin/env')
    const env = getAdminEnv()

    expect(env.isConfigured).toBe(true)
  })

  it('isAdminAuthConfigured returns true when fully configured', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ADMIN_SETUP_SECRET', 'secret123')
    vi.stubEnv('ADMIN_SESSION_SECRET', 'session123')
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/db')

    const { isAdminAuthConfigured } = await import('@/lib/admin/env')
    expect(isAdminAuthConfigured()).toBe(true)
  })

  it('isAdminAuthConfigured returns false when not configured', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    // required vars missing
    const { isAdminAuthConfigured } = await import('@/lib/admin/env')
    expect(isAdminAuthConfigured()).toBe(false)
  })

  it('isAdminAuthConfigured gracefully catches thrown errors and returns false in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    // Missing required vars will cause getAdminEnv to throw

    const { isAdminAuthConfigured } = await import('@/lib/admin/env')
    expect(isAdminAuthConfigured()).toBe(false)
  })
})
