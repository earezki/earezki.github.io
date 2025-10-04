import { getCollection } from 'astro:content';
import { plainExcerpt } from '../utils/excerpt';

export async function GET() {
  const posts = await getCollection('posts');
  const index = posts.map(p => ({
    slug: p.slug,
    title: p.data.title,
    categories: p.data.categories || [],
    pubDate: p.data.pubDate.toISOString(),
    excerpt: plainExcerpt(p.body, 40, 200)
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
}
