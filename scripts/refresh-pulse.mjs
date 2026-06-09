#!/usr/bin/env node
/*
 * DEV NOTES (2026-06-09):
 * - Why: Refresh the Stack Pulse snapshot with REAL latest versions + release dates.
 *   Run by the pulse-refresh GitHub Action on a schedule; it commits the updated snapshot,
 *   which Netlify auto-deploys — so the live Pulse page updates automatically (and dogfoods
 *   the "autodeploys updates as they're pushed" loop). The site also re-fetches live at
 *   runtime (ISR), so this snapshot is the resilient seed/fallback, not the only mechanism.
 * - Sources: npm registry (public, no auth) + nodejs.org dist index. No secrets needed.
 * Usage: node scripts/refresh-pulse.mjs   (writes web/lib/pulse/snapshot.json)
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const pulseDir = join(here, '..', 'web', 'lib', 'pulse')
const sources = JSON.parse(readFileSync(join(pulseDir, 'sources.json'), 'utf8'))

async function fetchNpm(pkg) {
  const res = await fetch(`https://registry.npmjs.org/${pkg}`)
  if (!res.ok) throw new Error(`npm ${pkg} ${res.status}`)
  const data = await res.json()
  const version = data['dist-tags']?.latest
  return { version, date: version ? data.time?.[version] ?? null : null }
}

async function fetchNode() {
  const res = await fetch('https://nodejs.org/dist/index.json')
  if (!res.ok) throw new Error(`node ${res.status}`)
  const data = await res.json()
  const latest = data[0] // newest first
  return { version: String(latest.version).replace(/^v/, ''), date: latest.date ?? null }
}

const items = []
for (const s of sources) {
  try {
    const v = s.node ? await fetchNode() : await fetchNpm(s.npm)
    items.push({ name: s.name, category: s.category, url: s.url, version: v.version ?? null, date: v.date ?? null })
    console.log(`ok   ${s.name.padEnd(16)} ${v.version}  ${v.date}`)
  } catch (e) {
    items.push({ name: s.name, category: s.category, url: s.url, version: null, date: null })
    console.log(`FAIL ${s.name.padEnd(16)} ${e.message}`)
  }
}

// No timestamp in the file on purpose: the snapshot changes ONLY when a version/date changes,
// so the refresh Action commits (and triggers a deploy) only on real updates, not every run.
// The page computes its own "last checked" time at render (it also fetches live via ISR).
writeFileSync(join(pulseDir, 'snapshot.json'), JSON.stringify({ items }, null, 2) + '\n')
console.log(`\nWrote snapshot.json (${items.length} tools).`)
