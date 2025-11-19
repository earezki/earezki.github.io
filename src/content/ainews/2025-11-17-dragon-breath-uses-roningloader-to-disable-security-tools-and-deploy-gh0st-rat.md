---
title: "Dragon Breath Exploits RONINGLOADER to Deploy Gh0st RAT"
pubDate: 2025-11-17
description: "Dragon Breath threat actor leverages the RONINGLOADER to bypass security tools and deploy a modified Gh0st RAT, impacting Chinese-speaking users."
categories: ["AI News", "Cybersecurity", "Malware"]
---

## Dragon Breath Uses RONINGLOADER to Disable Security Tools and Deploy Gh0st RAT

The threat actor Dragon Breath is utilizing a multi-stage loader called RONINGLOADER to deliver a variant of the Gh0st RAT, primarily targeting Chinese-speaking users. This campaign employs trojanized installers disguised as legitimate software like Google Chrome and Microsoft Teams, demonstrating a sophisticated evasion technique.

### Why This Matters
Modern endpoint detection and response (EDR) systems are designed to detect and prevent malicious code execution, but threat actors like Dragon Breath are increasingly successful at bypassing these defenses through multi-stage loaders and anti-analysis techniques. The cost of successful breaches using RATs like Gh0st can range from intellectual property theft to long-term espionage, potentially costing organizations millions of dollars and damaging their reputation.

### Key Insights
- **RONINGLOADER targets multiple AV solutions**: The loader actively scans for and terminates processes associated with popular Chinese antivirus products like Microsoft Defender, Kingsoft, Tencent, and Qihoo 360.
- **PPL and EDR-Freeze abuse**: Dragon Breath employs techniques abusing Protected Process Light (PPL) and the Windows Error Reporting system to disable Microsoft Defender Antivirus.
- **WDAC manipulation**: The malware creates custom Windows Defender Application Control (WDAC) policies to block Chinese security vendors, further hindering detection.

### Practical Applications
- **Use Case**: Financial institutions in China are likely targets, given the actor’s history of targeting online gaming and gambling industries—potentially for financial gain.
- **Pitfall**: Relying solely on signature-based detection is insufficient; behavioral analysis and robust endpoint protection are crucial to mitigate these advanced threats.

**References:**
- https://thehackernews.com/2025/11/dragon-breath-uses-roningloader-to.html