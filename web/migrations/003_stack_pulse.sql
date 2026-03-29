-- Migration: 003_stack_pulse
-- Creates the stack_pulse_updates table and seeds initial tool data.
--
-- source_type: 'npm' = auto-fetched; 'manual' = human-curated
-- status: stable | update | new | beta | deprecated

CREATE TABLE IF NOT EXISTS stack_pulse_updates (
  id            SERIAL PRIMARY KEY,
  tool          TEXT NOT NULL UNIQUE,
  registry      TEXT NOT NULL,
  version       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'stable'
                  CHECK (status IN ('stable', 'update', 'new', 'beta', 'deprecated')),
  category      TEXT NOT NULL,
  updated       DATE NOT NULL DEFAULT CURRENT_DATE,
  source_type   TEXT NOT NULL DEFAULT 'manual'
                  CHECK (source_type IN ('npm', 'manual')),
  source_key    TEXT,               -- npm package name or NULL for manual
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial data (ON CONFLICT DO NOTHING — safe to re-run)
INSERT INTO stack_pulse_updates (tool, registry, version, status, category, updated, source_type, source_key) VALUES
  -- npm auto-tracked (versions refreshed daily by pulse-refresh function)
  ('Next.js',      'npm',       '15.1.0', 'update', 'Framework', '2024-12-19', 'npm', 'next'),
  ('Tailwind CSS', 'npm',       '4.0.0',  'update', 'Styling',   '2025-01-22', 'npm', 'tailwindcss'),
  ('TypeScript',   'npm',       '5.7.2',  'stable', 'Language',  '2024-11-22', 'npm', 'typescript'),
  ('Supabase JS',  'npm',       '2.47.0', 'stable', 'Backend',   '2025-01-15', 'npm', '@supabase/supabase-js'),

  -- AI Models (manual — no public version API)
  ('Claude 3.7 Sonnet', 'anthropic', '3.7',         'update', 'AI Model', '2025-02-24', 'manual', NULL),
  ('Claude 3.5 Sonnet', 'anthropic', '3.5.20241022','stable', 'AI Model', '2024-10-22', 'manual', NULL),
  ('GPT-4o',            'openai',    '2024-11-20',  'stable', 'AI Model', '2024-11-20', 'manual', NULL),
  ('GPT-4o mini',       'openai',    '2024-07-18',  'stable', 'AI Model', '2024-07-18', 'manual', NULL),
  ('Gemini 2.0 Flash',  'google',    '2.0',         'update', 'AI Model', '2025-02-05', 'manual', NULL),
  ('Mistral Large 2',   'mistral',   '2407',         'stable', 'AI Model', '2024-07-24', 'manual', NULL),

  -- IDEs (manual)
  ('Cursor',   'cursor',  '0.47.0', 'update', 'IDE', '2025-02-10', 'manual', NULL),
  ('Windsurf', 'codeium', '1.0',    'new',    'IDE', '2024-11-13', 'manual', NULL),

  -- Platforms & AI Tools (manual)
  ('Vercel',       'vercel',    'latest', 'stable', 'Platform', '2025-03-01', 'manual', NULL),
  ('Netlify',      'netlify',   'latest', 'stable', 'Platform', '2025-03-01', 'manual', NULL),
  ('v0 by Vercel', 'vercel',    'latest', 'stable', 'AI Tool',  '2025-03-01', 'manual', NULL),
  ('Claude Code',  'anthropic', 'latest', 'new',    'AI Tool',  '2025-02-24', 'manual', NULL)
ON CONFLICT (tool) DO NOTHING;
