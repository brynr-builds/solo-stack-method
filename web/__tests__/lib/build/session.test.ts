import { describe, it, expect } from 'vitest'
import { sealToken, openToken, ghCookieOptions } from '../../../lib/build/session'
import { EncryptJWT } from 'jose'
import { createHash } from 'crypto'

describe('session token utils', () => {
  const secret = 'super-secret-key-1234567890123456'
  const token = 'gho_1234567890abcdef'

  describe('sealToken & openToken', () => {
    it('should successfully seal and open a valid token', async () => {
      const sealed = await sealToken(token, secret)
      expect(typeof sealed).toBe('string')

      const opened = await openToken(sealed, secret)
      expect(opened).toBe(token)
    })

    it('should return null when opening with the wrong secret', async () => {
      const sealed = await sealToken(token, secret)
      const opened = await openToken(sealed, 'wrong-secret')
      expect(opened).toBeNull()
    })

    it('should return null for malformed JWT string', async () => {
      const opened = await openToken('not-a-real-jwt', secret)
      expect(opened).toBeNull()
    })

    it('should return null for empty string', async () => {
      const opened = await openToken('', secret)
      expect(opened).toBeNull()
    })

    it('should return null if the token payload does not contain a string tok field', async () => {
      // Manually create a JWE without 'tok' field
      const keyFrom = (s: string) => new Uint8Array(createHash('sha256').update(s).digest())
      const jwe = await new EncryptJWT({ wrongField: 'hello' })
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(keyFrom(secret))

      const opened = await openToken(jwe, secret)
      expect(opened).toBeNull()
    })

    it('should return null if tok field is not a string', async () => {
      // Manually create a JWE where 'tok' is an object
      const keyFrom = (s: string) => new Uint8Array(createHash('sha256').update(s).digest())
      const jwe = await new EncryptJWT({ tok: { notAString: true } })
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(keyFrom(secret))

      const opened = await openToken(jwe, secret)
      expect(opened).toBeNull()
    })
  })

  describe('ghCookieOptions', () => {
    it('should return correct default options', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const options = ghCookieOptions()
      expect(options.httpOnly).toBe(true)
      expect(options.secure).toBe(false)
      expect(options.sameSite).toBe('lax')
      expect(options.path).toBe('/')
      expect(options.maxAge).toBe(60 * 60 * 24 * 7)

      process.env.NODE_ENV = originalEnv
    })

    it('should set secure to true in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const options = ghCookieOptions()
      expect(options.secure).toBe(true)

      process.env.NODE_ENV = originalEnv
    })

    it('should allow custom maxAge', () => {
      const options = ghCookieOptions(3600)
      expect(options.maxAge).toBe(3600)
    })
  })
})
