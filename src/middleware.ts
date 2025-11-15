import { defineMiddleware } from 'astro:middleware';

/**
 * Note: Middleware only works with SSR (server-side rendering).
 * For GitHub Pages (static hosting), URL normalization is handled
 * client-side in BaseLayout.astro instead.
 */

export const onRequest = defineMiddleware((context, next) => {
    // Middleware is disabled for static sites
    // URL normalization is handled client-side
    return next();
});
