---
title: "AI-Driven Software Delivery: Leveraging Lean, ChOP & LLMs to Create Effective Learning Experiences"
pubDate: 2025-11-17
description: "QCon’s experiment delivered a certification program using AI, achieving an 89% ‘green’ satisfaction rating and demonstrating the power of RAG architectures."
categories: ["AI News", "Software Development", "Machine Learning"]
---

## Transcript

QCon recently ran an experiment to deliver a certification program leveraging Retrieval-Augmented Generation (RAG) and supervised coding agents (Claude Sonnet/Cursor), successfully processing 75 conference talks in a four-week timeframe. This initiative aimed to provide attendees with AI-powered access to key insights from the event's content.

### Why This Matters
Current AI models, while powerful, often lack real-time knowledge and domain-specific context. This experiment demonstrates a practical approach to bridging this gap with RAG, reducing hallucinations and providing explainability, crucial for building trust in AI-driven systems. The cost of building a prototype RAG pipeline was approximately $130, highlighting the accessibility of these technologies, but also the potential for human toil in refining and maintaining them.

### Key Insights
- **Four-week development cycle**: The entire system, from initial concept to working prototype, was built in four weeks by a single engineer.
- **RAG variations**: Beyond naive RAG, the presentation explored retrieve-and-re-rank, multimodal RAG, graph RAG, and agentic RAG architectures.
- **95% AI-generated code**:  Claude Sonnet 3.7 via Cursor was used to generate approximately 95% of the code for the project, demonstrating the potential of AI-assisted development.

### Working Example
```python
# Example curl command to query the retriever
# Replace with your actual endpoint and API key
curl -X POST \
  'https://your-retriever-endpoint' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "query": "What are the key takeaways for Kraken serverless architecture?"
  }'
```

### Practical Applications
- **Use Case**: QCon utilized the system to provide attendees with a searchable knowledge base of conference talks and generate personalized insights.
- **Pitfall**: Over-reliance on AI-generated code without sufficient review and understanding can lead to code bloat and maintainability issues.

**References:**
- https://www.infoq.com/presentations/chop-rag-llm-qcon/