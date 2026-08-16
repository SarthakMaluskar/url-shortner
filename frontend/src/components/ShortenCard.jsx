import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { shortenUrl } from '../api/urls';
import { copyToClipboard } from '../utils/formatters';
import { validateUrl, validateCustomAlias } from '../utils/validators';

export default function ShortenCard({ onCreated, autoFocus = false, compact = false }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate URL
    const urlValidation = validateUrl(longUrl);
    if (!urlValidation.valid) {
      setError(urlValidation.error);
      return;
    }

    // Validate Custom Alias
    if (customAlias && customAlias.trim()) {
      const aliasValidation = validateCustomAlias(customAlias);
      if (!aliasValidation.valid) {
        setError(aliasValidation.error);
        return;
      }
    }

    if (!isAuthenticated) {
      toast.info('Sign in to create and manage short links.');
      navigate('/login', { state: { savedUrl: longUrl, savedAlias: customAlias } });
      return;
    }

    const validatedUrl = urlValidation.url;
    setLoading(true);

    try {
      const response = await shortenUrl(validatedUrl, customAlias.trim() || null);
      
      const shortUrl = response.message;
      const shortCode = shortUrl.split('/').pop();

      const createdObj = {
        shortUrl,
        shortCode,
        originalURL: validatedUrl,
        customAlias: customAlias.trim() || null,
      };

      setResult(createdObj);
      toast.success('Short link generated');

      if (onCreated) {
        onCreated(createdObj);
      }
    } catch (err) {
      const errorMsg = err.userMessage || err.message || 'Failed to shorten URL';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;
    const success = await copyToClipboard(result.shortUrl);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleReset = () => {
    setLongUrl('');
    setCustomAlias('');
    setShowCustom(false);
    setError(null);
    setResult(null);
    setCopied(false);
  };

  return (
    <div className="shorten-container">
      {!result ? (
        <form onSubmit={handleSubmit} className="shorten-form" noValidate>
          <div className="shorten-input-row">
            <div className="shorten-input-wrapper">
              <input
                type="text"
                className={`url-input ${error ? 'input-error' : ''}`}
                placeholder="Paste a long URL (e.g. https://example.com/very/long/path)..."
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus={autoFocus}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !longUrl.trim()}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>

          {/* Custom Alias Option */}
          <div className="custom-alias-row">
            <button
              type="button"
              className="custom-alias-toggle-btn"
              onClick={() => setShowCustom(!showCustom)}
              disabled={loading}
            >
              {showCustom ? '− Remove custom alias' : '+ Add custom alias'}
            </button>

            {showCustom && (
              <div className="custom-alias-input-box">
                <span className="alias-prefix">
                  {window.location.host}/
                </span>
                <input
                  type="text"
                  className="alias-field"
                  placeholder="custom-slug"
                  value={customAlias}
                  onChange={(e) => {
                    setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''));
                    if (error) setError(null);
                  }}
                  maxLength={30}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Unauthenticated note */}
          {!isAuthenticated && (
            <p className="auth-notice-text">
              Sign in required to create links. <Link to="/login">Sign in</Link> or <Link to="/signup">Sign up</Link>
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="form-error-msg" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        /* Result View */
        <div className="shorten-result">
          <div className="shorten-result-text">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="result-short-link"
            >
              {result.shortUrl}
            </a>
            <span className="result-dest-link" title={result.originalURL}>
              &rarr; {result.originalURL}
            </span>
          </div>

          <div className="result-actions-row">
            <button
              onClick={handleCopy}
              className="btn btn-primary btn-sm"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>

            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Visit
            </a>

            {result.shortCode && (
              <Link
                to={`/analytics/${result.shortCode}`}
                className="btn btn-outline btn-sm"
              >
                Analytics
              </Link>
            )}

            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm"
            >
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
