---
title: Next.js vs Astro — which should your AI build your site with?
description: The two frameworks AI coding tools reach for most, compared for non-technical founders — with version facts that update themselves.
updated: 2026-06-10
programs: [cloudways, kinsta]
pulse: [next, astro, node]
---

Ask Claude Code, Cursor, Lovable, or Bolt to "build me a website" and the
framework it picks will usually be one of two: **Next.js** or **Astro**. You
don't have to understand either to ship — but knowing which one your AI is
using (and why) helps you ask for the right things and avoid paying for
hosting you don't need.

A note on freshness: the version numbers on this page come from **live data**
(see the panel above) — they're re-checked every hour, not typed in by a
writer and left to rot. As of the last check, Next.js is at
**v{{pulse:next.version}}** (released {{pulse:next.ago}}) and Astro is at
**v{{pulse:astro.version}}** (released {{pulse:astro.ago}}), both running on
Node.js **v{{pulse:node.version}}**.

## The one-paragraph difference

**Astro builds pages that are finished before anyone visits.** Your content
is baked into plain, fast files — ideal for sites that mostly *say things*:
marketing pages, portfolios, local-business sites, blogs.

**Next.js builds pages that can think when someone visits.** It runs code per
visitor — ideal for sites that mostly *do things*: logins, dashboards,
payments, anything personalized.

## What this means for your hosting bill

| | Astro (static) | Next.js (dynamic) |
|---|---|---|
| Typical site | brochure, blog, portfolio | app, SaaS, member area |
| Hosting needed | any static host — often free tiers | a Node server or a platform that runs one |
| Monthly cost floor | $0 is realistic | usually $10–30+ once real traffic arrives |
| Speed out of the box | extremely fast by default | fast, but depends on how it's built |
| When it breaks | rarely — nothing is running | like any running software — needs updates |

The practical rule: **if your site doesn't log anyone in, you probably want
the static path** — and the savings are real. If it does (or will), a small
managed host beats wrestling servers yourself: that's the territory of
[Cloudways](/go/cloudways) and [Kinsta](/go/kinsta), which exist precisely so
a non-technical owner never SSHes into anything.

## What we actually run

In the spirit of this site's repo-as-proof rule: **solostackmethod.io itself
runs Next.js 14** — it has interactive features (the Build wizard, live tool
data) that static files can't do. Our free
[starter template](https://github.com/brynr-builds/solo-stack-starter) — the
one the Build flow creates for you — is the opposite: plain static files, no
framework at all, because a first website should be free to host and
impossible to break. Both choices are deliberate; neither is "better" — they
match the job.

## How to direct your AI

You don't need to pick the framework — you need to state the job. Say one of
these to your AI tool, verbatim:

- *"This is a content site: no logins, no user accounts. Prefer a static
  build I can host for free."* → it will reach for Astro or plain files.
- *"This site will have user accounts and a dashboard."* → it will reach for
  Next.js, and you should budget for real hosting from day one.

## Bottom line

- **Choosing for a brochure/portfolio/local-business site:** static (Astro or
  plainer). Free hosting, nothing to maintain.
- **Choosing for an app:** Next.js — currently v{{pulse:next.version}} — and
  pair it with managed hosting so updates and scaling are someone else's job.
- **Not sure?** Start static. Moving up later is a rebuild your AI can do in
  an afternoon; paying app-hosting prices for a brochure site is just a leak.
