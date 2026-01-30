# Schema Truth

> **Source of Truth:** `SUPABASE_MIGRATION.sql`
> > **Last Verified:** January 30, 2026
> >
> > This document defines the canonical database schema for Solo Stack Method™ Stack Pulse system.
> >
> > ---
> >
> > ## Core Tables
> >
> > ### `stack_pulse_updates`
> >
> > Primary table for storing tool/dependency update notifications ingested by the Stack Pulse system.
> >
> > ```sql
> > CREATE TABLE stack_pulse_updates (
> >     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
> >     tool_name TEXT NOT NULL,
> >     version TEXT,
> >     update_type TEXT,  -- 'major', 'minor', 'patch', 'security'
> >     summary TEXT,
> >     source_url TEXT,
> >     dedupe_key TEXT UNIQUE,  -- Single-column deduplication
> >     raw_payload JSONB,
> >     created_at TIMESTAMPTZ DEFAULT now(),
> >     processed_at TIMESTAMPTZ
> > );
> > ```
> >
> > #### Key Constraint: `dedupe_key`
> >
> > The `dedupe_key` column is the **sole deduplication mechanism**. It is a single `TEXT UNIQUE` column—not a composite constraint.
> >
> > **Recommended format:**
> > ```
> > {tool_name}:{version}:{source}
> > ```
> >
> > **Examples:**
> > - `react:19.0.0:npm`
> > - - `supabase-js:2.45.0:github`
> >   - - `deno:1.40.0:releases`
> >    
> >     - This design allows flexible deduplication across different source types while maintaining a simple, queryable key.
> >    
> >     - ---
> >
> > ### `tool_sources`
> >
> > Registry of tools being monitored and their update sources.
> >
> > ```sql
> > CREATE TABLE tool_sources (
> >     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
> >     tool_name TEXT NOT NULL,
> >     registry TEXT,         -- 'npm', 'pypi', 'github', 'crates', etc.
> >     url TEXT,              -- RSS feed, API endpoint, or release page
> >     priority INTEGER DEFAULT 5,  -- 1-10, higher = more important
> >     enabled BOOLEAN DEFAULT true,
> >     last_checked TIMESTAMPTZ,
> >     created_at TIMESTAMPTZ DEFAULT now()
> > );
> > ```
> >
> > #### Priority Scoring
> >
> > | Priority | Meaning |
> > |----------|---------|
> > | 1-3 | Low priority (nice-to-know) |
> > | 4-6 | Standard priority (default) |
> > | 7-9 | High priority (core dependencies) |
> > | 10 | Critical (security-sensitive) |
> >
> > ---
> >
> > ## Example Queries
> >
> > ### Get recent updates for high-priority tools
> >
> > ```sql
> > SELECT u.tool_name, u.version, u.update_type, u.summary
> > FROM stack_pulse_updates u
> > JOIN tool_sources s ON u.tool_name = s.tool_name
> > WHERE s.priority >= 7
> >   AND u.created_at > now() - interval '7 days'
> > ORDER BY u.created_at DESC;
> > ```
> >
> > ### Check for duplicate before insert
> >
> > ```sql
> > INSERT INTO stack_pulse_updates (tool_name, version, dedupe_key, summary)
> > VALUES ('react', '19.0.0', 'react:19.0.0:npm', 'React 19 stable release')
> > ON CONFLICT (dedupe_key) DO NOTHING;
> > ```
> >
> > ### List enabled tool sources by priority
> >
> > ```sql
> > SELECT tool_name, registry, priority
> > FROM tool_sources
> > WHERE enabled = true
> > ORDER BY priority DESC, tool_name;
> > ```
> >
> > ---
> >
> > ## Schema Evolution
> >
> > Changes to this schema MUST:
> > 1. Be documented in `SUPABASE_MIGRATION.sql`
> > 2. 2. Update this document
> >    3. 3. Follow the Dual Audit Loop process
> >       4. 4. Pass Final Audit before merge
> >         
> >          5. ---
> >         
> >          6. *This document is the canonical reference for Stack Pulse database design. When in doubt, check `SUPABASE_MIGRATION.sql`.*
