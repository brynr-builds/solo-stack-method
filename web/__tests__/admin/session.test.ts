import { describe, it, expect } from 'vitest'
import {
  verifySessionToken,
  getSessionFromRequest,
  createSessionToken,
  COOKIE_NAME,
} from '@/lib/admin/session'
import * as jose from 'jose'

describe('Admin Session Management', () => {
  const SECRET = 'test-secret-key-that-is-long-enough'
  const WRONG_SECRET = 'wrong-secret-key-that-is-long-enough'
  const USER_ID = 'test-user-id'
  const EMAIL = 'test@example.com'

  describe('createSessionToken & verifySessionToken', () => {
    it('should create and verify a valid session token', async () => {
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, 1) // 1 hour TTL
      expect(typeof token).toBe('string')

      const payload = await verifySessionToken(token, SECRET)
      expect(payload).not.toBeNull()
      expect(payload?.sub).toBe(USER_ID)
      expect(payload?.email).toBe(EMAIL)
      expect(payload?.jti).toBeDefined()
      expect(payload?.iat).toBeDefined()
      expect(payload?.exp).toBeDefined()
    })

    it('should return null if token is empty', async () => {
      const payload = await verifySessionToken('', SECRET)
      expect(payload).toBeNull()
    })

    it('should return null if secret is empty', async () => {
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, 1)
      const payload = await verifySessionToken(token, '')
      expect(payload).toBeNull()
    })

    it('should return null for tampered token', async () => {
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, 1)
      const tamperedToken = token + 'tampered'
      const payload = await verifySessionToken(tamperedToken, SECRET)
      expect(payload).toBeNull()
    })

    it('should return null if verified with different secret', async () => {
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, 1)
      const payload = await verifySessionToken(token, WRONG_SECRET)
      expect(payload).toBeNull()
    })

    it('should return null if token is expired', async () => {
      // Create a token that expires immediately (-1 hour)
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, -1)
      const payload = await verifySessionToken(token, SECRET)
      expect(payload).toBeNull()
    })
  })

  describe('getSessionFromRequest', () => {
    it('should successfully get and verify token from request cookies', async () => {
      const token = await createSessionToken(USER_ID, EMAIL, SECRET, 1)
      const request = {
        cookies: {
          get: (name: string) => {
            if (name === COOKIE_NAME) return { value: token }
            return undefined
          },
        },
      }

      const payload = await getSessionFromRequest(request, SECRET)
      expect(payload).not.toBeNull()
      expect(payload?.sub).toBe(USER_ID)
      expect(payload?.email).toBe(EMAIL)
    })

    it('should return null if cookie is not present in request', async () => {
      const request = {
        cookies: {
          get: () => undefined,
        },
      }

      const payload = await getSessionFromRequest(request, SECRET)
      expect(payload).toBeNull()
    })
  })
})
