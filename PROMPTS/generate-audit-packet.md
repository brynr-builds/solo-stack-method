# Generate Audit Packet

> **Intent (Dev Notes):**  
> This prompt template standardizes the Audit Packet format for all PRs requiring dual audit.  
> The Audit Packet is the evidence package that enables both Builder and Final Auditor to make informed decisions.

---

## Instructions

Before opening a PR that requires dual audit, generate an Audit Packet using this template.

**When to generate:**
- All non-trivial code changes
- Schema or database modifications
- Configuration changes
- Workflow or process changes
- Any change that could affect production

**When NOT needed:**
- Typo fixes in documentation
- README updates
- Comment-only changes

---

## Audit Packet Template

```markdown
# Audit Packet: [PR Title]

**Generated:** [ISO 8601 timestamp]
**Builder:** [Agent name]
**Branch:** [branch name]
**Target:** main

---

## 1. Change Request Summary

[2-3 sentences describing WHAT this change does and WHY it's needed]

**Related Issues/Docs:**
- [Link to issue or doc if applicable]

---

## 2. Acceptance Criteria Checklist

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] All criteria verified by Builder

---

## 3. Files Changed

| File | Action | Description |
|------|--------|-------------|
| [path/to/file] | Added/Modified/Deleted | [Brief description] |

---

## 4. Diff Summary

```
[Output of: git diff --stat main..HEAD]
```

---

## 5. Key Excerpts

[Include MINIMAL excerpts of critical code/config changes. Not full files.]

```[language]
// Only the most important 5-15 lines
```

**Why this excerpt matters:** [Brief explanation]

---

## 6. Commands Run + Outputs

```bash
# Command 1
$ [command]
[output summary]

# Command 2
$ [command]
[output summary]
```

---

## 7. CI Status

- **Workflow:** [workflow name]
- **Status:** ✅ Passing / ❌ Failing / ⏳ Pending
- **Link:** [CI run URL]

---

## 8. Risks and Rollback

### Potential Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

### Rollback Plan
1. [Step 1]
2. [Step 2]
3. Verify rollback: [How to confirm]

---

## 9. Security Checklist

- [ ] No secrets committed
- [ ] No PII exposed
- [ ] Auth/permissions unchanged (or documented)
- [ ] No new attack vectors introduced

---

## 10. Dev Notes Confirmation

- [ ] Intent documented in code/config where applicable
- [ ] README/docs updated if needed
- [ ] Breaking changes documented

---

*Generated using PROMPTS/generate-audit-packet.md*
```

---

## Rules

1. **Artifacts Only** — Base all content on actual outputs, not assumptions
2. **No Secrets** — Never include tokens, keys, passwords, or credentials
3. **Minimal Excerpts** — Don't dump entire files; show only what's needed
4. **Link to Evidence** — Reference CI runs, commits, and docs by URL
5. **Be Honest** — If something is uncertain, say so

---

## Example: Minimal Packet

For small changes, a minimal packet is acceptable:

```markdown
# Audit Packet: Fix typo in workflow diagram

**Generated:** 2025-01-30T08:00:00Z
**Builder:** Claude
**Branch:** fix/workflow-typo

## 1. Change Request Summary
Fixed typo "recieve" → "receive" in workflow diagram.

## 3. Files Changed
| File | Action | Description |
|------|--------|-------------|
| workflows/01-onboarding.md | Modified | Fixed typo |

## 4. Diff Summary
```
1 file changed, 1 insertion(+), 1 deletion(-)
```

## 8. Risks and Rollback
- Risk: None (typo fix)
- Rollback: Revert commit

*Minimal packet — trivial change*
```

---

*Last updated: Governed by AI_CONTRACT.md*
