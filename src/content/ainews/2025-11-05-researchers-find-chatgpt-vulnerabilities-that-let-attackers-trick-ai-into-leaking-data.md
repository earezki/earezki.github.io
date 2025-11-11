---
title: "Researchers Find ChatGPT Vulnerabilities That Let Attackers Trick AI Into Leaking Data"
pubDate: 2025-11-05
description: "Seven critical vulnerabilities in ChatGPT's GPT-4o and GPT-5 models allow attackers to inject malicious prompts and exfiltrate user data."
categories: ["AI News", "Cybersecurity", "AI Ethics"]
---

## Researchers Find ChatGPT Vulnerabilities That Let Attackers Trick AI Into Leaking Data

Cybersecurity researchers have identified seven vulnerabilities in OpenAI's ChatGPT that enable attackers to trick the AI into leaking user data. These flaws include zero-click prompt injection and memory poisoning techniques targeting GPT-4o and GPT-5 models.

### Why This Matters
Large language models (LLMs) like ChatGPT struggle to distinguish between legitimate user input and attacker-controlled data from external sources. This creates a fundamental security risk, as demonstrated by vulnerabilities allowing malicious actors to bypass safety mechanisms and extract sensitive information. The scale of potential damage is heightened by the fact that even minor flaws—such as a 250-document poisoning attack—can compromise model integrity, as shown in recent Anthropic research.

### Key Insights
- "Seven vulnerabilities in GPT-4o and GPT-5, 2025": Disclosed by Tenable researchers via The Hacker News  
- "Indirect prompt injection via Bing URLs": Attackers mask malicious links using OpenAI’s allow-listed domain  
- "250 poisoned documents can backdoor models": Anthropic study shows minimal input can corrupt AI behavior  

### Practical Applications
- **Use Case**: Attackers use "malicious content hiding" to inject hidden commands into ChatGPT via markdown rendering bugs  
- **Pitfall**: Relying on external data sources without strict sanitization enables prompt injection attacks  

**References:**
- https://thehackernews.com/2025/11/researchers-find-chatgpt.html
---