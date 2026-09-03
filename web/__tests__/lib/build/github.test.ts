import { describe, it, expect } from 'vitest'
import { authorizeUrl, OAUTH_SCOPE } from '@/lib/build/github'

describe('authorizeUrl', () => {
  it('generates the correct authorization URL with provided options', () => {
    const url = authorizeUrl({
      clientId: 'test-client-id',
      redirectUri: 'http://localhost/callback',
      state: 'test-state-123',
    })

    const parsedUrl = new URL(url)
    expect(parsedUrl.origin).toBe('https://github.com')
    expect(parsedUrl.pathname).toBe('/login/oauth/authorize')

    const params = parsedUrl.searchParams
    expect(params.get('client_id')).toBe('test-client-id')
    expect(params.get('redirect_uri')).toBe('http://localhost/callback')
    expect(params.get('scope')).toBe(OAUTH_SCOPE)
    expect(params.get('state')).toBe('test-state-123')
    expect(params.get('allow_signup')).toBe('true')
  })

  it('correctly URL-encodes special characters in parameters', () => {
    const url = authorizeUrl({
      clientId: 'client id with spaces',
      redirectUri: 'https://example.com/callback?query=1&foo=bar',
      state: 'state=with&special?chars',
    })

    const parsedUrl = new URL(url)
    const params = parsedUrl.searchParams

    expect(params.get('client_id')).toBe('client id with spaces')
    expect(params.get('redirect_uri')).toBe('https://example.com/callback?query=1&foo=bar')
    expect(params.get('state')).toBe('state=with&special?chars')
  })
})
