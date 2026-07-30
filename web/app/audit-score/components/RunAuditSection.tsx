import React from 'react';

interface RunAuditSectionProps {
  projectPath: string;
  setProjectPath: (path: string) => void;
  handleRunAudit: () => void;
  isSubscribed: boolean;
}

export function RunAuditSection({
  projectPath,
  setProjectPath,
  handleRunAudit,
  isSubscribed
}: RunAuditSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Run Audit</h2>
      <p className="text-gray-600 text-sm mb-4">
        Point to your local project directory to run governance and quality checks.
      </p>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
          placeholder="/path/to/your/project"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solo-accent focus:border-transparent"
        />
        <button
          onClick={handleRunAudit}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isSubscribed
              ? 'bg-solo-accent text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-600'
          }`}
        >
          Run Audit
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Phase 1.2: Simulated audit for demonstration. Local CLI integration coming in Phase 2.
      </p>
    </div>
  );
}
