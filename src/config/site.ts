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
} as const;
