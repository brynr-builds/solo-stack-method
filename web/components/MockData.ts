/*
 * DEV NOTES / Intent:
 * - Why: Centralized mock data for admin, analytics, CRM, and support
 * - Phase 1.3: All data is static/simulated — NO database, NO API calls
 * - Phase 2+: Replace with Supabase queries and real analytics
 * - This file is the ONLY source of mock data for admin features
 *
 * What this does NOT do:
 * - No real user data
 * - No real analytics collection
 * - No external service calls
 * - No persistence between sessions
 *
 * Compatibility:
 * - Pure TypeScript, no React dependencies
 * - Importable by any component
 * - All types exported for type safety
 */

// ============================================
// TYPES
// ============================================

export interface MockUser {
  id: string
  name: string
  email: string
  subscriptionState: 'free' | 'active' | 'churned' | 'trial'
  currentStep: number
  lastActivity: string
  latestAuditScore: number | null
  shipped: boolean
  tags: string[]
  notes: string[]
  joinedAt: string
}

export interface SystemHealthMetrics {
  activeUsers: number
  usersByStep: Record<number, number>
  shippedAtLeastOnce: number
  totalUsers: number
  auditPassRate: number
}

export interface ProcessMetrics {
  dropOffByStep: Record<number, number>
  avgTimePerStep: Record<number, string>
  avgAuditIterations: number
  topGovernanceFailures: { reason: string; count: number }[]
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

export interface AdminConfig {
  steps: { number: number; title: string; description: string }[]
  gatingCopy: { locked: string; upgrade: string; pricing: string }
  auditThresholds: { modeA: { name: string; enabled: boolean }[] }
  advisoryRules: { modeB: { name: string; weight: number; enabled: boolean }[] }
  monetizationCopy: { headline: string; subline: string; price: string; sustain: string }
}

// ============================================
// MOCK USERS (CRM)
// ============================================

export const MOCK_USERS: MockUser[] = [
  {
    id: 'usr_001',
    name: 'Alex Chen',
    email: 'alex@example.com',
    subscriptionState: 'active',
    currentStep: 5,
    lastActivity: '2026-02-01T14:30:00Z',
    latestAuditScore: 87,
    shipped: true,
    tags: ['power-user', 'early-adopter'],
    notes: ['Completed steps 1-4 in 3 days', 'Asked about enterprise features'],
    joinedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'usr_002',
    name: 'Jordan Rivera',
    email: 'jordan@example.com',
    subscriptionState: 'active',
    currentStep: 3,
    lastActivity: '2026-01-31T10:15:00Z',
    latestAuditScore: 62,
    shipped: false,
    tags: ['needs-help'],
    notes: ['Struggling with AI contract setup'],
    joinedAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 'usr_003',
    name: 'Sam Patel',
    email: 'sam@example.com',
    subscriptionState: 'free',
    currentStep: 1,
    lastActivity: '2026-01-28T08:00:00Z',
    latestAuditScore: null,
    shipped: false,
    tags: ['inactive'],
    notes: [],
    joinedAt: '2026-01-20T16:30:00Z',
  },
  {
    id: 'usr_004',
    name: 'Morgan Blake',
    email: 'morgan@example.com',
    subscriptionState: 'active',
    currentStep: 7,
    lastActivity: '2026-02-01T18:45:00Z',
    latestAuditScore: 95,
    shipped: true,
    tags: ['power-user', 'completed'],
    notes: ['Finished entire flow', 'Gave positive feedback on governance model'],
    joinedAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'usr_005',
    name: 'Taylor Kim',
    email: 'taylor@example.com',
    subscriptionState: 'churned',
    currentStep: 2,
    lastActivity: '2026-01-15T09:30:00Z',
    latestAuditScore: null,
    shipped: false,
    tags: ['churned'],
    notes: ['Cancelled after 3 days', 'Said "too complex"'],
    joinedAt: '2026-01-12T14:00:00Z',
  },
  {
    id: 'usr_006',
    name: 'Casey Nguyen',
    email: 'casey@example.com',
    subscriptionState: 'trial',
    currentStep: 4,
    lastActivity: '2026-02-01T11:00:00Z',
    latestAuditScore: 74,
    shipped: false,
    tags: ['trial'],
    notes: ['Trial expires in 5 days'],
    joinedAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'usr_007',
    name: 'Riley Thompson',
    email: 'riley@example.com',
    subscriptionState: 'active',
    currentStep: 6,
    lastActivity: '2026-01-30T16:20:00Z',
    latestAuditScore: 82,
    shipped: true,
    tags: ['early-adopter'],
    notes: ['Deployed to Netlify successfully', 'Requested Pulse improvements'],
    joinedAt: '2026-01-08T08:30:00Z',
  },
  {
    id: 'usr_008',
    name: 'Avery Williams',
    email: 'avery@example.com',
    subscriptionState: 'free',
    currentStep: 1,
    lastActivity: '2026-01-29T13:45:00Z',
    latestAuditScore: null,
    shipped: false,
    tags: [],
    notes: ['Browsed steps but never started'],
    joinedAt: '2026-01-27T17:00:00Z',
  },
]

// ============================================
// SYSTEM HEALTH
// ============================================

export const MOCK_SYSTEM_HEALTH: SystemHealthMetrics = {
  activeUsers: 142,
  usersByStep: { 1: 38, 2: 28, 3: 24, 4: 19, 5: 15, 6: 11, 7: 7 },
  shippedAtLeastOnce: 23,
  totalUsers: 284,
  auditPassRate: 72,
}

// ============================================
// PROCESS METRICS
// ============================================

export const MOCK_PROCESS_METRICS: ProcessMetrics = {
  dropOffByStep: { 1: 12, 2: 18, 3: 22, 4: 15, 5: 8, 6: 5, 7: 3 },
  avgTimePerStep: { 1: '15m', 2: '25m', 3: '45m', 4: '1h 20m', 5: '35m', 6: '20m', 7: '10m' },
  avgAuditIterations: 2.3,
  topGovernanceFailures: [
    { reason: 'Missing DEV NOTES', count: 47 },
    { reason: 'Direct commit to main', count: 31 },
    { reason: 'No audit artifacts', count: 24 },
    { reason: 'Missing intent.md', count: 18 },
    { reason: 'Secrets in code', count: 5 },
  ],
}

// ============================================
// PRODUCT ANALYTICS
// ============================================

export const MOCK_PRODUCT_ANALYTICS: ProductAnalytics = {
  signupsDaily: [
    { date: '2026-01-26', count: 8 },
    { date: '2026-01-27', count: 12 },
    { date: '2026-01-28', count: 6 },
    { date: '2026-01-29', count: 15 },
    { date: '2026-01-30', count: 11 },
    { date: '2026-01-31', count: 9 },
    { date: '2026-02-01', count: 14 },
  ],
  signupsWeekly: [
    { week: 'W1 Jan', count: 32 },
    { week: 'W2 Jan', count: 45 },
    { week: 'W3 Jan', count: 58 },
    { week: 'W4 Jan', count: 75 },
  ],
  dau: 42,
  wau: 142,
  freeToConversion: 18.5,
  promptGenerationCount: 1247,
  auditScoreDistribution: [
    { range: '0-20', count: 5 },
    { range: '21-40', count: 12 },
    { range: '41-60', count: 28 },
    { range: '61-80', count: 45 },
    { range: '81-100', count: 32 },
  ],
}

// ============================================
// DEFAULT ADMIN CONFIG
// ============================================

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  steps: [
    { number: 1, title: 'Create Repo + Connect GitHub', description: 'Establish your project foundation with version control' },
    { number: 2, title: 'Connect Agents', description: 'Link Claude (Builder), ChatGPT (Auditor), and optionally Cursor' },
    { number: 3, title: 'Add AI Contract + Guardrails', description: 'Define what AI can and cannot do in your project' },
    { number: 4, title: 'Ship First Feature', description: 'Build your Hello World content hub with guided execution' },
    { number: 5, title: 'Run Dual Audit + Approve', description: 'ChatGPT reviews, you approve before any merge' },
    { number: 6, title: 'Deploy Preview → Production', description: 'See it live before pushing to production' },
    { number: 7, title: 'Enable Pulse + Maintenance Loop', description: 'Stay updated as your tools evolve' },
  ],
  gatingCopy: {
    locked: 'Viewing is free. Acting requires a subscription.',
    upgrade: 'Unlock Full Access',
    pricing: '$20/month',
  },
  auditThresholds: {
    modeA: [
      { name: 'Repository Exists', enabled: true },
      { name: 'Branch Workflow', enabled: true },
      { name: 'PR Opened', enabled: true },
      { name: 'Audit Artifacts Present', enabled: true },
      { name: 'No Secrets Committed', enabled: true },
      { name: 'Intent Artifacts Exist', enabled: true },
      { name: 'DEV NOTES Present', enabled: true },
      { name: 'No Direct Main Commits', enabled: true },
    ],
  },
  advisoryRules: {
    modeB: [
      { name: 'Prompt Clarity', weight: 15, enabled: true },
      { name: 'DEV NOTES Quality', weight: 15, enabled: true },
      { name: 'Compatibility Notes', weight: 15, enabled: true },
      { name: 'Documentation Completeness', weight: 15, enabled: true },
      { name: 'Enterprise Takeover Ready', weight: 20, enabled: true },
      { name: 'Code Style Consistency', weight: 10, enabled: true },
      { name: 'Accessibility Basics', weight: 10, enabled: true },
    ],
  },
  monetizationCopy: {
    headline: 'Build real software with AI — without losing control.',
    subline: 'From idea to deployment, governed every step of the way.',
    price: '$20/month',
    sustain: 'Your subscription sustains the stack: governance updates, prompt improvements, and audit tooling — maintained by the builder, verified by independent audit.',
  },
}
