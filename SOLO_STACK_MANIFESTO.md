# Solo Stack Manifesto

> *One builder. AI agents that do the work. One system of truth they can't drift from.*

---

## The Problem

Building with AI is fast — and easy to lose control of. You ship something that works, then come
back a week later and can't remember why it works. The AI doesn't know your codebase, your
decisions, or your constraints, so every session starts from zero. Prototypes pile up that no
real developer would touch. The industry has a name for it now: **comprehension debt** — owning a
codebase you can't explain, with a *bus factor of zero*.

**The result:** software you can't maintain, can't hand off, and can't trust.

---

## The Solution: the Solo Stack Method

Solo developers and non-technical builders deserve the same operational rigor as a real team —
without the overhead. The Method is a small set of rules that keep AI agents productive *and*
accountable, so what you ship stays yours to understand.

### Core Principles

**1. Repo-as-Truth™**
Everything important lives in the repository, where any agent (or future-you) can find it —
decisions, context, the rules agents must follow. If it only exists in a chat window, it doesn't
exist. *(In 2026 this means a real `AGENTS.md` at the repo root — the open standard every agent
reads — not context trapped in a prompt.)*

**2. Explainability Before Execution**
Before any significant action, the agent states — in plain English — **what** it's about to do,
**why**, **what could break**, and **how to undo it**. Plan first; act second.

**3. Intent-Preserving Code**
Code without context is a liability. Non-trivial logic gets a short note on *why* it exists; load-
bearing architectural decisions get a lightweight decision record (ADR).

**4. Workflow Understanding Over Code Understanding**
An agent should understand *how the work flows* before it touches a line of code. Orientation
before edits.

**5. The Not-Psychic Rule**
Never guess. If the file to change, the intent, the safety of a change, or anything about
credentials is unclear — stop and ask. Missing context, not model intelligence, is the number-one
cause of bad AI output.

**6. Scoped Approval Gateway**
Not all changes are equal. Define the boundaries once — what's always allowed, what needs a check,
what's never touched without explicit permission — and enforce them in config, not vibes.

---

## The Audit Loop

For anything non-trivial, the agent that *builds* a change is not the agent that *approves* it.
A second, independent reviewer audits for correctness, security, and intent — backed by
deterministic gates (tests, linters, secret scans) that don't have an opinion. One model's blind
spots are another's easy catch. *Your AI builds. A second AI audits. You stay in control.*

---

## Exit-Ready by Default

The test that matters: **if a real dev team took over your project tomorrow, could they — without
calling you?** When the repo is the truth, intent is documented, and every change has an audit
trail, the answer is yes. You're not just shipping apps; you're building software someone could buy.

---

## Stack Pulse

Your tools change constantly. **Stack Pulse** tracks the ones you actually use and surfaces only
what matters — critical updates, new releases, status changes — so a dependency never breaks your
project by surprise.

---

## Start Here

1. Read [`AGENTS.md`](AGENTS.md) — the orientation every agent reads first
2. Read [`AI_CONTRACT.md`](AI_CONTRACT.md) — the binding rules that govern all AI work
3. Browse [`workflows/`](workflows/) — step-by-step guides for common tasks
4. Set up Stack Pulse — never miss a critical tool update

---

*The Solo Stack Method — built for builders who ship alone but refuse to move slow.*
