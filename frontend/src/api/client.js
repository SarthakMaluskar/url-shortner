import axios from 'axios';

// Get base URL from environment; default to '/api' for local dev proxy
const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Explicitly guarantee withCredentials is set on every single request
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to extract meaningful backend error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const dataMessage = error.response?.data?.message;
    const requestUrl = (error.config?.baseURL || '') + (error.config?.url || '');

    let message = 'An unexpected error occurred';

    if (error.response) {
      if (status === 401) {
        message = 'Session expired or unauthenticated. Please sign in.';
      } else if (dataMessage) {
        message = dataMessage;
      } else if (status === 400) {
        message = 'Bad request: Please check your input.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status === 409) {
        message = 'Conflict: The requested alias already exists.';
      } else if (status === 429) {
        message = 'Too many requests. Please slow down and try again.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      if (error.code === 'ERR_NETWORK') {
        message = `Network or CORS error connecting to ${requestUrl}. Ensure the server allows cross-origin requests with credentials.`;
      } else {
        message = `Could not connect to ${requestUrl}. Please ensure the server is online.`;
      }
    } else {
      message = error.message;
    }

    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
