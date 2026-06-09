/**
 * Logout route tests. Tests cookie clearing and redirect.
 */

import { describe, it, expect } from 'vitest'
import { COOKIE_NAME } from '@/lib/admin/session'

describe('POST /api/admin/logout', () => {
  it('redirects to enter-email and clears cookie', async () => {
    const mod = await import('@/app/api/admin/logout/route')
    const req = new Request('http://localhost/api/admin/logout', {
      method: 'POST',
    }) as any
    const res = await mod.POST(req)

    expect(res.status).toBe(307) // NextResponse.redirect uses 307
    expect(res.headers.get('location')).toBe('http://localhost/admin/enter-email')

    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain(`${COOKIE_NAME}=;`) // Empties cookie
    expect(setCookie).toContain('Max-Age=0') // Expires cookie immediately
    expect(setCookie).toContain('Path=/') // From config
    expect(setCookie).toContain('HttpOnly') // From config
  })
})
