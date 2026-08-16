/**
 * Validates and normalizes destination URLs before shortening
 * @param {string} input - The raw URL string from user input
 * @returns {{ valid: boolean, error?: string, url?: string }}
 */
export function validateUrl(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Please enter a valid URL to shorten.' };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a valid URL to shorten.' };
  }

  // Reject simple words or pure numbers (e.g. "hello", "abc", "test", "12345")
  if (/^\d+$/.test(trimmed) || /^[a-zA-Z]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid URL with a domain (e.g., https://google.com or github.com).',
    };
  }

  // Reject malformed schemas or numbers in URL host like "http://12345"
  if (/^https?:\/\/\d+(\/.*)?$/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid URL (e.g., https://google.com).',
    };
  }

  let toTest = trimmed;
  if (!/^https?:\/\//i.test(toTest)) {
    toTest = 'https://' + toTest;
  }

  try {
    const parsed = new URL(toTest);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        error: 'URL must use http:// or https:// protocol.',
      };
    }

    const hostname = parsed.hostname;
    if (!hostname || hostname.includes(' ') || /^\d+$/.test(hostname)) {
      return {
        valid: false,
        error: 'Please enter a valid domain name (e.g., https://example.com).',
      };
    }

    // Allow localhost for local development testing
    if (hostname === 'localhost') {
      return { valid: true, url: parsed.toString() };
    }

    // Check valid IPv4 (4 octets each 0-255)
    const ipv4Parts = hostname.split('.');
    if (
      ipv4Parts.length === 4 &&
      ipv4Parts.every((p) => /^\d+$/.test(p) && parseInt(p, 10) >= 0 && parseInt(p, 10) <= 255)
    ) {
      return { valid: true, url: parsed.toString() };
    }

    // Check standard domain format (must have valid TLD with at least 2 chars)
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(hostname)) {
      return {
        valid: false,
        error: 'Please enter a complete and valid domain (e.g., https://example.com).',
      };
    }

    return { valid: true, url: parsed.toString() };
  } catch {
    return {
      valid: false,
      error: 'The entered URL is malformed. Please check and try again.',
    };
  }
}

/**
 * Validates custom alias if provided
 * @param {string} alias 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateCustomAlias(alias) {
  if (!alias || !alias.trim()) {
    return { valid: true };
  }
  const trimmed = alias.trim();
  if (trimmed.length > 30) {
    return { valid: false, error: 'Custom alias must be 30 characters or less.' };
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) {
    return { valid: false, error: 'Custom alias can only contain letters, numbers, hyphens (-), and underscores (_).' };
  }
  return { valid: true, alias: trimmed };
}
