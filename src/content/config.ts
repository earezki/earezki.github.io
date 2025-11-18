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

const aifinnews = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
    ticker: z.string().optional(),
    prediction: z.enum(['increase', 'decrease']).optional(),
    confidence: z.number().min(1).max(10).optional(),
    priceAtPrediction: z.number().optional(),
    prediction52WeekHigh: z.number().optional(),
    prediction52WeekLow: z.number().optional(),
    targetDate: z.coerce.date().optional(),
  })
});

const about = defineCollection({
  schema: z.object({
    title: z.string(),
    language: z.enum(['fr', 'en']),
  })
});

const cv = defineCollection({
  schema: z.object({
    title: z.string(),
    language: z.enum(['fr', 'en']),
  })
});

export const collections = { posts, ainews, aifinnews, about, cv };
