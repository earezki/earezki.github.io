---
title: "Bundle Google Fonts with your NativePHP Mobile application"
pubDate: 2025-11-17
description: "Bundling Google Fonts in NativePHP apps cuts boot time from 2-5 seconds to instant."
categories: ["AI News", "nativephp", "laravel"]
---

## Bundle Google Fonts with your NativePHP Mobile application

Using Google Fonts in NativePHP mobile apps can cause 2-5 second boot delays due to incorrect URL resolution. The log1x/laravel-webfonts package solves this by bundling fonts locally with relative imports.

### Why This Matters
The ideal model assumes CDN fonts load instantly, but mobile apps running on `http://127.0.0.1` fail to resolve absolute URLs like `http://localhost:8000`. This forces fallback to Google’s CDN, causing timeouts until caching occurs. The technical reality demands local font bundling for deterministic performance.

### Key Insights
- "Boot time reduced from 2-5s to instant" (Author, 2025)
- "Sagas over ACID for e-commerce" (Not applicable here, but illustrates tradeoffs)
- "log1x/laravel-webfonts used by NativePHP developers" (Author’s recommendation)

### Working Example
```bash
composer require log1x/laravel-webfonts --dev
```

```bash
php artisan webfonts:add
```

```css
@import './fonts.css';
```

### Practical Applications
- **Use Case**: NativePHP mobile apps requiring offline font rendering
- **Pitfall**: Using spatie/laravel-google-fonts with absolute URLs causes repeated timeouts

**References:**
- https://dev.to/michaelishri/bundle-google-fonts-with-your-nativephp-mobile-application-1l84
---