---
title: "Russian Hackers Target Ukrainian Organizations Using Stealthy Living-Off-the-Land Tactics"
pubDate: 2025-10-29
description: "Russian threat actors targeted Ukrainian organizations using stealthy Living-Off-the-Land (LotL) tactics, leveraging dual-use tools and minimal malware to evade detection. The attack involved web shells, PowerShell backdoors, and memory dumps, with implications for global cybersecurity strategies."
categories: ["AI News", "Cybersecurity", "Threat Intelligence"]
---

## Russian Hackers Target Ukrainian Organizations Using Stealthy Living-Off-the-Land Tactics

### Overview of the Cyberattack Campaign
Russian-origin threat actors conducted a prolonged cyberattack campaign targeting Ukrainian organizations, including a major business services firm and a local government entity. The attackers used **Living-Off-the-Land (LotL)** tactics—exploiting legitimate system tools and dual-use software—to minimize digital footprints and remain undetected. Key methods included deploying web shells, PowerShell backdoors, and memory dump tools, with the goal of exfiltrating sensitive data and establishing persistent access.

### Key Attack Methodologies and Tools
- **Web Shells and Initial Access**  
  - Attackers exploited unpatched vulnerabilities in public-facing servers to deploy **LocalOlive**, a web shell previously linked to the Russia-associated **Sandworm** group.  
  - LocalOlive was used to deliver payloads like **Chisel**, **plink**, and **rsockstun**, enabling remote access and data exfiltration.  
  - The attack began on **June 27, 2025**, with the deployment of a web shell for reconnaissance.

- **PowerShell and Scheduled Tasks for Persistence**  
  - PowerShell commands were executed to:  
    - Exclude the **Downloads** folder from Microsoft Defender Antivirus scans.  
    - Create a scheduled task to perform memory dumps every 30 minutes using **RDRLeakDiag** (Windows Resource Leak Diagnostic tool).  
  - A PowerShell backdoor script (**link.ps1**) was scheduled to run every 30 minutes using a domain account.

- **Exploitation of Native Tools**  
  - Attackers used legitimate tools like **RDPclip** (for clipboard access in remote desktop sessions) and **OpenSSH** (to enable remote access via port 22).  
  - **MikroTik’s `winbox64.exe`** was deployed in the Downloads folder, a tool previously associated with Sandworm campaigns targeting Ukrainian infrastructure (e.g., energy and water suppliers).

- **Reconnaissance and Data Exfiltration**  
  - The attackers:  
    - Saved registry hives to files (e.g., "1.log").  
    - Enumerated files in user directories and listed processes starting with "kee" (likely targeting **KeePass** password managers).  
    - Ran reconnaissance commands on multiple machines and modified registry settings to allow RDP connections.

### Timeline and Targets
- **Business Services Organization**:  
  - Targeted for **2 months** starting in **June 2025**.  
  - Attackers used multiple web shells and executed memory dumps to gather intelligence.  
- **Local Government Entity**:  
  - Targeted for **1 week**, with similar tactics employed to access sensitive systems.

### Connection to Broader Cybersecurity Trends
- **Sandworm and Sandworm-Linked Campaigns**:  
  - While no direct evidence linked the attack to **Sandworm**, the use of **LocalOlive** and **winbox64.exe** aligns with historical Sandworm operations (e.g., **BadPilot**, 2021–2025).  
  - The **CERT-UA** (Ukraine’s Computer Emergency Response Team) previously documented **winbox64.exe** in **April 2024** during a Sandworm campaign targeting critical infrastructure.

- **Exploitation of Zero-Day Vulnerabilities**:  
  - **CVE-2025-8088** (CVSS 8.8) in **WinRAR** was exploited by the **Gamaredon** group to deliver HTA malware via malicious RAR archives. Users were tricked into opening weaponized PDFs, which silently dropped malware into the Startup folder.

- **Russian Cybercriminal Ecosystem**:  
  - **Operation Endgame** (international law enforcement efforts) has shifted Russian state ties with cybercriminal groups from passive tolerance to active management.  
  - Senior threat actors maintain ties with **Russian intelligence services**, leveraging political connections for impunity.  
  - Cybercriminal groups are decentralizing operations to avoid surveillance, while the Russian government selectively enforces laws against "politically inconvenient" actors.

### Implications and Recommendations
- **Defensive Strategies**:  
  - **Patch Management**: Prioritize patching vulnerabilities like **CVE-2025-8088** and ensure systems are up-to-date.  
  - **Monitor for LotL Activity**: Use **Endpoint Detection and Response (EDR)** tools to detect unusual PowerShell or scheduled task behavior.  
  - **Limit Privilege Access**: Restrict domain account usage for scheduled tasks and enforce least-privilege principles.  
  - **Behavioral Analysis**: Focus on detecting anomalies in registry modifications, RDP configurations, and memory dump activities.  

- **Threat Intelligence Sharing**:  
  - Collaborate with organizations like **Symantec**, **Carbon Black**, and **CERT-UA** to share indicators of compromise (IOCs) related to **LocalOlive**, **winbox64.exe**, and **CVE-2025-8088**.  

- **User Awareness**:  
  - Train users to avoid opening suspicious PDFs or RAR archives, especially those from untrusted sources.  

- **Legal and Policy Considerations**:  
  - Monitor evolving Russian state policies on cybercrime, which may involve co-opting or selectively enforcing laws against threat actors.  

### Reference
https://thehackernews.com/2025/10/russian-hackers-target-ukrainian.html