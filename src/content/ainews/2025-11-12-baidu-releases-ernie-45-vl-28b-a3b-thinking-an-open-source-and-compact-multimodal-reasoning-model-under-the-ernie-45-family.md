---
title: "Baidu Releases ERNIE-4.5-VL-28B-A3B-Thinking: An Open-Source and Compact Multimodal Reasoning Model Under the ERNIE-4.5 Family"
pubDate: 2025-11-11
description: "Baidu’s ERNIE-4.5-VL-28B-A3B-Thinking achieves 3B active parameters per token with 30B total parameters, outperforming larger models on multimodal benchmarks."
categories: ["AI News", "Applications", "Computer Vision"]
---

## Baidu Releases ERNIE-4.5-VL-28B-A3B-Thinking: An Open-Source and Compact Multimodal Reasoning Model Under the ERNIE-4.5 Family

Baidu introduced ERNIE-4.5-VL-28B-A3B-Thinking, a vision-language model that activates only 3B parameters per token while maintaining a 30B total parameter MoE architecture. It achieves competitive performance on document, chart, and video reasoning tasks compared to models with 7B–32B parameters.

### Why This Matters
Traditional large multimodal models require massive parameter budgets, but ERNIE-4.5-VL-28B-A3B-Thinking uses a Mixture-of-Experts (MoE) design to activate only 3B parameters per token, reducing compute and memory overhead by 90% compared to full 30B activation. This enables deployment on resource-constrained systems without sacrificing reasoning capabilities on complex tasks like STEM problems or document analysis.

### Key Insights
- "3B active parameters per token with 30B total parameters, 2025": Baidu’s A3B routing scheme activates a subset of experts for each input.
- "Thinking with Images for document and chart reasoning": The model iteratively zooms into image regions and integrates local observations into final answers.
- "Apache License 2.0 enables commercial deployment": Open-sourcing under permissive terms supports enterprise adoption.

### Practical Applications
- **Use Case**: Document analysis in analytics workflows using "Thinking with Images" for dense text and chart interpretation.
- **Pitfall**: Overlooking the need for mid-training on visual-language reasoning corpora, which risks poor semantic alignment between modalities.

**References:**
- https://www.marktechpost.com/2025/11/11/baidu-releases-ernie-4-5-vl-28b-a3b-thinking-an-open-source-and-compact-multimodal-reasoning-model-under-the-ernie-4-5-family/
---