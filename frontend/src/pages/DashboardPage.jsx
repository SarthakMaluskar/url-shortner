import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getMyUrls, deleteUrl } from '../api/urls';
import UrlItem from '../components/UrlItem';
import DeleteModal from '../components/DeleteModal';
import ShortenCard from '../components/ShortenCard';
import StatCard from '../components/StatCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCreate, setShowCreate] = useState(false);

  const [urlToDelete, setUrlToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUrls = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const data = await getMyUrls();
      setUrls(data || []);
    } catch (err) {
      const msg = err.userMessage || err.message || 'Failed to load links';
      setError(msg);
      if (err.response?.status !== 401) {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUrls(true);
  };

  const handleUrlCreated = () => {
    fetchUrls(true);
    setShowCreate(false);
  };

  const handleDeleteConfirm = async () => {
    if (!urlToDelete) return;
    setIsDeleting(true);

    try {
      await deleteUrl(urlToDelete.shortCode);
      toast.success(`Deleted /${urlToDelete.shortCode}`);
      setUrls((prev) => prev.filter((u) => u.shortCode !== urlToDelete.shortCode));
      setUrlToDelete(null);
    } catch (err) {
      const msg = err.userMessage || err.message || 'Failed to delete link';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUrls = useMemo(() => {
    return urls
      .filter((item) => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return true;
        return (
          item.shortCode.toLowerCase().includes(q) ||
          item.originalURL.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'alphabetical') return a.shortCode.localeCompare(b.shortCode);
        return 0;
      });
  }, [urls, searchTerm, sortBy]);

  const customCount = useMemo(() => {
    return urls.filter((u) => u.shortCode && u.shortCode.length !== 6).length;
  }, [urls]);

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title-text">Links</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage your shortened links and view analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn btn-primary btn-sm"
          >
            {showCreate ? 'Close' : '+ Create link'}
          </button>
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="dashboard-metrics-row">
        <StatCard title="Total Links" value={urls.length} />
        <StatCard title="Custom Aliases" value={customCount} />
      </div>

      {/* Shorten Form Toggle */}
      {showCreate && (
        <div>
          <ShortenCard onCreated={handleUrlCreated} compact autoFocus />
        </div>
      )}

      {/* Links List */}
      <div className="dashboard-table-container">
        <div className="dashboard-table-toolbar">
          <input
            type="text"
            className="search-input-flat"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="sort-select-flat"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alphabetical">Code (A-Z)</option>
          </select>
        </div>

        {loading ? (
          <div className="state-box">
            <p>Loading links...</p>
          </div>
        ) : error ? (
          <div className="state-box">
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <button onClick={() => fetchUrls()} className="btn btn-outline btn-sm">
              Retry
            </button>
          </div>
        ) : filteredUrls.length === 0 ? (
          <div className="state-box">
            {searchTerm ? (
              <p>No links match "{searchTerm}".</p>
            ) : (
              <>
                <p>No links created yet.</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="btn btn-primary btn-sm"
                >
                  Create your first link
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="links-list">
            {filteredUrls.map((url) => (
              <UrlItem
                key={url._id || url.shortCode}
                url={url}
                onDeleteClick={(u) => setUrlToDelete(u)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!urlToDelete}
        onClose={() => setUrlToDelete(null)}
        onConfirm={handleDeleteConfirm}
        urlData={urlToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
