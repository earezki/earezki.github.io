---
title: "The Two Lists That Define Every Software Project"
pubDate: 2025-11-14
description: "Missing dependencies and overapproximation cause build failures, explained with a robot chef metaphor."
categories: ["AI News", "buildtools", "devops"]
---

## The Two Lists That Define Every Software Project

The robot chef metaphor reveals why builds fail: it only follows the shopping list, not the recipe. A missing ingredient like "eggs" triggers a fatal error.

### Why This Matters
The ideal model assumes the shopping list (build file) perfectly mirrors the recipe (code). In reality, gaps between declared and actual dependencies lead to failures (e.g., missing "eggs") or inefficiencies (e.g., unused "cabbage"). Modern systems like Bazel enforce strict checks to prevent fragile transitive dependencies, which can cause sudden build breaks when dependencies change.

### Key Insights
- "Missing dependencies cause build failures (e.g., 'eggs' not on the list)"
- "Overapproximation adds unused items, slowing builds (e.g., 'cabbage')"
- "Bazel enforces strict dependency checking to avoid transitive dependency issues"

### Practical Applications
- **Use Case**: Bazel used by companies to enforce strict dependency management, preventing transitive dependency issues.
- **Pitfall**: Relying on transitive dependencies without declaring them can lead to sudden build failures when a dependency is removed.

**References:**
- https://dev.to/tmwakalasya/the-two-lists-that-define-every-software-project-2nhk
---