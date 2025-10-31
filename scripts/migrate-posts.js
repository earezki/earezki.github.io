#!/usr/bin/env node

/**
 * Migration script: Converts Jekyll `_posts/*.markdown` to Astro content collection
 * 
 * Transformations:
 * - Maps frontmatter `date` field to `pubDate`
 * - Derives `slug` from explicit `permalink` or filename
 * - Preserves body content and categories/tags
 * - Copies assets to public directory
 * 
 * Usage:
 *   node migrate-posts.js         # Normal mode (skips existing)
 *   node migrate-posts.js --force # Force overwrite existing files
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Configuration
const POSTS_DIR = path.resolve('_posts');
const TARGET_DIR = path.resolve('src/content/posts');
const ASSETS_SRC = path.resolve('assets');
const ASSETS_DEST = path.resolve('public/assets');
const FORCE = process.argv.includes('--force');

// Ensure target directory exists
fs.mkdirSync(TARGET_DIR, { recursive: true });

/**
 * Normalizes permalink or filename into a slug
 * @param {string} permalink - Original permalink from frontmatter
 * @param {string} filename - Original filename
 * @returns {string} Normalized slug
 */
function generateSlug(permalink, filename) {
  let slug = permalink.replace(/^\/+|\/+$/g, '');
  
  // Flatten nested paths (e.g., "recallfilai/tech-stack" -> "recallfilai-tech-stack")
  if (slug.includes('/')) {
    slug = slug.split('/').filter(Boolean).join('-');
  }
  
  // Derive from filename if no permalink
  if (!slug) {
    slug = filename
      .replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-/, '') // Remove date prefix
      .replace(/\.markdown$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  return slug;
}

/**
 * Normalizes categories/tags into a deduplicated array
 * @param {*} rawCategories - Categories from frontmatter (array, string, or null)
 * @returns {string[]} Normalized array of categories
 */
function normalizeCategories(rawCategories) {
  let categories = [];
  
  if (Array.isArray(rawCategories)) {
    categories = rawCategories.slice();
  } else if (typeof rawCategories === 'string') {
    // Support comma-separated strings
    categories = rawCategories.split(',').map(s => s.trim()).filter(Boolean);
  } else if (rawCategories != null) {
    categories = [String(rawCategories)];
  }
  
  // Deduplicate while preserving order
  const seen = new Set();
  const normalized = [];
  
  for (let category of categories) {
    if (!category) continue;
    category = category.toString().trim();
    if (!category || seen.has(category)) continue;
    seen.add(category);
    normalized.push(category);
  }
  
  return normalized;
}

/**
 * Processes and migrates a single post file
 * @param {string} file - Filename to process
 */
function migratePost(file) {
  const fullPath = path.join(POSTS_DIR, file);
  const rawContent = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(rawContent);
  const data = parsed.data || {};

  // Generate slug
  const originalPermalink = (data.permalink || '').trim();
  const slug = generateSlug(originalPermalink, file);

  // Extract publication date
  const pubDate = data.pubDate || data.date || new Date().toISOString();

  // Normalize categories/tags
  const rawCategories = data.categories ?? data.tags ?? [];
  const categories = normalizeCategories(rawCategories);

  // Build new frontmatter
  const frontmatter = {
    title: data.title || slug,
    pubDate,
    categories
    // Note: slug is intentionally omitted - Astro derives it from filename
  };

  // Generate new content with updated frontmatter
  const newContent = matter.stringify(parsed.content, frontmatter);
  const outPath = path.join(TARGET_DIR, `${slug}.md`);

  // Check if file exists
  if (fs.existsSync(outPath)) {
    if (!FORCE) {
      console.warn(`⚠️  Skipping existing ${outPath}`);
      return;
    }
    console.log(`🔄 Overwriting ${outPath} (force mode)`);
  }

  fs.writeFileSync(outPath, newContent, 'utf8');
  console.log(`✅ Migrated ${file} → ${outPath}`);
}

/**
 * Copies assets from Jekyll assets directory to public
 */
function copyAssets() {
  if (!fs.existsSync(ASSETS_SRC)) {
    console.warn('⚠️  No assets directory found, skipping asset copy');
    return;
  }

  fs.mkdirSync(ASSETS_DEST, { recursive: true });
  
  const entries = fs.readdirSync(ASSETS_SRC);
  let copiedCount = 0;

  for (const entry of entries) {
    const from = path.join(ASSETS_SRC, entry);
    const to = path.join(ASSETS_DEST, entry);
    
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      copiedCount++;
    }
  }

  console.log(`📁 Copied ${copiedCount} asset(s) to ${ASSETS_DEST}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting Jekyll to Astro migration...\n');

  // Migrate posts
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.markdown'));
  console.log(`Found ${files.length} post(s) to migrate\n`);

  for (const file of files) {
    try {
      migratePost(file);
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error.message);
    }
  }

  // Copy assets
  console.log();
  copyAssets();

  console.log('\n✨ Migration complete!');
}

main();
