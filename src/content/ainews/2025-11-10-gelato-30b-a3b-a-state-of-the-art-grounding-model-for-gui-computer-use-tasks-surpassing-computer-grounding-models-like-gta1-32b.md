---
title: "Gelato-30B-A3B: A State-of-the-Art Grounding Model for GUI Computer-Use Tasks, Surpassing Computer Grounding Models like GTA1-32B"
pubDate: 2025-11-10
description: "Gelato-30B-A3B achieves 63.88% accuracy on ScreenSpot Pro, outperforming GTA1-32B and larger VLMs in GUI grounding tasks."
categories: ["AI News", "Agentic AI", "Language Model"]
---

## Gelato-30B-A3B: A State-of-the-Art Grounding Model for GUI Computer-Use Tasks, Surpassing Computer Grounding Models like GTA1-32B

Researchers at ML Foundations introduced Gelato-30B-A3B, a 31B-parameter model that converts natural language instructions into precise click coordinates for GUI tasks. It achieves 63.88% accuracy on ScreenSpot Pro, surpassing GTA1-32B and even larger models like Qwen3-VL-235B-A22B-Instruct.

### Why This Matters
Grounding models bridge natural language and GUI interactions, but prior systems often failed to align instructions with screen elements, leading to costly errors in automation. Gelato-30B-A3B’s 63.88% accuracy on ScreenSpot Pro (vs. GTA1-32B’s 56.97% in the same test) demonstrates a critical leap in reliability, reducing the need for manual corrections in agent workflows.

### Key Insights
- "63.88% accuracy on ScreenSpot Pro, 2025": Achieved through GRPO training on Click 100k dataset.
- "Click 100k dataset": Merges 85+ professional app tutorials and filtered public datasets, ensuring precise bounding box annotations.
- "GRPO reinforcement learning": Sparse rewards only trigger when predicted clicks match ground-truth boxes, boosting accuracy by +9 pp over unfiltered training.

### Practical Applications
- **Use Case**: Agent frameworks (e.g., GTA1.5) using GPT-5 as a planner and Gelato-30B-A3B for grounding achieve 58.71% automated success on OS World tasks.
- **Pitfall**: Over-reliance on automated grounding may fail in UIs with dynamic layouts not represented in Click 100k.

**References:**
- https://www.marktechpost.com/2025/11/10/gelato-30b-a3b-a-state-of-the-art-grounding-model-for-gui-computer-use-tasks-surpassing-computer-grounding-models-like-gta1-32b/
---