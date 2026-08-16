import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Page not found.</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-sm">
          Home
        </Link>
        <Link to="/dashboard" className="btn btn-outline btn-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
