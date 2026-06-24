import React from 'react';

type ProcessEffectivenessTabProps = {
  process: {
    dropOffByStep: Record<number, number>;
    avgTimePerStep: Record<number, string>;
    avgAuditIterations: number;
    topGovernanceFailures: Array<{ reason: string; count: number }>;
  };
};

export function ProcessEffectivenessTab({ process }: ProcessEffectivenessTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Drop-off by Step */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Drop-off by Step (%)</h3>
          <div className="space-y-3">
            {Object.entries(process.dropOffByStep).map(([step, pct]) => (
              <div key={step} className="flex items-center gap-4">
                <span className="w-20 text-sm text-gray-600">Step {step}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                  <div
                    className="bg-red-400 rounded-full h-5 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(pct * 2, 8)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avg Time per Step */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Avg Time per Step</h3>
          <div className="space-y-3">
            {Object.entries(process.avgTimePerStep).map(([step, time]) => (
              <div key={step} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Step {step}</span>
                <span className="text-sm font-mono font-medium text-gray-900">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance Failures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Top Governance Failures</h3>
          <span className="text-sm text-gray-500">Avg audit iterations: {process.avgAuditIterations}</span>
        </div>
        <div className="space-y-3">
          {process.topGovernanceFailures.map((failure, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-800">{failure.reason}</span>
              <span className="text-sm font-bold text-red-600">{failure.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
