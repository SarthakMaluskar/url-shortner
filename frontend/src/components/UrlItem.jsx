import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { copyToClipboard, formatDate, formatRelativeTime, truncateUrl, buildShortUrl } from '../utils/formatters';

export default function UrlItem({ url, onDeleteClick }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const fullShortUrl = buildShortUrl(url.shortCode);

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

  return (
    <div className="link-row">
      <div className="link-main-info">
        <div className="link-code-row">
          <a
            href={fullShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-short-text"
          >
            /{url.shortCode}
          </a>

          {url.shortCode && url.shortCode.length !== 6 && (
            <span className="alias-badge">custom</span>
          )}

          <span className="link-date-text" title={formatDate(url.createdAt)}>
            {formatRelativeTime(url.createdAt)}
          </span>
        </div>

        <span className="link-target-text" title={url.originalURL}>
          {truncateUrl(url.originalURL, 70)}
        </span>
      </div>

      <div className="link-actions">
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

        <Link
          to={`/analytics/${url.shortCode}`}
          className="btn btn-outline btn-sm"
        >
          Analytics
        </Link>

        <button
          onClick={() => onDeleteClick(url)}
          className="btn btn-outline-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
