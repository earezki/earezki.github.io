export const SITE = {
  title: 'Dev|Journal',
  description: 'Blogging about interests.',
  url: 'https://earezki.com',
  author: 'AREZKI El Mehdi',
  postsPerPage: 12,
  searchAPI: {
    url: import.meta.env.PUBLIC_SEARCH_API_URL || 'https://blogapi.earezki.com/q',
    timeout: 2000,
  },
} as const;

