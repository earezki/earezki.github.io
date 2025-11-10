---
title: "Researchers Uncover BankBot-YNRK and DeliveryRAT Android Trojans Targeting Financial Data"
pubDate: 2025-11-03
description: "Cybersecurity researchers reveal two Android trojans, BankBot-YNRK and DeliveryRAT, that steal financial data, evade detection, and exploit Android vulnerabilities."
categories: ["AI News", "cyber security", "malware"]

---

## Researchers Uncover BankBot-YNRK and DeliveryRAT Android Trojans Targeting Financial Data

### Overview of BankBot-YNRK
BankBot-YNRK is a sophisticated Android trojan designed to steal sensitive financial data from infected devices. It evades analysis by detecting virtualized or emulated environments and targets specific Android versions (13 and below). The malware mimics legitimate apps to trick users into installation and employs advanced techniques to maintain persistence and access.

#### Key Features of BankBot-YNRK
- **Environment Detection**: Checks if it's running on a real device by analyzing manufacturer and model details (e.g., Oppo, Samsung, Google Pixel).
- **Targeted Device Optimization**: Applies device-specific functionality only on recognized models (e.g., Samsung, Google).
- **APK Disguises**: Packages are named to impersonate the Indonesian government app "Identitas Kependudukan Digital" (e.g., `com.westpacb4a.payqingynrk1b4a`).
- **Persistence Mechanism**: Uses Android's `JobScheduler` to ensure execution after reboots.
- **Accessibility Exploitation**: Requests users to enable accessibility services to gain elevated privileges (e.g., managing apps, redirecting calls, stealing SMS, contacts, and clipboard data).
- **Remote Communication**: Connects to a server (`ping.ynrkone[.]top`) and executes commands like `OPEN_ACCESSIBILITY`.
- **Stealth Techniques**: Mutes audio streams (music, ringtone) to prevent user alerts and displays overlay messages to mask malicious activities.
- **Financial App Targeting**: Aims to steal credentials from 62 financial apps, including banking and cryptocurrency wallets.

### Overview of DeliveryRAT
DeliveryRAT is another Android trojan distributed via phishing campaigns disguised as food delivery, marketplace, or employment apps. It operates under a malware-as-a-service (MaaS) model and targets Russian users, with capabilities expanding to other regions.

#### Key Features of DeliveryRAT
- **Distribution Channels**: Spread through Telegram bots (e.g., "Bonvi Team") and phishing links, often masquerading as legitimate services.
- **Data Theft**: Accesses SMS, call logs, and battery optimization settings to run in the background.
- **Persistence and Stealth**: Hides app icons from the home screen and requests permissions to avoid detection.
- **DDoS Capabilities**: Some variants launch distributed denial-of-service (DDoS) attacks via simultaneous URL requests or QR code scanning.
- **Geographic Targets**: Impersonates 20 institutions, primarily Russian banks, but also targets Brazil, Poland, the Czech Republic, and Slovakia.

### Related Threats: NFC Data Theft
Zimperium discovered over **760 Android apps** since April 2024 that misuse **Near Field Communication (NFC)** to steal payment data. These apps mimic financial services and exploit **host-based card emulation (HCE)** to capture contactless credit card details, which are then relayed to threat actors via Telegram or custom apps.

#### Impact of NFC Exploitation
- **Data Exfiltration**: Stolen NFC data is used to withdraw funds or make purchases at point-of-sale (PoS) terminals.
- **Impersonated Institutions**: Targets include banks and financial services in Russia, Brazil, Poland, and other countries.

### Android Security Context
- **Android 14 Mitigation**: Android 14 (launched 2023) blocks accessibility services from bypassing permission requests, limiting BankBot-YNRK's effectiveness.
- **Legacy Vulnerabilities**: Older Android versions (13 and below) remain vulnerable to accessibility-based privilege escalation.

### Recommendations for Users and Organizations
- **Update Devices**: Upgrade to Android 14 or later to block accessibility-based attacks.
- **Verify App Sources**: Avoid downloading apps from untrusted sources, especially those mimicking government or financial services.
- **Enable Security Features**: Use built-in security tools (e.g., Google Play Protect) and avoid granting unnecessary permissions.
- **Monitor for Anomalies**: Be cautious of apps requesting access to SMS, call logs, or battery optimization.
- **Educate Users**: Train users to recognize phishing attempts and suspicious app behavior (e.g., overlay messages, muted notifications).

---

## Reference
[Researchers Uncover BankBot-YNRK and DeliveryRAT Android Trojans Stealing Financial Data](https://thehackernews.com/2025/11/researchers-uncover-bankbot-ynrk-and.html)