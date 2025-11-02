---
title: "Eclipse Foundation Revokes Leaked Open VSX Tokens Following Wiz Discovery"
pubDate: 2025-10-31
description: "Eclipse Foundation revokes VS Code tokens exposed in public repositories and implements security upgrades after a Wiz report revealed supply chain risks."
categories: ["AI News", "Cyber Security", "Open Source"]

---

## Eclipse Foundation Addresses Leaked Tokens in Open VSX Registry

The Eclipse Foundation, which oversees the Open VSX registry for Visual Studio Code (VS Code) extensions, has revoked a limited number of access tokens exposed in public repositories. This action follows a report by cloud security firm Wiz, which identified vulnerabilities in extensions from both Microsoft's VS Code Marketplace and Open VSX. The leaked tokens could have allowed malicious actors to publish or modify extensions, compromising the extension supply chain.

### Key Security Measures Implemented

- **Token Revocation and Prefixing**  
  - A small number of leaked tokens were revoked after confirmation of potential abuse.  
  - Introduced a token prefix format "ovsxp_" to simplify detection of exposed tokens in public repositories.  

- **Supply Chain Security Enhancements**  
  - **Reduced Token Lifetimes**: Default token expiration limits tightened to minimize damage from accidental leaks.  
  - **Improved Token Revocation**: Streamlined process for revoking tokens upon notification.  
  - **Automated Extension Scanning**: Extensions are now automatically checked for malicious code patterns or embedded secrets during publication.  

### Response to the "GlassWorm" Campaign

- **Malware Removal**: Extensions flagged by Koi Security as part of the "GlassWorm" campaign were removed.  
  - The malware required stolen developer credentials to propagate, disqualifying it as a self-replicating worm.  
  - Reported download count of 35,800 was likely inflated by bot traffic and visibility-boosting tactics.  

### Broader Implications for Supply Chain Security

- **Developer Responsibility**: Emphasis on careful token management by extension publishers.  
- **Registry Improvements**: Enhanced detection and response capabilities by registry maintainers.  
- **Industry Context**: Growing targeting of software suppliers and developers, enabling persistent access to enterprise environments.  

### Reference  
[Eclipse Foundation Revokes Leaked Open VSX Tokens Following Wiz Discovery](https://thehackernews.com/2025/10/eclipse-foundation-revokes-leaked-open.html)  
---