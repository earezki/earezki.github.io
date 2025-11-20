/**
 * Publication Date Utilities
 * 
 * Handles logic for determining if content should be visible in listings
 * based on publication date vs current build time.
 */

/**
 * Check if a post is published (pubDate <= current date, ignoring time)
 * @param pubDate - The publication date from frontmatter
 * @returns true if the post should be visible in listings
 */
export function isPublished(pubDate: Date): boolean {
  const now = new Date();
  
  // Strip time components for date-only comparison
  const pubDateOnly = new Date(pubDate.getFullYear(), pubDate.getMonth(), pubDate.getDate());
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return pubDateOnly <= nowDateOnly;
}

/**
 * Get a human-readable status for unpublished posts
 * @param pubDate - The publication date from frontmatter
 * @returns Status message or null if published
 */
export function getPublishStatus(pubDate: Date): string | null {
  if (isPublished(pubDate)) {
    return null;
  }
  
  const now = new Date();
  const diffTime = pubDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Publishing today';
  } else if (diffDays === 1) {
    return 'Publishing tomorrow';
  } else if (diffDays <= 7) {
    return `Publishing in ${diffDays} days`;
  } else {
    return `Scheduled for ${pubDate.toLocaleDateString()}`;
  }
}
