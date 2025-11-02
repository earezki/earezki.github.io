/**
 * Auto-generated Search Index
 * 
 * This endpoint generates a JSON index of all articles (posts + AI news)
 * at build time. The search functionality uses this index for fast client-side search.
 * 
 * Advantages:
 * - Always up-to-date (regenerated on every build)
 * - No manual maintenance required
 * - Includes all collections automatically
 * - Optimized for search (only includes necessary fields)
 */

import { getAllProcessedContent } from '../utils/dataCache.js';

export async function GET() {
  const allContent = await getAllProcessedContent();
  
  // Create minimal search index with only necessary fields
  const searchData = allContent.map(post => ({
    slug: post.slug,
    title: post.data.title,
    excerpt: post.excerpt,
    categories: post.data.categories || [],
    pubDate: post.data.pubDate.toISOString(),
    url: post.urlPath,
    collection: post.collection,
    // Include reading time for display in search results
    readingTime: post.readingTime.text
  }));
  
  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour in production
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
