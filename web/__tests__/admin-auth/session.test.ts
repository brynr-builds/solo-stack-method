import { describe, it, expect } from 'vitest'
import { verifySessionToken, createSessionToken } from '@/lib/admin/session'

describe('verifySessionToken', () => {
  it('returns null for an invalid token', async () => {
    // Attempt to verify a random string instead of a valid JWT.
    const invalidToken = 'this.is.not.a.valid.jwt'
    const secret = 'test-secret'
    const payload = await verifySessionToken(invalidToken, secret)

    // According to the logic, this should drop into the catch block and return null.
    expect(payload).toBeNull()
  })

  it('returns null if token or secret is empty', async () => {
    expect(await verifySessionToken('', 'secret')).toBeNull()
    expect(await verifySessionToken('token', '')).toBeNull()
  })

  it('verifies a valid session token correctly', async () => {
    const secret = 'valid-test-secret-key-1234567890'
    const validToken = await createSessionToken('user_123', 'admin@example.com', secret, 1)

    const payload = await verifySessionToken(validToken, secret)

    expect(payload).not.toBeNull()
    expect(payload?.sub).toBe('user_123')
    expect(payload?.email).toBe('admin@example.com')
    expect(payload?.exp).toBeDefined()
    expect(payload?.iat).toBeDefined()
    expect(payload?.jti).toBeDefined()
  })

  it('returns null for an expired token', async () => {
    const secret = 'valid-test-secret-key-1234567890'
    // Create token with -1 hours TTL to simulate expiration
    const expiredToken = await createSessionToken('user_123', 'admin@example.com', secret, -1)

    const payload = await verifySessionToken(expiredToken, secret)
    expect(payload).toBeNull()
  })
})
