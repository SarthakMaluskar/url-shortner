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
 * Formats a raw short code into a full URL using base URL
 */
export function formatShortUrl(shortCodeOrUrl, baseUrl = 'http://localhost:3000') {
  if (!shortCodeOrUrl) return '';
  if (shortCodeOrUrl.startsWith('http://') || shortCodeOrUrl.startsWith('https://')) {
    return shortCodeOrUrl;
  }
  const cleanBase = (baseUrl || 'http://localhost:3000').replace(/\/$/, '');
  return `${cleanBase}/${shortCodeOrUrl}`;
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
