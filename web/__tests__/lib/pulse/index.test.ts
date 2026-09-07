import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPulse } from '@/lib/pulse/index'
import snapshot from '@/lib/pulse/snapshot.json'

describe('getPulse', () => {
  let fetchSpy: any

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch')
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-16T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should return successfully fetched data', async () => {
    fetchSpy.mockImplementation(async (url: string) => {
      if (url.includes('nodejs.org')) {
        return {
          ok: true,
          json: async () => [{ version: 'v20.0.0', date: '2023-04-18' }]
        }
      }
      if (url.includes('registry.npmjs.org')) {
        return {
          ok: true,
          json: async () => ({
            'dist-tags': { latest: '1.2.3' },
            time: { '1.2.3': '2023-05-01T00:00:00.000Z' }
          })
        }
      }
      return { ok: false, status: 404 }
    })

    const result = await getPulse()

    expect(result.items.length).toBeGreaterThan(0)

    const nodeItem = result.items.find(i => i.name === 'Node.js')
    expect(nodeItem?.version).toBe('20.0.0') // stripped 'v'
    expect(nodeItem?.date).toBe('2023-04-18')

    const nextItem = result.items.find(i => i.name === 'Next.js')
    expect(nextItem?.version).toBe('1.2.3')
    expect(nextItem?.date).toBe('2023-05-01T00:00:00.000Z')
  })

  it('should fallback to snapshot when fetch fails (throws error)', async () => {
    fetchSpy.mockRejectedValue(new Error('Network error'))

    const result = await getPulse()

    const nodeItem = result.items.find(i => i.name === 'Node.js')
    const snapNode = snapshot.items.find((i: any) => i.name === 'Node.js')
    expect(nodeItem?.version).toBe(snapNode?.version)

    const nextItem = result.items.find(i => i.name === 'Next.js')
    const snapNext = snapshot.items.find((i: any) => i.name === 'Next.js')
    expect(nextItem?.version).toBe(snapNext?.version)
  })

  it('should fallback to snapshot when registry returns non-OK response', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500
    })

    const result = await getPulse()

    const nodeItem = result.items.find(i => i.name === 'Node.js')
    const snapNode = snapshot.items.find((i: any) => i.name === 'Node.js')
    expect(nodeItem?.version).toBe(snapNode?.version)
  })

  it('should fallback to snapshot when registry returns malformed/missing data', async () => {
    fetchSpy.mockImplementation(async (url: string) => {
      if (url.includes('nodejs.org')) {
        return {
          ok: true,
          json: async () => [{ version: undefined }] // missing version
        }
      }
      if (url.includes('registry.npmjs.org')) {
        return {
          ok: true,
          json: async () => ({
            'dist-tags': {} // missing latest
          })
        }
      }
      return { ok: false, status: 404 }
    })

    const result = await getPulse()

    const nodeItem = result.items.find(i => i.name === 'Node.js')
    const snapNode = snapshot.items.find((i: any) => i.name === 'Node.js')
    expect(nodeItem?.version).toBe(snapNode?.version)

    const nextItem = result.items.find(i => i.name === 'Next.js')
    const snapNext = snapshot.items.find((i: any) => i.name === 'Next.js')
    expect(nextItem?.version).toBe(snapNext?.version)
  })
})
