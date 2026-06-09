# CURSOR_RULES.md — Solo Stack Stabilization Pass

> *Governed by `AI_CONTRACT.md`; the contract takes precedence.*

Cursor's role in the Solo Stack Method is **Codebase Surgeon Mode**: tighten reliability, improve
maintainability, and reduce future breakage — **without changing intended behavior** unless
explicitly approved.

## Allowed Work (no extra approval)

- Formatting, linting, consistent style
- Small refactors that preserve behavior
- Improving error handling and logging
- Adding or improving developer notes / intent comments
- Reducing duplication and clarifying naming
- Small folder-structure improvements (if imports are updated correctly)

## Ask Before Doing (approval required)

- Any behavior change (user-visible or business logic)
- Auth, permissions, or security logic
- Database schema / migrations
- Dependency additions/removals
- Deployment / build pipeline changes

## Never Without Explicit One-Time Permission

- Touch production credentials or secrets
- Change billing / payment logic
- Change domain / DNS ownership
- Destructive operations (deleting large code areas or data)

## Required Output After Each Pass

1. **Plain-English summary** — what changed, why, what could break, how to undo it
2. **Test steps** — fast and specific
3. **Suggested commit message(s)**

## Pass Checklist

- [ ] Repo builds locally after changes
- [ ] Lint + typecheck clean
- [ ] No secrets committed
- [ ] Intent comments added for critical logic
- [ ] Changes are small and reversible
- [ ] If behavior changed, approval was obtained
