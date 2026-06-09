---
title: Where to Deploy an App You Built with AI (Claude Code, Lovable, Bolt, Cursor)
description: You used AI to build something real. Now where does it actually live? A plain-English guide to hosting an AI-built app — from static sites to full-stack — without a DevOps background.
updated: 2026-06-08
author: Solo Stack Method
programs:
  - cloudways
  - kinsta
  - bluehost
  - webflow
---

The AI wrote the code. That was the easy part. The question nobody answers cleanly: **where does
this thing actually go so other people can use it?**

This is the gap we see most often with people who build using Claude Code, Lovable, Bolt, Cursor,
or v0. The build feels like magic; deployment feels like hitting a wall in a language you don't
speak. Here's the map, in plain English, matched to what you actually built.

## First, figure out what you actually built

Three honest buckets:

1. **A static site or landing page** (HTML/CSS, or a no-code export) — no server, no database.
2. **A web app with a backend** (Next.js, a Node/Python API, user accounts, a database).
3. **A WordPress or content site** you want to own and scale.

Where it goes depends entirely on which bucket you're in. Most "where do I deploy this" confusion
is just people in bucket 2 reading advice written for bucket 1.

## If you built a static site or landing page

You don't need much, and you shouldn't overpay. Free tiers (Netlify, Vercel, Cloudflare Pages)
handle this beautifully. If you built it in a visual tool and want a *real, ownable* site you can
keep editing without code, **Webflow** is the grown-up option — it exports clean and won't trap you.

**Skip the heavy hosting here.** A static page on a $20/mo managed host is money lit on fire.

## If you built a full-stack app (the common case)

This is where AI-built projects usually land: a Next.js app, an API, a database, real users. You need
a host that runs a server and a database without making you a sysadmin.

- **Cloudways** is our default recommendation for this person. It's managed cloud hosting — you get
  the power of a real server (DigitalOcean/Vultr/AWS under the hood) with a dashboard instead of a
  terminal. You can deploy an app, attach a database, and not learn Linux. This is the sweet spot for
  "I built something real with AI and need it to just run."
- **Kinsta** is the premium step up — application + database hosting with excellent performance and
  support. Worth it when the project is making money and downtime costs you.

The thing to avoid: cheap shared hosting that *says* it supports Node but throttles it into
uselessness. If your app has a backend, host it somewhere built for backends.

## If you built (or want) a WordPress/content site

For a content site, blog, or a WordPress build, **Bluehost** is the easiest on-ramp (cheap, one-click
WordPress, forgiving for beginners), and **Cloudways** or **Kinsta** are where you go when traffic
grows and the cheap host starts straining.

## The honest decision tree

- Static page, no backend → **free tier**, or **Webflow** if you want an ownable visual site.
- Full-stack app, first deploy, no DevOps → **Cloudways.**
- Full-stack app that's earning and needs to be bulletproof → **Kinsta.**
- WordPress/blog, just starting → **Bluehost**, graduate to **Cloudways** later.

## One thing the AI won't tell you

Wherever you deploy, put your environment secrets in the host's settings — never in the code the AI
generated, and never committed to your repo. AI tools cheerfully hardcode API keys; that's the single
most common way an AI-built app gets compromised on day one. (This is exactly the kind of thing the
[Solo Stack Method](/) governance workflow is built to catch.)

> Compare full hosting terms and where each ranks in [The Stack](/tools).
