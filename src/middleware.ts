import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const pathname = new URL(context.request.url).pathname;

  if (pathname === '/') {
    return next();
  }

  if (pathname.match(/\.\w+$/)) {
    return next();
  }

  if (!pathname.endsWith('/')) {
    const url = new URL(context.request.url);
    url.pathname = pathname + '/';
    return context.redirect(url.pathname, 301);
  }

  return next();
});
