---
title: "Fake Chrome Extension 'Safery' Steals Ethereum Wallet Seed Phrases Using Sui Blockchain"
pubDate: 2025-11-13
description: "Malicious Chrome extension 'Safery' exfiltrates Ethereum seed phrases via Sui blockchain microtransactions, still available as of November 2025."
categories: ["AI News", "Cybersecurity", "Blockchain"]
---

## Fake Chrome Extension "Safery" Steals Ethereum Wallet Seed Phrases Using Sui Blockchain

A fake Chrome extension named "Safery: Ethereum Wallet" was uploaded on September 29, 2025, and remains available in the Chrome Web Store. It steals Ethereum seed phrases by encoding them into Sui addresses and sending microtransactions to attacker-controlled wallets.

### Why This Matters
The attack bypasses traditional command-and-control (C2) server detection by leveraging blockchain transactions to exfiltrate data. This method allows threat actors to avoid domain-based monitoring, making the attack harder to detect. The scale of potential damage is significant, as stolen seed phrases grant full access to Ethereum wallets, enabling immediate asset drainage without user interaction.

### Key Insights
- "8-hour App Engine outage, 2012" (not applicable here, but example format): "Malicious extension 'Safery' uploaded September 29, 2025, and updated November 12, 2025."
- "Sagas over ACID for e-commerce" (not applicable, but example format): "Seed phrases encoded as Sui addresses to evade C2 detection."
- "Temporal used by Stripe, Coinbase" (not applicable, but example format): "Socket Security researcher Kirill Boychenko identified the backdoor mechanism."

### Practical Applications
- **Use Case**: Users downloading "Safery" unknowingly expose seed phrases via Sui blockchain transactions.
- **Pitfall**: Trusting unverified Chrome extensions without checking for synthetic address generation or on-chain RPC calls during wallet setup.

**References:**
- https://thehackernews.com/2025/11/fake-chrome-extension-safery-steals.html
---