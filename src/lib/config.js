/**
 * Application configuration utilities
 * Provides app URL functionality without relying on environment variables
 */

/**
 * Gets the base URL for the application
 * Works in both client and server contexts
 */
export function getAppBaseUrl() {
  // In browser context
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server context with headers (for API routes)
  if (typeof Headers !== 'undefined' && Headers.host) {
    return `https://${Headers.host}`;
  }
  
  // Fallback for other server contexts
  return 'https://minicdworld.vercel.app';
}

/**
 * Create a full URL from a path
 */
export function createAppUrl(path) {
  const baseUrl = getAppBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
} 