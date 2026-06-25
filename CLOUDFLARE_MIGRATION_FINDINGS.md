# Solo Stack → Cloudflare migration — findings (2026-06-25)

Branch: `cloudflare-migration`. **Production is untouched (still Netlify).** This branch holds a
**code-complete** OpenNext migration that is **blocked on the Workers free-plan CPU limit**.

## Done (and verified to build)
- **Next 14.1.0 → 15.5.19** (required: latest `@opennextjs/cloudflare` peer is `next >=15.5.18`; the
  Next-14-compatible adapter line topped out at `0.6.6` — chose the forward path).
- **`@opennextjs/cloudflare@^1.20.0`** added; OpenNext build emits `.open-next/worker.js`.
- **Next 15 breaking-change fixes** (all that this app needed):
  - async `cookies()` — `app/api/build/{spec,me,create}/route.ts` → `(await cookies()).get(...)`.
  - async `params` — `app/{go,compare,guides,tools}/[slug]` → `params: Promise<…>` + `await`.
  - `generateMetadata` in compare/guides/tools made `async`.
- `next build` ✅ and `opennextjs-cloudflare build` ✅ (incl. bundling `pg` for the admin path).
- Deployed to a `*.workers.dev` preview with D1 `DB` binding live.

## BLOCKER — Workers free-plan CPU limit (10 ms)
Live preview logs (`wrangler tail`) on the preview showed, repeatedly:
```
GET /pulse   - Exceeded CPU Limit
GET /privacy - Exceeded CPU Limit   ← a STATIC page
Error: Worker exceeded CPU time limit.
```
- **OpenNext serves every page through the worker** — `.open-next/assets/` contains only `_next/static`
  chunks, no page HTML — so even static pages pay the worker's cold-start init CPU, which exceeds 10 ms.
- Measured failure rates on the preview: `/pulse` 5/5 fail; `/`, `/audit-score`, SSG pages ~20–40% fail;
  **revenue path `/go/[slug]` failed 7/12** (503/500). The redirect handler is trivial — the failures are
  worker-init CPU, not page logic, so app-level optimization cannot fix it.
- No free-plan escape: static-from-ASSETS bypass isn't available (no page HTML in assets); `output: export`
  is blocked by middleware + dynamic API routes + `/pulse` live data; cron-warming doesn't cover real
  multi-colo traffic.

## Decision (2026-06-25): stay on Netlify
Solo Stack is the heaviest SSR app of the three migration targets. Keep it on Netlify (no CPU ceiling on
its functions). This branch is preserved so the migration is **ready to ship the moment the account is on
Workers Paid** (CPU limit → 30 s): no further code changes needed — just enable Paid and `cf:deploy`.

speedrungames (static) migrated cleanly; Branch Tree is the remaining (lighter) candidate.
