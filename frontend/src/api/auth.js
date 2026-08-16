import apiClient from './client';

console.log("API URL:", import.meta.env.VITE_API_URL);

/**
 * Register a new user account
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{message: string}>}
 */
export async function signupUser(username, password) {
  const response = await apiClient.post('/signup', {
    username,
    password,
  });
  return response.data;
}

/**
 * Log in an existing user
 * Sets HTTP-only cookie 'token' on backend
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, username: string, userId: string}>}
 */
export async function loginUser(username, password) {
  const response = await apiClient.post('/login', {
    username,
    password,
  });
  return response.data;
}

/**
 * Log out current user and clear HTTP-only cookie
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function logoutUser() {
  const response = await apiClient.post('/logout');
  return response.data;
}
