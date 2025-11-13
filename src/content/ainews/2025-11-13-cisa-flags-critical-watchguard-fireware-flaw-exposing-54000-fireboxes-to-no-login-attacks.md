---
title: "CISA Flags Critical WatchGuard Fireware Flaw Exposing 54,000 Fireboxes to No-Login Attacks"  
pubDate: 2025-11-13  
description: "CISA warns 54,300+ WatchGuard firewalls risk remote code execution via CVE-2025-9242, with patches due by December 3."  
categories: ["AI News", "Cyber Security", "Network Security"]  
---  

## CISA Flags Critical WatchGuard Fireware Flaw Exposing 54,000 Fireboxes to No-Login Attacks  

CISA added a critical vulnerability in WatchGuard Fireware to its KEV catalog, citing active exploitation. The flaw, CVE-2025-9242 (CVSS 9.3), allows unauthenticated remote code execution on 54,300+ Fireboxes as of November 12, 2025.  

### Why This Matters  
The vulnerability stems from a missing length check in the IKE handshake process, enabling attackers to trigger an out-of-bounds write before authentication. This bypasses standard security layers, exposing devices to pre-authentication exploits. With 54,300 vulnerable firewalls globally, the risk spans critical infrastructure, including 18,500 U.S.-based devices. Unpatched systems face potential data breaches, service disruptions, or lateral movement within networks.  

### Key Insights  
- "54,300 vulnerable Fireboxes as of November 12, 2025": Shadowserver Foundation  
- "CVE-2025-9242 (CVSS 9.3) allows remote code execution pre-authentication": CISA advisory  
- "Patches due by December 3, 2025 for FCEB agencies": WatchGuard advisory  
- "UNC6485 linked to exploitation of CVE-2025-12480": Mandiant Threat Defense team  

### Practical Applications  
- **Use Case**: Federal agencies applying WatchGuard patches by December 3 to prevent unauthorized access.  
- **Pitfall**: Delaying patches risks exploitation via IKE_AUTH payload manipulation, leading to service outages or data exfiltration.  

**References:**  
- https://thehackernews.com/2025/11/cisa-flags-critical-watchguard-fireware.html  
- https://www.watchguard.com/  
- https://www.shadowserver.org/  
- https://mandiant.com/  
---