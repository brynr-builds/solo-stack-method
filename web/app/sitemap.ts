/*
 * DEV NOTES (2026-06-09):
 * - Why: a real sitemap so search + AI answer engines discover every page (tools, guides,
 *   comparisons, pulse, build). Enumerates the dynamic routes from the same data the pages use.
 */
import type { MetadataRoute } from 'next'
import { programs } from '../lib/tools'
import { getArticles } from '../lib/content'

const BASE = 'https://solostackmethod.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPaths = ['', '/tools', '/guides', '/compare', '/pulse', '/build']
  const toolPaths = programs.map((p) => `/tools/${p.slug}`)
  const guidePaths = getArticles('guides').map((a) => `/guides/${a.slug}`)
  const comparePaths = getArticles('compare').map((a) => `/compare/${a.slug}`)

  return [...staticPaths, ...toolPaths, ...guidePaths, ...comparePaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : path.startsWith('/tools/') || path.startsWith('/compare/') ? 0.8 : 0.6,
  }))
}
