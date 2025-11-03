---
title: "New HttpTroy Backdoor Exploits South Korean Targets via Phishing Campaign"
pubDate: 2025-11-03
description: "North Korea-linked group Kimsuky deploys HttpTroy backdoor via phishing emails posing as VPN invoices, enabling full system control and stealthy persistence in South Korea."
categories: ["AI News", "Cybersecurity", "Threat Intelligence"]
---

## New HttpTroy Backdoor Poses as VPN Invoice in Targeted Cyberattack on South Korea

This summary details a sophisticated cyberattack attributed to the North Korea-linked threat group Kimsuky, which deployed a novel backdoor named **HttpTroy** to target a victim in South Korea through a spear-phishing campaign. The attack leverages a deceptive phishing email disguised as a "VPN invoice" to deliver malware, enabling attackers to gain full system control and evade detection through advanced obfuscation techniques.

---

### **Attack Chain and Technical Implementation**

The attack follows a three-stage chain:

1. **Dropper and Initial Infection**  
   - A ZIP file named `250908_A_HK이노션_SecuwaySSL VPN Manager U100S 100user_견적서.zip` was sent via phishing email, masquerading as a VPN invoice.  
   - The ZIP contains a `.SCR` file (a Windows screen saver executable) that triggers the infection chain upon execution.  
   - The `.SCR` file executes a Golang binary embedding three files: a decoy PDF to avoid suspicion, a loader (`MemLoad`), and the backdoor (`HttpTroy`).

2. **Persistence Mechanism**  
   - **MemLoad** establishes persistence by creating a scheduled task named **"AhnlabUpdate"**, impersonating AhnLab, a South Korean cybersecurity firm.  
   - This task decrypts and executes the `HttpTroy` DLL backdoor in memory, avoiding disk-based detection.

3. **HttpTroy Backdoor Capabilities**  
   - **Full System Control**:  
     - File upload/download, screenshot capture, command execution with elevated privileges, in-memory executable loading, reverse shell, process termination, and trace removal.  
   - **Communication**:  
     - Communicates with a command-and-control (C2) server at `load.auraria[.]org` via HTTP POST requests.  
   - **Obfuscation Techniques**:  
     - Uses custom hashing for API calls and XOR/SIMD instructions to obfuscate strings.  
     - Dynamically reconstructs API hashes and strings at runtime using arithmetic/logical operations, evading static analysis.

---

### **Lazarus Group Attack and BLINDINGCAN Trojan**

In a separate campaign, the **Lazarus Group** (also linked to North Korea) deployed **Comebacker** and an upgraded version of **BLINDINGCAN** (also known as AIRDRY or ZetaNile) to target victims in Canada. Key details include:

- **Comebacker Variants**:  
  - Two variants (DLL and EXE) were used, with the DLL launched via a Windows service and the EXE via `cmd.exe`.  
  - Both decrypt and deploy **BLINDINGCAN** as a service.  

- **BLINDINGCAN Capabilities**:  
  - Connects to C2 server `tronracing[.]com` to perform actions such as:  
    - File upload/download, deletion, and attribute modification.  
    - Recursive file enumeration, system metadata collection, and process termination.  
    - Memory execution of binaries, screenshot capture, and video device access.  
    - Self-deletion to erase traces of malicious activity.  

---

### **Implications and Threat Actor Evolution**

- **Sophistication and Stealth**:  
  - Kimsuky and Lazarus demonstrate advanced technical capabilities, including dynamic API resolution, COM-based task registration, and custom encryption.  
  - Their use of multi-stage infection chains and obfuscation highlights a shift toward stealthy, evasive tactics.  

- **Targeting Strategy**:  
  - Phishing remains the primary initial access vector, exploiting human error rather than software vulnerabilities.  
  - Attacks are highly targeted, with tailored lures (e.g., fake invoices) to maximize success rates.  

- **Geographic and Sector Focus**:  
  - South Korea and Canada are key targets, likely due to their strategic or economic significance.  
  - The use of localized decoys (e.g., AhnLab impersonation) suggests a deep understanding of regional cybersecurity ecosystems.  

---

### **Recommendations for Defense**

- **Phishing Awareness**:  
  - Train employees to identify suspicious emails, especially those containing unexpected attachments or urgent requests.  
  - Implement email filtering solutions to block suspicious domains and file types.  

- **Endpoint Protection**:  
  - Deploy advanced endpoint detection and response (EDR) tools to monitor for anomalous behavior, such as unauthorized scheduled tasks or memory-based execution.  
  - Use behavioral analysis to detect obfuscated payloads and unusual network activity.  

- **Network Monitoring**:  
  - Monitor for communication with known C2 domains (e.g., `load.auraria[.]org`, `tronracing[.]com`).  
  - Implement network segmentation to limit lateral movement in case of compromise.  

- **Incident Response**:  
  - Regularly update threat intelligence feeds to include indicators of compromise (IOCs) related to HttpTroy and BLINDINGCAN.  
  - Conduct post-incident analysis to identify gaps in defenses and refine response protocols.  

---

## Reference  
[https://thehackernews.com/2025/11/new-httptroy-backdoor-poses-as-vpn.html](https://thehackernews.com/2025/11/new-httptroy-backdoor-poses-as-vpn.html)