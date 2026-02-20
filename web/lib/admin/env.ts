/**
 * Admin auth environment validation.
 * Fails safely when required vars are missing in production.
 * Do not import in client components — server/API only.
 */

const isProd = process.env.NODE_ENV === 'production'

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue
  if (isProd && !value && !defaultValue) {
    throw new Error(`Missing required env var: ${key}. Admin auth will not work in production.`)
  }
  return value ?? ''
}

function getEnvInt(key: string, defaultValue: number): number {
  const raw = process.env[key]
  if (!raw) return defaultValue
  const n = parseInt(raw, 10)
  return Number.isNaN(n) ? defaultValue : n
}

/**
 * Admin auth config. Use getAdminEnv() to access.
 * RP ID / Origin: localhost for dev, your domain for production.
 */
export interface AdminEnv {
  /** Only this email can be admin. Default brynrgarnett@gmail.com */
  allowedEmail: string
  /** Required for /admin/setup. One-time secret to claim first admin. */
  setupSecret: string
  /** WebAuthn RP ID. Use "localhost" for local dev; domain (e.g. solostackmethod.io) for prod. */
  rpId: string
  /** WebAuthn RP display name. */
  rpName: string
  /** Full origin URL. e.g. http://localhost:3000 or https://solostackmethod.io */
  origin: string
  /** Secret for signing session JWTs. Min 32 chars recommended. */
  sessionSecret: string
  /** Session TTL in hours. Default 8. */
  sessionTtlHours: number
  /** Rate limit: max requests per minute for setup/login endpoints. Default 20. */
  rateLimitPerMinute: number
  /** Database connection string. */
  databaseUrl: string
  /** True if all required admin auth vars are present. */
  isConfigured: boolean
}

let _cached: AdminEnv | null = null

/**
 * Get validated admin env. Throws in production if required vars missing.
 * Cached for performance.
 */
export function getAdminEnv(): AdminEnv {
  if (_cached) return _cached

  const allowedEmail = getEnv('ADMIN_ALLOWED_EMAIL', 'brynrgarnett@gmail.com')
  const setupSecret = getEnv('ADMIN_SETUP_SECRET')
  const rpId = getEnv('ADMIN_RP_ID', 'localhost')
  const rpName = getEnv('ADMIN_RP_NAME', 'Solo Stack Method')
  const origin = getEnv('ADMIN_ORIGIN', 'http://localhost:3000')
  const sessionSecret = getEnv('ADMIN_SESSION_SECRET')
  const sessionTtlHours = getEnvInt('ADMIN_SESSION_TTL_HOURS', 8)
  const rateLimitPerMinute = getEnvInt('ADMIN_RATE_LIMIT_PER_MINUTE', 20)
  const databaseUrl = getEnv('DATABASE_URL')

  const requiredForAuth = [setupSecret, sessionSecret, databaseUrl].every(Boolean)
  const isConfigured = requiredForAuth

  if (isProd && !isConfigured) {
    const missing: string[] = []
    if (!setupSecret) missing.push('ADMIN_SETUP_SECRET')
    if (!sessionSecret) missing.push('ADMIN_SESSION_SECRET')
    if (!databaseUrl) missing.push('DATABASE_URL')
    throw new Error(
      `Admin auth not configured. Missing: ${missing.join(', ')}. ` +
        'Set these in production or admin routes will fail.'
    )
  }

  _cached = {
    allowedEmail,
    setupSecret,
    rpId,
    rpName,
    origin,
    sessionSecret,
    sessionTtlHours,
    rateLimitPerMinute,
    databaseUrl,
    isConfigured,
  }
  return _cached
}

/**
 * Check if admin auth is configured without throwing.
 * Use when you need to branch (e.g. redirect to setup vs login).
 */
export function isAdminAuthConfigured(): boolean {
  try {
    return getAdminEnv().isConfigured
  } catch {
    return false
  }
}
