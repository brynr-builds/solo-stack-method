import React, { useState } from 'react';

// "Ask the System" example prompts
const INSIGHT_PROMPTS = [
  'Why are users failing Step 4?',
  'What changed after Prompt v1.4?',
  'Where should I improve next?',
  'Which users are most at risk of churning?',
  'What is the most common governance failure?',
]

type AskTheSystemTabProps = {
  health: {
    activeUsers: number;
    auditPassRate: number;
    usersByStep: Record<number, number>;
  };
  process: {
    dropOffByStep: Record<number, number>;
    topGovernanceFailures: Array<{ reason: string; count: number }>;
  };
};

export function AskTheSystemTab({ health, process }: AskTheSystemTabProps) {
  const [insightQuery, setInsightQuery] = useState('')
  const [insightResult, setInsightResult] = useState<string | null>(null)

  const handleInsightQuery = () => {
    if (!insightQuery.trim()) return
    // Phase 1.3: Simulated AI response
    setInsightResult(
      `[Phase 1.3 Placeholder]\n\nAnalysis for: "${insightQuery}"\n\n` +
      `Based on current mock data:\n` +
      `• ${health.activeUsers} active users across ${Object.keys(health.usersByStep).length} steps\n` +
      `• Drop-off is highest at Step 3 (${process.dropOffByStep[3]}% leave)\n` +
      `• Top governance failure: "${process.topGovernanceFailures[0]?.reason}" (${process.topGovernanceFailures[0]?.count} occurrences)\n` +
      `• Audit pass rate: ${health.auditPassRate}%\n\n` +
      `Recommendation: Focus on reducing Step 3 friction and improving DEV NOTES compliance.\n\n` +
      `[This is a simulated response. Real AI analysis coming in Phase 2.]`
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Ask the System</h3>
        <p className="text-sm text-gray-600 mb-4">
          Query your system data using natural language. AI summarizes — never executes or mutates.
        </p>
        <p className="text-xs text-amber-600 mb-4">
          Phase 1.3: Simulated responses. Real AI integration in Phase 2.
        </p>

        {/* Example prompts */}
        <div className="mb-4">
          <span className="text-xs text-gray-500 block mb-2">Try these:</span>
          <div className="flex flex-wrap gap-2">
            {INSIGHT_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => setInsightQuery(prompt)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Query input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={insightQuery}
            onChange={(e) => setInsightQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsightQuery()}
            placeholder="Ask about your system..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
          />
          <button
            onClick={handleInsightQuery}
            className="px-6 py-3 bg-solo-primary text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Result */}
      {insightResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-bold text-gray-700 mb-3">AI Analysis</h4>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">
            {insightResult}
          </pre>
          <p className="text-xs text-gray-400 mt-3">
            This output is read-only. No actions were taken. No data was modified.
          </p>
        </div>
      )}
    </div>
  );
}
