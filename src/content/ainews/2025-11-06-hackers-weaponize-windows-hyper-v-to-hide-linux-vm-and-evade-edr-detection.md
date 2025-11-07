---
title: "Hackers Exploit Hyper-V and Alpine Linux VMs to Evade EDR Detection"
pubDate: 2025-11-06
description: "Bitdefender reports that the Curly COMrades threat actor is using Hyper-V and Alpine Linux VMs to hide malicious activities and evade detection by EDR solutions."
categories: ["AI News", "Cyber Security", "Threat Intelligence"]
---

## Hackers Weaponize Windows Hyper-V to Hide Linux VM and Evade EDR Detection

This article details how the **Curly COMrades** threat actor leverages Windows Hyper-V and Alpine Linux virtual machines (VMs) to execute custom malware while evading endpoint detection and response (EDR) systems. The group, linked to Russia, has been active since late 2023, targeting Georgia and Moldova with sophisticated techniques involving minimalistic VMs, reverse shells, and proxy tools.

### Key Technical Details

- **Hyper-V and Alpine Linux VM Usage**:
  - The attackers enable the Hyper-V role on compromised Windows 10 systems to deploy a lightweight Alpine Linux VM.
  - The VM requires only **120MB of disk space** and **256MB of memory**, making it difficult to detect as a malicious environment.
  - This setup isolates malware execution, bypassing traditional EDR solutions that monitor host-based activities.

- **Custom Malware and Tools**:
  - **CurlyShell**: A C++-written, headless daemon that establishes a reverse shell to a command-and-control (C2) server. It executes encrypted commands via HTTP GET/POST requests.
  - **CurlCat**: A reverse proxy tool that routes traffic through SSH, providing flexibility in data exfiltration and command execution.
  - **RuRat**: A tool for persistent remote access to compromised systems.
  - **Mimikatz**: Used for credential harvesting.
  - **MucorAgent**: A modular .NET implant with origins dating back to November 2023.

- **Evasion Techniques**:
  - By isolating malware within a VM, attackers avoid direct detection by EDR systems that monitor host processes and network traffic.
  - The use of **proxy and tunneling tools** (e.g., Resocks, Ligolo-ng, Stunnel) further obfuscates communication with C2 servers.
  - The group continuously updates its toolset, demonstrating adaptability in maintaining long-term access.

### Timeline and Attribution

- **Activity Timeline**:
  - **Late 2023**: Initial operations linked to Curly COMrades.
  - **August 2025**: Bitdefender first documented the group’s attacks on Georgia and Moldova.
  - **November 2025**: Follow-up analysis with Georgia CERT uncovered additional tools and Hyper-V exploitation techniques.

- **Attribution**:
  - The group is assessed to be aligned with Russian interests, based on operational patterns and targeting of Eastern European nations.

### Collaboration and Analysis

- Bitdefender collaborated with **Georgia CERT** to analyze the threat actor’s tactics, identifying new tooling and methods for establishing persistent access.
- The attackers’ use of **Hyper-V on Windows 10** highlights a growing trend of weaponizing virtualization features to bypass security measures.

### Recommendations for Defense

- **Monitor Virtualization Features**:
  - Detect unauthorized Hyper-V role activation or unexpected VM creation on endpoints.
  - Use EDR solutions capable of detecting anomalies in virtualized environments.

- **Enhance Network Monitoring**:
  - Look for unusual HTTP traffic patterns (e.g., frequent GET/POST requests to suspicious domains) indicative of reverse shells or proxies.

- **Update Detection Rules**:
  - Incorporate signatures for **CurlyShell**, **CurlCat**, and other tools into threat intelligence platforms.
  - Focus on detecting lightweight VMs with minimal resource usage.

- **Implement Least Privilege**:
  - Restrict administrative access to systems where Hyper-V or other virtualization features are not required.

- **Regularly Audit Systems**:
  - Conduct audits for unauthorized software installations, such as **Mimikatz** or **RuRat**, which are often indicators of credential theft or persistence mechanisms.

For further details, refer to the original report: [Bitdefender's Analysis of Curly COMrades](https://thehackernews.com/2025/11/hackers-weaponize-windows-hyper-v-to.html).