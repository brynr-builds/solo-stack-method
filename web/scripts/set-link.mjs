#!/usr/bin/env node
/*
 * DEV NOTES (2026-06-08): One-line revenue switch.
 * Usage:  node scripts/set-link.mjs <program-slug> "<your-affiliate-tracking-url>"
 * Example: node scripts/set-link.mjs kit "https://kit.com/?lmref=AbC123"
 *
 * Writes the link into lib/tools/affiliate-links.json. After this, every /go/<slug> on the
 * site redirects through your tracking link and starts earning. Commit + push to go live.
 * Run with no args to list which programs are still missing a link.
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const linksPath = join(here, '..', 'lib', 'tools', 'affiliate-links.json')
const programsPath = join(here, '..', 'lib', 'tools', 'programs.json')

const links = JSON.parse(readFileSync(linksPath, 'utf8'))
const programs = JSON.parse(readFileSync(programsPath, 'utf8'))
const validSlugs = new Set(programs.map((p) => p.slug))

const [, , slug, url] = process.argv

if (!slug) {
  const have = Object.keys(links).filter((k) => k !== '_README')
  const missing = programs.filter((p) => !links[p.slug]).map((p) => p.slug)
  console.log(`\nLinks set (${have.length}): ${have.join(', ') || '(none yet)'}`)
  console.log(`\nStill missing a tracking link (${missing.length}):\n  ${missing.join('\n  ')}`)
  console.log(`\nUsage: node scripts/set-link.mjs <slug> "<tracking-url>"\n`)
  process.exit(0)
}

if (!validSlugs.has(slug)) {
  console.error(`Unknown slug "${slug}". Valid slugs:\n  ${[...validSlugs].join('\n  ')}`)
  process.exit(1)
}
if (!url || !/^https?:\/\//.test(url)) {
  console.error(`Provide a full URL starting with http(s)://  — got: ${url}`)
  process.exit(1)
}

links[slug] = url
writeFileSync(linksPath, JSON.stringify(links, null, 2) + '\n')
console.log(`✓ ${slug} → ${url}`)
console.log(`  That program now earns on every /go/${slug} click. Commit + push to publish.`)
