# CURSOR_RULES.md — Solo Stack Cursor Stabilization Pass

> *Governed by AI_CONTRACT.md; contract takes precedence.*
>
> Cursor's role in Solo Stack is **Codebase Surgeon Mode**:
> - tighten reliability
> - - improve maintainability
>   - - reduce future breakage
>     - - WITHOUT changing intended behavior unless explicitly approved
>      
>       - ---
>
> ## Allowed Work (No extra approval required)
>
> - Formatting, linting, and consistent style
> - - Small refactors that preserve behavior
>   - - Improving error handling and logging
>     - - Adding or improving developer notes / intent comments
>       - - Reducing duplication and clarifying naming
>         - - Improving folder structure (small moves) if imports are updated correctly
>          
>           - ---
>
> ## Ask Before Doing (Approval required)
>
> - Any behavior change (user-visible or business logic)
> - - Auth, permissions, or security logic changes
>   - - Database schema/migrations changes
>     - - Dependency additions/removals
>       - - Deployment/build pipeline changes
>        
>         - ---
>
> ## Never Do Without Explicit One-Time Permission
>
> - Touch production credentials or secrets
> - - Change billing/payment logic
>   - - Change domain/DNS ownership
>     - - Destructive operations (deletes of large code areas or data)
>      
>       - ---
>
> ## Required Output After Each Cursor Pass
>
> 1) Plain-English summary:
> 2)    - what changed
>       -    - why it changed
>            -    - what could break
>                 -    - how to undo it
>                  
>                      - 2) Test steps (fast + specific)
>                       
>                        3) 3) Suggested commit message(s)
>                          
>                           4) ---
>                          
>                           5) ## Cursor Pass Checklist
>                          
>                           6) - [ ] Repo builds locally (or in Replit) after changes
> - [ ] No secrets committed
> - [ ] - [ ] Intent comments added for critical logic
> - [ ] - [ ] Changes are small + reversible
> - [ ] - [ ] If behavior changed, approval was obtained
