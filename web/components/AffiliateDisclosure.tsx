/*
 * DEV NOTES (2026-06-08):
 * - Why: FTC-required affiliate disclosure. Must appear on any page with affiliate links.
 *   Keeps the site compliant and signals transparency (also an E-E-A-T trust signal).
 */

export default function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-gray-500">
        Some links below are affiliate links. If you sign up, we may earn a commission at no
        extra cost to you. We only list tools that clear our research and scoring process.
      </p>
    )
  }
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-gray-600">
      <strong className="text-gray-800">Affiliate disclosure.</strong>{' '}
      Some links on this page are affiliate links — if you sign up through them we may earn a
      commission at no additional cost to you. We never accept payment for placement. Every tool
      here is ranked by the same research and scoring method we run on our own stack.
    </div>
  )
}
