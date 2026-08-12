import React from 'react';

export function RubricDocumentation() {
  return (
    <div className="mt-12 bg-slate-50 rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Audit Rubric</h2>
      <div className="prose prose-sm max-w-none text-gray-600">
        <h3 className="text-lg font-semibold text-gray-800">Mode A: Governance (Required)</h3>
        <p>
          Mode A checks are <strong>non-negotiable</strong>. Failing any Mode A check blocks
          deployment and requires immediate remediation. These checks ensure your project
          follows the Solo Stack governance model.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6">Mode B: Quality (Advisory)</h3>
        <p>
          Mode B checks are <strong>informational only</strong>. They never block progress.
          Low Mode B scores indicate areas for improvement but do not prevent deployment.
          Focus on Mode B after Mode A passes.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6">Scoring</h3>
        <ul>
          <li><strong>Mode A:</strong> Pass/Fail per check. All must pass to proceed.</li>
          <li><strong>Mode B:</strong> 0-100 weighted average. Higher is better but not required.</li>
        </ul>
      </div>
    </div>
  );
}
