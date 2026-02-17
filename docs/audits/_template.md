# Audit Report: [PR Title or Branch Name]

> **Governed by AI_CONTRACT.md; contract takes precedence.**

**Auditor:** [Agent name]
**Date:** [ISO 8601]
**PR/Branch:** [link or branch name]
**Risk Level:** L0 | L1 | L2 | L3

---

## Context

[1-2 sentences: what was built and why.]

---

## Correctness Findings

- [ ] Logic matches spec
- [ ] Edge cases handled
- [ ] No regressions introduced

**Notes:** [Details or "No issues found."]

## Security Findings

- [ ] No secrets committed
- [ ] No new attack vectors (XSS, injection, CSRF)
- [ ] Auth/permissions unchanged or documented
- [ ] No PII exposure

**Notes:** [Details or "No issues found."]

## Spec Mismatches

- [ ] Implementation matches accepted spec

**Notes:** [List deviations or "None."]

## Test Gaps

- [ ] Unit tests cover new logic
- [ ] Integration tests cover boundaries
- [ ] Manual verification steps documented

**Notes:** [List gaps or "Coverage adequate."]

## Performance Concerns

- [ ] No N+1 queries introduced
- [ ] No unbounded loops or memory growth
- [ ] No blocking calls on hot paths

**Notes:** [Details or "No concerns."]

---

## Recommendation

**Verdict:** Ship | No-Ship | Ship with Required Fixes

## Required Fixes (if any)

- [ ] [Fix 1]
- [ ] [Fix 2]

---

*Generated from `docs/audits/_template.md`*
