/*
 * DEV NOTES / Intent:
 * - Why: Public marketing homepage - conversion-focused, explains value
 * - Phase 1: Static content, Stack Pulse preview, pricing, CTA
 * - Phase 2+: Dynamic pulse data, testimonials, case studies
 * 
 * LOCKED COPY:
 * - Headline: "Build real software with AI — without losing control, from idea to deployment."
 * - Pulse gating: "Viewing is free. Acting requires a subscription."
 * - Pricing: $20/month
 * 
 * NEW MARKETING (2026-01-31):
 * - Enterprise takeover readiness positioning
 * - Sellable software package framing
 * - Sustain the Stack (optional contribution)
 * 
 * Phase 1.3b ADDITIONS (2026-02-02):
 * - Differentiation block: governance-first, context-as-artifact, exit-ready
 * - Factual positioning vs generic AI builders (no name-attacks)
 * - Compatible: additive section, no existing content removed
 * 
 * Compatibility: Root marketing page, no dependencies on other app routes
 */

import Link from 'next/link'
import { HeroSection } from '../components/home/HeroSection'
import { TargetAudienceSection } from '../components/home/TargetAudienceSection'
import { DifferentiationSection } from '../components/home/DifferentiationSection'
import { WorkflowSection } from '../components/home/WorkflowSection'
import { StackPulsePreviewSection } from '../components/home/StackPulsePreviewSection'
import { ProofOfConceptSection } from '../components/home/ProofOfConceptSection'
import { EnterpriseTakeoverSection } from '../components/home/EnterpriseTakeoverSection'
import { SustainStackSection } from '../components/home/SustainStackSection'
import { PricingSection } from '../components/home/PricingSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-solo-primary">
            Solo Stack Method™
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pulse" className="text-gray-600 hover:text-solo-primary transition-colors">
              Stack Pulse
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
      <TargetAudienceSection />
      <DifferentiationSection />
      <WorkflowSection />
      <StackPulsePreviewSection />
      <ProofOfConceptSection />
      <EnterpriseTakeoverSection />
      <SustainStackSection />
      <PricingSection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 Solo Stack Method™. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/pulse" className="text-gray-500 hover:text-solo-primary">Stack Pulse</Link>
            <Link href="/audit-score" className="text-gray-500 hover:text-solo-primary">Audit Score</Link>
            <Link href="/terms" className="text-gray-500 hover:text-solo-primary">Terms</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-solo-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
