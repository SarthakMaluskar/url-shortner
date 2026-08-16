import React, { useEffect } from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm, urlData, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !urlData) return null;

  return (
    <div className="modal-overlay" onClick={!isDeleting ? onClose : undefined}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="modal-title-text">Delete short link</h3>
        <p className="modal-body-text">
          Are you sure you want to delete <code style={{ fontFamily: 'var(--font-mono)' }}>/{urlData.shortCode}</code>? This will permanently stop traffic from redirecting to:
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: '4px', wordBreak: 'break-all' }}>
          {urlData.originalURL}
        </p>

        <div className="modal-actions-row">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete link'}
          </button>
        </div>
      </div>
    </div>
  );
}
