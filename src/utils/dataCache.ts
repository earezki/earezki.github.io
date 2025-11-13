/**
 * Centralized Data Cache
 * 
 * This module provides cached access to content collections and precomputed metadata.
 * All data is loaded once at build time and reused across all pages, preventing
 * redundant getCollection() calls and expensive recomputations.
 * 
 * CRITICAL: This cache is build-time only. It's reset between builds.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime, { type ReadingTimeResult } from './readingTime.js';
import { plainExcerpt } from './excerpt.js';
import { slugify } from './slugify.js';

/**
 * Extended post with precomputed metadata
 */
export interface ProcessedPost {
  id: string;
  slug: string;
  body: string;
  collection: 'posts' | 'ainews' | 'aifinnews';
  data: {
    title: string;
    pubDate: Date;
    categories?: string[];
    [key: string]: any;
  };
  readingTime: ReadingTimeResult;
  excerpt: string;
  urlPath: string;
}

// Build-time caches
let cachedPosts: CollectionEntry<'posts'>[] | null = null;
let cachedAinews: CollectionEntry<'ainews'>[] | null = null;
let cachedAifinnews: CollectionEntry<'aifinnews'>[] | null = null;
let cachedProcessedPosts: ProcessedPost[] | null = null;
let cachedProcessedAinews: ProcessedPost[] | null = null;
let cachedProcessedAifinnews: ProcessedPost[] | null = null;
let cachedAllProcessed: ProcessedPost[] | null = null;

/**
 * Get all posts from the 'posts' collection (cached)
 * @returns Array of raw post entries
 */
export async function getAllPosts(): Promise<CollectionEntry<'posts'>[]> {
  if (!cachedPosts) {
    cachedPosts = await getCollection('posts');
    console.log(`[DataCache] Loaded ${cachedPosts.length} posts`);
  }
  return cachedPosts;
}

/**
 * Get all AI news from the 'ainews' collection (cached)
 * @returns Array of raw ainews entries
 */
export async function getAllAinews(): Promise<CollectionEntry<'ainews'>[]> {
  if (!cachedAinews) {
    cachedAinews = await getCollection('ainews');
    console.log(`[DataCache] Loaded ${cachedAinews.length} AI news articles`);
  }
  return cachedAinews;
}

/**
 * Get all AI financial news from the 'aifinnews' collection (cached)
 * @returns Array of raw aifinnews entries
 */
export async function getAllAifinnews(): Promise<CollectionEntry<'aifinnews'>[]> {
  if (!cachedAifinnews) {
    cachedAifinnews = await getCollection('aifinnews');
    console.log(`[DataCache] Loaded ${cachedAifinnews.length} AI financial news articles`);
  }
  return cachedAifinnews;
}

/**
 * Get processed posts with precomputed metadata (cached)
 * Includes: readingTime, excerpt, urlPath
 * Sorted by publication date (newest first)
 * @returns Array of processed posts
 */
export async function getProcessedPosts(): Promise<ProcessedPost[]> {
  if (!cachedProcessedPosts) {
    const posts = await getAllPosts();
    
    cachedProcessedPosts = posts
      .map((post): ProcessedPost => ({
        ...post,
        readingTime: readingTime(post.body),
        excerpt: plainExcerpt(post.body, 30, 160),
        urlPath: `/${post.slug}/`
      }))
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    
    console.log(`[DataCache] Processed ${cachedProcessedPosts.length} posts with metadata`);
  }
  return cachedProcessedPosts;
}

/**
 * Get processed AI news with precomputed metadata (cached)
 * Includes: readingTime, excerpt, urlPath
 * Sorted by publication date (newest first)
 * @returns Array of processed AI news
 */
export async function getProcessedAinews(): Promise<ProcessedPost[]> {
  if (!cachedProcessedAinews) {
    const ainews = await getAllAinews();
    
    cachedProcessedAinews = ainews
      .map((post): ProcessedPost => ({
        ...post,
        readingTime: readingTime(post.body),
        excerpt: plainExcerpt(post.body, 30, 160),
        urlPath: `/ai-news/${post.slug}/`
      }))
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    
    console.log(`[DataCache] Processed ${cachedProcessedAinews.length} AI news with metadata`);
  }
  return cachedProcessedAinews;
}

/**
 * Get processed AI financial news with precomputed metadata (cached)
 * Includes: readingTime, excerpt, urlPath
 * Sorted by publication date (newest first)
 * @returns Array of processed AI financial news
 */
export async function getProcessedAifinnews(): Promise<ProcessedPost[]> {
  if (!cachedProcessedAifinnews) {
    const aifinnews = await getAllAifinnews();
    
    cachedProcessedAifinnews = aifinnews
      .map((post): ProcessedPost => ({
        ...post,
        readingTime: readingTime(post.body),
        excerpt: plainExcerpt(post.body, 30, 160),
        urlPath: `/ai-financial-news/${post.slug}/`
      }))
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    
    console.log(`[DataCache] Processed ${cachedProcessedAifinnews.length} AI financial news with metadata`);
  }
  return cachedProcessedAifinnews;
}

/**
 * Get all processed content (posts + ainews + aifinnews) combined and sorted (cached)
 * Useful for cross-collection features like search and related posts
 * @returns Array of all processed content
 */
export async function getAllProcessedContent(): Promise<ProcessedPost[]> {
  if (!cachedAllProcessed) {
    const posts = await getProcessedPosts();
    const ainews = await getProcessedAinews();
    const aifinnews = await getProcessedAifinnews();
    
    cachedAllProcessed = [...posts, ...ainews, ...aifinnews]
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    
    console.log(`[DataCache] Combined ${cachedAllProcessed.length} total articles`);
  }
  return cachedAllProcessed;
}

/**
 * Get paginated posts
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated posts and metadata
 */
export async function getPaginatedPosts(page: number, pageSize: number) {
  const allPosts = await getProcessedPosts();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    posts: allPosts.slice(start, end),
    total: allPosts.length,
    totalPages: Math.ceil(allPosts.length / pageSize),
    currentPage: page,
    hasNext: end < allPosts.length,
    hasPrev: page > 1
  };
}

/**
 * Get paginated AI news
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated AI news and metadata
 */
export async function getPaginatedAinews(page: number, pageSize: number) {
  const allAinews = await getProcessedAinews();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    posts: allAinews.slice(start, end),
    total: allAinews.length,
    totalPages: Math.ceil(allAinews.length / pageSize),
    currentPage: page,
    hasNext: end < allAinews.length,
    hasPrev: page > 1
  };
}

/**
 * Get paginated AI financial news
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated AI financial news and metadata
 */
export async function getPaginatedAifinnews(page: number, pageSize: number) {
  const allAifinnews = await getProcessedAifinnews();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    posts: allAifinnews.slice(start, end),
    total: allAifinnews.length,
    totalPages: Math.ceil(allAifinnews.length / pageSize),
    currentPage: page,
    hasNext: end < allAifinnews.length,
    hasPrev: page > 1
  };
}

/**
 * Find a post by slug (from cache)
 * @param slug - Post slug
 * @returns Processed post or undefined
 */
export async function findPostBySlug(slug: string): Promise<ProcessedPost | undefined> {
  const posts = await getProcessedPosts();
  return posts.find(p => p.slug === slug);
}

/**
 * Find an AI news article by slug (from cache)
 * @param slug - Article slug
 * @returns Processed AI news or undefined
 */
export async function findAinewsBySlug(slug: string): Promise<ProcessedPost | undefined> {
  const ainews = await getProcessedAinews();
  return ainews.find(p => p.slug === slug);
}

/**
 * Find an AI financial news article by slug (from cache)
 * @param slug - Article slug
 * @returns Processed AI financial news or undefined
 */
export async function findAifinnewsBySlug(slug: string): Promise<ProcessedPost | undefined> {
  const aifinnews = await getProcessedAifinnews();
  return aifinnews.find(p => p.slug === slug);
}

/**
 * Get all unique tags/categories from both collections
 * @returns Map of tag name to count
 */
export async function getAllTags(): Promise<Map<string, number>> {
  const allContent = await getAllProcessedContent();
  const tagMap = new Map<string, number>();
  
  for (const content of allContent) {
    const categories = content.data.categories || [];
    for (const category of categories) {
      const tag = (category || '').toString().trim();
      // Skip empty/blank category entries which would generate invalid routes
      if (!tag) continue;
      // Don't count "AI News" as a separate tag since it has its own section
      if (tag.toLowerCase() !== 'ai news') {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
  }
  
  return tagMap;
}

/**
 * Get posts by tag/category
 * @param tag - Tag to filter by
 * @returns Array of posts with that tag
 */
export async function getPostsByTag(tag: string): Promise<ProcessedPost[]> {
  const allContent = await getAllProcessedContent();
  const normalizedTag = slugify(tag);

  return allContent.filter(post => {
    const categories = post.data.categories || [];
    return categories.some((cat: string) => slugify(cat) === normalizedTag);
  });
}

/**
 * Clear all caches (useful for testing or forced rebuild)
 */
export function clearCache(): void {
  cachedPosts = null;
  cachedAinews = null;
  cachedProcessedPosts = null;
  cachedProcessedAinews = null;
  cachedAllProcessed = null;
  console.log('[DataCache] Cache cleared');
}
