import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Astro Configuration
 * @see https://astro.build/config
 */
export default defineConfig({
  // Production site URL
  site: 'https://earezki.com',
  
  // Always add trailing slashes to URLs
  trailingSlash: 'always',
  
  // Integrations
  integrations: [
    sitemap({
      // Exclude draft pages from sitemap
      filter: (page) => !page.includes('/drafts/')
    })
  ],
  
  // Markdown configuration
  markdown: {
    // Use Prism for simpler, more controllable syntax highlighting
    syntaxHighlight: 'prism',
  },
});
