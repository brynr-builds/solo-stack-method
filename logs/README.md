# Logs Directory

> **Intent (Dev Notes):**  
> This directory contains logs and audit trails for Solo Stack Method™ governance.  
> All logs must follow the rules below to prevent security issues and maintain usefulness.

---

## What May Be Logged

✅ **Allowed in logs:**

- Prompt evolution history (version changes, timestamps, roles)
- Audit decision summaries (verdicts, reasons, dates)
- Agent pulse review results (metrics, recommendations)
- PR merge history (links, dates, agents involved)
- Error summaries (what went wrong, how it was fixed)
- Process improvement notes

---

## What May NOT Be Logged

🚫 **Never log:**

- Secrets, tokens, API keys, or credentials
- Passwords or authentication data
- Personal identifiable information (PII)
- Full code dumps or raw file contents
- Raw command outputs containing sensitive data
- Environment variables with secrets
- Database connection strings
- Third-party service credentials

---

## Log Files

### prompt-evolution.md

Tracks the evolution of prompts through the Dual Audit Loop.

**Format:**
```markdown
## [ISO 8601 Timestamp]

**Prompt:** [Name/ID]
**Version:** v0 → v1.5 → v2
**Builder:** [Agent]
**Final Auditor:** [Agent]
**Change:** [Brief description]
**Outcome:** Merged / Rejected / Pending
```

### audit-history.md (future)

Historical record of audit verdicts and outcomes.

### incident-log.md (future)

Record of incidents and their resolutions.

---

## Retention Policy

- Logs are kept indefinitely in the repository
- Old logs may be archived to a separate file if they become too large
- Logs are never deleted (audit trail requirement)

---

## Creating New Log Files

When creating a new log file:

1. Add to this README
2. Document the purpose and format
3. Ensure no secrets policy is followed
4. Use ISO 8601 timestamps consistently

---

*Last updated: Governed by AI_CONTRACT.md*
