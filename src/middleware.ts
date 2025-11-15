import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    const pathname = new URL(context.request.url).pathname;

    if (pathname === '/') {
        return next();
    }

    if (pathname.match(/\.\w+$/)) {
        return next();
    }

    // Normalize pathname: convert to lowercase and ensure trailing slash
    const lowerPathname = pathname.toLowerCase();
    const needsLowercase = lowerPathname !== pathname;
    const needsTrailingSlash = !pathname.endsWith('/');
    
    if (needsLowercase || needsTrailingSlash) {
        const url = new URL(context.request.url);
        // Apply both transformations: lowercase and trailing slash
        url.pathname = lowerPathname + (needsTrailingSlash ? '/' : '');
        return context.redirect(url.toString(), 301);
    }

    return next();
});
