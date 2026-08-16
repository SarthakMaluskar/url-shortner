import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getUrlAnalytics } from '../api/analytics';
import { copyToClipboard, formatDate, formatRelativeTime } from '../utils/formatters';
import AnalyticsCharts from '../components/AnalyticsCharts';
import StatCard from '../components/StatCard';

export default function AnalyticsPage() {
  const { shortCode } = useParams();
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!shortCode) return;
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const data = await getUrlAnalytics(shortCode);
      setAnalytics(data);
    } catch (err) {
      const msg = err.userMessage || err.message || 'Failed to load analytics';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shortCode, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics(true);
  };

  const backendBase = import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost:3000';
  const fullShortUrl = `${backendBase.replace(/\/$/, '')}/${shortCode}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(fullShortUrl);
    if (success) {
      setCopied(true);
      toast.success('Copied');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="state-box">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="state-box">
        <p style={{ color: 'var(--danger)' }}>{error || 'Analytics unavailable'}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Link to="/dashboard" className="btn btn-outline btn-sm">
            &larr; Back to Dashboard
          </Link>
          <button onClick={() => fetchAnalytics()} className="btn btn-primary btn-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            &larr; Back to Links
          </Link>
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            disabled={refreshing}
          >
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        <div className="analytics-code-banner">
          <div>
            <h1 className="analytics-code-title">/{analytics.shortCode}</h1>
            <p className="analytics-dest-row">
              Target: <a href={analytics.originalURL} target="_blank" rel="noopener noreferrer">{analytics.originalURL}</a>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleCopy}
              className="btn btn-outline btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Visit
            </a>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="dashboard-metrics-row">
        <StatCard title="Total Clicks" value={analytics.totalClicks.toLocaleString()} />
        <StatCard title="Last 24 Hours" value={analytics.clicksLast24Hours.toLocaleString()} />
        <StatCard title="Unique Visitors" value={analytics.uniqueVisitors.toLocaleString()} />
        <StatCard
          title="Last Clicked"
          value={formatRelativeTime(analytics.lastClickedAt)}
          subtitle={analytics.lastClickedAt ? formatDate(analytics.lastClickedAt) : 'No clicks'}
        />
      </div>

      {/* Visualizations */}
      <AnalyticsCharts analytics={analytics} />

      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', paddingTop: '1rem' }}>
        Link created {formatDate(analytics.createdAt)}
      </p>
    </div>
  );
}
