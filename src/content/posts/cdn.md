---
title: CDNs, make the world feel closer
pubDate: '2025-11-02 00:00:00 +0100'
description: "How CDNs improve performance and reliability: caching strategies, configuration tips, purge practices, and cost considerations."
categories:
  - Software architecture
  - Performance
  - Infrastructure
---

A Content Delivery Network (CDN) caches and serves public assets from edge locations close to users. It reduces latency, lowers origin load, and provides edge security features like DDoS protection and WAFs.

When to use a CDN
- Public static assets (images, JS, CSS) and cacheable API responses.
- To reduce TTFB for geographically distributed users or to handle bursty traffic.

Configuration tips
- Use immutable URLs / content-hashed filenames for long-lived assets.
- Set cache-control and CDN-specific headers correctly for desired TTL and revalidation behavior.
- Configure origin failover and tiered caching where beneficial.

Operational notes
- Purging: provide fast purge APIs for urgent invalidation; avoid relying solely on short TTLs.
- Cost: CDNs reduce origin costs but introduce egress and request costs; measure and optimize.
- Security: enable edge protection features and be careful when caching personalized content.

Recommendation
- Add a CDN early for public assets. It usually pays back in performance and operational simplicity.
