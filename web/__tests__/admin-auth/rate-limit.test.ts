import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkRateLimit } from '@/lib/admin/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('allows first request', () => {
    const result = checkRateLimit('user1', '/api/test', 5)
    expect(result).toEqual({ ok: true })
  })

  it('allows subsequent requests under limit', () => {
    const id = 'user2'
    const route = '/api/test'

    expect(checkRateLimit(id, route, 3)).toEqual({ ok: true })
    expect(checkRateLimit(id, route, 3)).toEqual({ ok: true })
    expect(checkRateLimit(id, route, 3)).toEqual({ ok: true })
  })

  it('blocks requests over limit and returns retryAfter', () => {
    const id = 'user3'
    const route = '/api/test'

    expect(checkRateLimit(id, route, 2)).toEqual({ ok: true })
    expect(checkRateLimit(id, route, 2)).toEqual({ ok: true })

    // 3rd request should be blocked
    const result = checkRateLimit(id, route, 2)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.retryAfter).toBe(60)
    }
  })

  it('resets count after windowMs (60_000ms)', () => {
    const id = 'user4'
    const route = '/api/test'

    // hit the limit
    checkRateLimit(id, route, 1)
    let result = checkRateLimit(id, route, 1)
    expect(result.ok).toBe(false)

    // Advance time by 60 seconds (actually, strict > is used: `now > entry.resetAt` or `now >= entry.resetAt`?)
    // Let's advance by 60001 ms to be safe.
    vi.advanceTimersByTime(60_001)

    // Should be allowed again
    result = checkRateLimit(id, route, 1)
    expect(result.ok).toBe(true)
  })

  it('isolates limits between different identifiers', () => {
    const route = '/api/test'

    checkRateLimit('idA', route, 1)
    const resultA = checkRateLimit('idA', route, 1)
    expect(resultA.ok).toBe(false)

    // idB should not be affected by idA's limit
    const resultB = checkRateLimit('idB', route, 1)
    expect(resultB.ok).toBe(true)
  })

  it('isolates limits between different routes', () => {
    const id = 'user5'

    checkRateLimit(id, '/api/routeA', 1)
    const resultA = checkRateLimit(id, '/api/routeA', 1)
    expect(resultA.ok).toBe(false)

    // routeB should not be affected by routeA's limit
    const resultB = checkRateLimit(id, '/api/routeB', 1)
    expect(resultB.ok).toBe(true)
  })
})
