import type { Config } from 'tailwindcss'

/*
 * DEV NOTES:
 * - Why: Tailwind for rapid UI development with utility-first approach
 * - Phase 1: Minimal custom theme, focus on structure
 * - Phase 2+: Brand colors, custom components, dark mode
 */

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Solo Stack brand colors
        'solo-primary': '#0f172a',    // Deep slate
        'solo-accent': '#3b82f6',     // Blue
        'solo-success': '#22c55e',    // Green
        'solo-warning': '#f59e0b',    // Amber
        'solo-danger': '#ef4444',     // Red
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
