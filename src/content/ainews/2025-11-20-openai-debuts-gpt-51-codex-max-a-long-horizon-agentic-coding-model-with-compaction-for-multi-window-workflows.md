---
title: "OpenAI Debuts GPT-5.1-Codex-Max, a Long-Horizon Agentic Coding Model With Compaction for Multi-Window Workflows"
pubDate: 2025-11-19
description: "OpenAI's GPT-5.1-Codex-Max achieves 77.9% accuracy on SWE-bench Verified with compaction, enabling 24-hour autonomous coding sessions."
categories: ["AI News", "Agentic AI", "AI Agents"]
---

## OpenAI Debuts GPT-5.1-Codex-Max, a Long-Horizon Agentic Coding Model With Compaction for Multi-Window Workflows

OpenAI has released GPT-5.1-Codex-Max, a model optimized for long-running software engineering tasks. It autonomously handles multi-hour workflows by compaction, sustaining sessions over millions of tokens.

### Why This Matters
Traditional models struggle with context window limits, forcing developers to split tasks or accept reduced accuracy. GPT-5.1-Codex-Max overcomes this via compaction, pruning redundant history while retaining critical state. This enables uninterrupted coding sessions but risks increased complexity in debugging if compaction obscures intermediate steps.

### Key Insights
- "24-hour autonomous coding sessions, 2025": OpenAI's internal evaluations show the model operating independently on single tasks for over 24 hours.
- "Compaction over fixed context windows for long-horizon tasks": The model natively compresses interaction history to span multiple context windows.
- "Codex CLI used by developers for PR creation and code review": GPT-5.1-Codex-Max is deployed in Codex's CLI, IDE extensions, and code review tools.

### Practical Applications
- **Use Case**: Frontend coding in Codex CLI with compaction for multi-hour tasks.
- **Pitfall**: Over-reliance on compaction may obscure debugging steps in complex workflows.

**References:**
- https://www.marktechpost.com/2025/11/19/openai-debuts-gpt-5-1-codex-max-a-long-horizon-agentic-coding-model-with-compaction-for-multi-window-workflows/
---