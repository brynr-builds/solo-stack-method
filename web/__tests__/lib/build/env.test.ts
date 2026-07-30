import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBuildEnv, callbackUrl } from '@/lib/build/env';

describe('Build Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllEnvs();
  });

  describe('getBuildEnv()', () => {
    it('returns default unconfigured state when env vars are missing', () => {
      vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', '');
      vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', '');
      vi.stubEnv('BUILD_SESSION_SECRET', '');
      vi.stubEnv('GITHUB_TEMPLATE_REPO', '');

      const env = getBuildEnv();

      expect(env).toEqual({
        clientId: null,
        clientSecret: null,
        sessionSecret: null,
        templateRepo: 'brynr-builds/solo-stack-starter',
        configured: false,
      });
    });

    it('returns configured state when all required env vars are present', () => {
      vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', 'test-client-id');
      vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', 'test-client-secret');
      vi.stubEnv('BUILD_SESSION_SECRET', 'test-session-secret');
      vi.stubEnv('GITHUB_TEMPLATE_REPO', 'test-owner/test-repo');

      const env = getBuildEnv();

      expect(env).toEqual({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        sessionSecret: 'test-session-secret',
        templateRepo: 'test-owner/test-repo',
        configured: true,
      });
    });

    it('returns unconfigured if missing clientId', () => {
      vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', '');
      vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', 'test-client-secret');
      vi.stubEnv('BUILD_SESSION_SECRET', 'test-session-secret');

      const env = getBuildEnv();
      expect(env.configured).toBe(false);
    });

    it('returns unconfigured if missing clientSecret', () => {
      vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', 'test-client-id');
      vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', '');
      vi.stubEnv('BUILD_SESSION_SECRET', 'test-session-secret');

      const env = getBuildEnv();
      expect(env.configured).toBe(false);
    });

    it('returns unconfigured if missing sessionSecret', () => {
      vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', 'test-client-id');
      vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', 'test-client-secret');
      vi.stubEnv('BUILD_SESSION_SECRET', '');

      const env = getBuildEnv();
      expect(env.configured).toBe(false);
    });
  });

  describe('callbackUrl()', () => {
    it('constructs correct callback URL based on origin', () => {
      const origin = 'https://example.com';
      expect(callbackUrl(origin)).toBe('https://example.com/api/build/callback');
    });

    it('handles localhost origin', () => {
      const origin = 'http://localhost:3000';
      expect(callbackUrl(origin)).toBe('http://localhost:3000/api/build/callback');
    });
  });
});
