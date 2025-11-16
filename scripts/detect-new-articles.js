import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_BASE = path.join(__dirname, '../src/content');
const OUTPUT_FILE = path.join(__dirname, '../public/new-articles.json');
const HOURS_THRESHOLD = 24;

const COLLECTIONS = ['posts', 'ainews', 'aifinnews'];

function getGitCommitTime(filePath) {
  try {
    // Get the timestamp of the last commit that modified this file
    const timestamp = execSync(
      `git log -1 --format=%ct -- "${filePath}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    
    if (!timestamp) return null;
    
    // Convert Unix timestamp (seconds) to milliseconds
    return parseInt(timestamp) * 1000;
  } catch (error) {
    // If git command fails (e.g., file not committed yet), fall back to file system time
    return fs.statSync(filePath).mtimeMs;
  }
}

function scanCollectionForNewFiles(collectionName) {
  const collectionPath = path.join(CONTENT_BASE, collectionName);
  
  if (!fs.existsSync(collectionPath)) {
    console.log(`⚠️  Collection '${collectionName}' not found, skipping...`);
    return [];
  }

  const now = Date.now();
  const threshold = now - (HOURS_THRESHOLD * 60 * 60 * 1000);
  const newFiles = [];

  const files = fs.readdirSync(collectionPath);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(collectionPath, file);
    const commitTime = getGitCommitTime(filePath);
    
    if (commitTime && commitTime > threshold) {
      // Lowercase the slug to match URL routing
      const slug = file.replace(/\.md$/, '').toLowerCase();
      const stats = fs.statSync(filePath);
      newFiles.push({
        slug,
        collection: collectionName,
        filename: file,
        modifiedAt: new Date(commitTime).toISOString(),
        sizeKB: (stats.size / 1024).toFixed(2)
      });
    }
  }

  return newFiles;
}

function main() {
  console.log(`\n📝 Scanning for articles modified in last ${HOURS_THRESHOLD} hours...\n`);
  
  const allNewFiles = [];
  
  for (const collection of COLLECTIONS) {
    const newFiles = scanCollectionForNewFiles(collection);
    if (newFiles.length > 0) {
      console.log(`  ✨ ${collection}: ${newFiles.length} new article(s)`);
      allNewFiles.push(...newFiles);
    } else {
      console.log(`  ✓ ${collection}: no new articles`);
    }
  }

  allNewFiles.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));

  const output = {
    generatedAt: new Date().toISOString(),
    thresholdHours: HOURS_THRESHOLD,
    count: allNewFiles.length,
    articles: allNewFiles
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Generated new-articles.json with ${allNewFiles.length} article(s)`);
  
  if (allNewFiles.length > 0) {
    console.log('\n📋 New articles:');
    allNewFiles.forEach(article => {
      console.log(`  • [${article.collection}] ${article.slug}`);
    });
  }
  
  console.log('');
}

main();
