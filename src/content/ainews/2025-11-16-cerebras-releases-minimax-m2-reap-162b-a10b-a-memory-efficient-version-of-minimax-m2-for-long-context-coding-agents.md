---
title: "Cerebras Releases MiniMax-M2-REAP-162B-A10B: A Memory Efficient Version of MiniMax-M2 for Long Context Coding Agents"
pubDate: 2025-11-15
description: "Cerebras compresses 230B MiniMax-M2 to 162B with 30% expert pruning, retaining 10B active parameters per token for coding agents."
categories: ["AI News", "Agentic AI", "AI Infrastructure"]
---

## Cerebras Releases MiniMax-M2-REAP-162B-A10B: A Memory Efficient Version of MiniMax-M2 for Long Context Coding Agents

Cerebras introduced **MiniMax-M2-REAP-162B-A10B**, a **Sparse Mixture-of-Experts (SMoE)** model derived from MiniMax-M2, achieving **30% expert pruning** while retaining 10B active parameters per token. The model maintains performance on coding and reasoning benchmarks despite reducing total parameters by 30%.

### Why This Matters
Large SMoE models like MiniMax-M2 (230B total parameters) are computationally heavy for deployment. Traditional expert merging risks "functional subspace collapse," degrading performance. REAP pruning avoids this by selectively removing low-saliency experts, preserving router control and achieving **near-lossless compression** at 30% pruning, as shown on HumanEval (90% accuracy) and MBPP (80% accuracy).

### Key Insights
- "30% expert pruning, 2025": Cerebras’ REAP method reduces MiniMax-M2 from 230B to 162B parameters while retaining 10B active per token.
- "Sagas over ACID for e-commerce": Not applicable here; REAP’s pruning outperforms expert merging for generative tasks.
- "vLLM used by Cerebras": Deployment example shows `vllm serve` with `--tensor-parallel-size 8` for efficient inference.

### Working Example
```bash
vllm serve cerebras/MiniMax-M2-REAP-162B-A10B \
--tensor-parallel-size 8 \
--tool-call-parser minimax_m2 \
--reasoning-parser minimax_m2_append_think \
--trust-remote-code \
--enable_expert_parallel \
--enable-auto-tool-choice
```

### Practical Applications
- **Use Case**: Coding agents using long-context LLMs (e.g., HumanEval, MBPP).
- **Pitfall**: Over-pruning beyond 30% may degrade performance on mathematical reasoning (AIME 25, MATH 500).

**References:**
- https://www.marktechpost.com/2025/11/15/cerebras-releases-minimax-m2-reap-162b-a10b-a-memory-efficient-version-of-minimax-m2-for-long-context-coding-agents/
---