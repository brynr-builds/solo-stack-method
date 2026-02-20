# Admin Auth — Solo Stack Method

Production-safe admin authentication with email bootstrap, passkeys (WebAuthn), and optional backup codes.

## Env Vars

Create `web/.env.local` with:

```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_SETUP_SECRET=your-secret  # openssl rand -hex 32
ADMIN_SESSION_SECRET=your-secret  # openssl rand -hex 32

# Admin email (only this email can be admin)
ADMIN_ALLOWED_EMAIL=brynrgarnett@gmail.com

# WebAuthn
ADMIN_RP_ID=localhost  # use "solostackmethod.io" in production
ADMIN_RP_NAME=Solo Stack Method
ADMIN_ORIGIN=http://localhost:3000  # https://solostackmethod.io in production

# Optional
ADMIN_SESSION_TTL_HOURS=8
ADMIN_RATE_LIMIT_PER_MINUTE=20
```

## Migrations

```bash
cd web
psql $DATABASE_URL -f migrations/001_admin_auth.sql
psql $DATABASE_URL -f migrations/002_admin_auth_email_bootstrap.sql
```

Rollback:

```bash
psql $DATABASE_URL -f migrations/002_admin_auth_email_bootstrap.rollback.sql
psql $DATABASE_URL -f migrations/001_admin_auth.rollback.sql
```

## First-Time Setup

1. Visit `/admin` — you will be redirected to `/admin/enter-email`.
2. Enter `brynrgarnett@gmail.com` and click Continue.
3. You will be sent to `/admin/setup` (no admin exists yet).
4. Enter the **Setup Secret** (from `ADMIN_SETUP_SECRET`).
5. Click **Create Admin + Register Passkey**.
6. Complete passkey registration (Face ID / Touch ID / Windows Hello).
7. **Store your backup codes** — they are shown once and cannot be retrieved.
8. Click **Continue to Admin**.

## Passkey Login

1. Visit `/admin` — redirected to `/admin/enter-email`.
2. Enter `brynrgarnett@gmail.com` and click Continue.
3. You will be sent to `/admin/login` (admin exists).
4. Click **Sign in with Passkey**.
5. Complete passkey authentication.

## Backup Codes

- Generated once at setup.
- Each code can be used only once.
- Store them securely.
- To use: on login page, click **Use backup code instead**, enter a code.

## Sign Out

- Click **Sign out** in the admin nav bar, or
- `POST /api/admin/logout` (clears session cookie and redirects to `/admin/enter-email`).

## Production Notes

- Set `ADMIN_RP_ID` to your domain (e.g. `solostackmethod.io`).
- Set `ADMIN_ORIGIN` to your full origin (e.g. `https://solostackmethod.io`).
- Ensure `ADMIN_SETUP_SECRET` and `ADMIN_SESSION_SECRET` are strong and unique.
- Rate limiting is in-memory (resets on server restart). For multi-instance, consider Redis.
