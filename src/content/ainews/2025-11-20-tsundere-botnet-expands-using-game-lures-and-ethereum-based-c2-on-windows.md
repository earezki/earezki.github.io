---
title: "Tsundere Botnet Expands Using Game Lures and Ethereum-Based C2 on Windows"
pubDate: 2025-11-20
description: "The Tsundere botnet is actively spreading via MSI and PowerShell installers, leveraging game-themed lures and an Ethereum-based C2 rotation system."
categories: ["AI News", "Cybersecurity", "Malware"]
---

## Tsundere Botnet Expands Using Game Lures and Ethereum-Based C2 on Windows

The Tsundere botnet, active since mid-2025, targets Windows users with the capability to execute arbitrary JavaScript code from a command-and-control (C2) server. Researchers observed the botnet utilizing game-themed lures like Valorant and Counter-Strike 2 to distribute malicious MSI and PowerShell installers.

### Why This Matters
Traditional botnet infrastructure relies on static C2 servers, creating single points of failure and making takedown easier. Tsundere’s use of the Ethereum blockchain for C2 rotation significantly increases resilience, making disruption more complex and costly; the smart contract alone has seen 26 transactions. This highlights a shift toward leveraging decentralized technologies to improve botnet persistence.

### Key Insights
- **Ethereum C2**: The botnet utilizes a smart contract created on September 23, 2024, to dynamically retrieve C2 server addresses.
- **Node.js Dependency**: The malware relies on Node.js for execution, installing it via both MSI and PowerShell installers.
- **RMM Tool Abuse**: Initial infection vectors include compromised sites delivering malicious MSI installers via legitimate Remote Monitoring and Management (RMM) tools.

### Practical Applications
- **Use Case**: Threat actors are utilizing Tsundere to build and rent botnets through a dedicated marketplace, offering proxy services and malicious capabilities.
- **Pitfall**: Relying on static indicators of compromise (IOCs) is ineffective against botnets employing dynamic C2 infrastructure like Tsundere, requiring behavioral analysis.

**References:**
- https://thehackernews.com/2025/11/tsundere-botnet-expands-using-game.html