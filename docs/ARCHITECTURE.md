# ARCHITECTURE.md — Solo Stack Method™

> Skeleton only. Expand incrementally as the system evolves.

---

## System Purpose

Solo Stack Method™ is a governance framework and automation system for solo developers working with AI agents. It provides contract-based rules, workflow templates, agent role management, and drift-prevention tooling to keep codebases safe under multi-agent development.

---

## Entry Points

| Entry Point | Description |
|-------------|-------------|
| `AI_CONTRACT.md` | Supreme governance document — all agents read this first |
| `AI_README.md` | Agent orientation — quick reference to structure and rules |
| `AGENTS.md` | Execution-layer rules for AI agents (Three-Gate workflow, drift guards) |
| `.cursor/rules/governance.mdc` | Cursor-specific enforcement of execution rules |

---

## Key Flows

### 1. New Change Flow
```
Human request
  → Agent reads AI_CONTRACT.md + AGENTS.md
  → Gate 1: Brief (goal, files, risks, verify, rollback)
  → Gate 2: Execute (minimal diff, preserve behavior)
  → Gate 3: Verify (commands, results, behavior delta)
  → Branch + PR
  → Dual Audit (Builder self-audit → Final Auditor review)
  → Merge to main
```

### 2. Stabilization Pass Flow (Cursor)
```
Cursor reads CURSOR_RULES.md + .cursor/rules/governance.mdc
  → Summarize existing intent
  → Small refactors preserving behavior
  → Lint / format / type tightening
  → Report: what changed, why, what could break, how to undo
```

### 3. Agent Capability Pulse (Weekly)
```
Review agent performance signals
  → Check official model updates
  → Update confidence scores in agents/agent-profiles.yaml
  → Adjust role assignments (human approval required)
```

---

## Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| GitHub Actions | Active | Stack Pulse cron workflows in `.github/workflows/` |
| Supabase | Schema defined | See `SUPABASE_MIGRATION.sql` |
| External tool feeds | Planned | Stack Pulse ingestion pipeline |

---

## Deployment Notes

- **Main branch = production state.** No direct commits to main.
- All changes flow through branches and pull requests per AI_CONTRACT.md.
- GitHub is the execution environment for production changes.
- Replit is allowed only for teaching/prototyping (see AI_CONTRACT.md: Replit Usage Policy).

---

*Skeleton created 2025-02-07. Expand as architecture solidifies.*
