/*
 * DEV NOTES / Intent:
 * - Why: Centralized mock data for admin dashboard, CRM, analytics, and AI insights
 * - What it does NOT do: No real database calls, no Supabase, no external APIs
 * - Phase 1.3: All data is hardcoded and deterministic for UI development
 * - Phase 2+: Replace with Supabase queries and real analytics
 *
 * Compatibility:
 * - Pure TypeScript, no side effects
 * - Importable from any component
 * - Does not depend on React or Next.js
 */

// ─── TYPES ────────────────────────────────────────────────

export interface MockUser {
  id: string
  email: string
  name: string
  subscriptionState: 'free' | 'active' | 'churned'
  currentStep: number
  lastActivity: string
  latestAuditScore: number | null
  shipped: boolean
  signupDate: string
  tags: string[]
  notes: string[]
}

export interface SystemHealthMetrics {
  activeUsers: number
  totalUsers: number
  usersByStep: Record<number, number>
  shippedAtLeastOnce: number
  auditPassRate: number
}

export interface ProcessMetrics {
  dropOffByStep: Record<number, number>
  avgTimePerStep: Record<number, string>
  avgAuditIterations: number
  topGovernanceFailures: { rule: string; count: number }[]
}

export interface ProductAnalytics {
  signupsDaily: { date: string; count: number }[]
  signupsWeekly: { week: string; count: number }[]
  dau: number
  wau: number
  freeToConversion: number
  promptGenerationCount: number
  auditScoreDistribution: { range: string; count: number }[]
}

// ─── MOCK USERS ───────────────────────────────────────────

export const MOCK_USERS: MockUser[] = [
  {
    id: 'usr_001', email: 'alex@example.com', name: 'Alex Rivera',
    subscriptionState: 'active', currentStep: 5, lastActivity: '2026-01-31',
    latestAuditScore: 92, shipped: true, signupDate: '2025-12-01',
    tags: ['power-user', 'early-adopter'], notes: ['Shipped a content hub in 3 days']
  },
  {
    id: 'usr_002', email: 'jamie@example.com', name: 'Jamie Chen',
    subscriptionState: 'active', currentStep: 3, lastActivity: '2026-01-30',
    latestAuditScore: 78, shipped: false, signupDate: '2025-12-15',
    tags: ['needs-help'], notes: ['Stuck on AI contract setup']
  },
  {
    id: 'usr_003', email: 'morgan@example.com', name: 'Morgan Wells',
    subscriptionState: 'free', currentStep: 1, lastActivity: '2026-01-28',
    latestAuditScore: null, shipped: false, signupDate: '2026-01-10',
    tags: ['free-tier'], notes: []
  },
  {
    id: 'usr_004', email: 'sam@example.com', name: 'Sam Patel',
    subscriptionState: 'active', currentStep: 7, lastActivity: '2026-02-01',
    latestAuditScore: 96, shipped: true, signupDate: '2025-11-20',
    tags: ['power-user', 'completed'], notes: ['Fully shipped, running Pulse loop']
  },
  {
    id: 'usr_005', email: 'taylor@example.com', name: 'Taylor Kim',
    subscriptionState: 'churned', currentStep: 4, lastActivity: '2026-01-15',
    latestAuditScore: 65, shipped: false, signupDate: '2025-12-20',
    tags: ['at-risk'], notes: ['Left after failing audit twice on Step 4']
  },
  {
    id: 'usr_006', email: 'casey@example.com', name: 'Casey Jordan',
    subscriptionState: 'active', currentStep: 6, lastActivity: '2026-01-31',
    latestAuditScore: 88, shipped: true, signupDate: '2025-12-05',
    tags: ['early-adopter'], notes: ['Clean audit history']
  },
  {
    id: 'usr_007', email: 'riley@example.com', name: 'Riley Nguyen',
    subscriptionState: 'free', currentStep: 2, lastActivity: '2026-01-25',
    latestAuditScore: null, shipped: false, signupDate: '2026-01-05',
    tags: ['free-tier'], notes: ['Browsing steps, no execution yet']
  },
  {
    id: 'usr_008', email: 'drew@example.com', name: 'Drew Martinez',
    subscriptionState: 'active', currentStep: 4, lastActivity: '2026-01-29',
    latestAuditScore: 71, shipped: false, signupDate: '2025-12-28',
    tags: ['needs-help'], notes: ['Audit failing on missing DEV NOTES']
  },
]

// ─── SYSTEM HEALTH ────────────────────────────────────────

export const SYSTEM_HEALTH: SystemHealthMetrics = {
  activeUsers: 6,
  totalUsers: 8,
  usersByStep: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1, 7: 1 },
  shippedAtLeastOnce: 3,
  auditPassRate: 72,
}

// ─── PROCESS METRICS ──────────────────────────────────────

export const PROCESS_METRICS: ProcessMetrics = {
  dropOffByStep: { 1: 0, 2: 5, 3: 12, 4: 25, 5: 8, 6: 3, 7: 2 },
  avgTimePerStep: { 1: '15m', 2: '30m', 3: '1h', 4: '2.5h', 5: '45m', 6: '20m', 7: '10m' },
  avgAuditIterations: 2.3,
  topGovernanceFailures: [
    { rule: 'Missing DEV NOTES', count: 18 },
    { rule: 'No compatibility check', count: 12 },
    { rule: 'Overbuild detected', count: 9 },
    { rule: 'Secret in commit', count: 2 },
  ],
}

// ─── PRODUCT ANALYTICS ────────────────────────────────────

export const PRODUCT_ANALYTICS: ProductAnalytics = {
  signupsDaily: [
    { date: '2026-01-26', count: 3 }, { date: '2026-01-27', count: 5 },
    { date: '2026-01-28', count: 2 }, { date: '2026-01-29', count: 7 },
    { date: '2026-01-30', count: 4 }, { date: '2026-01-31', count: 6 },
    { date: '2026-02-01', count: 8 },
  ],
  signupsWeekly: [
    { week: 'W1 Jan', count: 12 }, { week: 'W2 Jan', count: 18 },
    { week: 'W3 Jan', count: 15 }, { week: 'W4 Jan', count: 22 },
    { week: 'W5 Jan', count: 35 },
  ],
  dau: 6,
  wau: 8,
  freeToConversion: 62.5,
  promptGenerationCount: 147,
  auditScoreDistribution: [
    { range: '90-100', count: 2 }, { range: '80-89', count: 1 },
    { range: '70-79', count: 2 }, { range: '60-69', count: 1 },
    { range: 'No score', count: 2 },
  ],
}
