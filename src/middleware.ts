import { defineMiddleware } from 'astro:middleware';

/**
 * Middleware to redirect URLs without trailing slash to URLs with trailing slash
 * This ensures consistency with the trailingSlash: 'always' configuration
 */
export const onRequest = defineMiddleware((context, next) => {
  const pathname = new URL(context.request.url).pathname;

  // Skip for root path
  if (pathname === '/') {
    return next();
  }

  // Skip for files (anything with a file extension)
  if (pathname.match(/\.\w+$/)) {
    return next();
  }

  // If URL doesn't end with /, redirect to URL with trailing slash
  if (!pathname.endsWith('/')) {
    const url = new URL(context.request.url);
    url.pathname = pathname + '/';
    return context.redirect(url.pathname, 301);
  }

  return next();
});
