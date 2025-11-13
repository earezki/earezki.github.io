---
title: "Ctrl+Z for agents"
pubDate: 2021-02-09
description: "IBM and University of Illinois propose a Ctrl-Z feature for agents that could reduce IT outage costs by $14,000/minute."
categories: ["AI News", "Cloud Engineering", "SRE"]
---

## Ctrl+Z for agents

IBM Research and University of Illinois propose an undo-and-retry mechanism for cloud engineering agents, enabling safer troubleshooting of IT issues. The system, STRATUS, outperformed other AIOps tools by 150% on industry benchmarks.

### Why This Matters
Current AIOps tools assist in diagnosing IT failures but lack the safety to execute fixes directly. Unplanned outages now cost $14,000 per minute, yet operators distrust AI agents without rollback capabilities. STRATUS introduces transactional-no-regression (TNR) safety, ensuring only reversible changes are applied, preventing catastrophic actions like deleting production clusters.

### Key Insights
- "150% performance boost over state-of-the-art systems, STRATUS on AIOpsLab/ITBench (2025)"
- "TNR ensures reversible changes, avoiding irreversible system damage"
- "STRATUS blocks destructive actions (e.g., deleting databases) before execution"

### Practical Applications
- **Use Case**: Cloud SREs using STRATUS to safely rollback failed remediation steps
- **Pitfall**: Over-reliance on automation may obscure complex, non-transactional issues requiring human judgment

**References:**
- https://research.ibm.com/blog/undo-agent-for-cloud?utm_medium=rss&utm_source=rss
---