# Stack Pulse

Stack Pulse is a real-time dependency monitoring system that tracks tool/package updates across your development stack. It ingests update notifications from multiple registries and provides unified visibility into version changes.

## Schema Truth

> **Source of Truth:** [`SUPABASE_MIGRATION.sql`](../SUPABASE_MIGRATION.sql)
>
> ### Core Table: `stack_pulse_updates`
>
> This is the canonical table for storing all dependency update records.
>
> | Column | Type | Description |
> |--------|------|-------------|
> | `id` | `UUID` | Primary key (auto-generated) |
> | `dedupe_key` | `TEXT UNIQUE` | **Deduplication enforcer** — prevents duplicate entries |
> | `tool_name` | `TEXT` | Package/tool identifier |
> | `version` | `TEXT` | Version string |
> | `registry` | `TEXT` | Source registry (npm, pypi, crates, etc.) |
> | `detected_at` | `TIMESTAMPTZ` | When the update was detected |
> | `metadata` | `JSONB` | Additional version metadata |
>
> ### Deduplication Strategy
>
> - **Single column enforcement:** `dedupe_key TEXT UNIQUE`
> - - **Key format:** `{registry}:{tool_name}:{version}`
>   - - **Conflict handling:** `ON CONFLICT (dedupe_key) DO NOTHING`
>    
>     - This ensures idempotent ingestion — the same update can be pushed multiple times without creating duplicates.
>    
>     - ### Supporting Table: `tool_sources`
>    
>     - Defines monitored tools and their registry configurations.
>
> | Column | Type | Description |
> |--------|------|-------------|
> | `tool_name` | `TEXT` | Unique tool identifier |
> | `registry` | `TEXT` | Package registry |
> | `url` | `TEXT` | Registry URL or feed endpoint |
> | `priority` | `INTEGER` | Polling priority (lower = more frequent) |
>
> ## Modes
>
> Stack Pulse operates in two modes:
>
> 1. **Global Mode** — Monitors public registry feeds for general ecosystem updates
> 2. 2. **User Mode** — Tracks dependencies specific to a user's project manifest
>   
>    3. ---
>   
>    4. *See also: [Schema Truth](./schema.md) | [Schema Truth](./schema.md) | [Deployment Checklist](./deployment-checklist.md) | [Security Notes](./security-notes.md)*
