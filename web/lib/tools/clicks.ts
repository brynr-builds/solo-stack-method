/*
 * DEV NOTES (2026-06-08):
 * - Why: Durable, best-effort click logging for outbound affiliate links. This is the
 *   analytics backbone — you can't optimize what you don't measure (which tools get clicks,
 *   from which pages, so the content engine can prioritize what converts).
 * - Store: Vercel KV (already a dependency) when configured; otherwise a no-op so the
 *   REDIRECT NEVER BREAKS. Logging is fire-and-forget — a logging failure must never block
 *   the user's click-through.
 * - Schema: per-slug daily counter (clicks:<slug>:<yyyy-mm-dd>) + a rolling recent list
 *   (clicks:recent) capped at 500 for a quick admin feed. Swap to Postgres later if needed.
 */

export type ClickEvent = {
  slug: string
  ts: string
  referrer: string | null
  ua: string | null
}

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

export async function logClick(ev: ClickEvent): Promise<void> {
  try {
    const kv = await getKv()
    if (!kv) {
      // Dev / unconfigured: leave a breadcrumb in the server log, never throw.
      // eslint-disable-next-line no-console
      console.log('[affiliate-click]', ev.slug, ev.referrer ?? '')
      return
    }
    const day = ev.ts.slice(0, 10)
    await Promise.all([
      kv.incr(`clicks:${ev.slug}:${day}`),
      kv.incr(`clicks:${ev.slug}:total`),
      kv.lpush('clicks:recent', JSON.stringify(ev)),
      kv.ltrim('clicks:recent', 0, 499),
    ])
  } catch {
    // Swallow — logging must never block the redirect.
  }
}
