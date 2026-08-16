import axios from 'axios';

// Get base URL from environment; default to '/api' to leverage Vite proxy and prevent CORS issues
const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL
  : '/api';

console.log('[API Client Initialized] Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${fullUrl}`, config.data ? { payload: config.data } : '');
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to extract meaningful backend error messages
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[HTTP Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const dataMessage = error.response?.data?.message;
    const requestUrl = (error.config?.baseURL || '') + (error.config?.url || '');

    console.error('[HTTP Error]', {
      url: requestUrl,
      method: error.config?.method?.toUpperCase(),
      code: error.code,
      status: status || 'No Response (CORS or Server Offline)',
      errorName: error.name,
      errorMessage: error.message,
      responseData: error.response?.data,
    });

    let message = 'An unexpected error occurred';

    if (error.response) {
      if (dataMessage) {
        message = dataMessage;
      } else if (status === 400) {
        message = 'Bad request: Please check your input parameters.';
      } else if (status === 401) {
        message = 'Authentication required or session expired. Please log in.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status === 409) {
        message = 'Conflict: The requested alias or resource already exists.';
      } else if (status === 429) {
        message = 'Too many requests. Rate limit reached, please try again in a few seconds.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      if (error.code === 'ERR_NETWORK') {
        message = `Network or CORS error connecting to ${requestUrl}. If using a direct URL, verify the backend allows CORS with credentials, or set VITE_API_URL=/api to use the Vite proxy.`;
      } else {
        message = `Could not connect to ${requestUrl}. Please ensure the backend is running.`;
      }
    } else {
      message = error.message;
    }

    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
