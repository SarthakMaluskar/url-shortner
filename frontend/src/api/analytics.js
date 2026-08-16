import apiClient from './client';

/**
 * Fetch analytics metrics for a specific shortCode
 * @param {string} shortCode 
 * @returns {Promise<{
 *   shortCode: string,
 *   originalURL: string,
 *   totalClicks: number,
 *   lastClickedAt: string|null,
 *   clicksLast24Hours: number,
 *   createdAt: string,
 *   uniqueVisitors: number,
 *   clicksPerDay: Array<{_id: string, totalClicks: number}>,
 *   topReferrers: Array<{_id: string, count: number}>
 * }>}
 */
export async function getUrlAnalytics(shortCode) {
  const response = await apiClient.get(`/analytics/${encodeURIComponent(shortCode)}`);
  return response.data;
}
