---
title: "Researchers Find Serious AI Bugs Exposing Meta, Nvidia, and Microsoft Inference Frameworks"
pubDate: 2025-11-14
description: "Critical RCE flaws in AI inference engines from Meta, Nvidia, and Microsoft expose unsafe code reuse patterns."
categories: ["AI News", "Cybersecurity", "AI Infrastructure"]
---

## Researchers Find Serious AI Bugs Exposing Meta, Nvidia, and Microsoft Inference Frameworks

Cybersecurity researchers uncovered remote code execution (RCE) vulnerabilities in AI inference engines from Meta, Nvidia, Microsoft, and open-source projects like vLLM and SGLang. The flaws stem from unsafe use of ZeroMQ and Python’s pickle deserialization, enabling arbitrary code execution via malicious data.

### Why This Matters
The technical reality of AI infrastructure development often prioritizes speed over security, leading to unsafe code reuse patterns. While ideal models assume isolated, well-validated components, real-world systems frequently copy-paste vulnerable logic, as seen in the ShadowMQ pattern. This flaw could allow attackers to escalate privileges, steal models, or deploy cryptocurrency miners, with CVSS scores up to 8.8 for some fixes.

### Key Insights
- "8.8 CVSS score for NVIDIA TensorRT-LLM (CVE-2025-23254), fixed in v0.18.2"
- "ShadowMQ pattern: pickle deserialization over unauthenticated ZMQ TCP sockets in vLLM, SGLang, and Modular Max Server"
- "Oligo Security identified code reuse chains: SGLang adapted from vLLM, Modular Max Server borrowed from both"

### Practical Applications
- **Use Case**: AI infrastructure teams must audit code reuse for deserialization risks in inference engines
- **Pitfall**: Copying unauthenticated ZMQ TCP socket logic without security validation exposes systems to RCE attacks

**References:**
- https://thehackernews.com/2025/11/researchers-find-serious-ai-bugs.html
---