import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    const pathname = new URL(context.request.url).pathname;

    if (pathname === '/') {
        return next();
    }

    if (pathname.match(/\.\w+$/)) {
        return next();
    }

    // convert to lowercase (e.g., /ai-financial-news/2025-11-15-AMZN/ -> /ai-financial-news/2025-11-15-amzn/)
    const lowerPathname = pathname.toLowerCase();
    if (lowerPathname !== pathname) {
        const url = new URL(context.request.url);
        url.pathname = lowerPathname;
        return context.redirect(url.pathname, 301);
    }

    // handle missing "/" at the end
    if (!pathname.endsWith('/')) {
        const url = new URL(context.request.url);
        url.pathname = pathname + '/';
        return context.redirect(url.pathname, 301);
    }

    return next();
});
