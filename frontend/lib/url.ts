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

/**
 * Resolves a backend relative asset path to a fully qualified backend URL.
 * Preserves absolute URLs unchanged.
 */
export function getBackendUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
}
