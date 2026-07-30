import React from 'react';

interface Check {
  id: string;
  name: string;
  description: string;
  severity?: string;
  weight?: number;
}

interface AuditResultsProps {
  modeAPassed: boolean;
  modeAScore: number | null;
  modeATotal: number;
  modeBScore: number | null;
  modeAResults: Record<string, 'pass' | 'fail' | 'pending'>;
  modeBResults: Record<string, number>;
  MODE_A_CHECKS: Check[];
  MODE_B_CHECKS: Check[];
}

export function AuditResults({
  modeAPassed,
  modeAScore,
  modeATotal,
  modeBScore,
  modeAResults,
  modeBResults,
  MODE_A_CHECKS,
  MODE_B_CHECKS
}: AuditResultsProps) {
  return (
    <div className="space-y-8">
      {/* Score Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Audit Results</h2>
          <span className="text-xs text-gray-500">
            Generated: {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode A Score */}
          <div className={`p-6 rounded-xl ${modeAPassed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${modeAPassed ? 'text-green-600' : 'text-red-600'}`}>
                {modeAScore}/{modeATotal}
              </div>
              <div className="text-sm text-gray-600 mb-3">Mode A: Governance</div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                modeAPassed
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {modeAPassed ? '✓ PASSED — Ready to proceed' : '✗ BLOCKED — Fix required issues'}
              </span>
            </div>
          </div>

          {/* Mode B Score */}
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-2">
                {modeBScore}
              </div>
              <div className="text-sm text-gray-600 mb-3">Mode B: Quality (0-100)</div>
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                Advisory only — Does not block
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode A Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Mode A: Governance Checks</h3>
        <div className="space-y-3">
          {MODE_A_CHECKS.map(check => (
            <div
              key={check.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                modeAResults[check.id] === 'pass'
                  ? 'bg-green-50'
                  : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  modeAResults[check.id] === 'pass'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-red-200 text-red-700'
                }`}>
                  {modeAResults[check.id] === 'pass' ? '✓' : '✗'}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{check.name}</div>
                  <div className="text-sm text-gray-500">{check.description}</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                modeAResults[check.id] === 'pass' ? 'text-green-600' : 'text-red-600'
              }`}>
                {modeAResults[check.id] === 'pass' ? 'PASS' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mode B Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Mode B: Quality Signals</h3>
        <div className="space-y-3">
          {MODE_B_CHECKS.map(check => (
            <div key={check.id} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{check.name}</div>
                  <div className="text-sm text-gray-500">{check.description}</div>
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {modeBResults[check.id] || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-solo-accent rounded-full h-2 transition-all"
                  style={{ width: `${modeBResults[check.id] || 0}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Weight: {check.weight}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Prompts</h3>
        <p className="text-sm text-gray-600 mb-4">
          Generate prompts to fix issues or request human review of the audit.
        </p>
        <div className="flex gap-4">
          <button
            className="flex-1 px-4 py-3 bg-solo-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate Fix Prompt (Claude)
          </button>
          <button
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Generate Review Prompt (ChatGPT)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Results will be timestamped and logged in future versions.
        </p>
      </div>
    </div>
  );
}
