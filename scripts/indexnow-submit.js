import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://earezki.com';
const INDEXNOW_KEY = 'e0b2d1d4eef749e8bdcb95374a1d309a';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const CACHE_DIR = path.join(__dirname, '../cache');
const INDEXNOW_CACHE_FILE = path.join(CACHE_DIR, 'indexnow-submitted.json');
const CONTENT_BASE = path.join(__dirname, '../src/content');
const BATCH_SIZE = 200;

const COLLECTIONS = [
  { name: 'posts', urlPrefix: '' },
  { name: 'ainews', urlPrefix: '/ai-news' },
  { name: 'aifinnews', urlPrefix: '/ai-financial-news' }
];

/**
 * Calculate SHA-256 hash of file content
 */
function hashFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Load previously submitted articles cache
 */
function loadCache() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  if (fs.existsSync(INDEXNOW_CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(INDEXNOW_CACHE_FILE, 'utf-8'));
    } catch (error) {
      console.warn('⚠️  Failed to parse cache, starting fresh:', error.message);
      return {};
    }
  }
  return {};
}

/**
 * Save submitted articles cache
 */
function saveCache(cache) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(INDEXNOW_CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Scan all collections for articles
 */
function scanAllArticles() {
  const articles = [];

  for (const collection of COLLECTIONS) {
    const collectionPath = path.join(CONTENT_BASE, collection.name);
    
    if (!fs.existsSync(collectionPath)) {
      console.log(`⚠️  Collection '${collection.name}' not found, skipping...`);
      continue;
    }

    const files = fs.readdirSync(collectionPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(collectionPath, file);
      const slug = file.replace(/\.md$/, '').toLowerCase();
      const hash = hashFile(filePath);
      const url = `${SITE_URL}${collection.urlPrefix}/${slug}`;
      
      articles.push({
        collection: collection.name,
        slug,
        url,
        hash,
        filePath
      });
    }
  }

  return articles;
}

/**
 * Detect new or modified articles
 */
function detectChanges(articles, cache) {
  const toSubmit = [];

  for (const article of articles) {
    const cacheKey = `${article.collection}:${article.slug}`;
    const cached = cache[cacheKey];

    if (!cached) {
      // New article
      toSubmit.push({ ...article, reason: 'new' });
    } else if (cached.hash !== article.hash) {
      // Modified article
      toSubmit.push({ ...article, reason: 'modified' });
    }
  }

  return toSubmit;
}

/**
 * Submit URLs to IndexNow API in batches
 */
async function submitBatch(urls, batchNumber, totalBatches) {
  const payload = JSON.stringify({
    host: 'earezki.com',
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`  ✅ Batch ${batchNumber}/${totalBatches}: ${urls.length} URLs submitted (status: ${res.statusCode})`);
          resolve({ success: true, statusCode: res.statusCode, urls });
        } else {
          console.warn(`  ⚠️  Batch ${batchNumber}/${totalBatches}: Unexpected status ${res.statusCode}`);
          console.warn(`     Response: ${data}`);
          resolve({ success: false, statusCode: res.statusCode, error: data, urls });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`  ❌ Batch ${batchNumber}/${totalBatches} failed: ${error.message}`);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Submit all URLs in batches
 */
async function submitToIndexNow(articles) {
  if (articles.length === 0) {
    console.log('\nℹ️  No new or modified articles to submit');
    return { submitted: [], failed: [] };
  }

  console.log(`\n🚀 Submitting ${articles.length} URL(s) to IndexNow in batches of ${BATCH_SIZE}...\n`);

  const urls = articles.map(a => a.url);
  const batches = [];
  
  // Split into batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  const submitted = [];
  const failed = [];

  // Submit batches sequentially to avoid rate limiting
  for (let i = 0; i < batches.length; i++) {
    try {
      const result = await submitBatch(batches[i], i + 1, batches.length);
      
      if (result.success) {
        submitted.push(...result.urls);
      } else {
        failed.push(...result.urls);
      }

      // Small delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`  ❌ Batch ${i + 1}/${batches.length} failed:`, error.message);
      failed.push(...batches[i]);
    }
  }

  return { submitted, failed };
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🔍 IndexNow Smart Submission\n');
  console.log('━'.repeat(70));

  // Load cache
  const cache = loadCache();
  const cacheSize = Object.keys(cache).length;
  console.log(`📦 Loaded cache: ${cacheSize} previously submitted article(s)`);

  // Scan all articles
  console.log('📝 Scanning content collections...');
  const articles = scanAllArticles();
  console.log(`   Found ${articles.length} total article(s)\n`);

  // Detect changes
  const toSubmit = detectChanges(articles, cache);

  if (toSubmit.length === 0) {
    console.log('✨ No changes detected - all articles already submitted with current content\n');
    return;
  }

  // Show what will be submitted
  console.log(`📋 Detected ${toSubmit.length} article(s) to submit:\n`);
  
  const newArticles = toSubmit.filter(a => a.reason === 'new');
  const modifiedArticles = toSubmit.filter(a => a.reason === 'modified');

  if (newArticles.length > 0) {
    console.log(`   🆕 New articles: ${newArticles.length}`);
    newArticles.slice(0, 5).forEach(a => {
      console.log(`      • [${a.collection}] ${a.slug}`);
    });
    if (newArticles.length > 5) {
      console.log(`      ... and ${newArticles.length - 5} more`);
    }
  }

  if (modifiedArticles.length > 0) {
    console.log(`   ✏️  Modified articles: ${modifiedArticles.length}`);
    modifiedArticles.slice(0, 5).forEach(a => {
      console.log(`      • [${a.collection}] ${a.slug}`);
    });
    if (modifiedArticles.length > 5) {
      console.log(`      ... and ${modifiedArticles.length - 5} more`);
    }
  }

  // Submit to IndexNow
  const { submitted, failed } = await submitToIndexNow(toSubmit);

  // Update cache for successfully submitted articles
  const updatedCache = { ...cache };
  
  for (const article of toSubmit) {
    const cacheKey = `${article.collection}:${article.slug}`;
    if (submitted.includes(article.url)) {
      updatedCache[cacheKey] = {
        hash: article.hash,
        url: article.url,
        submittedAt: new Date().toISOString()
      };
    }
  }

  saveCache(updatedCache);

  // Summary
  console.log('\n' + '━'.repeat(70));
  console.log('📊 Submission Summary:\n');
  console.log(`   ✅ Successfully submitted: ${submitted.length}`);
  if (failed.length > 0) {
    console.log(`   ❌ Failed: ${failed.length}`);
  }
  console.log(`   💾 Cache updated: ${Object.keys(updatedCache).length} total entries`);
  
  if (submitted.length > 0) {
    console.log('\n✨ URLs submitted to search engines (Bing, Yandex, Seznam)\n');
  }

  if (failed.length > 0) {
    console.log('\n⚠️  Failed URLs (will retry on next run):');
    failed.forEach(url => console.log(`   ${url}`));
    console.log('');
  }
}

main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
