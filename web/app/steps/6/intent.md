# Step 6: Final Audit (ChatGPT)

## Goal
Independent verification by a different AI agent (separation of duties).

## Constraints
- Builder (Claude) ≠ Auditor (ChatGPT)
- Audit must cite evidence (diffs, file lists, etc.)
- No approval without evidence
- Audit checks: contract compliance, scope compliance, overbuild check
- Auditor can request changes or approve

## Success Definition
- Audit packet is complete and provided to ChatGPT
- ChatGPT reviews all changes
- Verdict is documented: Approve or Changes Requested
- If changes requested, loop back to Step 4
- If approved, proceed to deploy

## What Must NOT Happen
- Do not self-approve (builder cannot audit own work)
- Do not approve without reviewing diffs
- Do not skip the audit step
- Do not merge without auditor approval
- Do not ignore auditor feedback

## Compatibility
- Audit reviews all changes from Steps 4-5
- Must verify compatibility confirmations
- Must check for overbuild against Step 3 context
