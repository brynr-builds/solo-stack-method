/**
 * Identify route tests. Uses mock env and DB.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/admin/env', () => ({
  getAdminEnv: vi.fn(() => ({
    isConfigured: true,
    allowedEmail: 'brynrgarnett@gmail.com',
  })),
}))

vi.mock('@/lib/admin/storage/db', () => ({
  query: vi.fn(),
}))

describe('POST /api/admin/identify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns denied for non-allowed email', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([])

    const mod = await import('@/app/api/admin/identify/route')
    const res = await mod.POST(
      new Request('http://localhost/api/admin/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'other@example.com' }),
      })
    )
    const data = await res.json()
    expect(data.next).toBe('denied')
    expect(query).not.toHaveBeenCalled()
  })

  it('returns setup when no admin exists for allowed email', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([])

    const mod = await import('@/app/api/admin/identify/route')
    const res = await mod.POST(
      new Request('http://localhost/api/admin/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'brynrgarnett@gmail.com' }),
      })
    )
    const data = await res.json()
    expect(data.next).toBe('setup')
    expect(query).toHaveBeenCalledWith(
      'SELECT id FROM admin_users WHERE email = $1 AND is_active = true',
      ['brynrgarnett@gmail.com']
    )
  })

  it('returns login when admin exists for allowed email', async () => {
    const { query } = await import('@/lib/admin/storage/db')
    vi.mocked(query).mockResolvedValue([{ id: 'user-123' }])

    const mod = await import('@/app/api/admin/identify/route')
    const res = await mod.POST(
      new Request('http://localhost/api/admin/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'brynrgarnett@gmail.com' }),
      })
    )
    const data = await res.json()
    expect(data.next).toBe('login')
  })
})
