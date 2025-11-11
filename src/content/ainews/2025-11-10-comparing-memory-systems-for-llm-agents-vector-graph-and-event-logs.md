---
title: "Zep's Temporal KG Memory Hits 94.8% Accuracy on DMR, Outperforming Vector RAG"
pubDate: 2025-11-10
description: "Zep's temporal knowledge graph memory achieves 94.8% accuracy on DMR, outperforming vector RAG in multi-agent planning."
categories: ["AI News", "Agentic AI", "AI Agents"]
---

## Comparing Memory Systems for LLM Agents: Vector, Graph, and Event Logs

Zep's temporal knowledge graph memory system achieved **94.8% accuracy** on the Deep Memory Retrieval (DMR) benchmark in 2025, outperforming vector-based RAG systems. This highlights the critical role of structured memory in multi-agent workflows.

### Why This Matters
Vector memory systems, while fast for sublinear retrieval, struggle with temporal and relational tasks. Benchmarks like DMR show they degrade on long-horizon queries, leading to **lost constraints**, **semantic drift**, and **context dilution** in multi-agent planning. The cost of these failures can include invalid tool calls, compliance violations, or system instability. Graph memory systems, by contrast, encode explicit temporal and relational structures, improving accuracy and reducing latency by up to 90% in complex scenarios.

### Key Insights
- "94.8% accuracy on DMR, 2025": Zep/Graphiti (MarkTechPost, 2025)  
- "Temporal KG over vector RAG for multi-agent planning": Zep's architecture enables cross-session consistency and multi-hop reasoning  
- "ALAS used by multi-agent systems for execution logs": Transactional logging ensures replayability and localized repair  

### Practical Applications
- **Use Case**: Zep used in multi-agent systems for cross-session consistency (e.g., tracking user requests across time)  
- **Pitfall**: Vector RAG's semantic drift in temporal queries (e.g., misaligned region/environment IDs in retrieved chunks)  

**Reference:** https://www.marktechpost.com/2025/11/10/comparing-memory-systems-for-llm-agents-vector-graph-and-event-logs/  

---