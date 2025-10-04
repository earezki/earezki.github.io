#!/usr/bin/env node
/**
 * Migration script: Converts Jekyll `_posts/*.markdown` to Astro content collection under `src/content/posts`.
 * - Maps `date` -> `pubDate`
 * - Derives `slug` from explicit `permalink` (without slashes) or filename
 * - Preserves body content
 * - Keeps categories
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDir = path.resolve('_posts');
const targetDir = path.resolve('src/content/posts');
fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.markdown'));
const FORCE = process.argv.includes('--force');

for (const file of files) {
  const full = path.join(postsDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};

  const originalPermalink = (data.permalink || '').trim();
  let slug = originalPermalink.replace(/^\/+|\/+$/g, '');
  // Flatten nested permalink paths (e.g. recallfilai/tech-stack) into recallfilai-tech-stack
  if (slug.includes('/')) {
    slug = slug.split('/').filter(Boolean).join('-');
  }
  if (!slug) {
    // derive from filename after date prefix YYYY-MM-DD-
    slug = file
      .replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-/, '')
      .replace(/\.markdown$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const pubDate = data.pubDate || data.date || new Date().toISOString();

  // Normalize categories/tags: accept `categories` or `tags`, coerce string -> array,
  // trim values, remove empty entries and deduplicate preserving order.
  const rawCats = data.categories ?? data.tags ?? [];
  let cats = [];
  if (Array.isArray(rawCats)) {
    cats = rawCats.slice();
  } else if (typeof rawCats === 'string') {
    // allow comma-separated string
    cats = rawCats.split(',').map(s => s.trim()).filter(Boolean);
  } else if (rawCats == null) {
    cats = [];
  } else {
    cats = [String(rawCats)];
  }
  // cleanup each entry and dedupe
  const seen = new Set();
  const normalized = [];
  for (let c of cats) {
    if (!c) continue;
    c = c.toString().trim();
    if (!c) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    normalized.push(c);
  }

  const frontmatter = {
    title: data.title || slug,
    pubDate,
    categories: normalized
    // slug intentionally omitted; Astro derives slug from filename.
  };

  const newContent = matter.stringify(parsed.content, frontmatter); // full frontmatter + body
  const outPath = path.join(targetDir, `${slug}.md`);
  if (fs.existsSync(outPath)) {
    if (!FORCE) {
      console.warn(`Skipping existing ${outPath}`);
      continue;
    } else {
      console.log(`Overwriting ${outPath} (force)`);
    }
  }
  fs.writeFileSync(outPath, newContent, 'utf8');
  console.log(`Migrated ${file} -> ${outPath}`);
}

// Copy assets to public/assets for Astro static serving
const assetsSrc = path.resolve('assets');
const assetsDest = path.resolve('public/assets');
if (fs.existsSync(assetsSrc)) {
  fs.mkdirSync(assetsDest, { recursive: true });
  for (const entry of fs.readdirSync(assetsSrc)) {
    const from = path.join(assetsSrc, entry);
    const to = path.join(assetsDest, entry);
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      console.log(`Copied asset ${entry}`);
    }
  }
}

console.log('\nDone. You can now remove Jekyll files (Gemfile, _config.yml, _posts, etc.) after verifying build.');
