import React from 'react';

export function ModeCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Mode A Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              REQUIRED
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Mode A: Governance</h2>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          <strong>BLOCKS progress</strong> if any check fails. These are non-negotiable governance requirements.
        </p>
        <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800">
          Failing Mode A blocks deployment. Fix all issues before proceeding.
        </div>
      </div>

      {/* Mode B Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
              ADVISORY
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Mode B: Quality</h2>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          <strong>Never blocks</strong> progress. Quality signals help improve your project but are not required.
        </p>
        <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
          Mode B scores are advisory only. Low scores are informational, not blocking.
        </div>
      </div>
    </div>
  );
}
