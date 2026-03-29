# Error Handling — The Safety Net

> *Governed by AI_CONTRACT.md; contract takes precedence.*
>
> **Purpose:** Ensure errors never leave the user confused or stuck. Every error is explained in plain English with a clear path forward.

---

## How It Works

When an error occurs during any Solo Stack operation:

```
Error Occurs
    |
    v
Artisan sets pulse.json -> "blocker"
    |
    v
Error Diagnostics Agent activates
    |
    v
Translates error to plain English
    |
    v
Is it auto-fixable?
   / \
  Y   N
  |   |
  v   v
Self-Heal    Escalate to User
  |          (plain English + options)
  v
Fixed?
 / \
Y   N
|   |
v   v
Resume  Escalate to User
```

---

## Plain English Diagnostics

Every error message follows this format:

> "I tried to **[ACTION]**, but **[PROBLEM]**. Should I **[SUGGESTED FIX]**?"

The user never sees raw stack traces, terminal output, or error codes unless they explicitly ask.

---

## Self-Heal Routine

The Self-Heal agent can automatically fix:
- Syntax errors (missing brackets, typos)
- Import/export mismatches
- Type annotation issues
- Config/env reference problems
- Missing dependencies

It will **not** attempt to fix:
- Business logic errors
- Authentication/credential issues
- Data or database problems
- External service failures

Maximum of 2 auto-fix attempts before escalating.

---

## Learning Objective

Users learn that errors are a **normal part of building software** — not a sign of failure. The pattern of "diagnose, attempt fix, escalate if needed" is the same process professional developers follow.

---

*Part of Solo Stack Method V2: The Builder's OS*
