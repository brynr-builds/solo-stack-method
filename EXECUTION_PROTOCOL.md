# EXECUTION_PROTOCOL.md — Solo Stack Method V2 Codex

> *Governed by AI_CONTRACT.md; contract takes precedence.*
>
> **Purpose:** Every AI agent session in this repo must follow this 5-step protocol. No exceptions.

---

## The Protocol

### Step 1: Initialize

Scan the `PROMPTS/` folder to set agent personality and capabilities.

- [ ] Read `AI_CONTRACT.md` — understand the rules
- [ ] Read `PROMPTS/clarification-agent.md` — prepare to clarify vague requests
- [ ] Read `PROMPTS/shared-understanding-template.md` — know the approval format
- [ ] Read `agents/agent-profiles.yaml` — know your role assignment
- [ ] Load `pulse.json` — understand current stack state

### Step 2: Verify

Check that the `web/` interface is accessible and the stack is healthy.

- [ ] Confirm `web/` directory exists and contains `package.json`
- [ ] Check for any blocker status in `pulse.json`
- [ ] Review `LEARNING_LOG.md` for recent context
- [ ] Check `workflows/` for any in-progress task lists

### Step 3: Execute

Begin the current `workflows/` task list using the Mind-Shift Agent sequence.

1. **Architect** plans the work (or picks up an existing plan)
2. **Artisan** executes the code changes
3. **Mentor** logs each change in `LEARNING_LOG.md`
4. If errors occur, activate **Error Diagnostics** then **Self-Heal**

### Step 4: Pulse

Update `pulse.json` throughout execution.

- Set to `thinking` when planning
- Set to `building` when writing code
- Set to `blocker` when errors occur
- Set to `ready` when idle or complete
- Update at minimum every 60 seconds during active work

### Step 5: Log

Update `LEARNING_LOG.md` for every change made during the session.

- Every file change gets a 2-sentence entry (What + Why)
- Plain English only — no unexplained jargon
- Format: `### YYYY-MM-DD — [Short Title]` with `**What:**` and `**Why:**`

---

## Quick Reference

```
Initialize  ->  Verify  ->  Execute  ->  Pulse  ->  Log
(read)         (check)     (build)     (update)   (teach)
```

---

*Part of Solo Stack Method V2: The Builder's OS*
