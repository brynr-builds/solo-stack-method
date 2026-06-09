# ADR-0001 — Independent, cross-provider audit for non-trivial changes

**Status:** accepted
**Date:** 2026-06-09

## Context
AI agents writing code exhibit **self-attribution bias** — they rate their own output as more
correct than it is — so an agent reviewing its own work is a weak control. Single-model self-review
also shares the model's blind spots. At the same time, two models trained on similar data can agree
on the *same wrong answer* ("consensus is not verification"), and a full review pass on every trivial
change is friction a solo builder won't sustain.

## Decision
For non-trivial changes, the agent that **builds** is never the **final approver**. An independent
agent audits — preferably from a **different provider** (different training data → different blind
spots) — running in an isolated subagent context. The audit runs **after deterministic gates**
(tests, lint/typecheck, secret/dependency scans) pass; LLM agreement is layered on top of, not in
place of, machines that don't have an opinion. Rigor is **risk-tiered**: lightweight for
docs/refactors, full audit packet + human sign-off for schema/auth/billing/security.

## Consequences
- Positive: catches a meaningfully different class of bugs than self-review; keeps a human in the
  loop exactly where stakes are highest; sustainable because trivial work isn't over-audited.
- Negative / trade-offs: cross-provider review adds cost and latency; the "popularity trap" (similar
  models agreeing) is mitigated but not eliminated — which is why deterministic gates come first.

## Alternatives considered
- **Single-model self-review** — cheapest, but biased and blind-spot-sharing. Rejected as the primary control.
- **Same-provider second pass** — better than self-review, weaker on independence. Allowed only when a
  cross-provider auditor isn't available.
- **Humans review everything** — doesn't scale for a solo builder; reserved for the top risk tier.
