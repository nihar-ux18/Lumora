/**
 * Safe URL sanitization utility to prevent XSS via javascript: or vbscript: URLs.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return "";
  
  const trimmed = url.trim();
  
  // Safe protocols: http, https, mailto, relative paths, query, hash
  if (
    trimmed.startsWith("/") || 
    trimmed.startsWith("http://") || 
    trimmed.startsWith("https://") || 
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("?") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  
  // Block unsafe protocols by returning a safe default
  return "#";
}
