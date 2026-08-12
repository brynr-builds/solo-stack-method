/*
 * DEV NOTES (2026-06-08):
 * - Why: Content engine for SEO articles (guides + comparisons). Content lives as MARKDOWN
 *   files in web/content/<type>/<slug>.md so that BOTH humans and the Hermes content agents
 *   (quinn-copywriter) can author pages without touching React. This is the traffic flywheel:
 *   dogfooded, governed articles that internal-link to The Stack and earn via /go redirects.
 * - Frontmatter (between --- fences): title, description, updated (YYYY-MM-DD), programs
 *   (list of program slugs to surface as monetized CTA cards), and optional author/excerpt.
 * - Rendering: tiny hand-rolled frontmatter parser (no extra dep) + `marked` for md->html.
 *   Content is FIRST-PARTY and trusted, so server-rendered HTML is fine.
 * - Read at build time (generateStaticParams pre-renders each article).
 */

import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

export type ContentType = 'guides' | 'compare'

export type Article = {
  type: ContentType
  slug: string
  title: string
  description: string
  updated: string | null
  author: string | null
  excerpt: string | null
  programs: string[]      // program slugs to surface as monetized cards
  pulse: string[]         // pulse keys (lib/pulse/live.ts) -> LiveFacts panel + {{pulse:*}} tokens
  html: string            // rendered body
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

/** Minimal YAML-ish frontmatter parser: scalar strings + `[a, b]` / `- item` lists. */
function parseFrontmatter(raw: string): { data: Record<string, any>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data: Record<string, any> = {}
  const lines = m[1].split('\n')
  let currentListKey: string | null = null
  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentListKey) {
      data[currentListKey].push(line.replace(/^\s*-\s+/, '').trim().replace(/^["']|["']$/g, ''))
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    let val = kv[2].trim()
    if (val === '') {
      // block list follows on subsequent `- ` lines
      currentListKey = key
      data[key] = []
      continue
    }
    currentListKey = null
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else {
      data[key] = val.replace(/^["']|["']$/g, '')
    }
  }
  return { data, body: m[2] }
}

// ⚡ Bolt: Shared helper for parsing to keep logic DRY
function parseArticleFile(filePath: string, type: ContentType, slug: string): Article {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  return {
    type,
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    updated: data.updated ?? null,
    author: data.author ?? null,
    excerpt: data.excerpt ?? null,
    programs: Array.isArray(data.programs) ? data.programs : [],
    pulse: Array.isArray(data.pulse) ? data.pulse : [],
    html: marked.parse(body, { async: false }) as string,
  };
}

function readType(type: ContentType): Article[] {
  const dir = path.join(CONTENT_ROOT, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      return parseArticleFile(path.join(dir, f), type, slug);
    })
    .sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
}

export function getArticles(type: ContentType): Article[] {
  return readType(type)
}

export function getArticle(type: ContentType, slug: string): Article | undefined {
  // ⚡ Bolt: Read single file directly to avoid O(N) disk I/O and CPU overhead
  const cleanSlug = path.basename(slug);
  const filePath = path.join(CONTENT_ROOT, type, `${cleanSlug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return parseArticleFile(filePath, type, cleanSlug);
}
