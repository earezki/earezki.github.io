---
title: "Salesforce’s Approach to Self-Healing Using AIOps and Agentic AI"
pubDate: 2025-11-12
description: "Salesforce reduces Kubernetes cluster issue resolution time by 80% using AIOps and agentic AI at KubeCon NA 2025."
categories: ["AI News", "AIOps", "Kubernetes"]
---

## Salesforce’s Approach to Self-Healing Using AIOps and Agentic AI

At KubeCon NA 2025, Salesforce presented its self-healing Kubernetes platform managing 1400 clusters with AIOps and agentic AI, cutting manual intervention by 80%. The system automates diagnostics and resolutions, reducing mean time to identify (MTTI) and resolve (MTTR) critical issues.

### Why This Matters
The ideal of fully automated infrastructure management clashes with real-world challenges like agent coordination, security guardrails, and data silos. Salesforce’s 1400+ cluster scale and 200+ monitoring plugins highlight the complexity of maintaining reliability without human oversight. Manual interventions cost time and risk outages, but current AI agents still require careful tuning to avoid errors in high-stakes environments.

### Key Insights
- "80% manual work elimination roadmap, 2025": Salesforce aims to automate 80% of Kubernetes operations via AI agents.
- "Agentic AI over traditional automation": Agents like the Live Site Analysis Agent automate RCA and SLA reviews, replacing static workflows.
- "K8sGPT Operator used by Salesforce": Integrates with Prometheus and EKS to improve MTTI metrics.

### Practical Applications
- **Use Case**: Salesforce’s Hyperforce platform automates cluster upgrades and rollback triggers via AI agents.
- **Pitfall**: Over-reliance on agentic AI without human oversight may lead to unresolved issues during edge cases.

**References:**
- https://www.infoq.com/news/2025/11/salesforce-self-healing-aiops/
---