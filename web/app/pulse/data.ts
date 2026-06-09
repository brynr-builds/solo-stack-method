export interface PulseItem {
  id: number;
  tool: string;
  registry: string;
  version: string;
  status: string;
  category: string;
  updated: string;
}

// Mock pulse data - Phase 1 uses static JSON
// Phase 2+: Replace with Supabase query to stack_pulse_updates table
export const pulseData: PulseItem[] = [
  { id: 1, tool: 'Claude 3.5 Sonnet', registry: 'anthropic', version: '3.5.20240620', status: 'stable', category: 'AI Model', updated: '2024-01-28' },
  { id: 2, tool: 'GPT-4 Turbo', registry: 'openai', version: '0125-preview', status: 'update', category: 'AI Model', updated: '2024-01-31' },
  { id: 3, tool: 'Cursor', registry: 'cursor', version: '0.42.0', status: 'stable', category: 'IDE', updated: '2024-01-25' },
  { id: 4, tool: 'Next.js', registry: 'npm', version: '14.1.0', status: 'stable', category: 'Framework', updated: '2024-01-29' },
  { id: 5, tool: 'Supabase', registry: 'supabase', version: '2.39.0', status: 'stable', category: 'Backend', updated: '2024-01-30' },
  { id: 6, tool: 'Vercel', registry: 'vercel', version: 'latest', status: 'stable', category: 'Platform', updated: '2024-01-27' },
  { id: 7, tool: 'Tailwind CSS', registry: 'npm', version: '3.4.1', status: 'stable', category: 'Styling', updated: '2024-01-26' },
  { id: 8, tool: 'TypeScript', registry: 'npm', version: '5.3.3', status: 'stable', category: 'Language', updated: '2024-01-20' },
  { id: 9, tool: 'Gemini Pro', registry: 'google', version: '1.0', status: 'update', category: 'AI Model', updated: '2024-01-31' },
  { id: 10, tool: 'Mistral Large', registry: 'mistral', version: 'latest', status: 'new', category: 'AI Model', updated: '2024-01-30' },
  { id: 11, tool: 'v0 by Vercel', registry: 'vercel', version: '0.1', status: 'beta', category: 'AI Tool', updated: '2024-01-29' },
  { id: 12, tool: 'Netlify', registry: 'netlify', version: 'latest', status: 'stable', category: 'Platform', updated: '2024-01-28' },
];

export const categories = ['All', 'AI Model', 'AI Tool', 'Framework', 'Backend', 'Platform', 'IDE', 'Styling', 'Language'];
