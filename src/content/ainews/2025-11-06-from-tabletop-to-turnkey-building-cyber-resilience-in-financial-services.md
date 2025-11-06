---
title: "From Tabletop to Turnkey: Building Cyber Resilience in Financial Services"
pubDate: 2025-11-06
description: "Financial institutions leverage OpenAEV to automate cyber resilience simulations, aligning with global mandates like DORA and CORIE through integrated tabletop and red-team exercises."
categories: ["AI News", "Cybersecurity", "Regulatory Compliance"]
---

## From Tabletop to Turnkey: Building Cyber Resilience in Financial Services

### Regulatory Mandates Drive Cyber Resilience in Financial Services
Cyber resilience has transitioned from a best practice to a **regulatory requirement** for financial institutions (FSIs) worldwide. Key regulations include:
- **DORA (EU)**: Requires digital operational resilience, including crisis management and tabletop exercises.
- **CPS230 / CORIE (Australia)**: Mandates cyber operational resilience through intelligence-led exercises.
- **MAS TRM (Singapore)**: Focuses on technology risk management.
- **FCA/PRA (UK)**: Enforces operational resilience frameworks.
- **FFIEC IT Handbook (US)**: Guides financial institutions on IT risk management.
- **SAMA (Saudi Arabia)**: Implements cybersecurity frameworks.

These regulations demand **cross-functional collaboration** between technical teams (e.g., SOC, IR) and non-technical stakeholders (e.g., leadership, crisis management), often requiring **simultaneous red-teaming** (technical simulations) and tabletop exercises.

### The Limitations of Traditional Tools
Historically, tabletop exercises relied on **Excel-based templates** with limited scope. However, modern requirements demand:
- **Complex scenarios**: Including threat actor profiles, TTPs (Tactics, Techniques, Procedures), IOCs (Indicators of Compromise), and simulated threat reports.
- **Frequency**: At least annual exercises, often quarterly or continuous.
- **Integration**: Technical tools (e.g., SIEMs, EDRs) and human-driven crisis simulations.

Excel’s **scalability and automation limitations** make it inadequate for these advanced needs.

### OpenAEV: Blending Tabletop and Red-Team Simulations
**OpenAEV**, developed by Filigran, is a **holistic adversarial exposure management platform** that integrates:
- **Technical simulations**: Breach & attack simulations (BAS) to test technical controls.
- **Human-driven scenarios**: Crisis communication simulations (e.g., ransomware alerts, leadership emails).

#### Key Advantages:
- **Scenario Design**: 
  - Threat intelligence from platforms like **OpenCTI** generates technical injects (e.g., ransomware encryption alerts) and human-facing communications (e.g., simulated emails, SOC/MSSP reports).
  - Aligns threat actor TTPs with real-world timelines and attack patterns.
- **Logistics Simplification**:
  - Synchronizes participant data from **Identity and Access Management (IAM)** systems, ensuring consistent alert recipients, feedback questionnaires, and reporting.
  - Maintains updated contact lists for **alternate crisis communication channels** (e.g., phone trees, third-party MSSPs).

#### Technical Integration:
- **SIEM/EDR Compatibility**: Integrates with security tools for real-time monitoring and log analysis.
- **Open Source Ecosystem**: Extensible for custom threat scenarios and automation.

### Scheduling and Simulation Duration
OpenAEV supports **flexible scheduling**:
- **Short-term**: Red-team simulations on Day 1 (technical controls testing) followed by tabletop exercises on Day 2.
- **Long-term**: Multi-week/month scenarios (e.g., simulating **archive log searches** for "patient zero" in intrusion investigations), which mirror real-world challenges.

### Benefits of Streamlined Simulations
- **Muscle Memory Development**: Repeated simulations build **confidence and readiness** in crisis management teams.
- **Compliance**: Helps meet **DORA, CORIE, and other mandates** through documented, repeatable exercises.
- **Continuous Improvement**: Enables **iterative refinement** of incident response plans based on exercise outcomes.

### Real-World Application
OpenAEV is **free for community use**, with pre-built scenarios for ransomware and common threats. It supports:
- **Automated Reporting**: For auditor reviews and compliance documentation.
- **Threat Landscape Mapping**: Tracks evolving threats and aligns simulations with current intelligence.

---

## Working Example (Not Applicable)
No code examples are provided in the context. However, OpenAEV’s technical integrations with SIEMs (e.g., Splunk, ELK Stack) and EDRs (e.g., CrowdStrike, SentinelOne) enable automated log analysis during simulations.

---

## Recommendations
- **Start Small**: Begin with isolated red-team or tabletop exercises before blending them.
- **Leverage Threat Intelligence**: Use platforms like OpenCTI to align simulations with real-world TTPs.
- **Automate Where Possible**: Use IAM integrations to reduce manual effort in participant management.
- **Schedule Regularly**: Conduct simulations quarterly or continuously to maintain readiness.
- **Avoid Pitfalls**: 
  - Over-reliance on Excel for complex scenarios.
  - Neglecting to update threat models and participant lists post-exercise.

---

**Reference**: [https://thehackernews.com/2025/11/from-tabletop-to-turnkey-building-cyber.html](https://thehackernews.com/2025/11/from-tabletop-to-turnkey-building-cyber.html)