import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const { signup, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const result = await signup(trimmed, password);

    if (result.success) {
      toast.success('Account created');
      const loginResult = await login(trimmed, password);
      if (loginResult.success) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      setError(result.error || 'Failed to create account.');
      toast.error(result.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header-box">
        <h1 className="auth-header-title">Create account</h1>
        <p className="auth-header-sub">Get started with link shortening and analytics.</p>
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

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-input"
            placeholder="repeat password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
