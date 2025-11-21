---
title: "QConSF 2025: Navigating Engineering Leadership in the Age of AI"
pubDate: 2025-11-21
description: "Michelle Brush of Google’s QConSF 2025 keynote highlighted the increasing complexity for engineers as AI automates tasks, demanding higher-level skills and conscious competence."
categories: ["AI News", "Software Engineering", "Leadership"]
---

## Humans in the Loop: Engineering Leadership in a Chaotic Industry

Google’s Michelle Brush, engineering director of Site Reliability Engineering (SRE), delivered a keynote at QCon San Francisco 2025 arguing that automation, while increasing, shifts engineering work to more challenging areas. Brush, a contributor to “97 Things Every SRE Should Know,” emphasized the need for conscious competence and effective leadership to navigate this evolving landscape. 

### Why This Matters
Idealized models of automation often fail to account for the increased cognitive load placed on humans when monitoring and debugging automated systems. As illustrated by Bainbridge’s “Ironies of Automation” (1983), automating tasks doesn’t eliminate work—it transforms it, often making the remaining human responsibilities more difficult and demanding. This mismatch between expectation and reality can lead to increased operational costs and reduced system reliability.

### Key Insights
- **Jevons’ Paradox**: As AI reduces the cost of software development, overall engineering work will likely *increase* due to expanded possibilities.
- **LLM Limitations**: Large language models operate with “unconscious competence,” lacking explainability and awareness of their limitations, leading to potential “hallucinations.”
- **SRE Evolution**: Google’s SRE organization has evolved over two decades, learning from incidents like a 2019 outage caused by runaway automation and insufficient geographic distribution.

### Practical Applications
- **Use Case**: Google SRE utilizes intent-based rollout systems and latency injection testing to proactively identify and mitigate risks before deploying changes.
- **Pitfall**: Assuming geographic distribution alone guarantees resilience; organizations must account for correlated failures and capacity limitations.

**References:**
- https://www.infoq.com/news/2025/11/qcon-engineering-leadership/