---
title: "Microsoft Discovers 'SesameOp' Backdoor Leveraging OpenAI API for Stealthy Cyber Operations"
pubDate: 2025-11-04
description: "Microsoft reveals 'SesameOp,' a sophisticated backdoor using OpenAI's API as a covert command-and-control channel for prolonged espionage activities."
categories: ["AI News", "Cyber Security", "Malware Analysis"]
---

## Microsoft Discovers 'SesameOp' Backdoor Leveraging OpenAI API for Stealthy Cyber Operations

### Discovery and Technical Details
Microsoft’s Detection and Response Team (DART) identified **SesameOp**, a novel backdoor that exploits **OpenAI’s Assistants API** as a **command-and-control (C2) communication channel**. Key findings include:

- **Discovery Date**: July 2025, during a sophisticated security incident involving prolonged persistence in a target environment.
- **Targeted Goal**: Long-term access for espionage, leveraging legitimate tools to evade detection.
- **Components Involved**:
  - **Loader Component**: `Netapi64.dll`, heavily obfuscated using **Eazfuscator.NET** for stealth.
  - **Backdoor**: `.NET-based` `OpenAIAgent.Netapi64`, which uses the OpenAI API to fetch and execute encrypted commands.
  - **Persistence Mechanism**: **AppDomainManager injection** via a crafted `.config` file to load `Netapi64.dll` at runtime.

### Mechanism of Operation
SesameOp uses OpenAI’s API as a **stealthy relay** for malicious activities, bypassing traditional C2 methods. The process involves:

- **Command Retrieval**: The backdoor fetches encrypted commands from OpenAI’s Assistants API, which are then decoded and executed locally.
- **Result Transmission**: Execution results are sent back to OpenAI as messages, with the **description field** signaling outcomes:
  - **SLEEP**: Pauses the process thread for a specified duration.
  - **Payload**: Extracts and executes code from the instructions field in a separate thread.
  - **Result**: Sends processed results to OpenAI, marked with the keyword "Result" for the threat actor.

- **Obfuscation and Evasion**:
  - **Eazfuscator.NET**: Used to obfuscate `Netapi64.dll`, making analysis difficult.
  - **Legitimate Tools**: Exploits Microsoft Visual Studio utilities and AppDomainManager injection to blend with normal activity.

### Implications and Mitigations
- **API Deprecation**: OpenAI’s Assistants API will be deprecated in **August 2026**, replaced by the **Responses API**, which may reduce future exploitation opportunities.
- **Collaboration with OpenAI**: Microsoft shared findings with OpenAI, leading to the **disabling of a compromised API key** and associated account.
- **Threat Actor Unknown**: The perpetrators remain unidentified, but the attack highlights the growing trend of **abusing AI APIs** for malicious purposes.

### Broader Cybersecurity Concerns
- **Stealth and Persistence**: The use of legitimate APIs allows attackers to maintain access without triggering traditional security alerts.
- **Evolving Threat Landscape**: As AI tools become more integrated, their misuse for C2 channels poses new challenges for detection and response.

For further details, refer to the full report: [Microsoft’s Technical Report on SesameOp](https://thehackernews.com/2025/11/microsoft-detects-sesameop-backdoor.html)