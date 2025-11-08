---
title: "Trojanized ESET Installers Used in Phishing Campaigns to Deploy Kalambur Backdoor in Ukraine"
pubDate: 2025-11-06
description: "A Russia-aligned threat group, InedibleOchotense, is exploiting ESET's reputation through phishing attacks to deploy the Kalambur backdoor in Ukraine, alongside Sandworm's wiper campaigns and RomCom's WinRAR 0-day exploits."
categories: ["AI News", "Cybersecurity", "Threat Intelligence"]

---

## Trojanized ESET Installers and Kalambur Backdoor Campaign

A previously unknown threat activity cluster, **InedibleOchotense**, has been targeting Ukrainian entities through phishing attacks that impersonate Slovak cybersecurity firm **ESET**. The campaign, detected in **May 2025**, leverages the trust in ESET's brand to distribute **trojanized installers** that deliver the **Kalambur backdoor** (also known as SUMBUR). This backdoor uses the **Tor anonymity network** for command-and-control (C2) communications and enables **remote access via RDP on port 3389**. The attack chain includes:

- **Phishing vectors**: Spear-phishing emails and Signal messages in Ukrainian, with a Russian word in the subject line, likely a typo or translation error.
- **Malicious domains**: Attackers use domains like **esetsmart[.]com**, **esetscanner[.]com**, and **esetremover[.]com** to host the trojanized installers.
- **Payload components**: The installer includes a legitimate **ESET AV Remover** alongside the **Kalambur backdoor**, which can also drop **OpenSSH** for further access.

### Attribution and Connections
- **Russia-aligned**: InedibleOchotense overlaps with **Sandworm** (APT44) sub-clusters like **UAC-0212** and **BACKORDER**, though direct links remain unconfirmed.
- **CERT-UA** attributes a similar campaign (UAC-0125) to Sandworm, but ESET cannot independently verify the connection.

---

## Sandworm Wiper Attacks in Ukraine

The **Sandworm** group (also known as APT44) has continued destructive operations in Ukraine, deploying **wiper malware** such as **ZEROLOT** and **Sting**. Key details include:

- **Target sectors**: Government, energy, logistics, and grain sectors.
- **Timeline**: Attacks occurred in **April 2025**, targeting an unnamed university.
- **Collaboration**: The **UAC-0099** group provided initial access, funneling validated targets to Sandworm for follow-up attacks.
- **Impact**: Wiper malware is a recurring tool for Russia-aligned actors, emphasizing the persistent threat to critical infrastructure.

---

## RomCom Exploits WinRAR 0-Day in Global Attacks

Another Russia-aligned group, **RomCom** (also known as Storm-0978, Tropical Scorpius, UNC2596), exploited a **WinRAR 0-day vulnerability (CVE-2025-8088, CVSS 8.8)** in **mid-July 2025** to target European and Canadian organizations in finance, manufacturing, defense, and logistics sectors. Key aspects:

- **Exploitation method**: Spear-phishing campaigns delivering payloads via the WinRAR vulnerability.
- **Malware variants**: 
  - **SnipBot** (also SingleCamper or RomCom RAT 5.0)
  - **RustyClaw**
  - **Mythic agent**
- **Evolution**: Initially a **commodity e-crime tool**, RomCom transitioned to **nation-state operations** to support Russian geopolitical objectives, including **credential harvesting** and **data exfiltration**.

---

## Reference
https://thehackernews.com/2025/11/trojanized-eset-installers-drop.html