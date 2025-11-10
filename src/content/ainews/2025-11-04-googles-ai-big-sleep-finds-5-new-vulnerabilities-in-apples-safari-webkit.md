---
title: "Google’s AI 'Big Sleep' Finds 5 New Vulnerabilities in Apple’s Safari WebKit"
pubDate: 2025-11-04
description: "Google’s Big Sleep AI uncovered five Safari flaws Apple swiftly patched—learn how this boosts your device security."
categories: ["AI News", "Cyber Security", "AI in Cybersecurity"]

---

## Google’s AI 'Big Sleep' Discovers Critical Safari WebKit Vulnerabilities

Google’s AI-powered cybersecurity tool, **Big Sleep**, identified five critical vulnerabilities in Apple’s Safari browser, prompting Apple to release urgent patches across its ecosystem. These flaws, if exploited, could lead to crashes, memory corruption, or unauthorized access, underscoring the growing role of AI in proactive threat detection.

---

### Major Vulnerabilities Identified

The vulnerabilities discovered by Big Sleep are detailed below, along with their nature, potential impact, and Apple’s mitigation strategies:

1. **CVE-2025-43429**  
   - **Type**: Buffer overflow  
   - **Impact**: Could cause a browser crash when processing malicious web content.  
   - **Fix**: Improved bounds checking in WebKit to prevent overflow.  

2. **CVE-2025-43430**  
   - **Type**: Unspecified vulnerability  
   - **Impact**: May lead to unexpected crashes during content processing.  
   - **Fix**: Enhanced state management in WebKit.  

3. **CVE-2025-43431 & CVE-2025-43433**  
   - **Type**: Memory corruption  
   - **Impact**: Risk of arbitrary code execution or system instability.  
   - **Fix**: Improved memory handling mechanisms.  

4. **CVE-2025-43434**  
   - **Type**: Use-after-free  
   - **Impact**: Could trigger Safari crashes or potential privilege escalation.  
   - **Fix**: Enhanced state management to prevent invalid memory access.  

---

### Apple’s Patch Rollout and Affected Devices

Apple addressed these flaws in its **iOS 26.1, iPadOS 26.1, macOS Tahoe 26.1, tvOS 26.1, watchOS 26.1, visionOS 26.1, and Safari 26.1** updates, released on **November 4, 2025**. Key device compatibility includes:

- **iOS 26.1 / iPadOS 26.1**: iPhone 11 and later, iPad Pro (3rd gen+), iPad Air (3rd gen+), and newer models.  
- **iOS 18.7.2 / iPadOS 18.7.2**: iPhone XS and later, iPad Pro (13-inch, 12.9-inch 3rd gen+), and older iPad models.  
- **macOS Tahoe 26.1**: All Macs running macOS Tahoe.  
- **tvOS 26.1**: Apple TV 4K (2nd gen+).  
- **visionOS 26.1**: Apple Vision Pro.  
- **watchOS 26.1**: Apple Watch Series 6 and newer.  
- **Safari 26.1**: macOS Sonoma and Sequoia users.  

---

### Big Sleep: Google’s AI-Driven Security Initiative

- **Background**: Big Sleep (formerly Project Naptime) is a collaboration between Google DeepMind and Google Project Zero, designed to automate vulnerability discovery using AI.  
- **Previous Successes**:  
  - Identified **CVE-2025-6965** in SQLite (CVSS score: 7.2), flagged as a high-risk exploit.  
  - Demonstrates AI’s potential to detect complex flaws faster than traditional methods.  
- **Purpose**: Accelerate threat detection, reduce human workload, and improve response times for critical vulnerabilities.  

---

### Importance of Timely Updates

- **No Known Exploits**: None of the vulnerabilities have been exploited in the wild, but proactive patching is critical.  
- **Recommendation**: Users should update all devices to the latest OS versions to mitigate risks.  
- **Impact**: Proactive AI-driven security reduces the window of exposure for potential attackers.  

---

### Reference  
[Google’s AI ‘Big Sleep’ Finds 5 New Vulnerabilities in Apple’s Safari WebKit](https://thehackernews.com/2025/11/googles-ai-big-sleep-finds-5-new.html)