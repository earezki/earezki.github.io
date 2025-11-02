---
title: "CISA and NSA Issue Urgent Guidance to Secure WSUS and Microsoft Exchange Servers"
pubDate: 2025-10-31
description: "CISA and NSA warn of WSUS and Exchange attacks, urging immediate patching and zero trust adoption."
categories: ["AI News", "Cybersecurity", "Vulnerability Management"]
---

## CISA and NSA Urge Immediate Action to Secure Critical Microsoft Servers

The U.S. Cybersecurity and Infrastructure Security Agency (CISA) and National Security Agency (NSA), alongside international partners, have issued urgent guidance to protect on-premise Microsoft Exchange Server and Windows Server Update Services (WSUS) infrastructure from exploitation. The alerts emphasize patching, zero-trust principles, and mitigating risks from newly discovered vulnerabilities, including CVE-2025-59287, which allows remote code execution via WSUS.

### Key Security Recommendations for Exchange Servers

CISA and NSA outline comprehensive measures to harden Exchange Server environments, which are critical for enterprise communications:

- **Patching and Updates**: Maintain regular security updates and patching cycles for Exchange Server, Windows, and mail clients. Decommission end-of-life Exchange servers after migrating to Microsoft 365.
- **Access Controls**: Restrict administrative access to the Exchange Admin Center (EAC) and remote PowerShell, enforcing the principle of least privilege.
- **Authentication and Encryption**: Implement Transport Layer Security (TLS), HTTP Strict Transport Security (HSTS), and multi-factor authentication (MFA). Replace NTLM with Kerberos and Server Message Block (SMB).
- **Security Features**: Enable antivirus, Windows Antimalware Scan Interface (AMSI), Attack Surface Reduction (ASR), AppLocker, and Exchange's built-in anti-spam/anti-malware tools.
- **Emergency Mitigation**: Ensure the Exchange Emergency Mitigation Service is active and apply the latest security baselines.

These measures aim to reduce attack surfaces and prevent unauthorized access, which could lead to data breaches or operational disruptions.

### CVE-2025-59287: WSUS Vulnerability and Exploitation

CISA updated its alert to address **CVE-2025-59287**, a critical vulnerability in WSUS that allows remote code execution. Key details include:

- **Exploitation Timeline**: First detected on **October 24, 2025**, one day after Microsoft released the out-of-band patch.
- **Attack Vectors**: Threat actors use Base64-encoded PowerShell commands to exploit vulnerable WSUS servers, exfiltrating data to endpoints like `webhook[.]site`.
- **Impact**: Sophos reported **six confirmed incidents** in customer environments, with **50 potential victims** identified through further analysis. Industries targeted include universities, healthcare, and manufacturing.
- **Technical Details**: Attackers leverage `wsusservice.exe` and `w3wp.exe` processes, often using nested PowerShell scripts. Cisco Splunk’s Michael Haag discovered an alternate attack chain involving `mmc.exe` to trigger `cmd.exe` execution, causing Event Log crashes.

### Monitoring and Mitigation Strategies

Organizations are advised to:

- **Monitor Suspicious Activity**: Track SYSTEM-level processes from `wsusservice.exe` or `w3wp.exe`, and nested PowerShell scripts with Base64 encoding.
- **Apply Patches Immediately**: Install Microsoft’s out-of-band update for CVE-2025-59287 and configure WSUS securely.
- **Investigate Logs**: Analyze logs such as `SoftwareDistribution.log` for signs of exploitation, including Event ID 7053 crashes.

### Reference
[Read the full article here](https://thehackernews.com/2025/10/cisa-and-nsa-issue-urgent-guidance-to.html)