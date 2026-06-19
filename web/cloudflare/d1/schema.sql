-- Cloudflare D1 schema for Solo Stack Method
-- Apply with:  npx wrangler d1 execute solostack --remote --file=./cloudflare/d1/schema.sql
-- (or --local for a local dev D1). Safe to re-run — everything is IF NOT EXISTS.
--
-- This replaces the Vercel KV click store (lib/tools/clicks.ts) with durable,
-- queryable SQL on Cloudflare's free tier. Raw events instead of KV counters,
-- so the admin can slice clicks by slug / day / country without pre-aggregating.

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  slug      TEXT NOT NULL,          -- program slug (matches programs.json)
  ts        TEXT NOT NULL,          -- ISO 8601 timestamp of the click
  day       TEXT NOT NULL,          -- yyyy-mm-dd, derived from ts for cheap grouping
  referrer  TEXT,                   -- referring page (which content page converted)
  ua        TEXT,                   -- user agent
  country   TEXT                    -- CF-IPCountry when proxied by Cloudflare
);

CREATE INDEX IF NOT EXISTS idx_clicks_slug     ON affiliate_clicks(slug);
CREATE INDEX IF NOT EXISTS idx_clicks_day      ON affiliate_clicks(day);
CREATE INDEX IF NOT EXISTS idx_clicks_slug_day ON affiliate_clicks(slug, day);
