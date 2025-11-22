---
title: "Scalable Multi-Tenant Architecture for Hundreds of Custom Domains"
pubDate: 2025-11-22
description: "AWS ALB enforces 100 SSL certificates limit, forcing SaaS platforms to innovate for 300+ domains."
categories: ["AI News", "DevOps", "Cloud Architecture"]
---

## Scalable Multi-Tenant Architecture for Hundreds of Custom Domains

Modern SaaS platforms face a critical challenge: hosting hundreds of custom domains on a shared backend. The AWS ALB’s 100-SSL-certificate limit becomes a blocker when managing 300+ domains, requiring architectural ingenuity to avoid outages.

### Why This Matters
The ideal multi-tenant model assumes unlimited scalability, but AWS enforces strict quotas. A misconfigured ALB with 100+ certificates risks downtime, while splitting tenants across multiple ALBs introduces operational complexity. The cost of mismanagement includes increased IaC overhead, error-prone domain tracking, and higher maintenance risk.

### Key Insights
- "100 SSL certificates per ALB limit, AWS documentation"
- "CloudFront can forward Host headers to ALB for tenant routing"
- "Single internal origin domain (e.g., origin.example.com) eliminates ALB certificate dependency"

### Working Example
```plaintext
User → https://storeABC.com
↓
CloudFront (receives request)
- TLS handshake with storeABC.com
- Decrypts request
- Forwards request to origin
↓
CloudFront → Origin (ALB via CNAME):
- HTTPS request to https://origin.example.com
- TLS handshake with ALB (*.example.com)
- Sends HTTP request with Host: storeABC.com
↓
ALB:
- Terminates TLS
- Receives Host: storeABC.com
- Forwards to backend service/pod in EKS
```

### Practical Applications
- **Use Case**: SaaS commerce platforms with 300+ custom domains
- **Pitfall**: Attempting to attach 100+ certificates directly to ALB causes quota violations and potential service disruption

**References:**
- https://dev.to/peter_dyakov_06f3c69a46b7/scalable-multi-tenant-architecture-for-hundreds-of-custom-domains-56mn
---