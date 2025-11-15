/**
 * Site-wide configuration
 * Centralized settings for the entire site
 */
export const SITE = {
  /** Site title displayed in header and meta tags */
  title: 'Dev|Journal',
  
  /** Site description for meta tags and SEO */
  description: 'Blogging about interests.',
  
  /** Site base URL (production domain) */
  url: 'https://earezki.com',
  
  /** Site author name */
  author: 'AREZKI El Mehdi',
  
  /** Number of posts to display per page in pagination */
  postsPerPage: 12,
  
  /** Search API configuration */
  searchAPI: {
    /** Server API endpoint URL (set to empty string to disable) */
    url: import.meta.env.PUBLIC_SEARCH_API_URL || 'http://localhost:8000/q',
    /** Timeout in milliseconds before falling back to client-side search */
    timeout: 2000,
  },
} as const;

