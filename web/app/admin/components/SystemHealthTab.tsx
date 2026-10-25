import React from 'react';

type SystemHealthTabProps = {
  health: {
    activeUsers: number;
    shippedAtLeastOnce: number;
    auditPassRate: number;
    totalUsers: number;
    usersByStep: Record<number, number>;
  };
};

export function SystemHealthTab({ health }: SystemHealthTabProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-primary">{health.activeUsers}</div>
          <div className="text-sm text-gray-600 mt-1">Active Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-success">{health.shippedAtLeastOnce}</div>
          <div className="text-sm text-gray-600 mt-1">Shipped At Least Once</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-accent">{health.auditPassRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Audit Pass Rate</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-gray-700">{Math.round((health.shippedAtLeastOnce / health.totalUsers) * 100)}%</div>
          <div className="text-sm text-gray-600 mt-1">Ship Rate</div>
        </div>
      </div>

      {/* Users by Step */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Step</h3>
        <div className="space-y-3">
          {Object.entries(health.usersByStep).map(([step, count]) => (
            <div key={step} className="flex items-center gap-4">
              <span className="w-20 text-sm text-gray-600">Step {step}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div
                  className="bg-solo-accent rounded-full h-6 flex items-center justify-end pr-2"
                  style={{ width: `${Math.max((count / health.activeUsers) * 100, 8)}%` }}
                >
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
