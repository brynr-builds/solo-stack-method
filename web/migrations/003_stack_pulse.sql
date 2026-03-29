-- Migration: 003_stack_pulse
-- Creates stack_pulse_updates table. All tools are fetched autonomously —
-- no manual updates. Seed data is the last-known baseline; the daily
-- refresh function will overwrite with live data on first run.

CREATE TABLE IF NOT EXISTS stack_pulse_updates (
  id              SERIAL PRIMARY KEY,
  tool            TEXT NOT NULL UNIQUE,
  registry        TEXT NOT NULL,
  version         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'stable'
                    CHECK (status IN ('stable', 'update', 'new', 'beta', 'deprecated')),
  category        TEXT NOT NULL,
  updated         DATE NOT NULL DEFAULT CURRENT_DATE,
  source_type     TEXT NOT NULL DEFAULT 'npm'
                    CHECK (source_type IN ('npm', 'anthropic', 'openai', 'google-ai', 'mistral', 'github')),
  source_key      TEXT,
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Baseline seed — overwritten on first refresh run.
INSERT INTO stack_pulse_updates
  (tool, registry, version, status, category, updated, source_type, source_key)
VALUES
  -- AI Models
  ('Claude (Latest)',   'anthropic', 'check provider', 'stable', 'AI Model',  NOW()::date, 'anthropic', 'claude-3'),
  ('GPT-4o',           'openai',    'check provider', 'stable', 'AI Model',  NOW()::date, 'openai',    'gpt-4o'),
  ('GPT-4o mini',      'openai',    'check provider', 'stable', 'AI Model',  NOW()::date, 'openai',    'gpt-4o-mini'),
  ('Gemini (Latest)',  'google',    'check provider', 'stable', 'AI Model',  NOW()::date, 'google-ai', 'gemini'),
  ('Mistral Large',    'mistral',   'check provider', 'stable', 'AI Model',  NOW()::date, 'mistral',   'mistral-large'),

  -- AI Tools (npm)
  ('Claude Code',      'npm',       'check provider', 'stable', 'AI Tool',   NOW()::date, 'npm',       '@anthropic-ai/claude-code'),
  ('v0 by Vercel',     'npm',       'check provider', 'stable', 'AI Tool',   NOW()::date, 'npm',       'v0'),

  -- Frameworks & Languages (npm)
  ('Next.js',          'npm',       'check provider', 'stable', 'Framework', NOW()::date, 'npm',       'next'),
  ('Tailwind CSS',     'npm',       'check provider', 'stable', 'Styling',   NOW()::date, 'npm',       'tailwindcss'),
  ('TypeScript',       'npm',       'check provider', 'stable', 'Language',  NOW()::date, 'npm',       'typescript'),

  -- Backend (npm)
  ('Supabase JS',      'npm',       'check provider', 'stable', 'Backend',   NOW()::date, 'npm',       '@supabase/supabase-js'),

  -- Platforms (CLI on npm)
  ('Vercel CLI',       'npm',       'check provider', 'stable', 'Platform',  NOW()::date, 'npm',       'vercel'),
  ('Netlify CLI',      'npm',       'check provider', 'stable', 'Platform',  NOW()::date, 'npm',       'netlify-cli'),

  -- IDEs (GitHub releases)
  ('Cursor',           'cursor',    'check provider', 'stable', 'IDE',       NOW()::date, 'github',    'getcursor/cursor'),
  ('Windsurf',         'codeium',   'check provider', 'stable', 'IDE',       NOW()::date, 'github',    'Exafunction/windsurf-releases')

ON CONFLICT (tool) DO NOTHING;
