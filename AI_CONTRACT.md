# AI_CONTRACT.md — Solo Stack Method™

> **Governed by this contract. This document takes precedence over all other instructions in this repository.**
>
> This contract defines how AI agents must operate within this codebase. Any AI (Claude, GPT, Copilot, Cursor, etc.) working in this repo MUST follow these rules.
>
> ---
>
> ## Core Principles
>
> ### 1. Repo-as-Truth™
> Everything important must live in the repository. No "it's in chat only" — if it matters, commit it.
>
> - Documentation belongs in `/docs/` or `/workflows/`
> - - Prompts belong in `/PROMPTS/`
>   - - Code changes require commits with clear messages
>     - - Decisions should be documented, not just discussed
>      
>       - ### 2. Explainability Before Execution™
>       - Before any major action, explain in plain English:
>       - - **What** you're about to do
>         - - **Why** you're doing it
>           - - **What could break**
>             - - **How to undo it**
>              
>               - ### 3. Intent-Preserving Code™
>               - Add developer notes explaining the intent for any non-trivial logic.
>              
>               - ```javascript
>                 // INTENT: This retry logic exists because the API is flaky during high traffic.
>                 // It retries 3 times with exponential backoff before failing gracefully.
>                 ```
>
> ### 4. Workflow Understanding Over Code Understanding™
> Understanding the workflows (how work flows through the system) is more important than understanding every line of code. Start with `/workflows/` before diving into `/src/`.
>
> ### 5. The Not-Psychic Rule™
> If anything is ambiguous, **stop and ask**. Never guess on:
> - Which file to modify
> - - What the user actually wants
>   - - Whether a change is safe
>     - - Credentials, keys, or sensitive data
>      
>       - ---
>
> ## Scoped Approval Gateway™
>
> ### Always Allowed (No Approval Needed)
> - `/workflows/` — workflow documentation
> - - `/docs/` — documentation
>   - - `/PROMPTS/` — prompt templates
>     - - Markdown files (`.md`)
>       - - Diagrams and images
>         - - Comments and developer notes
>          
>           - ### Ask Before Modifying
>           - - Application code (`/src/`, `/app/`, `/lib/`)
>             - - Database schema or migrations
>               - - Authentication/authorization logic
>                 - - Deployment configurations
>                   - - API routes and endpoints
>                     - - Environment variable structure
>                      
>                       - ### Never Touch Without Explicit One-Time Permission
>                       - - Production credentials or secrets
>                         - - Billing or payment logic
>                           - - Domain/DNS ownership
>                             - - Destructive database operations (DROP, TRUNCATE, DELETE *)
>                               - - Third-party API keys
>                                 - - User data in production
>                                  
>                                   - ---
>
> ## Cursor Usage (Codebase Surgeon Mode)
>
> Cursor is an approved tool for a **Stabilization Pass** after features/bug fixes, to improve code quality and reduce future breakage.
>
> **Allowed:**
> - Small refactors that preserve behavior
> - - Lint/format/type tightening
>   - - Improved error handling and logs
>     - - Adding intent-preserving developer notes
>      
>       - **Rules:**
>       - - Cursor edits MUST preserve documented intent
>         - - If the change affects behavior, auth, permissions, database schema, or deployment, the AI MUST ask for approval first
>           - - Prefer small commits or a PR with a clear summary
>             - - After changes, provide:
>               -   - Plain-English explanation
>                   -   - Test steps
>                       -   - Rollback instructions
>                        
>                           - ```mermaid
>                             flowchart LR
>                               A[Changes implemented + tested] --> B[Cursor Stabilization Pass]
>                               B --> C[Plain-English summary + tests]
>                               C --> D[Commit / PR to GitHub]
>                             ```
>
> ---
>
> ## Commit Message Format
>
> Use clear, conventional commit messages:
>
> ```
> type: short description
>
> - Detailed change 1
> - Detailed change 2
>
> INTENT: Why this change was made
> ```
>
> Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
>
> ---
>
> ## When In Doubt
>
> 1. Read this contract first
> 2. 2. Check `/workflows/` for relevant process
>    3. 3. Ask the human if still unclear
>       4. 4. Document your decision
>         
>          5. ---
>         
>          6. *Last updated: This version is the canonical source.*
