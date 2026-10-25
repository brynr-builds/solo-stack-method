import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('logClick', () => {
  let consoleLogMock: any;

  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogMock.mockRestore()
  })

  it('logs to console and returns early if KV is not configured', async () => {
    // Make sure env is missing
    vi.stubEnv('KV_REST_API_URL', '')
    vi.stubEnv('KV_REST_API_TOKEN', '')

    const { logClick } = await import('../lib/tools/clicks')

    await logClick({
      slug: 'test-slug',
      ts: '2023-10-10T12:00:00Z',
      referrer: 'https://example.com',
      ua: null
    })

    expect(consoleLogMock).toHaveBeenCalledWith(
      '[affiliate-click]',
      'test-slug',
      'https://example.com'
    )
  })

  it('performs KV operations successfully when configured', async () => {
    vi.stubEnv('KV_REST_API_URL', 'http://localhost')
    vi.stubEnv('KV_REST_API_TOKEN', 'token')

    const mockIncr = vi.fn().mockResolvedValue(1)
    const mockLpush = vi.fn().mockResolvedValue(1)
    const mockLtrim = vi.fn().mockResolvedValue('OK')

    // Since lib/tools/clicks.ts caches the kvClient, we need to make sure we mock before import
    vi.doMock('@vercel/kv', () => {
      return {
        kv: {
          incr: mockIncr,
          lpush: mockLpush,
          ltrim: mockLtrim,
        }
      }
    })

    const { logClick } = await import('../lib/tools/clicks')

    const ev = {
      slug: 'test-slug',
      ts: '2023-10-10T12:00:00Z',
      referrer: 'https://example.com',
      ua: null
    }
    await logClick(ev)

    expect(mockIncr).toHaveBeenCalledWith('clicks:test-slug:2023-10-10')
    expect(mockIncr).toHaveBeenCalledWith('clicks:test-slug:total')
    expect(mockLpush).toHaveBeenCalledWith('clicks:recent', JSON.stringify(ev))
    expect(mockLtrim).toHaveBeenCalledWith('clicks:recent', 0, 499)
  })

  it('swallows errors when KV import fails', async () => {
    vi.stubEnv('KV_REST_API_URL', 'http://localhost')
    vi.stubEnv('KV_REST_API_TOKEN', 'token')

    vi.doMock('@vercel/kv', () => {
      throw new Error('Import Error')
    })

    const { logClick } = await import('../lib/tools/clicks')

    await logClick({
      slug: 'test-slug',
      ts: '2023-10-10T12:00:00Z',
      referrer: 'https://example.com',
      ua: null
    })

    expect(consoleLogMock).toHaveBeenCalledWith(
      '[affiliate-click]',
      'test-slug',
      'https://example.com'
    )
  })

  it('swallows errors when KV operations fail', async () => {
    vi.stubEnv('KV_REST_API_URL', 'http://localhost')
    vi.stubEnv('KV_REST_API_TOKEN', 'token')

    vi.doMock('@vercel/kv', () => {
      return {
        kv: {
          incr: vi.fn().mockRejectedValue(new Error('KV Error')),
          lpush: vi.fn(),
          ltrim: vi.fn(),
        }
      }
    })

    const { logClick } = await import('../lib/tools/clicks')

    await expect(logClick({
      slug: 'test-slug',
      ts: '2023-10-10T12:00:00Z',
      referrer: null,
      ua: null
    })).resolves.toBeUndefined()
  })
})
