import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span>ShortLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <span className="user-name-text">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            )}
          </div>
          <div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="btn btn-outline btn-sm w-full"
              >
                Log out ({user?.username})
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm w-full" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm w-full" onClick={() => setMobileOpen(false)}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
