---
title: "Malicious npm Package Targets GitHub-Owned Repositories"
pubDate: 2025-11-11
description: "Malicious npm package @acitons/artifact steals GitHub tokens, downloaded 47,405 times."
categories: ["AI News", "Cybersecurity", "npm Security"]
---

## Malicious npm Package Targets GitHub-Owned Repositories

Cybersecurity researchers identified the malicious npm package "@acitons/artifact," which typosquats a legitimate GitHub Actions package. It exfiltrated GitHub tokens from 47,405 downloads, targeting repositories owned by GitHub itself.

### Why This Matters
Supply chain attacks exploit trusted dependencies, assuming package managers enforce strict security. However, typosquatting—where malicious packages mimic legitimate ones—remains a critical vulnerability. This attack highlights how even minor configuration errors (e.g., typos in `npm install`) can compromise sensitive infrastructure, with potential costs exceeding $1M in breach remediation and lost trust.

### Key Insights
- "47,405 downloads of @acitons/artifact, per npm-stat": https://thehackernews.com/2025/11/researchers-detect-malicious-npm.html
- "Post-install hooks used to execute malware in GitHub Actions workflows": Veracode analysis
- "Veracode identifies targeted attack on GitHub-owned repos": https://thehackernews.com/2025/11/researchers-detect-malicious-npm.html

### Practical Applications
- **Use Case**: GitHub Actions workflows using `@acitons/artifact` inadvertently execute token-exfiltration scripts.
- **Pitfall**: Relying on unverified third-party npm packages without audit checks, enabling supply chain compromises.

**Reference:** https://thehackernews.com/2025/11/researchers-detect-malicious-npm.html
---