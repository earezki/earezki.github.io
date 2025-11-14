---
title: "Over 67,000 Fake npm Packages Flood Registry in Worm-Like Spam Attack"
pubDate: 2025-11-13
description: "A worm-like attack flooded npm with 67,579 fake packages over two years, exploiting manual execution to evade detection."
categories: ["AI News", "Cybersecurity", "Supply Chain Security"]
---

## IndonesianFoods Worm

A worm-like attack flooded npm with 67,579 fake packages over two years, exploiting manual execution to evade detection. Researchers traced the IndonesianFoods Worm to a coordinated campaign using Indonesian food-themed names and Tea protocol tokens for monetization.

### Why This Matters
The attack highlights a critical gap in npm's security model: automated scanners fail to detect threats that require manual execution. Unlike traditional malware, this worm avoids detection by staying dormant until a user runs a script like `node auto.js`. The scale—over 67,000 packages—strains registry infrastructure, pollutes search results, and creates supply chain risks if developers accidentally install these packages. The attack’s low technical complexity underscores how open ecosystems can be weaponized at scale.

### Key Insights
- "67,579 packages published over two years, 2024–2025": https://thehackernews.com/2025/11/over-46000-fake-npm-packages-flood.html
- "Worm-like propagation via self-referential dependencies": Endor Labs report (2025)
- "JFrog identified malware reusing npm credentials for relentless package publishing": https://thehackernews.com/2025/11/over-46000-fake-npm-packages-flood.html

### Practical Applications
- **Use Case**: Supply chain attacks via npm dependencies, e.g., `arts-dao` and `gula-dao` packages linking to TEA token farming.
- **Pitfall**: Relying on manual execution for security—attackers crafted scripts to evade automated detection by requiring user intervention.

**References:**
- https://thehackernews.com/2025/11/over-46000-fake-npm-packages-flood.html
- https://aws.amazon.com/blogs/security/over-150000-spam-packages-linked-to-tea-token-farming-campaign/