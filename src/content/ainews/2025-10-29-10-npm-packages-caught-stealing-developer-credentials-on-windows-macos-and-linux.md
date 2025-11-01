---
title: "10 Malicious npm Packages Caught Stealing Developer Credentials Across Operating Systems"
pubDate: 2025-10-10
description: "Cybersecurity researchers uncovered 10 typosquatted npm packages that deliver a 24MB PyInstaller info stealer, stealing credentials from Windows, macOS, and Linux systems via obfuscation and postinstall hooks."
categories: ["AI News", "Cyber Security", "Software Vulnerability"]
---

## Main Heading (essence of the article)

Cybersecurity researchers identified 10 malicious npm packages uploaded on July 4, 2025, that exploit typosquatting and obfuscation to steal developer credentials across Windows, macOS, and Linux systems. These packages mimic popular libraries like `discord.js` and `typescript` to trick users into installing malware that exfiltrates sensitive data.

---

## Malware Overview

- **Packages Identified**:  
  - deezcord.js  
  - dezcord.js  
  - dizcordjs  
  - etherdjs  
  - ethesjs  
  - ethetsjs  
  - nodemonjs  
  - react-router-dom.js  
  - typescriptjs  
  - zustand.js  

- **Upload Date**: July 4, 2025  
- **Total Downloads**: ~9,900 (as of October 10, 2025)  
- **Target Platforms**: Windows, Linux, macOS  
- **Malware Type**: Information stealer using PyInstaller (24MB payload)  

**Purpose**: The packages aim to harvest credentials from system keyrings, browsers, and authentication services, providing attackers with access to corporate networks, email, and cloud storage.

---

## Attack Mechanism

### 1. **Typosquatting and Social Engineering**  
- Packages mimic popular libraries (e.g., `typescriptjs` vs. `typescript`) to deceive developers into installing them.  
- Fake CAPTCHA prompts and legitimate-looking installation outputs mimic normal npm behavior to avoid suspicion.

### 2. **Postinstall Hook Execution**  
- Malware triggers automatically via a `postinstall` hook, launching `install.js` to detect the OS and execute an obfuscated payload (`app.js`).  
- A new terminal window is spawned (e.g., Command Prompt, GNOME Terminal) to run the payload independently, then cleared to avoid detection.

### 3. **Obfuscation Layers**  
- **Four obfuscation techniques**:  
  - XOR cipher with dynamically generated keys  
  - URL-encoding of payloads  
  - Hexadecimal and octal arithmetic to obscure code flow  
- Designed to resist reverse-engineering and analysis.

### 4. **Data Exfiltration**  
- The payload connects to a remote server (`195.133.79[.]43`) to download and execute a stealer (`data_extracter`).  
- Harvests credentials from:  
  - System keyrings (Outlook, Dropbox, SSH keys, etc.)  
  - Web browsers (session cookies, passwords)  
  - Configuration files and SSH passphrases  
- Data is compressed into a ZIP file and sent to the attacker’s server.

---

## Technical Details

- **Obfuscation Purpose**: To evade detection by security tools and manual analysis.  
- **Platform-Specific Extraction**: Uses the `keyring` npm library to access OS-level credential stores, bypassing application-level security.  
- **Impact**:  
  - Direct access to decrypted credentials (no need to crack encryption).  
  - Potential access to corporate networks, production databases, and internal systems.  

---

## Recommendations

- **Verify Package Sources**: Always check the official npm registry for typos or suspiciously similar package names.  
- **Use Dependency Checkers**: Tools like `npm audit` or `Socket` can flag malicious or untrusted packages.  
- **Monitor Downloads**: Avoid installing packages with unusually high download counts or suspiciously low star ratings.  
- **Enable 2FA**: For npm accounts and critical services to mitigate credential theft risks.  
- **Update Regularly**: Ensure all dependencies are updated to patch known vulnerabilities.  

**Avoid**:  
- Installing packages from untrusted authors or repositories.  
- Ignoring warnings about postinstall scripts or unexpected terminal activity during installations.  

---

## Reference  
https://thehackernews.com/2025/10/10-npm-packages-caught-stealing.html