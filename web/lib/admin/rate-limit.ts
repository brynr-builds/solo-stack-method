/**
 * In-memory rate limiter for admin auth endpoints.
 * Resets on server restart. Document this limitation.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

function key(identifier: string, route: string): string {
  return `${identifier}:${route}`
}

export function checkRateLimit(
  identifier: string,
  route: string,
  limitPerMinute: number
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now()
  const windowMs = 60_000
  const k = key(identifier, route)
  const entry = store.get(k)

  if (!entry) {
    store.set(k, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (now > entry.resetAt) {
    store.set(k, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= limitPerMinute) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { ok: true }
}
