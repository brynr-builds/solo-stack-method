# Email Setup — `hello@solostackmethod.io` (free, ~10 minutes)

> Goal: a branded email on your domain for affiliate applications, contact, and (later) moving admin
> off your personal gmail. Free path = **Cloudflare Email Routing** (your domain is already on
> Cloudflare). It *forwards* mail to your gmail — there's no separate inbox to check.
> Operator-only (it's your Cloudflare login). When done, tell me and I'll add the contact link to the site.

---

## Part 1 — Receive mail at your domain (the essential part, 100% free)

1. Go to **dash.cloudflare.com** → click **solostackmethod.io**.
2. Left sidebar → **Email** → **Email Routing** → **Get started**.
3. Cloudflare will offer to **add the required DNS records** (MX + a TXT/SPF record). Click **Add records / Enable**. (It does this for you — don't hand-edit anything.)
4. **Add a destination address** = your personal Gmail. Cloudflare sends that gmail a **verification email** — open it and click the confirm link.
5. **Create routes** (custom address → forward to your verified gmail):
   - `hello@solostackmethod.io` → your gmail  ← use this one for affiliate applications + contact
   - (optional) `support@solostackmethod.io`, `brynr@solostackmethod.io` → your gmail
   - (optional) **Catch-all** → your gmail, so *anything*@solostackmethod.io reaches you.
6. **Test it:** from your phone, email `hello@solostackmethod.io`. It should land in your gmail within a minute. ✅

**You now have a working branded address for receiving.** That's enough to apply to affiliate
programs and put a contact email on the site.

---

## Part 2 — *Send/reply* as `hello@…` (optional; do when you want replies to look branded)

Cloudflare only forwards — it **doesn't send**. So to reply *from* `hello@solostackmethod.io`
(instead of your gmail showing), you add a free SMTP relay to Gmail's "Send mail as":

1. Make a free **Brevo** account (brevo.com) — free tier ~300 emails/day. (Resend works too.)
2. In Brevo → **SMTP & API** → copy the SMTP login + key (host `smtp-relay.brevo.com`, port `587`).
3. In Brevo, add + **verify your domain** — it gives you a couple of **DKIM/SPF DNS records** to paste into Cloudflare (Cloudflare → solostackmethod.io → **DNS** → add the records). This is what keeps your mail out of spam.
4. Gmail → **Settings → Accounts and Import → "Send mail as" → Add another email address**:
   - Email: `hello@solostackmethod.io` · uncheck "treat as alias" if you want a true send-as.
   - SMTP server: `smtp-relay.brevo.com` · port `587` · your Brevo SMTP login + key · TLS.
5. Gmail sends a confirmation to `hello@…` (which forwards back to you via Part 1) — click to confirm.
6. Now in Gmail you can pick `hello@solostackmethod.io` in the "From" dropdown when composing/replying.

> If "Send mail as" feels fiddly, **skip Part 2 for now** — just reply from gmail. Branded *receiving*
> (Part 1) is what matters for applications. Add sending later.

---

## Notes
- **Don't use this address as your newsletter "from."** Your email tool (Kit/MailerLite) handles
  bulk sending and its own domain verification — keep transactional/personal (`hello@`) separate from
  the newsletter sender.
- **Admin login** currently uses `brynrgarnett@gmail.com`. You can switch it to `brynr@solostackmethod.io`
  later (it's set via the `ADMIN_ALLOWED_EMAIL` env var) — not urgent.
- **AgentMail** (for an agent to send/receive email autonomously) needs the $20/mo tier for a custom
  domain — revisit when the autonomous email loop is worth it; not needed for any of the above.
