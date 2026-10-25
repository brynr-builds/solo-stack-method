import React from 'react';

interface EmptyStateProps {
  handleRunAudit: () => void;
}

export function EmptyState({ handleRunAudit }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Audit Results Yet</h3>
      <p className="text-gray-500 mb-6">
        Run an audit to see governance compliance and quality scores.
      </p>
      <button
        onClick={handleRunAudit}
        className="px-6 py-2 bg-solo-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Run Your First Audit
      </button>
    </div>
  );
}
