# Solo-Stack Loop (vNext) — Agent-Assisted Workflow

> **Governed by AI_CONTRACT.md; contract takes precedence.**
>
> **Intent (Dev Notes):**
> This document defines an optional workflow variant ("vNext") that introduces autonomous agents and Cursor as first-class participants in the Solo Stack development loop. It extends — but does not replace — the existing Dual Audit Loop and Scoped Approval Gateway.

---

## Status

**Optional workflow variant.** Teams and solo developers may adopt this loop when working with autonomous agents (Devin, Codex, Sweep, etc.) alongside Cursor and the existing Claude/ChatGPT audit chain.

All rules in `AI_CONTRACT.md` remain in effect. Where this document is silent, the contract governs.

---

## Roles and Responsibilities

| Role | Assigned To | Responsibility |
|------|-------------|----------------|
| **Orchestrator** | Human | Owns intent, priorities, and final merge authority. Approves all risk-level gates. |
| **Architect** | ChatGPT | Designs specs, defines scope, reviews architecture. Serves as **Final Auditor** per contract. |
| **Implementer + Integrator of Record** | Cursor | Anchors architecture in code. Creates feature branches, integrates agent output, runs stabilization passes. |
| **Contract Dev Team** | Autonomous Agents | Execute bounded Task Packs. No architectural decisions. Work only within scoped branches. |
| **Intermediate Auditor** | Claude | Reviews agent output for correctness, security, and spec compliance before Cursor integration. |
| **Release Manager** | CI/CD | Enforces lint, test, build, and deployment gates. |

### Contract Compatibility Note

Per `AI_CONTRACT.md` §Dual Audit Loop:

- **Builder** and **Final Auditor** must be different agents.
- Default Builder: Claude. Default Final Auditor: ChatGPT.

In the vNext loop, autonomous agents and Cursor share the Builder role, Claude performs an intermediate audit, and **ChatGPT remains the required Final Auditor** for all non-trivial PRs. The Dual Audit Loop independence requirement is preserved: the intermediate auditor (Claude) is not the same entity as the Final Auditor (ChatGPT).

**Role assignment note:** The contract's default Builder is Claude. This workflow reassigns Claude to Intermediate Auditor and distributes Builder work to Cursor and autonomous agents. Per `AI_CONTRACT.md` §Dynamic Role Assignment, this change requires human approval. Adopting vNext constitutes that approval. If roles are later adjusted via the weekly Agent Capability Pulse, update this workflow accordingly.

---

## The Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLO-STACK LOOP (vNext)                       │
│                                                                 │
│  Human          ChatGPT        Cursor       Agent       Claude  │
│    │               │              │            │           │    │
│    ├─ intent ─────►│              │            │           │    │
│    │               ├─ spec ──────►│            │           │    │
│    │               │              ├─ anchor ──►│           │    │
│    │               │              │  (branch)  │           │    │
│    │               │              │            ├─ code ───►│    │
│    │               │              │            │  (task    │    │
│    │               │              │            │   pack)   │    │
│    │               │              │            │           │    │
│    │               │              │◄── audit pass ────────┤    │
│    │               │              ├─ integrate │           │    │
│    │               │              │            │           │    │
│    │               ◄── PR + audit packet ─────┤           │    │
│    │               ├─ final audit ►           │           │    │
│    │◄── approve ───┤              │            │           │    │
│    │               │              ├─ merge ───►│  main     │    │
│    │               │              │            │           │    │
│    │               │       CI/CD runs gates    │           │    │
└─────────────────────────────────────────────────────────────────┘
```

**Sequence:**

1. **Human** defines intent and acceptance criteria.
2. **ChatGPT** (Architect) produces a spec (`docs/specs/`).
3. **Cursor** creates the anchor branch (`feature/<name>-anchor`) and scaffolds architecture.
4. **Cursor** writes Task Packs (`docs/task-packs/`) scoping agent work.
5. **Agents** execute Task Packs on scoped branches (`feature/<name>-tasks/<task#>`).
6. **Claude** (Intermediate Auditor) reviews agent output against spec and contract.
7. **Cursor** integrates audited work into the anchor branch.
8. **Builder Self-Audit** generated (Prompt v1.5).
9. **ChatGPT** (Final Auditor) performs Final Audit (Prompt v2).
10. **Human** approves merge. CI/CD runs gates. Merge to `main`.

This loop is **iterative**. Steps 4–7 repeat for each Task Pack. The Dual Audit Loop (steps 8–9) runs once per PR, after all task work is integrated.

---

## Cursor → Agent Handoff: Task Packs

**Do not hand partial code to agents. Hand a bounded Task Pack (SOW).**

A Task Pack is the formal handoff artifact between Cursor and an autonomous agent. It defines:

- What the agent must build
- Where it may work (allowed paths/files)
- What it must not change
- How to verify completion

See `docs/task-packs/_template.md` for the standard format.

### Rules

1. **Cursor anchors architecture; agents expand within bounds.** Agents never make architectural decisions.
2. **One Task Pack = one scoped unit of work.** Keep packs small and independently verifiable.
3. **Agents must not modify files outside the Task Pack scope.** Violations require re-review.
4. **Every Task Pack specifies a risk level (L0–L3)** and corresponding gates.

---

## Risk Levels and Gates

Risk levels provide an additional lens for scoping agent work. They **do not replace** the Scoped Approval Gateway or "Ask Before Modifying" / "Never Touch" rules in `AI_CONTRACT.md`. All existing contract rules remain in full effect.

### Level Definitions

| Level | Name | Description | Examples |
|-------|------|-------------|----------|
| **L0** | Safe | Docs, comments, dev notes, formatting. No behavior change. | README updates, intent comments, markdown templates |
| **L1** | Moderate | New code in isolated modules. No shared state or external boundaries. | New utility function, new test file, new UI component (no API calls) |
| **L2** | High | Touches shared state, APIs, integrations, or existing behavior. | API route changes, database queries, auth-adjacent logic |
| **L3** | Critical | Schema changes, auth/permissions, billing, deployment, data migrations. | DB migrations, auth flow changes, payment logic |

### Gate Requirements

| Level | Intermediate Audit (Claude) | Final Audit (ChatGPT) | Human Approval | CI Must Pass |
|-------|----------------------------|----------------------|----------------|-------------|
| **L0** | Optional | Optional (trivial changes may skip per contract) | Not required | Yes |
| **L1** | Required | Required | Not required | Yes |
| **L2** | Required | Required | Required | Yes |
| **L3** | Required | Required | Required + explicit one-time permission | Yes |

### Interaction with Existing Rules

- **"Ask Before Modifying"** paths (`/src/`, `/app/`, `/lib/`, schemas, auth, deploy configs, API routes, env vars) are automatically **L2 or higher**.
- **"Never Touch"** items (production credentials, billing, DNS, destructive DB ops, API keys, user data) are automatically **L3** and require explicit one-time permission per `AI_CONTRACT.md`.
- Risk levels are assigned **per Task Pack**, not per file. If any file in a Task Pack triggers a higher level, the entire pack inherits that level.

---

## Two-Branch Pattern (Optional)

For agent-assisted features, use a two-tier branching strategy:

```
main
 └── feature/<name>-anchor          ← Cursor owns this branch
      ├── feature/<name>-tasks/01   ← Agent works here (Task Pack 1)
      ├── feature/<name>-tasks/02   ← Agent works here (Task Pack 2)
      └── feature/<name>-tasks/03   ← Agent works here (Task Pack 3)
```

### Rules

1. **Cursor creates the anchor branch** from `main` and scaffolds architecture.
2. **Each Task Pack gets its own sub-branch** off the anchor.
3. **Agents commit only to their assigned task branch.**
4. **Merge into anchor only after intermediate audit passes.**
5. **PR to `main` only from the anchor branch**, after all task branches are integrated and Final Audit passes.

This pattern preserves `main` stability and gives Cursor full control over integration sequencing.

---

## Templates

| Template | Location | Purpose |
|----------|----------|---------|
| Spec | `docs/specs/_template.md` | Feature specification |
| Audit | `docs/audits/_template.md` | Audit findings report |
| Task Pack | `docs/task-packs/_template.md` | Cursor → Agent handoff artifact |

---

## Related Files

- `AI_CONTRACT.md` — Supreme governance document
- `docs/branching-and-prs.md` — Branch and PR protocol
- `workflows/00-solo-stack-overview.md` — System overview
- `PROMPTS/generate-audit-packet.md` — Audit packet generator

---

*Governed by AI_CONTRACT.md; contract takes precedence.*
