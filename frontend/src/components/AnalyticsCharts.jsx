import React from 'react';

export default function AnalyticsCharts({ analytics }) {
  const clicksPerDay = analytics?.clicksPerDay || [];
  const topReferrers = analytics?.topReferrers || [];

  // Generate 5-day array
  const chartDays = (() => {
    const days = [];
    const clickMap = new Map();
    clicksPerDay.forEach((item) => {
      clickMap.set(item._id, item.totalClicks);
    });

    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const displayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
      days.push({
        date: dateKey,
        label: displayLabel,
        clicks: clickMap.get(dateKey) || 0,
      });
    }
    return days;
  })();

  const maxClicks = Math.max(...chartDays.map((d) => d.clicks), 1);

  return (
    <div className="analytics-grid">
      {/* 5-Day Click Activity */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Daily Clicks (Last 5 Days)</h3>

        <div className="chart-bars-simple">
          {chartDays.map((day) => {
            const heightPercent = (day.clicks / maxClicks) * 100;

            return (
              <div key={day.date} className="bar-col">
                <span className="bar-count-label">{day.clicks}</span>
                <div
                  className="bar-rect"
                  style={{ height: `${Math.max(heightPercent, 4)}%` }}
                ></div>
                <span className="bar-date-label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Referrers */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Top Referral Sources</h3>

        <div className="referrers-table">
          {topReferrers.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', padding: '1rem 0' }}>
              No referrer data recorded yet.
            </p>
          ) : (
            topReferrers.map((item, index) => (
              <div key={index} className="referrer-item">
                <span className="referrer-name-text" title={item._id || 'Direct'}>
                  {item._id || 'Direct / None'}
                </span>
                <span className="referrer-val">{item.count} click{item.count === 1 ? '' : 's'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
