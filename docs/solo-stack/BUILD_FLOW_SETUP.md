# Build Flow Setup (operator) — connect GitHub to /build

The `/build` flow lets a user create a website repo from the `solo-stack-starter` template by
connecting their GitHub account. It needs a **GitHub OAuth App** (yours) + 3 env vars. ~5 minutes.
This is the one operator-only step — like the affiliate Gate 3, it involves credentials only you
can create.

## 1. Create a GitHub OAuth App
GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** Solo Stack Build
- **Homepage URL:** `https://solostackmethod.io`
- **Authorization callback URL:** `https://solostackmethod.io/api/build/callback`
  - For local dev, register a second app (or add the URL) with `http://localhost:3000/api/build/callback`.
- Create it, then **Generate a new client secret.**

## 2. Set environment variables
In your host (Netlify/Vercel dashboard) and in `web/.env.local` for dev:

```
GITHUB_OAUTH_CLIENT_ID=<your client id>
GITHUB_OAUTH_CLIENT_SECRET=<your client secret>
BUILD_SESSION_SECRET=<run: openssl rand -hex 32>   # encrypts the user's token cookie
# optional — defaults to brynr-builds/solo-stack-starter:
GITHUB_TEMPLATE_REPO=brynr-builds/solo-stack-starter
```

## 3. Done
Redeploy. Visit `/build` — the wizard shows "Connect GitHub" instead of the setup notice. Until the
vars are set, the page renders a friendly "not configured yet" message (it never crashes).

## How it works / security
- OAuth scope is **`public_repo`** — enough to create a public repo from the template; it does NOT
  grant access to the user's private repos.
- The user's token is **encrypted** (jose JWE) into an httpOnly, Secure, SameSite cookie. It never
  reaches the browser JS or the client bundle. All GitHub calls happen in `/api/build/*`.
- CSRF-protected via a one-time `state` cookie on the OAuth round-trip.

## Roadmap note (Model A → B)
This uses an OAuth App (simplest for "create a repo in the user's account"). For **Model B**
(a server-side agent that edits the user's repo from the browser), migrate to a **GitHub App** with
fine-grained, per-repo permissions and a webhook — the `/build` flow here is the foundation it builds on.
