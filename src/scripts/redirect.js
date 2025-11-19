/**
 * Client-side URL normalization
 * Redirects uppercase URLs to lowercase and ensures trailing slashes
 */
(function() {
  const pathname = window.location.pathname;
  
  // Skip if it's the root
  if (pathname === '/') {
    return;
  }
  
  // Skip if it's a file (has extension)
  if (/\.\w+$/.test(pathname)) {
    return;
  }
  
  // Normalize: convert to lowercase and ensure trailing slash
  const lowerPathname = pathname.toLowerCase();
  const needsLowercase = lowerPathname !== pathname;
  const needsTrailingSlash = !pathname.endsWith('/');
  
  if (needsLowercase || needsTrailingSlash) {
    // Apply both transformations
    const normalizedPath = lowerPathname + (needsTrailingSlash ? '/' : '');
    const newUrl = window.location.origin + normalizedPath + window.location.search + window.location.hash;
    window.location.replace(newUrl);
  }
})();
