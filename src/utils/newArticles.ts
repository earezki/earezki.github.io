import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface NewArticle {
  slug: string;
  collection: string;
  filename: string;
  modifiedAt: string;
  sizeKB: string;
}

interface NewArticlesIndex {
  generatedAt: string;
  thresholdHours: number;
  count: number;
  articles: NewArticle[];
}

let newArticlesCache: Set<string> | null = null;

async function loadNewArticles(): Promise<Set<string>> {
  if (newArticlesCache) {
    return newArticlesCache;
  }

  try {
    const response = await fetch('/new-articles.json');
    if (!response.ok) {
      console.warn('Could not load new-articles.json');
      return new Set();
    }
    
    const data: NewArticlesIndex = await response.json();
    newArticlesCache = new Set(data.articles.map(a => `${a.collection}/${a.slug}`));
    return newArticlesCache;
  } catch (error) {
    console.warn('Error loading new articles:', error);
    return new Set();
  }
}

export function isArticleNew(slug: string, collection: string): boolean {
  // For build-time (SSG), read from file system
  if (import.meta.env.SSR) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const indexPath = path.join(__dirname, '../../public/new-articles.json');
      
      if (!fs.existsSync(indexPath)) {
        return false;
      }
      
      const data: NewArticlesIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      return data.articles.some(a => a.slug === slug && a.collection === collection);
    } catch (error) {
      return false;
    }
  }
  
  // For client-side, we'll use data attributes set during SSG
  return false;
}

export async function initNewArticlesCache(): Promise<void> {
  if (typeof window !== 'undefined') {
    await loadNewArticles();
  }
}

export async function checkIfNew(slug: string, collection: string): Promise<boolean> {
  const newArticles = await loadNewArticles();
  return newArticles.has(`${collection}/${slug}`);
}
