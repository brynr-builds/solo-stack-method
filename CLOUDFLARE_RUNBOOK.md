# Cloudflare Migration — Runbook (account-side steps)

Branch: `cloudflare-migration`. Nothing here touches production until **Part D (DNS cutover)**.
Code status is tracked in `CLOUDFLARE_FREE_PLAN.md`. This file = the exact buttons to press.

---

## ✅ Part A — Activate D1 click tracking (Step 1, code DONE)

> **Provisioned 2026-06-19** (config, not secrets):
> - `CF_ACCOUNT_ID` = `f14fbd517a2319f53d206d16b640bbce`
> - `CF_D1_DATABASE_ID` = `e0745cbf-8454-46be-9603-b41b80a9a4f1`  (db name `solostack`, region WNAM)
> - ✅ database created · ✅ schema applied · ✅ write/read/delete round-trip verified
> - ⏳ remaining: create the API token (Step 4), set the 3 Netlify env vars (Step 5), redeploy + test
> - ⚠️ the D1 code is on branch `cloudflare-migration` — it must be shipped to `main` before Netlify runs it.

The code (`web/lib/tools/clicks.ts` + `web/app/go/[slug]/route.ts`) already prefers Cloudflare
D1 when three env vars are set. It writes fire-and-forget, so a misconfig can never break a
redirect — worst case it silently falls back to the old Vercel KV / console path. This works
**while the site is still on Netlify**.

```bash
# 0. one-time: install + log in
npm i -g wrangler          # or use `npx wrangler ...` below
wrangler login

# 1. create the database (prints a database_id — copy it)
cd ~/projects/solostackmethod/web
wrangler d1 create solostack

# 2. apply the schema (creates affiliate_clicks + indexes)
wrangler d1 execute solostack --remote --file=./cloudflare/d1/schema.sql

# 3. sanity check
wrangler d1 execute solostack --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

**Create an API token** (dashboard → *My Profile → API Tokens → Create Token → Custom*):
- Permissions: **Account · D1 · Edit**
- Account Resources: your account
- Copy the token.

**Find your Account ID**: dashboard → any domain → right sidebar, or *Workers & Pages → Account ID*.

**Set three env vars in Netlify** (*Site settings → Environment variables*), then redeploy:
```
CF_ACCOUNT_ID       = f14fbd517a2319f53d206d16b640bbce
CF_D1_DATABASE_ID   = e0745cbf-8454-46be-9603-b41b80a9a4f1
CF_D1_API_TOKEN     = <the D1-edit token from Step 4 — secret, not recorded here>
```

**Verify it's live** (after the Netlify redeploy):
```bash
# click any program link on the site, e.g. open https://solostackmethod.io/go/<some-slug>
# then:
wrangler d1 execute solostack --remote --command "SELECT slug, ts, referrer, country FROM affiliate_clicks ORDER BY id DESC LIMIT 5"
```
A row appears → **you now have durable, free affiliate click-tracking** (the thing
`MONETIZATION_PLAN.md` flagged as missing). Clicks log even before real tracking links exist
(they fall back to merchant URLs), so you start capturing interest data immediately.

> Note: the D1 write currently goes over the HTTP API (works from Netlify). After the host
> migration (Step 3) it auto-upgrades to a faster native D1 binding — same SQL, one-file swap.

---

## ⏭️ Part B — Turnstile on forms (Step 2, DEFERRED)

**Deferred — not needed yet.** `/signup` is a Phase-1 scaffold (simulated `setTimeout`,
`TODO: Supabase auth`) and `/support` has no form submission; there are no public API
endpoints. Turnstile protects real submission endpoints, so there's nothing to protect
today. Revisit the moment signup/support get real backends — then: create a **Turnstile**
widget (dashboard → *Turnstile → Add site*), set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` +
`TURNSTILE_SECRET_KEY`, and verify the token in the new endpoint.

---

## ⏭️ Part C — Preview deploy on Cloudflare (Step 3, code: pending)

Once the OpenNext scaffolding lands, deploy to a **preview** URL (no production DNS change):
```bash
cd ~/projects/solostackmethod/web
npm run preview        # builds with @opennextjs/cloudflare + deploys to a *.workers.dev preview
```
Then walk the checklist: home + content pages render, `/go/<slug>` redirects + logs to D1,
admin login works (after Step 4 D1 port). **Do not touch DNS until every box is checked.**

---

## ⏭️ Part D — DNS cutover (only after Part C passes)

1. Add `solostackmethod.io` to Cloudflare, change nameservers (or, if DNS already on
   Cloudflare, just flip the hostname to the Pages/Workers project).
2. Turn on the free wins: **Bot Fight Mode, Managed WAF, Web Analytics, one Rate-Limit rule,
   Email Routing**.
3. Promote the preview to production.
4. Keep Netlify up for 48h as instant rollback. Then decommission Netlify + Vercel KV + Postgres.

**Don't-lose-anything checklist (do before cutover):** registrar stays portable · schedule a
`wrangler d1 export` backup · R2 data mirrored · repo is source of truth.
