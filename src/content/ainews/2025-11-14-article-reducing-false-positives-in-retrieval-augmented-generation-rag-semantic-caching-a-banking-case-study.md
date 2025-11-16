---
title: "Reducing False Positives in Retrieval-Augmented Generation (RAG) Semantic Caching: A Banking Case Study"
pubDate: 2025-11-14
description: "Banking RAG system reduces false positives from 99% to 3.8% through semantic caching redesign"
categories: ["AI News", "Retrieval-Augmented Generation", "Caching"]
---

## Reducing False Positives in Retrieval-Augmented Generation (RAG) Semantic Caching: A Banking Case Study

A banking RAG system faced catastrophic false positives, directing users to incorrect procedures with 84.9–99% confidence. After testing 1,000 query variations across seven bi-encoder models, the team achieved a 3.8% false positive rate through architectural redesign.

### Why This Matters
Semantic caching aims to reduce LLM calls by reusing prior answers, but poorly designed systems risk false positives—critical in domains like banking. Initial tests showed 99% false positives, with models like e5-large-v2 failing to distinguish between "credit card cancellation" and "investment account closure." This highlights the cost of relying on model tuning alone: even state-of-the-art embeddings cannot overcome flawed cache content or query ambiguity.

### Key Insights
- "1,000 query variations tested across seven bi-encoder models" (InfoQ, 2025)
- "Best Candidate Principle: Ensure optimal candidates are available for selection, not just optimizing search algorithms" (Experiment 3)
- "Instructor-large reduced FP to 3.8% with cache quality controls" (Experiment 4)

### Working Example
```json
{
  "faq_id": "Q003",
  "domain": "payment",
  "faq": "how do I cancel a Zelle payment",
  "gold_answer": "You can only cancel a Zelle payment if the recipient hasn't enrolled in Zelle yet...",
  "variations": [
    ["V001", "formal", "What is the procedure for canceling a Zelle transaction?", "hard"],
    ["V002", "casual", "can i cancel a zelle payment i just sent", "medium"]
  ],
  "query_distractors": [
    ["Q1021", "topical_neighbor", "how do I view my recent transaction history", "medium", 0.83]
  ]
}
```

### Practical Applications
- **Use Case**: Banking FAQ system using semantic caching to avoid incorrect procedure guidance
- **Pitfall**: Over-reliance on similarity thresholds without quality control, leading to 99% FP rates

**References:**
- https://www.infoq.com/articles/reducing-false-positives-retrieval-augmented-generation/
---