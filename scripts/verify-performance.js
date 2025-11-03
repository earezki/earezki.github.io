#!/usr/bin/env node

/**
 * Verify Performance Optimizations
 * 
 * This script checks if cache headers and other optimizations
 * are correctly applied after deployment.
 * 
 * Usage: node scripts/verify-performance.js https://earezki.com
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.argv[2] || 'https://earezki.com';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      const headers = res.headers;
      res.resume(); // Consume response data
      resolve({ url, headers, statusCode: res.statusCode });
    }).on('error', reject);
  });
}

async function verifyPerformance() {
  console.log(colorize('\n🔍 Verifying Performance Optimizations\n', 'blue'));
  console.log(`Site: ${SITE_URL}\n`);

  const checks = [
    {
      name: 'Homepage',
      url: `${SITE_URL}/`,
      expectedCache: 'public, max-age=3600',
      type: 'html'
    },
    {
      name: 'CSS Asset (example)',
      url: `${SITE_URL}/_astro/index.HkdFI6K5.css`,
      expectedCache: 'public, max-age=31536000, immutable',
      type: 'css'
    },
    {
      name: 'JS Asset (example)',
      url: `${SITE_URL}/_astro/hoisted.5nExtMcd.js`,
      expectedCache: 'public, max-age=31536000, immutable',
      type: 'js'
    },
    {
      name: 'Favicon',
      url: `${SITE_URL}/favicon.svg`,
      expectedCache: 'public, max-age=31536000, immutable',
      type: 'image'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      console.log(colorize(`Checking: ${check.name}`, 'blue'));
      const result = await checkUrl(check.url);

      // Check status code
      if (result.statusCode === 200) {
        console.log(colorize(`  ✓ Status: ${result.statusCode}`, 'green'));
      } else {
        console.log(colorize(`  ✗ Status: ${result.statusCode}`, 'red'));
        failed++;
        continue;
      }

      // Check cache-control header
      const cacheControl = result.headers['cache-control'];
      if (cacheControl) {
        if (cacheControl.includes('max-age=31536000') || cacheControl.includes('max-age=3600')) {
          console.log(colorize(`  ✓ Cache-Control: ${cacheControl}`, 'green'));
          passed++;
        } else {
          console.log(colorize(`  ⚠ Cache-Control: ${cacheControl}`, 'yellow'));
          console.log(colorize(`    Expected: ${check.expectedCache}`, 'yellow'));
          failed++;
        }
      } else {
        console.log(colorize(`  ✗ No Cache-Control header`, 'red'));
        failed++;
      }

      // Check security headers
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
      ];

      securityHeaders.forEach(header => {
        if (result.headers[header]) {
          console.log(colorize(`  ✓ ${header}: ${result.headers[header]}`, 'green'));
        }
      });

      console.log('');
    } catch (error) {
      console.log(colorize(`  ✗ Error: ${error.message}`, 'red'));
      failed++;
      console.log('');
    }
  }

  // Summary
  console.log(colorize('━'.repeat(50), 'blue'));
  console.log(colorize(`\nSummary:`, 'blue'));
  console.log(colorize(`  Passed: ${passed}`, 'green'));
  console.log(colorize(`  Failed: ${failed}`, failed > 0 ? 'red' : 'green'));

  if (failed === 0) {
    console.log(colorize('\n✨ All checks passed!', 'green'));
    console.log('\nNext steps:');
    console.log('  1. Test with Google PageSpeed Insights');
    console.log('  2. Monitor Core Web Vitals in Search Console');
    console.log('  3. Check WebPageTest for detailed metrics\n');
  } else {
    console.log(colorize('\n⚠️  Some checks failed', 'yellow'));
    console.log('\nTroubleshooting:');
    console.log('  1. Verify _headers file is in public/ directory');
    console.log('  2. Ensure hosting platform supports _headers (Netlify, Cloudflare)');
    console.log('  3. Check CDN cache - may need to purge');
    console.log('  4. Verify asset paths match generated files\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run verification
verifyPerformance().catch(error => {
  console.error(colorize(`\nFatal error: ${error.message}`, 'red'));
  process.exit(1);
});
