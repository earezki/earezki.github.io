import { getAllProcessedContent, type ProcessedPost } from '../utils/dataCache.js';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allContent = await getAllProcessedContent();

  return rss({
    title: 'Dev|Journal',
    description: 'Blogging about interests.',
    site: context.site || 'https://earezki.github.io',
    items: allContent.map((post: ProcessedPost) => ({
      title: post.data.title,
      link: post.urlPath,
      pubDate: post.data.pubDate,
      description: post.excerpt || ''
    }))
  });
}
