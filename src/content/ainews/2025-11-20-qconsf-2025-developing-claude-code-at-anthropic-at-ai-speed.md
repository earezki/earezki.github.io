---
title: "Developing Claude Code at Anthropic at AI Speed"
pubDate: 2025-11-20
description: "Anthropic's Claude Code generates 90% of its production code, redefining AI-driven software development at QConSF 2025."
categories: ["AI News", "Generative AI", "Code Generation"]
---

## Developing Claude Code at Anthropic at AI Speed

At QCon San Francisco 2025, Adam Wolff revealed that Claude Code at Anthropic generates 90% of its production code. The system’s design prioritizes rapid iteration over upfront planning, with feedback loops driving continuous improvement.

### Why This Matters
Traditional software development treats implementation as the costly phase, but AI shifts the bottleneck to feedback speed. Anthropic’s experiments—like Unicode handling and shell command optimization—show that technical debt and architectural choices often emerge only after deployment. The SQLite storage failure, which caused install issues and concurrency problems, highlights the risks of over-engineering without real-world validation. The cost of these missteps, though not quantified, underscores the need for agile, iterative development in AI-powered workflows.

### Key Insights
- "90% of production code written by Claude Code, 2025" (InfoQ, 2025)
- "Cursor class with immutable text buffer reduced keystroke latency from seconds to milliseconds" (QConSF 2025 presentation)
- "SQLite adoption failed due to native dependency issues and locking mismatches" (Anthropic team retrospective)

### Practical Applications
- **Use Case**: Internal development at Anthropic with rapid iterations and feedback loops
- **Pitfall**: Over-reliance on native dependencies (e.g., SQLite) without considering distribution constraints

**References:**
- https://www.infoq.com/news/2025/11/claude-ai-speed/
---