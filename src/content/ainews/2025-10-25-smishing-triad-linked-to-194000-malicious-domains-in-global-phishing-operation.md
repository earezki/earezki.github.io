---
title: "Global Smishing Campaign Linked to 194,000 Malicious Domains and Over $1 Billion in Fraud"
pubDate: 2025-10-25
description: "A China-linked cybercriminal group, Smishing Triad, has used 194,000 malicious domains since 2024 to execute a global phishing operation, generating over $1 billion in fraud through smishing attacks targeting financial and government services."
categories: ["AI News", "Cyber Security", "Phishing", "Malware"]

---

## Global Smishing Campaign Linked to 194,000 Malicious Domains and Over $1 Billion in Fraud

A large-scale smishing campaign attributed to the China-linked **Smishing Triad** has leveraged over **194,000 malicious domains** since January 2024, targeting users worldwide with fraudulent messages impersonating services like toll violations, package deliveries, and government agencies. The operation, hosted on U.S. cloud infrastructure despite domain registration in Hong Kong, has generated **over $1 billion in fraud** over three years and evolved into a decentralized **phishing-as-a-service (PhaaS)** ecosystem.

---

## Operation Overview

### Key Details of the Smishing Triad Campaign
- **Domains**: 194,345 fully qualified domain names (FQDNs) used, resolving to **43,494 unique IP addresses**, primarily in the U.S. (hosted on Cloudflare).
- **Registration**: 93,200 (68.06%) of 136,933 root domains registered via **Dominet (HK) Limited**, a Hong Kong-based registrar.
- **Domain Lifespan**: 
  - 39,964 (29.19%) domains active for ≤2 days.
  - 71.3% active for <1 week.
  - 82.6% active for ≤2 weeks.
  - <6% domains persisted beyond 3 months.
- **Geographic Targets**: Campaigns mimic services in **Russia, Poland, Lithuania, and the U.S.**, including banks, cryptocurrency exchanges, government agencies, and toll services.

### Phishing-as-a-Service (PhaaS) Ecosystem
The Smishing Triad operates as a decentralized network with specialized roles:
- **Phishing Kit Developers**: Create templates for fraudulent landing pages.
- **Data Brokers**: Sell target phone numbers for mass smishing campaigns.
- **Domain Sellers**: Register disposable domains to host phishing sites.
- **Hosting Providers**: Use U.S.-based cloud services (e.g., Cloudflare) to host infrastructure.
- **Spammers**: Distribute fraudulent SMS messages at scale.
- **Liveness Scanners**: Validate phone numbers to avoid detection.
- **Blocklist Scanners**: Rotate domains to evade detection by checking against known blocklists.

---

## Attack Tactics and Impersonation Targets

### Top Impersonated Services
- **U.S. Postal Service (USPS)**: 28,045 FQDNs impersonating USPS.
- **Toll Services**: 90,000 FQDNs mimicking toll violation notices.
- **Government Agencies**: Campaigns use **ClickFix lures** to trick users into running malicious code during CAPTCHA checks.
- **Financial Institutions**: A **fivefold increase** in attacks targeting brokerage accounts in Q2 2025 compared to Q2 2024, aimed at stealing banking credentials and authentication codes.

### Financial Manipulation Tactics
- **"Ramp and Dump" Stock Market Schemes**: Attackers manipulate stock prices post-compromise, leaving minimal digital trails.
- **Monetization**: The campaign has generated **$1 billion in fraud** over three years, with significant revenue from phishing kits and data brokerage.

---

## Infrastructure and Detection Challenges

### Hosting and Domain Management
- **Hosting Locations**: 82.6% of domains hosted in the U.S., followed by China and Singapore.
- **Domain Rotation**: Rapid domain churn (most active for <2 weeks) to evade detection by security systems.
- **Domain Prefix Trends**: 70% of domains use the ".com" prefix, with a recent rise in ".gov" domains.

### Detection and Mitigation Challenges
- **Decentralized Nature**: The PhaaS model allows disparate threat actors to collaborate, making attribution and takedown complex.
- **Evasion Techniques**: Use of disposable domains, U.S.-based cloud hosting, and blocklist rotation to bypass security measures.

---

## Recommendations (for Cybersecurity Professionals)

- **Monitor Domain Registration Trends**: Track rapid domain creation and short lifespans to detect PhaaS operations.
- **Enhance SMS Filtering**: Deploy AI-driven systems to flag suspicious smishing messages, especially those impersonating trusted services.
- **Update Blocklists Dynamically**: Regularly update threat intelligence databases to include newly registered malicious domains.
- **Educate Users**: Train users to verify messages from official channels before clicking links or providing personal information.
- **Secure Financial Infrastructure**: Implement multi-factor authentication (MFA) and anomaly detection systems for brokerage and banking platforms.

---

## Reference
[Smishing Triad Linked to 194,000 Malicious Domains in Global Phishing Operation](https://thehackernews.com/2025/10/smishing-triad-linked-to-194000.html)