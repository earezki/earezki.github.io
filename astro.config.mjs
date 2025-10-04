import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap'; // Sitemap integration

export default defineConfig({
  site: 'https://earezki.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/drafts/')
    })
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true
    }
  },
});
