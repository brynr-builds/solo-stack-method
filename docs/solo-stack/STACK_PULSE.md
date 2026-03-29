# Stack Pulse — Heartbeat Monitoring

> *Governed by AI_CONTRACT.md; contract takes precedence.*
>
> **Purpose:** Provide real-time visibility into what the AI is doing, teaching the user the Software Development Life Cycle (SDLC) through visual feedback.

---

## How It Works

The file `pulse.json` in the repo root is updated after every major task. It acts as a heartbeat — a single place to check what the stack is doing right now.

---

## Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| green | **Ready** | Stack is idle, waiting for input |
| yellow | **Thinking** | AI is architecting or planning |
| blue | **Building** | AI is executing code changes |
| red | **Blocker** | An error occurred — the Support Agent is triggered |

---

## pulse.json Schema

```json
{
  "status": "ready | thinking | building | blocker",
  "status_label": "Human-readable status",
  "status_icon": "green | yellow | blue | red",
  "last_task": "Description of the last completed or in-progress task",
  "last_agent": "Which agent is active (architect | artisan | mentor | system)",
  "timestamp": "ISO 8601 timestamp of last update",
  "session_start": "ISO 8601 timestamp of when this session started",
  "tasks_completed": 0,
  "errors_encountered": 0,
  "notes": "Optional context or blockers"
}
```

---

## When to Update

AI agents **must** update `pulse.json`:
- When starting a new task (status: thinking)
- When beginning code execution (status: building)
- When a task completes successfully (status: ready, increment tasks_completed)
- When an error occurs (status: blocker, increment errors_encountered)
- At minimum every 60 seconds during active work

---

## Learning Objective

By watching the pulse, the user learns the natural phases of software development:
1. **Planning** (thinking) — before code, there is design
2. **Building** (building) — execution follows planning
3. **Idle** (ready) — work completes in cycles
4. **Troubleshooting** (blocker) — errors are normal and resolvable

This mirrors the real SDLC: Plan, Build, Test, Deploy, Monitor.

---

*Part of Solo Stack Method V2: The Builder's OS*
