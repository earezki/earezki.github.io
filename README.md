# Dev|Journal

Built with Astro.
[https://earezki.com](https://earezki.com)

## Features

- [x] **RSS Feed & Sitemap** - Auto-generated RSS feeds and sitemaps for all content
- [x] **Reading Time Estimation** - Accurate reading time calculations for all articles
- [x] **Series Navigation** - Support for multi-part article series with navigation
- [x] **Related Posts** - Content recommendations using optimized similarity algorithms
- [x] **New Article Badges** - Visual indicators for recently published content


- [x] **Dual Search System** - Hybrid approach combining embedding-based and fallback search
  - **Semantic Search** - Vector similarity search using
  - **Client-side Fallback** - IndexedDB-cached keyword search when API is unavailable


- [x] **AI News Aggregation** - Automated summarization of technical articles
- [x] **AI Financial Analysis** - Automated stock market analysis (educational)


- [x] **Newsletter Subscription** - Email signup
  - preference tracking
  - Mailjet integration for email delivery
- [x] **Dark/Light Theme** -
- [x] **Topic Carousel** -
- [x] **Table of Contents** - Auto-generated navigation for long articles


- [x] **WebP Image Optimization** - Automated conversion

- [x] **Send welcome emails** - Periodically
- [ ] **Send weekly emails** - Pick top 5 picks from the week

- [x] **AI Predition Performance tracking** - /ai-financial-news/performance/
- [x] **Stock performance timeline** -

- [ ] **RAG (Retrieval-Augmented Generation)** - Context-aware Q&A over all articles
- [ ] **Semantic Question Answering** - Natural language queries with cited sources
- [ ] **Multi-lingual Search** - Support for non-English queries


- [ ] **Code Playground** - Interactive code examples with live execution
- [ ] **Video Embeds** - Enhanced multimedia content support
- [ ] **Podcast Integration** - Audio versions of articles


- [ ] **Reading Analytics** - Track reader engagement and popular content
- [ ] **Personalized Recommendations** - ML-powered content suggestions
- [ ] **Email Digest** - Weekly/monthly content roundups for subscribers


- [ ] **Guest Posts** - Community-contributed articles
- [ ] **Bookmark System** - Save articles for later reading
- [ ] **Social Sharing** - Enhanced sharing with Open Graph optimization
- [ ] **Author Profiles** - Multi-author support with bios

## Quick Start

1. Install dependencies
2. Start the dev server

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Content

Posts live in `src/content/posts`. Each has frontmatter:

```yaml
title: "Post title"
pubDate: 2024-09-09T00:00:00.000Z
categories: [Category]
slug: custom-slug
```


## RSS & Sitemap

RSS feed: `/rss.xml`  
Sitemap: `/sitemap-index.xml` (auto-generated)


## License

Personal blog content – all rights reserved unless otherwise noted.