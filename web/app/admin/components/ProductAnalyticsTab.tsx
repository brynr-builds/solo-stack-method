import React from 'react';

type ProductAnalyticsTabProps = {
  analytics: {
    dau: number;
    wau: number;
    freeToConversion: number;
    promptGenerationCount: number;
    signupsDaily: Array<{ date: string; count: number }>;
    auditScoreDistribution: Array<{ range: string; count: number }>;
    signupsWeekly: Array<{ week: string; count: number }>;
  };
};

export function ProductAnalyticsTab({ analytics }: ProductAnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-primary">{analytics.dau}</div>
          <div className="text-sm text-gray-600 mt-1">DAU</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-accent">{analytics.wau}</div>
          <div className="text-sm text-gray-600 mt-1">WAU</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-solo-success">{analytics.freeToConversion}%</div>
          <div className="text-sm text-gray-600 mt-1">Free → Paid</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-gray-700">{analytics.promptGenerationCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">Prompts Generated</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Signups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Signups (Last 7 Days)</h3>
          <div className="space-y-2">
            {analytics.signupsDaily.map(day => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="w-24 text-xs text-gray-500 font-mono">{day.date.slice(5)}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                  <div
                    className="bg-solo-accent rounded-full h-5"
                    style={{ width: `${(day.count / 20) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{day.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Score Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Audit Score Distribution</h3>
          <div className="space-y-2">
            {analytics.auditScoreDistribution.map(bucket => (
              <div key={bucket.range} className="flex items-center gap-4">
                <span className="w-16 text-xs text-gray-500">{bucket.range}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                  <div
                    className="bg-solo-success rounded-full h-5"
                    style={{ width: `${(bucket.count / 50) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{bucket.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Signups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Signups</h3>
        <div className="flex items-end gap-4 h-40">
          {analytics.signupsWeekly.map(week => (
            <div key={week.week} className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium text-gray-700 mb-1">{week.count}</span>
              <div
                className="w-full bg-solo-accent rounded-t-lg"
                style={{ height: `${(week.count / 80) * 100}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{week.week}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
