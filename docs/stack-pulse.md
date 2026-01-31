# Stack Pulse

Stack Pulse is a real-time dependency monitoring system that tracks tool/package updates across your development stack. It ingests update notifications from multiple registries and provides unified visibility into version changes.

## Edge Function Endpoint

### `POST /functions/v1/stack-pulse`

The primary ingestion endpoint for Stack Pulse. Receives dependency update notifications and stores them in the database with deduplication.

### Authentication

```
Authorization: Bearer <STACK_PULSE_SECRET>
```

The endpoint uses a shared secret for server-to-server authentication. This is intended for trusted ingestion sources only (webhooks, cron jobs, registry monitors).

### Request Body

```json
{
  "tool_name": "lodash",       // Required: Package/tool identifier
  "version": "4.17.21",        // Required: Version string
  "registry": "npm",           // Optional: Source registry (default: "unknown")
  "metadata": {                // Optional: Additional version metadata
    "release_date": "2024-01-15",
    "changelog_url": "https://..."
  }
}
```

### Response

**Success (200):**
```json
{
  "ok": true,
  "duplicate": false,
  "dedupe_key": "npm:lodash:4.17.21"
}
```

**Duplicate Detection (200):**
```json
{
  "ok": true,
  "duplicate": true,
  "dedupe_key": "npm:lodash:4.17.21"
}
```

**Error (400/401/500):**
```json
{
  "ok": false,
  "error": "Missing or invalid 'tool_name' field",
  "code": 400
}
```

### Deduplication

Updates are deduplicated using a key format: `{registry}:{tool_name}:{version}`

This ensures:
- Same tool from different registries tracked separately
- - Same version detected multiple times stored only once
  - - First detection wins (detected_at reflects first occurrence)
   
    - ### curl Example
   
    - ```bash
      curl -X POST \
        'https://your-project.supabase.co/functions/v1/stack-pulse' \
        -H 'Authorization: Bearer YOUR_STACK_PULSE_SECRET' \
        -H 'Content-Type: application/json' \
        -d '{
          "tool_name": "react",
          "version": "18.3.0",
          "registry": "npm",
          "metadata": {
            "detected_by": "registry-monitor"
          }
        }'
      ```

      ### Error Codes

      | Code | Meaning |
      |------|---------|
      | 400  | Invalid JSON or missing required fields |
      | 401  | Missing or invalid authorization token |
      | 405  | Method not allowed (use POST) |
      | 500  | Server/database error |

      ## Schema Reference

      For database schema details, see [Schema Documentation](./schema.md).

      ---

      *See also:* [Deployment Checklist](./deployment-checklist.md) | [Security Notes](./security-notes.md)
