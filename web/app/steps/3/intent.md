# Step 3: Create Context Anchors

## Goal
Establish explicit context documents that AI agents and human auditors can reference.

## Constraints
- Context must be human-readable
- Context must be diffable (version-controlled)
- Context must be auditable
- No hidden context — everything explicit in repo
- Context changes must be logged

## Success Definition
- Project has clear intent documentation
- Key decisions are recorded with rationale
- AI agents can understand project scope from repo alone
- Context is sufficient for handoff to another developer

## What Must NOT Happen
- Do not rely on chat history as context
- Do not keep context outside the repo
- Do not make implicit assumptions
- Do not skip documentation for "obvious" decisions
- Do not create context that contradicts code

## Compatibility
- Context anchors are referenced by Steps 4-7
- Must align with repo structure from Step 1
- Must reflect tech stack decisions from Step 2
