---
title: "Mintlify Ignored This Feature Request for 6 Months. Here's Our Solution."
pubDate: 2025-11-22
description: "Mintlify delayed pre-filled API playgrounds for 6 months; developers now use madrasly for instant testing."
categories: ["AI News", "Engineering", "API Development"]
---

## Mintlify Ignored This Feature Request for 6 Months. Here's Our Solution.

Mintlify users demanded pre-filled API playground fields for months, with developers reporting hours lost to manual input. Despite OpenAPI specs containing valid examples, the "Try it" feature left all fields empty, forcing tedious copy-pasting.

### Why This Matters
The technical reality of API testing clashes with ideal workflows: manual input introduces errors and delays, while automated pre-filling using OpenAPI examples is both feasible and expected. Mintlify’s omission forced developers to waste hours on repetitive tasks, highlighting a gap between tooling and developer needs.

### Key Insights
- "6-month delay in addressing pre-filled playgrounds, 2025": Mintlify ignored user feedback despite repeated requests.
- "Automated pre-filling over manual input for API testing": OpenAPI specs inherently support example values, which should be leveraged.
- "madrasly used by developers for instant playground generation": The tool automates pre-filling with zero configuration.

### Working Example
```bash
npx madrasly your-spec.json output-dir
```

### Practical Applications
- **Use Case**: API documentation teams using madrasly to generate interactive playgrounds from OpenAPI specs.
- **Pitfall**: Relying on manual input increases error rates and slows down testing cycles.

**References:**
- https://dev.to/realfishsam/mintlify-ignored-this-feature-request-for-6-months-heres-our-solution-1jan
---