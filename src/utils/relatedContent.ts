/**
 * Find related posts based on shared categories/tags
 * Works across both posts and ainews collections
 * @param currentPost - The current post
 * @param allPosts - All available posts from posts collection
 * @param allAiNews - All available posts from ainews collection (optional)
 * @param maxResults - Maximum number of related posts to return
 * @returns Array of related posts, sorted by relevance
 */
export function findRelatedPosts(
  currentPost: any, 
  allPosts: any[], 
  allAiNews: any[] = [],
  maxResults: number = 3
) {
  const currentCategories = currentPost.data.categories || [];
  const currentSlug = currentPost.slug;
  
  // Combine posts and ainews for cross-collection linking
  const combinedPosts = [...allPosts, ...allAiNews];
  
  // Calculate relevance score for each post
  const scoredPosts = combinedPosts
    .filter(post => post.slug !== currentSlug) // Exclude current post
    .map(post => {
      const postCategories = post.data.categories || [];
      
      // Count matching categories
      const matchingCategories = postCategories.filter((cat: string) => 
        currentCategories.includes(cat)
      ).length;
      
      // Calculate score (more shared categories = higher score)
      const score = matchingCategories;
      
      // Determine the correct URL path based on collection
      const urlPath = post.collection === 'ainews' 
        ? `/ai-news/${post.slug}/` 
        : `/${post.slug}/`;
      
      return { post: { ...post, urlPath }, score };
    })
    .filter(item => item.score > 0) // Only include posts with at least one match
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, maxResults) // Limit results
    .map(item => item.post);
  
  return scoredPosts;
}

/**
 * Detect if a post is part of a series (e.g., SOLID principles)
 * @param post - The post to check
 * @returns Series information or null
 */
export function detectSeries(post: any) {
  const title = post.data.title.toLowerCase();
  const categories = (post.data.categories || []).map((c: string) => c.toLowerCase());
  
  // Define known series patterns
  const seriesPatterns = [
    {
      name: 'SOLID Principles',
      slug: 'solid',
      keywords: ['solid', 'single responsibility', 'open-closed', 'liskov substitution', 'interface segregation', 'dependency inversion'],
      pattern: /\b(S|O|L|I|D)\s+from\s+SOLID\b/i
    },
    {
      name: 'Domain-Driven Design',
      slug: 'ddd',
      keywords: ['domain-driven design', 'ddd', 'domain model', 'bounded context'],
      pattern: /domain[- ]driven/i
    },
    {
      name: 'Architecture Patterns',
      slug: 'architecture',
      keywords: ['architecture', 'hexagonal', 'microservices', 'monolith'],
      pattern: /architecture|pattern/i
    }
  ];
  
  for (const series of seriesPatterns) {
    const matchesKeyword = series.keywords.some(keyword => 
      title.includes(keyword) || categories.some((cat: string) => cat.includes(keyword))
    );
    
    const matchesPattern = series.pattern.test(title);
    
    if (matchesKeyword || matchesPattern) {
      return {
        name: series.name,
        slug: series.slug
      };
    }
  }
  
  return null;
}

/**
 * Find all posts in the same series
 * @param currentPost - The current post
 * @param allPosts - All available posts
 * @returns Array of posts in the same series
 */
export function findSeriesPosts(currentPost: any, allPosts: any[]) {
  const series = detectSeries(currentPost);
  if (!series) return [];
  
  return allPosts
    .filter(post => {
      const postSeries = detectSeries(post);
      return postSeries?.slug === series.slug;
    })
    .sort((a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime()); // Sort chronologically
}

/**
 * Generate breadcrumb data from URL path
 * @param path - The current page path
 * @param title - Optional page title for the last breadcrumb
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(path: string, title?: string) {
  const segments = path.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Use title for last segment if provided
    if (index === segments.length - 1 && title) {
      label = title;
    }
    
    breadcrumbs.push({
      label,
      href: currentPath + '/'
    });
  });
  
  return breadcrumbs;
}
