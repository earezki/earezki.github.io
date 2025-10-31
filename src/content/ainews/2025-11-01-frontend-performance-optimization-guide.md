---
title: 'Frontend Performance Optimization: Complete Guide to Building Fast Web Apps'
pubDate: '2025-11-01 17:00:00 +0000'
description: 'Master frontend performance optimization with proven techniques for loading speed, runtime performance, bundle size, critical rendering path, and Core Web Vitals. Complete guide with practical examples.'
categories:
  - Frontend
  - Performance
  - Web Development
  - JavaScript
---

# Frontend Performance Optimization: Complete Guide to Building Fast Web Apps

Performance is critical for modern web applications. This comprehensive guide covers everything from initial page load to runtime performance, with practical examples and proven techniques used by top companies.

## Table of Contents

1. [Performance Metrics](#metrics)
2. [Critical Rendering Path](#rendering-path)
3. [JavaScript Performance](#javascript)
4. [CSS Optimization](#css)
5. [Image and Media Optimization](#images)
6. [Network Optimization](#network)
7. [Bundle Size Optimization](#bundles)
8. [Runtime Performance](#runtime)
9. [Core Web Vitals](#web-vitals)
10. [Monitoring and Tools](#monitoring)

## Performance Metrics {#metrics}

### 1. Key Performance Indicators

```javascript
// Core Web Vitals
const webVitals = {
  // Largest Contentful Paint - Loading performance
  LCP: '< 2.5s',  // Good
  
  // First Input Delay - Interactivity
  FID: '< 100ms',  // Good
  
  // Cumulative Layout Shift - Visual stability
  CLS: '< 0.1',  // Good
  
  // Interaction to Next Paint (replacing FID)
  INP: '< 200ms',  // Good
};

// Other important metrics
const otherMetrics = {
  // Time to First Byte
  TTFB: '< 800ms',
  
  // First Contentful Paint
  FCP: '< 1.8s',
  
  // Time to Interactive
  TTI: '< 3.8s',
  
  // Total Blocking Time
  TBT: '< 200ms',
  
  // Speed Index
  SI: '< 3.4s',
};
```

### 2. Measuring Performance

```javascript
// Performance Observer API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Performance entry:', {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType
    });
  }
});

observer.observe({
  entryTypes: ['navigation', 'resource', 'paint', 'measure']
});

// Navigation Timing API
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  
  console.log({
    // DNS lookup
    dnsTime: perfData.domainLookupEnd - perfData.domainLookupStart,
    
    // TCP connection
    tcpTime: perfData.connectEnd - perfData.connectStart,
    
    // Request + Response
    requestTime: perfData.responseEnd - perfData.requestStart,
    
    // DOM processing
    domProcessing: perfData.domComplete - perfData.domInteractive,
    
    // Full page load
    pageLoad: perfData.loadEventEnd - perfData.fetchStart
  });
});

// Resource Timing API
const resources = performance.getEntriesByType('resource');

resources.forEach(resource => {
  console.log({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType
  });
});

// User Timing API - Custom measurements
performance.mark('component-render-start');

// ... component rendering code ...

performance.mark('component-render-end');
performance.measure(
  'component-render',
  'component-render-start',
  'component-render-end'
);

const measure = performance.getEntriesByName('component-render')[0];
console.log(`Component render took ${measure.duration}ms`);
```

### 3. Web Vitals Library

```javascript
// Install: npm install web-vitals

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Measure and send to analytics
function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating
  });
  
  // Use `navigator.sendBeacon()` if available
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

// Track all Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Custom implementation
function measureLCP() {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      resolve(lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

measureLCP().then((lcp) => {
  console.log('LCP:', lcp);
});
```

## Critical Rendering Path {#rendering-path}

### 1. HTML Optimization

```html
<!-- ❌ Bad: Render-blocking CSS -->
<head>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="print.css">
</head>

<!-- ✅ Good: Non-blocking CSS -->
<head>
  <!-- Critical CSS inline -->
  <style>
    /* Above-the-fold styles */
    body { margin: 0; font-family: sans-serif; }
    .header { background: #333; color: white; }
  </style>
  
  <!-- Non-critical CSS async -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
  
  <!-- Media-specific CSS -->
  <link rel="stylesheet" href="print.css" media="print">
</head>

<!-- ❌ Bad: Render-blocking JavaScript -->
<head>
  <script src="app.js"></script>
</head>

<!-- ✅ Good: Non-blocking JavaScript -->
<head>
  <!-- Critical JS inline -->
  <script>
    // Only critical code here
    window.APP_CONFIG = { theme: 'dark' };
  </script>
</head>
<body>
  <!-- Content -->
  
  <!-- Scripts at end of body -->
  <script src="app.js" defer></script>
  <script src="analytics.js" async></script>
</body>

<!-- Resource hints -->
<head>
  <!-- Preconnect to required origins -->
  <link rel="preconnect" href="https://api.example.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- DNS prefetch for third-party domains -->
  <link rel="dns-prefetch" href="https://analytics.example.com">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="hero-image.jpg" as="image">
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Prefetch next page resources -->
  <link rel="prefetch" href="/next-page.html">
</head>
```

### 2. Critical CSS Extraction

```javascript
// Using critical package
const critical = require('critical');

critical.generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  dest: 'index-critical.html',
  dimensions: [
    {
      height: 900,
      width: 1300,
    },
    {
      height: 720,
      width: 480,
    },
  ],
});

// Webpack plugin for critical CSS
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlCriticalWebpackPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: true,
      dimensions: [{
        height: 900,
        width: 1300,
      }],
    }),
  ],
};
```

### 3. Lazy Loading

```javascript
// Image lazy loading (native)
<img src="hero.jpg" loading="lazy" alt="Hero image">

// Intersection Observer for custom lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px' // Load 50px before entering viewport
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});

// Component lazy loading
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}

// Route-based code splitting
const routes = [
  {
    path: '/',
    component: React.lazy(() => import('./pages/Home'))
  },
  {
    path: '/about',
    component: React.lazy(() => import('./pages/About'))
  },
  {
    path: '/dashboard',
    component: React.lazy(() => import('./pages/Dashboard'))
  }
];

// Script lazy loading
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Load when needed
button.addEventListener('click', async () => {
  await loadScript('https://maps.googleapis.com/maps/api/js');
  initializeMap();
});
```

## JavaScript Performance {#javascript}

### 1. Debouncing and Throttling

```javascript
// Debounce - Execute after delay, reset on each call
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage: Search input
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // API call here
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle - Execute at most once per interval
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll handler
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);

// RequestAnimationFrame throttle for smooth animations
function rafThrottle(func) {
  let rafId = null;
  return function(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
}

const smoothScrollHandler = rafThrottle(() => {
  // Update UI based on scroll
  updateParallaxEffect();
});

window.addEventListener('scroll', smoothScrollHandler);
```

### 2. Web Workers

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { type, data } = e.data;
  
  if (type === 'HEAVY_COMPUTATION') {
    const result = performHeavyComputation(data);
    self.postMessage({ type: 'RESULT', result });
  }
});

function performHeavyComputation(data) {
  // CPU-intensive task
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// main.js
const worker = new Worker('worker.js');

worker.addEventListener('message', (e) => {
  if (e.data.type === 'RESULT') {
    console.log('Result:', e.data.result);
    updateUI(e.data.result);
  }
});

worker.addEventListener('error', (error) => {
  console.error('Worker error:', error);
});

// Send data to worker
function processData(data) {
  worker.postMessage({ type: 'HEAVY_COMPUTATION', data });
}

// Shared Worker for multiple tabs
const sharedWorker = new SharedWorker('shared-worker.js');

sharedWorker.port.start();
sharedWorker.port.postMessage({ type: 'CONNECT' });

sharedWorker.port.addEventListener('message', (e) => {
  console.log('Message from shared worker:', e.data);
});

// Worker pool for parallel processing
class WorkerPool {
  constructor(workerPath, poolSize = navigator.hardwareConcurrency) {
    this.workers = [];
    this.queue = [];
    
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerPath);
      worker.busy = false;
      worker.addEventListener('message', (e) => this.handleMessage(worker, e));
      this.workers.push(worker);
    }
  }
  
  execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker || this.queue.length === 0) return;
    
    const { data, resolve, reject } = this.queue.shift();
    availableWorker.busy = true;
    availableWorker.currentResolve = resolve;
    availableWorker.postMessage({ type: 'PROCESS', data });
  }
  
  handleMessage(worker, event) {
    worker.busy = false;
    if (worker.currentResolve) {
      worker.currentResolve(event.data);
      worker.currentResolve = null;
    }
    this.processQueue();
  }
  
  terminate() {
    this.workers.forEach(w => w.terminate());
  }
}

// Usage
const pool = new WorkerPool('worker.js', 4);

const tasks = Array.from({ length: 100 }, (_, i) => i);
const results = await Promise.all(
  tasks.map(task => pool.execute(task))
);
```

### 3. Code Splitting Strategies

```javascript
// Dynamic imports
async function loadModule() {
  const module = await import('./heavy-module.js');
  module.doSomething();
}

// Conditional loading
async function loadFeature() {
  if (user.isPremium) {
    const { PremiumFeature } = await import('./premium-feature.js');
    return new PremiumFeature();
  }
  return null;
}

// Webpack magic comments
import(
  /* webpackChunkName: "chart" */
  /* webpackPrefetch: true */
  './chart-library.js'
).then(module => {
  module.renderChart(data);
});

// React loadable components
import loadable from '@loadable/component';

const HeavyComponent = loadable(() => import('./HeavyComponent'), {
  fallback: <LoadingSpinner />,
});

// Preload on hover
function PreloadLink({ to, children }) {
  const handleMouseEnter = () => {
    import(/* webpackPrefetch: true */ `./pages${to}`);
  };
  
  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}

// Progressive enhancement
class FeatureLoader {
  static async loadIfSupported(feature, modulePath) {
    if (!this.isSupported(feature)) {
      console.log(`${feature} not supported`);
      return null;
    }
    
    return await import(modulePath);
  }
  
  static isSupported(feature) {
    const support = {
      'webgl': () => {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      },
      'webrtc': () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      'serviceWorker': () => 'serviceWorker' in navigator
    };
    
    return support[feature] ? support[feature]() : false;
  }
}

// Usage
const webglModule = await FeatureLoader.loadIfSupported('webgl', './webgl-features.js');
if (webglModule) {
  webglModule.initialize();
}
```

## CSS Optimization {#css}

### 1. CSS Performance Best Practices

```css
/* ❌ Bad: Expensive selectors */
div > div > div > p {
  color: red;
}

* {
  box-sizing: border-box;
}

/* ✅ Good: Specific, shallow selectors */
.paragraph {
  color: red;
}

/* Reset with specificity */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ❌ Bad: Triggers layout */
.element {
  width: 100px;
  height: 100px;
  top: 10px;
  left: 10px;
}

/* ✅ Good: Uses transform for animations */
.element {
  width: 100px;
  height: 100px;
  transform: translate(10px, 10px);
  will-change: transform;
}

/* Use containment for isolated components */
.card {
  contain: layout style paint;
}

.isolated-component {
  contain: content;
}

/* Content visibility for off-screen content */
.long-article section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Estimated height */
}

/* GPU acceleration */
.animated {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform; /* Hint to browser */
}

/* Efficient animations */
@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.sliding-element {
  animation: slide 0.3s ease-out;
}
```

### 2. CSS Loading Strategies

```html
<!-- Critical CSS inline -->
<style>
  /* Above-the-fold styles */
</style>

<!-- Preload non-critical CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">

<!-- Font loading strategies -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- ❌ Bad: Blocking font load -->
<link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet">

<!-- ✅ Good: Optimized font load -->
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

<style>
  /* Font loading with fallback */
  @font-face {
    font-family: 'MyFont';
    src: url('/fonts/myfont.woff2') format('woff2');
    font-display: swap; /* Show fallback immediately */
  }
  
  body {
    font-family: 'MyFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
</style>

<!-- Variable fonts for better performance -->
<style>
  @font-face {
    font-family: 'Variable Font';
    src: url('/fonts/variable-font.woff2') format('woff2-variations');
    font-weight: 100 900; /* Full weight range */
    font-style: normal italic;
  }
</style>
```

### 3. CSS-in-JS Performance

```javascript
// Styled-components with SSR
import styled from 'styled-components';
import { ServerStyleSheet } from 'styled-components';

// Extract critical CSS on server
const sheet = new ServerStyleSheet();
const html = renderToString(sheet.collectStyles(<App />));
const styleTags = sheet.getStyleTags();

// Emotion with zero-runtime
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// Styles computed at build time
const styles = css`
  color: ${theme.primary};
  padding: 1rem;
`;

// CSS Modules for optimal performance
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}

// Atomic CSS with Tailwind
<div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg">
  Content
</div>

// Dynamic styles optimization
const Button = styled.button`
  /* Static styles - extracted once */
  padding: 1rem 2rem;
  border-radius: 4px;
  
  /* Dynamic styles - computed per instance */
  ${props => props.variant === 'primary' && `
    background: blue;
    color: white;
  `}
`;

// Better: Use CSS custom properties
const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 4px;
  background: var(--button-bg);
  color: var(--button-color);
`;

<Button style={{
  '--button-bg': variant === 'primary' ? 'blue' : 'gray',
  '--button-color': 'white'
}} />
```

## Image and Media Optimization {#images}

### 1. Modern Image Formats

```html
<!-- Responsive images with srcset -->
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px,
         (max-width: 1000px) 800px,
         1200px"
  alt="Description"
  loading="lazy"
  decoding="async"
>

<!-- Modern formats with fallback -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

<!-- Art direction -->
<picture>
  <source
    media="(min-width: 1000px)"
    srcset="desktop-image.jpg"
  >
  <source
    media="(min-width: 600px)"
    srcset="tablet-image.jpg"
  >
  <img src="mobile-image.jpg" alt="Description">
</picture>

<!-- Background images with image-set -->
<style>
  .hero {
    background-image: image-set(
      url('hero.avif') type('image/avif'),
      url('hero.webp') type('image/webp'),
      url('hero.jpg') type('image/jpeg')
    );
  }
</style>
```

### 2. Image Optimization Techniques

```javascript
// Sharp for Node.js image processing
const sharp = require('sharp');

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(1200, 800, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

// Generate responsive image set
async function generateResponsiveImages(inputPath, outputDir) {
  const sizes = [400, 800, 1200, 1600];
  
  await Promise.all(
    sizes.map(async (size) => {
      await sharp(inputPath)
        .resize(size)
        .webp({ quality: 80 })
        .toFile(`${outputDir}/image-${size}.webp`);
      
      await sharp(inputPath)
        .resize(size)
        .jpeg({ quality: 80, progressive: true })
        .toFile(`${outputDir}/image-${size}.jpg`);
    })
  );
}

// Progressive JPEG
await sharp('input.jpg')
  .jpeg({ quality: 80, progressive: true })
  .toFile('output.jpg');

// Blur placeholder (LQIP)
async function generatePlaceholder(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(20) // Tiny size
    .blur(10)
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

// Client-side lazy loading with blur-up
function LazyImage({ src, placeholder }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="image-container">
      <img
        src={placeholder}
        className={`placeholder ${loaded ? 'hidden' : ''}`}
        alt=""
      />
      <img
        src={src}
        className={`main-image ${loaded ? 'visible' : ''}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        alt="Description"
      />
    </div>
  );
}
```

### 3. Video Optimization

```html
<!-- Optimized video delivery -->
<video
  width="1280"
  height="720"
  poster="poster.jpg"
  preload="metadata"
  controls
  playsinline
>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  Your browser doesn't support video.
</video>

<!-- Lazy load video -->
<video
  data-src="video.mp4"
  poster="poster.jpg"
  class="lazy-video"
></video>

<script>
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      video.src = video.dataset.src;
      video.load();
      videoObserver.unobserve(video);
    }
  });
});

document.querySelectorAll('.lazy-video').forEach(video => {
  videoObserver.observe(video);
});
</script>

<!-- Adaptive streaming with HLS -->
<video id="video" controls></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video');
  const hls = new Hls();
  
  hls.loadSource('video.m3u8');
  hls.attachMedia(video);
  
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    video.play();
  });
</script>
```

## Network Optimization {#network}

### 1. HTTP/2 and HTTP/3

```javascript
// HTTP/2 Server Push (Node.js)
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
});

server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    // Push critical resources
    stream.pushStream({ ':path': '/styles.css' }, (err, pushStream) => {
      if (!err) {
        pushStream.respondWithFile('styles.css');
      }
    });
    
    stream.pushStream({ ':path': '/app.js' }, (err, pushStream) => {
      if (!err) {
        pushStream.respondWithFile('app.js');
      }
    });
    
    stream.respondWithFile('index.html');
  }
});

// Early Hints (103 status)
app.get('/', (req, res) => {
  // Send early hints
  res.writeEarlyHints({
    link: [
      '</styles.css>; rel=preload; as=style',
      '</app.js>; rel=preload; as=script'
    ]
  });
  
  // Send actual response
  res.sendFile('index.html');
});
```

### 2. Caching Strategies

```javascript
// Service Worker caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/app.js',
        '/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache first, network fallback
      return response || fetch(event.request);
    })
  );
});

// Network first, cache fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Stale-while-revalidate
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open('v1').then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      
      return cachedResponse || fetchPromise;
    })
  );
});

// HTTP caching headers
app.get('/api/data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=3600', // 1 hour
    'ETag': generateETag(data)
  });
  res.json(data);
});

app.get('/static/*', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=31536000, immutable' // 1 year
  });
  res.sendFile(filePath);
});
```

### 3. Resource Prioritization

```html
<!-- Prioritize critical resources -->
<head>
  <!-- Highest priority -->
  <link rel="preconnect" href="https://api.example.com">
  
  <!-- High priority -->
  <link rel="preload" href="critical.css" as="style">
  <link rel="preload" href="hero.jpg" as="image" fetchpriority="high">
  
  <!-- Normal priority -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- Low priority -->
  <link rel="prefetch" href="next-page.html">
  <link rel="dns-prefetch" href="https://analytics.com">
</head>

<body>
  <!-- Image priorities -->
  <img src="hero.jpg" fetchpriority="high" alt="Hero">
  <img src="secondary.jpg" fetchpriority="low" loading="lazy" alt="Secondary">
  
  <!-- Script priorities -->
  <script src="critical.js"></script>
  <script src="non-critical.js" defer></script>
  <script src="analytics.js" async></script>
</body>
```

## Bundle Size Optimization {#bundles}

### 1. Webpack Configuration

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log
            dead_code: true,
            unused: true
          },
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    
    // Split chunks
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // Common chunk
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // Runtime chunk
    runtimeChunk: 'single'
  },
  
  plugins: [
    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // Brotli compression
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      filename: '[path][base].br'
    }),
    
    // Bundle analyzer
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

### 2. Tree Shaking

```javascript
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}

// ❌ Bad: Imports entire library
import _ from 'lodash';
import moment from 'moment';

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce';
import map from 'lodash/map';

// ✅ Better: Use tree-shakeable alternatives
import { debounce, map } from 'lodash-es';
import dayjs from 'dayjs'; // Instead of moment

// Named exports for tree shaking
// utils.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }

// main.js - only imports what's used
import { add, multiply } from './utils';
// subtract is not included in bundle

// Conditional imports
async function loadFeature() {
  if (condition) {
    const module = await import('./feature');
    return module.default;
  }
}
```

## Runtime Performance {#runtime}

### 1. Virtual Scrolling

```javascript
// React Window implementation
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="row">
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Variable size list
import { VariableSizeList } from 'react-window';

function VariableList({ items }) {
  const getItemSize = (index) => {
    return items[index].expanded ? 120 : 50;
  };
  
  return (
    <VariableSizeList
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}

// Vanilla JS virtual scrolling
class VirtualScroll {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    
    this.init();
  }
  
  init() {
    this.container.style.height = `${this.items.length * this.itemHeight}px`;
    this.container.addEventListener('scroll', () => this.render());
    this.render();
  }
  
  render() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    this.visibleStart = Math.floor(scrollTop / this.itemHeight);
    this.visibleEnd = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
    
    const fragment = document.createDocumentFragment();
    
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      if (this.items[i]) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = `${i * this.itemHeight}px`;
        div.textContent = this.items[i].name;
        fragment.appendChild(div);
      }
    }
    
    this.container.innerHTML = '';
    this.container.appendChild(fragment);
  }
}
```

### 2. Efficient DOM Updates

```javascript
// ❌ Bad: Multiple reflows
function badUpdate(items) {
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.text;
    document.body.appendChild(div); // Reflow on each append
  });
}

// ✅ Good: Single reflow
function goodUpdate(items) {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.text;
    fragment.appendChild(div);
  });
  
  document.body.appendChild(fragment); // Single reflow
}

// Batch DOM reads and writes
function updateElements(elements) {
  // ❌ Bad: Interleaved reads and writes
  elements.forEach(el => {
    const height = el.offsetHeight; // Read (reflow)
    el.style.width = height + 'px'; // Write (reflow)
  });
  
  // ✅ Good: Batch reads, then writes
  const heights = elements.map(el => el.offsetHeight); // Batch reads
  elements.forEach((el, i) => {
    el.style.width = heights[i] + 'px'; // Batch writes
  });
}

// Use requestAnimationFrame
function smoothUpdate() {
  let frame = 0;
  
  function animate() {
    frame++;
    updateUI(frame);
    
    if (frame < 100) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

// Intersection Observer for visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is visible, load/animate
      entry.target.classList.add('visible');
    } else {
      // Element not visible, pause/cleanup
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.lazy-component').forEach(el => {
  observer.observe(el);
});
```

## Core Web Vitals {#web-vitals}

### 1. Optimizing LCP

```javascript
// Techniques to improve LCP:

// 1. Preload LCP image
<link rel="preload" as="image" href="hero.jpg" fetchpriority="high">

// 2. Remove render-blocking resources
<link rel="stylesheet" href="critical.css">
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">

// 3. Optimize images
<img src="hero.jpg" 
     srcset="hero-400.jpg 400w, hero-800.jpg 800w"
     sizes="100vw"
     fetchpriority="high"
     alt="Hero">

// 4. Use CDN
const imageUrl = 'https://cdn.example.com/hero.jpg';

// 5. Optimize server response time
// - Use CDN
// - Enable caching
// - Optimize database queries
// - Use faster hosting

// 6. Client-side rendering optimization
function App() {
  return (
    <>
      {/* Render critical content first */}
      <Hero />
      
      {/* Lazy load below-the-fold content */}
      <Suspense fallback={<Skeleton />}>
        <BelowTheFold />
      </Suspense>
    </>
  );
}
```

### 2. Optimizing FID/INP

```javascript
// Techniques to improve FID and INP:

// 1. Break up long tasks
async function processLargeDataset(data) {
  const chunkSize = 100;
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    processChunk(chunk);
    
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

// 2. Use requestIdleCallback
function performNonCriticalWork() {
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task = tasks.shift();
      performTask(task);
    }
    
    if (tasks.length > 0) {
      performNonCriticalWork(); // Continue in next idle period
    }
  });
}

// 3. Debounce expensive operations
const expensiveOperation = debounce(() => {
  // Heavy computation
}, 300);

input.addEventListener('input', expensiveOperation);

// 4. Optimize event handlers
// ❌ Bad: Heavy work in event handler
button.addEventListener('click', () => {
  const result = heavyComputation();
  updateUI(result);
});

// ✅ Good: Defer work
button.addEventListener('click', () => {
  requestAnimationFrame(() => {
    const result = heavyComputation();
    updateUI(result);
  });
});

// 5. Code splitting for interactions
async function handleClick() {
  const module = await import('./heavy-feature.js');
  module.handleFeature();
}
```

### 3. Optimizing CLS

```javascript
// Techniques to prevent layout shift:

// 1. Reserve space for images
<img src="image.jpg" width="800" height="600" alt="Description">

// Or use aspect ratio
<style>
  .image-container {
    aspect-ratio: 16 / 9;
  }
</style>

// 2. Reserve space for ads
<div class="ad-slot" style="min-height: 250px;">
  <!-- Ad loads here -->
</div>

// 3. Avoid inserting content above existing content
// ❌ Bad: Insert at top
container.prepend(newElement);

// ✅ Good: Append or replace
container.appendChild(newElement);

// 4. Use transform for animations
// ❌ Bad: Causes layout shift
.element {
  animation: move 1s;
}
@keyframes move {
  from { top: 0; }
  to { top: 100px; }
}

// ✅ Good: No layout shift
.element {
  animation: move 1s;
}
@keyframes move {
  from { transform: translateY(0); }
  to { transform: translateY(100px); }
}

// 5. Preload fonts
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<style>
  @font-face {
    font-family: 'MyFont';
    src: url('font.woff2') format('woff2');
    font-display: optional; /* Prevents layout shift */
  }
</style>
```

## Monitoring and Tools {#monitoring}

### 1. Performance Monitoring

```javascript
// Real User Monitoring (RUM)
class PerformanceMonitor {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.metrics = {};
    this.init();
  }
  
  init() {
    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor resource timing
    this.observeResourceTiming();
    
    // Send metrics periodically
    setInterval(() => this.sendMetrics(), 30000);
  }
  
  observeWebVitals() {
    import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
      getCLS((metric) => this.recordMetric('CLS', metric.value));
      getFID((metric) => this.recordMetric('FID', metric.value));
      getLCP((metric) => this.recordMetric('LCP', metric.value));
    });
  }
  
  observeLongTasks() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          this.recordMetric('long_task', entry.duration);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
  
  observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('resource', {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize
        });
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
  
  recordMetric(name, value) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(value);
  }
  
  sendMetrics() {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.apiEndpoint,
        JSON.stringify(this.metrics)
      );
    }
    this.metrics = {};
  }
}

// Initialize monitoring
const monitor = new PerformanceMonitor('/api/metrics');
```

### 2. Performance Tools

```javascript
// Lighthouse CI
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "interactive": ["error", {"maxNumericValue": 3000}]
      }
    }
  }
}

// WebPageTest API
const WebPageTest = require('webpagetest');
const wpt = new WebPageTest('www.webpagetest.org', 'YOUR_API_KEY');

wpt.runTest('https://example.com', {
  location: 'Dulles:Chrome',
  connectivity: '4G',
  runs: 3,
  video: true
}, (err, result) => {
  console.log('Test results:', result.data);
});

// Custom performance budget
const performanceBudget = {
  'bundle.js': 200 * 1024,     // 200 KB
  'styles.css': 50 * 1024,     // 50 KB
  'total': 500 * 1024,         // 500 KB total
  'requests': 50,              // Max 50 requests
  'lcp': 2500,                 // 2.5s
  'fid': 100,                  // 100ms
  'cls': 0.1                   // 0.1
};

function checkBudget(metrics) {
  const violations = [];
  
  Object.entries(performanceBudget).forEach(([key, budget]) => {
    if (metrics[key] > budget) {
      violations.push({
        metric: key,
        actual: metrics[key],
        budget: budget
      });
    }
  });
  
  return violations;
}
```

## Conclusion

Frontend performance optimization is crucial for user experience. Key takeaways:

1. **Measure First** - Use real metrics, not assumptions
2. **Optimize Critical Path** - Load essentials first
3. **Reduce Bundle Size** - Ship less JavaScript
4. **Optimize Images** - Use modern formats and lazy loading
5. **Monitor Continuously** - Track performance over time

**Remember**: Every millisecond counts. Users notice performance.

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest](https://www.webpagetest.org/)

---

*What performance optimizations have had the biggest impact for you? Share your wins!*
