import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser, logoutUser } from '../api/auth';
import { getMyUrls } from '../api/urls';

const AuthContext = createContext(null);

const STORAGE_USER_KEY = 'shortlink_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verify auth session against backend on mount
  const checkAuth = useCallback(async () => {
    try {
      // Calling an authenticated endpoint (/my-urls) verifies if the HTTP-only token cookie is valid
      await getMyUrls();
      // If the request succeeds, we are authenticated
      if (!user) {
        // Fallback user object if not in localStorage
        const savedUser = localStorage.getItem(STORAGE_USER_KEY);
        const parsed = savedUser ? JSON.parse(savedUser) : { username: 'User' };
        setUser(parsed);
      }
    } catch (err) {
      // 401 or network failure: clear user session
      if (err.response?.status === 401) {
        setUser(null);
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await loginUser(username, password);
      const userData = {
        username: data.username || username,
        userId: data.userId || '',
      };
      setUser(userData);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await signupUser(username, password);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || error.message || 'Signup failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
