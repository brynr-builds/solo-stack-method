import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { track } from '@/lib/analytics'

describe('analytics track()', () => {
  const originalWindow = global.window

  beforeEach(() => {
    // Reset window before each test
    global.window = undefined as any
  })

  afterEach(() => {
    // Restore window
    if (originalWindow === undefined) {
      delete (global as any).window
    } else {
      global.window = originalWindow
    }
  })

  it('does nothing if window is undefined', () => {
    // Should not throw
    expect(() => track('test_event')).not.toThrow()
  })

  it('uses umami if available', () => {
    const umamiTrack = vi.fn()
    global.window = { umami: { track: umamiTrack } } as any

    track('test_event', { foo: 'bar' })

    expect(umamiTrack).toHaveBeenCalledWith('test_event', { foo: 'bar' })
  })

  it('uses plausible if available and umami is not', () => {
    const plausible = vi.fn()
    global.window = { plausible } as any

    track('test_event', { foo: 'bar' })

    expect(plausible).toHaveBeenCalledWith('test_event', { props: { foo: 'bar' } })
  })

  it('uses plausible without props if none provided', () => {
    const plausible = vi.fn()
    global.window = { plausible } as any

    track('test_event')

    expect(plausible).toHaveBeenCalledWith('test_event', undefined)
  })

  it('uses posthog if available and others are not', () => {
    const posthogCapture = vi.fn()
    global.window = { posthog: { capture: posthogCapture } } as any

    track('test_event', { foo: 'bar' })

    expect(posthogCapture).toHaveBeenCalledWith('test_event', { foo: 'bar' })
  })

  it('catches and swallows errors from providers', () => {
    const umamiTrack = vi.fn(() => {
      throw new Error('Analytics failed')
    })
    global.window = { umami: { track: umamiTrack } } as any

    // Should not throw
    expect(() => track('test_event')).not.toThrow()
    expect(umamiTrack).toHaveBeenCalled()
  })
})
