/**
 * Formats an ISO date string into a user-friendly readable date
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Returns a human-friendly relative time string (e.g., "5 mins ago", "2 hours ago")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  return formatDate(dateString);
}

/**
 * Truncates long URLs cleanly for UI display
 */
export function truncateUrl(url, maxLength = 48) {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return `${url.slice(0, maxLength - 3)}...`;
}

/**
 * Extracts the hostname from a URL string
 */
export function extractHostname(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Returns the configured base URL for short link redirects
 */
export function getShortUrlBase() {
  const envBase = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SHORT_URL_BASE)
    || (typeof process !== 'undefined' && process.env?.VITE_SHORT_URL_BASE);

  if (envBase && String(envBase).trim()) {
    return String(envBase).trim().replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

/**
 * Formats a raw short code or backend localhost URL into the canonical short URL using VITE_SHORT_URL_BASE
 * Example: "http://localhost:3000/abc123" -> "https://url-shortner-iqwk.onrender.com/abc123"
 */
export function buildShortUrl(shortCodeOrUrl) {
  if (!shortCodeOrUrl) return '';
  const base = getShortUrlBase();
  const code = String(shortCodeOrUrl).split('/').filter(Boolean).pop();
  return `${base}/${code}`;
}

/**
 * Formats a raw short code into a full URL using base URL (alias for buildShortUrl)
 */
export function formatShortUrl(shortCodeOrUrl) {
  return buildShortUrl(shortCodeOrUrl);
}

/**
 * Safely copies text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}
