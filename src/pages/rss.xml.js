import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Dev|Journal',
    description: 'Blogging about interests.',
    site: context.site,
    items: posts.map(p => ({
      title: p.data.title,
      link: `/${p.data.slug || p.slug}/`,
      pubDate: p.data.pubDate,
      description: p.data.description || ''
    }))
  });
}
