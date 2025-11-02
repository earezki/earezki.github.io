---
title: Caching, when to add it and how to avoid headaches
pubDate: '2025-11-02 00:00:00 +0100'
description: "Best practices for caching layers, invalidation strategies, common failure modes, and practical patterns to reduce latency and backend load."
categories:
  - Software architecture
  - Performance
  - Architecture
---

Caching is one of the highest-leverage techniques for improving latency and reducing load on backend systems. But used incorrectly it creates correctness problems and operational surprises.

What caching solves
- Reduces latency by keeping frequently accessed data close to the consumer.
- Lowers backend load by avoiding repeated computation or database hits.

Where to place caches
- Edge: CDN for public static assets and cacheable API responses.
- App-layer: Redis/Memcached for hot reads, session stores, or computed results.
- Client: browser or mobile caches for offline or fast re-rendering.

Invalidation strategies
- TTL (time-based expiry): simple but may serve stale data.
- Event-driven invalidation: hook updates to purge or refresh cache entries.
- Manual invalidation: explicit cache-clear commands during deploys or updates.

Common failure modes
- Cache stampede: many requests miss and query the origin simultaneously, mitigate with locks or request coalescing.
- Inconsistent caches: different caches returning conflicting values, enforce single source of truth for writes.
- Over-caching sensitive data: never cache secrets or PII without proper controls.

Practical patterns
- Cache-aside: app reads cache, on miss fetches DB and writes back to cache.
- Write-through / write-behind: write goes through cache to origin (stronger consistency patterns).
- Negative caching: store 'not found' responses to avoid repeated expensive misses.

Sample: simple TTL cache decorator (Python)
```python
from functools import wraps
import time

cache = {}

def ttl_cache(ttl=60):
    def decorator(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            key = (fn.__name__, args, tuple(sorted(kwargs.items())))
            entry = cache.get(key)
            if entry and time.time() - entry[0] < ttl:
                return entry[1]
            value = fn(*args, **kwargs)
            cache[key] = (time.time(), value)
            return value
        return wrapped
    return decorator

@ttl_cache(ttl=30)
def expensive_query(x):
    time.sleep(0.5)
    return x * 2
```

Recommendations
- Make cache semantics explicit: document TTLs and invalidation paths and test them.
- Start with cache-aside for simplicity; adopt write-through only when consistency demands it.
