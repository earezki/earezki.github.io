import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('posts');
  const aiNews = await getCollection('ainews');

  // Combine and sort by pubDate descending
  const allItems = [...posts, ...aiNews].sort((a, b) => 
    new Date(b.data.pubDate) - new Date(a.data.pubDate)
  );

  return rss({
    title: 'Dev|Journal',
    description: 'Blogging about interests.',
    site: context.site,
    items: allItems.map(p => ({
      title: p.data.title,
      link: `/${p.data.slug || p.slug}/`,
      pubDate: p.data.pubDate,
      description: p.data.description || ''
    }))
  });
}
