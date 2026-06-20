/*
 * DEV NOTES (updated 2026-06-19 — Cloudflare migration):
 * - Why: Durable, best-effort click logging for outbound affiliate links. This is the
 *   analytics backbone — you can't optimize what you don't measure (which tools get clicks,
 *   from which pages, so the content engine can prioritize what converts).
 * - Store priority:
 *     1. Cloudflare D1 (PREFERRED, free, durable, queryable) when CF_D1_* env is set.
 *     2. Vercel KV (legacy) when KV_REST_API_* is set — kept so nothing regresses mid-migration.
 *     3. console breadcrumb (dev / unconfigured) — never throws.
 * - D1 is written via the HTTP API so this works from Netlify TODAY and from Cloudflare
 *   Workers later unchanged. When the app moves onto Workers, swap d1Fetch() for a native
 *   D1 binding (env.DB.prepare(...).bind(...).run()) — the SQL stays identical.
 * - Schema: raw events in `affiliate_clicks` (see cloudflare/d1/schema.sql). Aggregate at
 *   read time (getClickTotals / getRecentClicks) instead of maintaining KV counters.
 * - HARD CONTRACT: logging is fire-and-forget. It must NEVER throw and NEVER block the
 *   user's click-through. Every path is wrapped so a logging failure is invisible to the hop.
 */

export type ClickEvent = {
  slug: string
  ts: string
  referrer: string | null
  ua: string | null
  country?: string | null
}

export type ClickRow = {
  slug: string
  ts: string
  referrer: string | null
  ua: string | null
  country: string | null
}

// ---------------------------------------------------------------------------
// Cloudflare D1 (preferred)
// ---------------------------------------------------------------------------

const D1_ACCOUNT = process.env.CF_ACCOUNT_ID
const D1_DATABASE = process.env.CF_D1_DATABASE_ID
const D1_TOKEN = process.env.CF_D1_API_TOKEN

function d1Configured(): boolean {
  return Boolean(D1_ACCOUNT && D1_DATABASE && D1_TOKEN)
}

/** Low-level D1 HTTP query. Returns the parsed JSON envelope (or throws — callers guard).
 *  Timeout-bounded so awaiting a write on the redirect path can never stall the hop. */
async function d1Fetch(sql: string, params: unknown[] = []): Promise<any> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${D1_ACCOUNT}/d1/database/${D1_DATABASE}/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${D1_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    signal: AbortSignal.timeout(2500),
  })
  return res.json()
}

async function logClickD1(ev: ClickEvent): Promise<void> {
  const day = ev.ts.slice(0, 10)
  await d1Fetch(
    'INSERT INTO affiliate_clicks (slug, ts, day, referrer, ua, country) VALUES (?, ?, ?, ?, ?, ?)',
    [ev.slug, ev.ts, day, ev.referrer, ev.ua, ev.country ?? null],
  )
}

// ---------------------------------------------------------------------------
// Vercel KV (legacy fallback — kept until D1 is wired in production)
// ---------------------------------------------------------------------------

let kvClient: any | null | undefined

async function getKv() {
  if (kvClient !== undefined) return kvClient
  // Only attempt KV when the env is actually configured, so local/dev never errors.
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    kvClient = null
    return null
  }
  try {
    const mod = await import('@vercel/kv')
    kvClient = mod.kv
  } catch {
    kvClient = null
  }
  return kvClient
}

async function logClickKv(ev: ClickEvent): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  const day = ev.ts.slice(0, 10)
  await Promise.all([
    kv.incr(`clicks:${ev.slug}:${day}`),
    kv.incr(`clicks:${ev.slug}:total`),
    kv.lpush('clicks:recent', JSON.stringify(ev)),
    kv.ltrim('clicks:recent', 0, 499),
  ])
  return true
}

// ---------------------------------------------------------------------------
// Public write API
// ---------------------------------------------------------------------------

export async function logClick(ev: ClickEvent): Promise<void> {
  try {
    if (d1Configured()) {
      await logClickD1(ev)
      return
    }
    if (await logClickKv(ev)) {
      return
    }
    // Dev / unconfigured: leave a breadcrumb in the server log, never throw.
    // eslint-disable-next-line no-console
    console.log('[affiliate-click]', ev.slug, ev.referrer ?? '')
  } catch {
    // Swallow — logging must never block the redirect.
  }
}

// ---------------------------------------------------------------------------
// Read API (admin dashboards). D1-only; returns [] when D1 isn't configured.
// ---------------------------------------------------------------------------

/** Most recent clicks, newest first. */
export async function getRecentClicks(limit = 100): Promise<ClickRow[]> {
  if (!d1Configured()) return []
  try {
    const json = await d1Fetch(
      'SELECT slug, ts, referrer, ua, country FROM affiliate_clicks ORDER BY id DESC LIMIT ?',
      [limit],
    )
    return (json?.result?.[0]?.results ?? []) as ClickRow[]
  } catch {
    return []
  }
}

/** Total clicks per slug, most-clicked first. */
export async function getClickTotals(): Promise<{ slug: string; clicks: number }[]> {
  if (!d1Configured()) return []
  try {
    const json = await d1Fetch(
      'SELECT slug, COUNT(*) AS clicks FROM affiliate_clicks GROUP BY slug ORDER BY clicks DESC',
    )
    return (json?.result?.[0]?.results ?? []) as { slug: string; clicks: number }[]
  } catch {
    return []
  }
}
