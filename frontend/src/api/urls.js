import apiClient from './client';

/**
 * Shorten a new URL (optionally with a custom alias)
 * @param {string} url - The original long URL
 * @param {string} [custom] - Optional custom alias
 * @returns {Promise<{message: string}>}
 */
export async function shortenUrl(url, custom = null) {
  const payload = { url };
  if (custom && custom.trim().length > 0) {
    payload.custom = custom.trim();
  }
  const response = await apiClient.post('/shorten', payload);
  return response.data;
}

/**
 * Fetch all URLs belonging to the authenticated user
 * @returns {Promise<Array<{_id: string, originalURL: string, shortCode: string, owner: string, createdAt: string, updatedAt: string}>>}
 */
export async function getMyUrls() {
  const response = await apiClient.get('/my-urls');
  return response.data?.data || [];
}

/**
 * Delete a shortened URL by its shortCode
 * @param {string} code - The shortCode to delete
 * @returns {Promise<{message: string}>}
 */
export async function deleteUrl(code) {
  const response = await apiClient.delete(`/delete/${encodeURIComponent(code)}`);
  return response.data;
}
