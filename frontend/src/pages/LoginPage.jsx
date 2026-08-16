import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const savedUrl = location.state?.savedUrl || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    const result = await login(username.trim(), password);

    if (result.success) {
      toast.success(`Welcome, ${result.data?.username || username}`);
      navigate(from, { replace: true, state: { initialUrl: savedUrl } });
    } else {
      setError(result.error || 'Invalid credentials');
      toast.error(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header-box">
        <h1 className="auth-header-title">Sign in</h1>
        <p className="auth-header-sub">Enter your account credentials to continue.</p>
      </div>

      {error && (
        <div className="auth-error-box" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form-box">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
          style={{ marginTop: '0.25rem' }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
