---
title: "New Android Trojan 'Herodotus' Evades Anti-Fraud Systems with Human-Like Typing Behavior"
pubDate: 2025-10-28
description: "Herodotus, a new Android banking trojan, mimics human behavior to bypass biometrics and steal banking data, targeting users in multiple countries."
categories: ["AI News", "Cyber Security", "Malware Analysis"]
---

## New Android Trojan 'Herodotus' Outsmarts Anti-Fraud Systems by Typing Like a Human

### Overview
Herodotus is a sophisticated Android banking trojan designed to bypass anti-fraud systems by mimicking human behavior, enabling device takeover (DTO) attacks and stealing sensitive financial data. First advertised in underground forums on **September 7, 2025**, it operates under the malware-as-a-service (MaaS) model and targets users in **Italy, Brazil, the U.S., Turkey, the U.K., Poland, and India**.

---

### Key Features and Technical Details

- **Human-Like Typing Behavior**  
  - Introduces **random delays (300–3000 milliseconds)** between keystrokes to evade timing-based detection systems. This mimics natural human input patterns, making automated fraud detection harder to trigger.  
  - Example: When stealing credentials, the trojan types slowly and unpredictably, avoiding the "machine-like speed" typically associated with malware.

- **Accessibility Service Exploitation**  
  - Uses Android’s accessibility services to overlay fake login screens on financial apps, intercepting user input and stealing credentials.  
  - Displays opaque overlays to hide malicious activity from users, such as fake KYC forms or phishing interfaces.

- **Stealthy Data Exfiltration**  
  - **Steals 2FA codes** via SMS interception.  
  - **Grabs lockscreen PINs or patterns** and extracts sensitive data like ATM PINs, government IDs (e.g., Aadhaar numbers), and card details.  
  - Installs remote APKs without requiring the Google Play Store, using the `REQUEST_INSTALL_PACKAGES` permission.

- **Persistence and Expansion**  
  - Designed to **persist within live user sessions**, focusing on account takeover rather than just static credential theft.  
  - Targets **cryptocurrency wallets and exchanges** in addition to traditional banking apps, indicating a broadening threat scope.

---

### Connection to Brokewell Trojan
- **Code Reuse and Obfuscation**: Shares similarities with the **Brokewell** banking trojan, including obfuscation techniques and direct references (e.g., "BRKWL_JAVA").  
- **Evolution**: Not a direct evolution of Brokewell but incorporates its methods to enhance evasion capabilities and persistence.

---

### Related Threat: GhostGrab
- **Dual-Revenue Strategy**: A separate Android malware (GhostGrab) discovered by CYFIRMA combines **banking credential theft** with **Monero cryptocurrency mining** on infected devices.  
- **Targeting**: Focuses on **Indian users**, using fake financial apps to request high-risk permissions for SMS interception and call forwarding.  
- **Impact**: Creates a "dual-revenue stream" for attackers by stealing financial data and mining cryptocurrency covertly.

---

### Mitigation and Google’s Response
- **Google Play Protect**: Automatically blocks known versions of Herodotus on devices with Google Play Services enabled.  
- **User Protection**: Users are advised to avoid downloading apps from untrusted sources and to enable security features like app permissions review.

---

### Reference
[Herodotus Android Trojan Details](https://thehackernews.com/2025/10/new-android-trojan-herodotus-outsmarts.html)