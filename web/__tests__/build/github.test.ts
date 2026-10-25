import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFromTemplate } from '@/lib/build/github'

describe('github.ts - createFromTemplate', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('handles 201 Created successfully', async () => {
    mockFetch.mockResolvedValue({
      status: 201,
      json: async () => ({
        html_url: 'https://github.com/user/repo',
        full_name: 'user/repo',
      }),
    })

    const result = await createFromTemplate({
      token: 'fake-token',
      templateRepo: 'tpl/repo',
      owner: 'user',
      name: 'repo',
    })

    expect(result).toEqual({
      ok: true,
      htmlUrl: 'https://github.com/user/repo',
      fullName: 'user/repo',
    })
  })

  it('handles errors with message and errors array', async () => {
    mockFetch.mockResolvedValue({
      status: 422,
      json: async () => ({
        message: 'Validation Failed',
        errors: [{ message: 'name is invalid' }, { code: 'already_exists' }],
      }),
    })

    const result = await createFromTemplate({
      token: 'fake-token',
      templateRepo: 'tpl/repo',
      owner: 'user',
      name: 'repo',
    })

    expect(result).toEqual({
      ok: false,
      status: 422,
      message: 'Validation Failed — name is invalid, already_exists',
    })
  })

  it('handles errors with only a message', async () => {
    mockFetch.mockResolvedValue({
      status: 403,
      json: async () => ({
        message: 'Forbidden',
      }),
    })

    const result = await createFromTemplate({
      token: 'fake-token',
      templateRepo: 'tpl/repo',
      owner: 'user',
      name: 'repo',
    })

    expect(result).toEqual({
      ok: false,
      status: 403,
      message: 'Forbidden',
    })
  })

  it('handles invalid JSON gracefully', async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      json: async () => { throw new Error('Invalid JSON') },
    })

    const result = await createFromTemplate({
      token: 'fake-token',
      templateRepo: 'tpl/repo',
      owner: 'user',
      name: 'repo',
    })

    expect(result).toEqual({
      ok: false,
      status: 500,
      message: 'GitHub returned 500',
    })
  })
})
