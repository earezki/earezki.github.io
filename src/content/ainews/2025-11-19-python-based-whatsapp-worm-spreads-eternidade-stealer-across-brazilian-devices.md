---
title: "Python-Based WhatsApp Worm Distributes Eternidade Stealer in Brazil"
pubDate: 2025-11-19
description: "Eternidade Stealer, a Delphi-based banking trojan, is spreading via a Python-scripted WhatsApp worm campaign targeting Brazilian users."
categories: ["AI News", "Cybersecurity", "Malware"]
---

## Python-Based WhatsApp Worm Spreads Eternidade Stealer

A new campaign leverages WhatsApp hijacking and a Python script to distribute the Eternidade Stealer banking trojan, primarily targeting users in Brazil. Researchers at Trustwave SpiderLabs identified the worm utilizing WPPConnect to automate message sending via compromised WhatsApp accounts, impacting a wide range of financial institutions.

### Why This Matters
Current threat actors increasingly favor automation via scripting languages like Python for malware distribution, moving away from older methods like PowerShell. This shift enables dynamic C2 updates via IMAP, complicating defense efforts and increasing the scale of potential attacks; the campaign blocked 452 out of 454 connection attempts from outside Brazil and Argentina, highlighting the targeted nature and potential for substantial financial loss.

### Key Insights
- **Python script for WhatsApp hijacking**: Replaces previous PowerShell-based methods for increased automation.
- **IMAP-driven C2**: Allows threat actors to dynamically update command-and-control servers, enhancing resilience.
- **Delphi preference in Latin America**: Delphi remains popular due to its efficiency and historical use in the region.

### Working Example
```python
# Example of WPPConnect usage (simplified)
from wppconnect import WhatsApp

# Initialize WhatsApp connection (replace with your credentials)
wp = WhatsApp(session_name="EternidadeSession")

# Send a message to a contact (replace with the contact number and message)
wp.send_message("5511999999999", "Malicious Attachment - Click Here!")

# Close the connection
wp.close()
```

### Practical Applications
- **Financial institutions in Brazil**: Must bolster fraud detection systems and user awareness campaigns regarding WhatsApp phishing.
- **Security vendors**: Should update signatures to detect the Python script and associated malware components, focusing on the IMAP-based C2 communication.

**References:**
- https://thehackernews.com/2025/11/python-based-whatsapp-worm-spreads.html