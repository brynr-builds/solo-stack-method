# Deployment Checklist

Pre-deployment verification for Solo Stack Method™ infrastructure.

## Supabase Migration

**Migration File:** [`SUPABASE_MIGRATION.sql`](../SUPABASE_MIGRATION.sql)

### Pre-Migration Checklist

- [ ] Backup existing database (if applicable)
- [ ] - [ ] Verify Supabase project credentials in environment
- [ ] - [ ] Review migration file for any environment-specific changes
- [ ] - [ ] Confirm `stack_pulse_updates` table does not exist (fresh deploy) or plan for migration

- [ ] ### Migration Steps

- [ ] 1. **Connect to Supabase SQL Editor**
- [ ]    - Navigate to your Supabase project dashboard
- [ ]       - Open SQL Editor

- [ ]   2. **Execute Migration**
- [ ]      - Copy contents of `SUPABASE_MIGRATION.sql`
- [ ]     - Run in SQL Editor
- [ ]    - Verify successful execution

- [ ]    3. **Post-Migration Verification**
- [ ]       - Confirm `stack_pulse_updates` table exists
- [ ]      - Confirm `tool_sources` table exists
- [ ]     - Verify RLS policies are active
- [ ]    - Test `dedupe_key` UNIQUE constraint

- [ ]    ### Schema Validation

- [ ]    ```sql
- [ ]    -- Verify tables exist
- [ ]    SELECT table_name FROM information_schema.tables
- [ ]    WHERE table_schema = 'public'
- [ ]    AND table_name IN ('stack_pulse_updates', 'tool_sources');

- [ ]    -- Verify dedupe_key constraint
- [ ]    SELECT constraint_name FROM information_schema.table_constraints
- [ ]    WHERE table_name = 'stack_pulse_updates'
- [ ]    AND constraint_type = 'UNIQUE';
- [ ]    ```

- [ ]    ## Environment Variables

- [ ]    Required environment variables for Stack Pulse:

- [ ]    | Variable | Description | Required |
- [ ]    |----------|-------------|----------|
- [ ]    | `SUPABASE_URL` | Supabase project URL | Yes |
- [ ]    | `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
- [ ]    | `SUPABASE_SERVICE_KEY` | Service role key (for admin ops) | Optional |

- [ ]    ## Edge Function Deployment

- [ ]    See [Stack Pulse](./stack-pulse.md) for Edge Function implementation details.

- [ ]    ---

- [ ]    See also: [Stack Pulse](./stack-pulse.md) | [Security Notes](./security-notes.md)
