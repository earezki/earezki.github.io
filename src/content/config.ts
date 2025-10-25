import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
    // Note: slug is reserved by Astro and generated automatically from file name.
  })
});

const ainews = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
});

export const collections = { posts, ainews };
