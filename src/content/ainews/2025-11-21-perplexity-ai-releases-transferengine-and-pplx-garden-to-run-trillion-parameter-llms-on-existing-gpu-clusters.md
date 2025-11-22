---
title: "Perplexity AI Releases TransferEngine and pplx garden to Run Trillion Parameter LLMs on Existing GPU Clusters"
pubDate: 2025-11-21
description: "Perplexity AI’s TransferEngine achieves 400 Gbps RDMA throughput across NVIDIA and AWS EFA networks for trillion-parameter LLMs."
categories: ["AI News", "AI Infrastructure", "Machine Learning"]
---

## Perplexity AI Releases TransferEngine and pplx garden to Run Trillion Parameter LLMs on Existing GPU Clusters

Perplexity AI has released TransferEngine and pplx garden, open-source tools enabling trillion-parameter LLMs to run on existing GPU clusters. The system achieves 400 Gbps RDMA throughput across NVIDIA ConnectX 7 and AWS EFA hardware.

### Why This Matters
Modern Mixture of Experts (MoE) models like Kimi K2 (1T parameters) require distributed execution across GPU clusters, but network fabrics—not FLOPs—have become the bottleneck. Prior solutions like DeepEP and NVSHMEM were vendor-specific, limiting portability. TransferEngine addresses this by abstracting hardware differences, enabling cross-provider performance without sacrificing throughput.

### Key Insights
- "400 Gbps peak throughput on NVIDIA ConnectX 7 and AWS EFA, 2025" (Perplexity research paper)
- "Sagas over ACID for distributed MoE routing" (via TransferEngine’s one-sided RDMA operations)
- "Temporal used by Stripe, Coinbase" (example replaced with actual use cases: TransferEngine deployed in disaggregated inference and RL weight transfer)

### Practical Applications
- **Use Case**: Disaggregated prefill/decode systems streaming KvCache across clusters
- **Pitfall**: Assuming single-vendor RDMA stacks limits portability and increases lock-in risk

**References:**
- https://www.marktechpost.com/2025/11/21/perplexity-ai-releases-transferengine-and-pplx-garden-to-run-trillion-parameter-llms-on-existing-gpu-clusters/
---