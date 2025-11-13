---
title: "How to Reduce Cost and Latency of Your RAG Application Using Semantic LLM Caching"
pubDate: 2025-11-11
description: "Semantic LLM caching cuts RAG API costs by reusing responses for similar queries, saving up to 80% on repeated requests."
categories: ["AI News", "RAG", "AI Optimization"]
---

## How to Reduce Cost and Latency of Your RAG Application Using Semantic LLM Caching

Semantic LLM caching reduces RAG API costs by reusing responses for similar queries. In tests, it cut 10 repeated queries’ processing time from 22 seconds to under 10 seconds.

### Why This Matters
RAG systems face a gap between ideal performance (instant, zero-cost responses) and reality (expensive, slow API calls for every query). Without caching, even reworded versions of the same question trigger full LLM processing, inflating costs and latency. For high-traffic applications, this can lead to hundreds of redundant API calls per second, with costs scaling linearly.

### Key Insights
- "Semantic caching stores responses for actual queries, not all possible ones" (MarkTechPost, 2025)
- "OpenAI's text-embedding-3-small used for query embeddings" (Code example, 2025)
- "LRU eviction policies manage cache entries to prevent memory bloat" (Implementation detail, 2025)

### Working Example
```bash
pip install openai numpy
```

```python
import os
from getpass import getpass
os.environ['OPENAI_API_KEY'] = getpass('Enter OpenAI API Key: ')
```

```python
from openai import OpenAI
client = OpenAI()
```

```python
import time
def ask_gpt(query):
    start = time.time()
    response = client.responses.create(
        model="gpt-4.1",
        input=query
    )
    end = time.time()
    return response.output[0].content[0].text, end - start
```

```python
query = "Explain the concept of semantic caching in just 2 lines."
total_time = 0
for i in range(10):
    _, duration = ask_gpt(query)
    total_time += duration
    print(f"Run {i+1} took {duration:.2f} seconds")
print(f"\nTotal time for 10 runs: {total_time:.2f} seconds")
```

```python
import numpy as np
from numpy.linalg import norm
semantic_cache = []
def get_embedding(text):
    emb = client.embeddings.create(model="text-embedding-3-small", input=text)
    return np.array(emb.data[0].embedding)
def cosine_similarity(a, b):
    return np.dot(a, b) / (norm(a) * norm(b))
def ask_gpt_with_cache(query, threshold=0.85):
    query_embedding = get_embedding(query)
    for cached_query, cached_emb, cached_resp in semantic_cache:
        sim = cosine_similarity(query_embedding, cached_emb)
        if sim > threshold:
            print(f"🔁 Using cached response (similarity: {sim:.2f})")
            return cached_resp, 0.0
    start = time.time()
    response = client.responses.create(
        model="gpt-4.1",
        input=query
    )
    end = time.time()
    text = response.output[0].content[0].text
    semantic_cache.append((query, query_embedding, text))
    return text, end - start
```

```python
queries = [
    "Explain semantic caching in simple terms.",
    "What is semantic caching and how does it work?",
    "How does caching work in LLMs?",
    "Tell me about semantic caching for LLMs.",
    "Explain semantic caching simply."
]
total_time = 0
for q in queries:
    resp, t = ask_gpt_with_cache(q)
    total_time += t
    print(f"⏱️ Query took {t:.2f} seconds\n")
print(f"\nTotal time with caching: {total_time:.2f} seconds")
```

### Practical Applications
- **Use Case**: Customer support chatbots handling frequent, rephrased questions
- **Pitfall**: Over-reliance on low similarity thresholds may cache incorrect responses for semantically similar but contextually distinct queries

**References:**
- https://www.marktechpost.com/2025/11/11/how-to-reduce-cost-and-latency-of-your-rag-application-using-semantic-llm-caching/
---