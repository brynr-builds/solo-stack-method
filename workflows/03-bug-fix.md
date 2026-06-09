# 03 — Bug Fix

> *Governed by `AI_CONTRACT.md`.*

1. **Reproduce first.** Confirm the bug with a failing test or exact repro steps. No repro → don't
   guess (the Not-Psychic Rule); ask for steps.
2. **Branch.** `git checkout -b fix/<description>`.
3. **Write a failing test** that captures the bug (where practical). It's your proof of the fix and
   your regression guard.
4. **Smallest fix that makes the test pass.** Resist scope creep — unrelated cleanup goes in a
   separate `chore/` branch. Add an `// INTENT:` note if the fix is non-obvious.
5. **Deterministic gates:** the new test passes, the suite stays green, lint/typecheck clean.
6. **Audit by risk tier** (auth/security/data fixes → independent audit + human sign-off).
7. **PR** with: what was broken, the root cause, the fix, and how it's now prevented.
