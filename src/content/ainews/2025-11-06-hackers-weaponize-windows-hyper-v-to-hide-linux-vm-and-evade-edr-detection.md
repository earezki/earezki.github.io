---
title: "Hackers Weaponize Windows Hyper-V to Hide Linux VM and Evade EDR Detection"
pubDate: 2025-11-06
description: "Threat actor Curly COMrades uses Hyper-V and 120MB Alpine Linux VMs to evade EDR detection, per Bitdefender."
categories: ["AI News", "Cybersecurity", "Malware"]
---

## Hackers Weaponize Windows Hyper-V to Hide Linux VM and Evade EDR Detection

Threat actor Curly COMrades exploits Windows Hyper-V to deploy a 120MB Alpine Linux VM, evading EDR detection with custom malware like CurlyShell and CurlCat. The attack leverages minimal resource footprints to host persistent reverse shells and proxies.

### Why This Matters
Traditional endpoint detection and response (EDR) systems often fail to monitor virtualized environments effectively, creating a blind spot for attackers. By isolating malware within a Hyper-V VM, Curly COMrades bypasses host-based detection mechanisms, enabling long-term access to compromised systems. The attack’s low resource usage (120MB disk, 256MB memory) underscores how minimalistic payloads can exploit gaps in security architectures, escalating risks for enterprises relying on conventional EDR tools.

### Key Insights
- "Alpine Linux VM (120MB/256MB) used by Curly COMrades, 2025": Bitdefender report
- "Hyper-V isolation bypassing EDRs, as seen in Curly COMrades' attacks": Bitdefender analysis
- "Custom malware CurlyShell and CurlCat deployed in hidden VMs, Bitdefender 2025": Technical report

### Practical Applications
- **Use Case**: Enterprise EDR systems must monitor Hyper-V VMs for hidden payloads and anomalous network traffic.
- **Pitfall**: Assuming EDRs detect all in-memory threats without VM isolation checks can lead to undetected persistence.

**References:**
- https://thehackernews.com/2025/11/hackers-weaponize-windows-hyper-v-to.html
---