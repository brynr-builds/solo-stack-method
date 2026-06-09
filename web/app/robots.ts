/*
 * DEV NOTES (2026-06-09):
 * - Why: /robots.txt was 404. This makes the site cleanly crawlable AND explicitly welcomes the AI
 *   answer-engine crawlers (GPTBot/ClaudeBot/PerplexityBot/etc.) — being cited by ChatGPT/Perplexity
 *   is a core 2026 distribution channel (AEO). ~68% of SaaS sites accidentally block these.
 * - Blocks only /admin and /api from indexing.
 */
import type { MetadataRoute } from 'next'

const BASE = 'https://solostackmethod.io'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
      // We WANT to be cited by AI answer engines — welcome them explicitly.
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'CCBot'],
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
