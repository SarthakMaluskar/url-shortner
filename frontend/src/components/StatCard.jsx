import React from 'react';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="metric-box">
      <span className="metric-label">{title}</span>
      <span className="metric-value">{value}</span>
      {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{subtitle}</span>}
    </div>
  );
}
