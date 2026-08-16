import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span>&copy; {new Date().getFullYear()} ShortLink</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
          <Link to="/dashboard" style={{ color: 'inherit' }}>Dashboard</Link>
          <Link to="/login" style={{ color: 'inherit' }}>Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
