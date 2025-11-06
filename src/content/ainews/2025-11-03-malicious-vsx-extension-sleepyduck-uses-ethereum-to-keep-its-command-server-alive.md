---
title: "Malicious VSX Extension SleepyDuck Leverages Ethereum for Persistent Command Server Control"
pubDate: 2025-11-03
description: "Researchers uncover SleepyDuck RAT hidden in a VSX extension, using Ethereum contracts to dynamically update its command-and-control server, highlighting risks in open-source software ecosystems."
categories: ["AI News", "Cybersecurity", "Malware Analysis"]
---

## Malicious VSX Extension SleepyDuck Leverages Ethereum for Persistent Command Server Control

### Overview of SleepyDuck Malware
- **Discovery**: Cybersecurity researchers identified a malicious extension named **juan-bianco.solidity-vlang** (versions 0.0.7 and 0.0.8) in the Open VSX registry, which harbors the **SleepyDuck** remote access trojan (RAT).
- **Publication Timeline**: 
  - Version 0.0.7 was published on **October 31, 2025**, as a benign Solidity development tool.
  - Version 0.0.8, containing malicious code, was released on **November 1, 2025**, after reaching **14,000 downloads**.
- **Purpose**: SleepyDuck is designed to evade sandbox detection, exfiltrate system data, and maintain persistence by dynamically updating its command-and-control (C2) server via Ethereum contracts.

### Ethereum-Based Command and Control Mechanism
- **Dynamic C2 Server Updates**:
  - The malware connects to an Ethereum contract at address **0xDAfb81732db454DA238e9cFC9A9Fe5fb8e34c465** to retrieve the C2 server address.
  - Initially, the server was set to **localhost:8080**, but it was later updated to **sleepyduck[.]xyz** through **four Ethereum transactions**.
- **Fallback Mechanism**:
  - If the primary domain is seized, the malware uses predefined Ethereum RPC providers to fetch updated C2 details, ensuring resilience against takedowns.
- **Polling Loop**:
  - SleepyDuck checks for new commands every **30 seconds** via the C2 server.
- **Data Exfiltration**:
  - The malware collects system information, including **hostname, username, MAC address, and timezone**, and sends it to the C2 server.

### Campaign Distribution and Impact
- **Target Audience**: Solidity developers using tools like **Cursor** or **Open VSX**.
- **Historical Context**:
  - In **July 2025**, Kaspersky reported a Russian developer losing **$500,000** in cryptocurrency after installing a similar malicious extension.
- **Malicious Behavior Triggers**:
  - The malware activates when a new code editor window is opened or a **.sol** (Solidity) file is selected.
- **Download Inflation Tactics**:
  - Threat actors may have artificially inflated download counts to boost the extension’s visibility in search results, increasing the likelihood of adoption by unsuspecting users.

### Additional Malicious Extensions
- **Threat Actor Activity**: A user named **developmentinc** published five malicious extensions on the VS Code Extension Marketplace, including:
  - **developmentinc.pokemon**: Downloads a **Monero mining script** from **mock1[.]su:443** and executes it using **cmd.exe**.
  - **Other Extensions**: developmentinc.cfx-lua-vs, developmentinc.torizon-vs, developmentinc.minecraftsnippets, developmentinc.kombai-vs.
- **Malware Features**:
  - The Monero miner script:
    - Relaunches itself with **administrator privileges** via PowerShell.
    - Configures **Microsoft Defender Antivirus exclusions** for all drives (**C: through Z:**).
    - Downloads and runs a **Monero mining executable** from **mock1[.]su**.

### Recommendations for Developers
- **Vetting Extensions**:
  - Only install extensions from **trusted publishers**.
  - Verify the authenticity of extensions using official repositories or community reviews.
- **Security Practices**:
  - Regularly update development tools and monitor for unusual activity.
  - Use **sandboxed environments** for testing untrusted extensions.
- **Organizational Measures**:
  - Enable **Microsoft’s marketplace-wide scans** (announced in June 2025) to detect and remove malicious extensions.
  - Monitor for **unauthorized cryptocurrency transactions** or mining activities on developer systems.

For further details, refer to the original analysis:  
[Malicious VSX Extension SleepyDuck Uses Ethereum to Keep Its Command Server Alive](https://thehackernews.com/2025/11/malicious-vsx-extension-sleepyduck-uses.html)