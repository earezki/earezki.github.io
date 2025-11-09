---
title: "Operation SkyCloak: Tor-Powered OpenSSH Backdoor Targeting Defense Sectors"
pubDate: 2025-11-04
description: "Researchers reveal a sophisticated cyber campaign, Operation SkyCloak, using Tor-enabled OpenSSH backdoors to target defense networks in Russia and Belarus via phishing attacks."
categories: ["AI News", "Cybersecurity", "Threat Intelligence"]

---

## Operation SkyCloak: Tor-Powered OpenSSH Backdoor Targeting Defense Sectors

### Attack Overview
Operation SkyCloak is a state-sponsored cyber campaign targeting defense and government sectors in Russia and Belarus. The threat actors use phishing emails to deliver malware that establishes a persistent backdoor using **OpenSSH** and **Tor hidden services** with **obfs4** traffic obfuscation. Key details include:
- **Target sectors**: Defense, government, and military organizations.
- **Attack vector**: Weaponized ZIP files distributed via phishing emails, containing malicious LNK files.
- **Malware components**: PowerShell droppers, scheduled tasks, and Tor-based C2 communication.
- **Attribution**: Likely linked to Eastern European threat actors, with tactical overlaps to the **UAC-0125** group tracked by **CERT-UA**.

### Infection Chain and Technical Mechanics
The attack unfolds in a multi-stage process:
- **Initial delivery**: Phishing emails lure victims with fake military documents, prompting them to open ZIP files containing:
  - A hidden folder with a second archive file.
  - A Windows shortcut (LNK) file that triggers the infection chain.
- **PowerShell dropper**: Executes commands to unpack and deploy malware, bypassing sandbox detection through **environmental checks**:
  - Verifies ≥10 recent LNK files on the system.
  - Confirms ≥50 active processes to mimic real user activity.
- **Decoy and persistence**: Displays a PDF decoy while creating a scheduled task named **"githubdesktopMaintenance"** to execute **"logicpro/githubdesktop.exe"** (a renamed **sshd.exe**) post-logon and daily at 10:21 UTC.

### Persistence and Communication
- **SSH Backdoor**: The renamed **sshd.exe** enables SSH access, restricted to pre-deployed authorized keys stored in the **"logicpro"** folder. This allows file transfers via **SFTP**.
- **Tor Hidden Service**: A second scheduled task executes **"logicpro/pinterest.exe"** (a customized Tor binary) to create a hidden service at **"yuknkap4im65njr3tlprnpqwj4h7aal4hrn2tdieg75rpp6fx25hqbyd[.]onion"**. Traffic is obfuscated using **obfs4** to evade detection.
- **Port Forwarding**: Critical services (RDP, SSH, SMB) are forwarded through the Tor network, enabling remote access to system resources.

### Data Exfiltration and Control
- **System Information Theft**: Exfiltrates victim system details and a unique **.onion URL hostname** via **curl** commands.
- **C2 Communication**: The attacker receives the .onion URL to establish remote control over the compromised system, ensuring anonymity through Tor.

### Attribution and Impact
- **Attribution**: Security firms **Cyble** and **Seqrite Labs** link the campaign to **Eastern European-linked espionage groups**, with similarities to **UAC-0125** (tracked by CERT-UA).
- **Impact**: Enables full system control while preserving attacker anonymity, posing significant risks to defense infrastructure and sensitive data.

### Reference
https://thehackernews.com/2025/11/operation-skycloak-deploys-tor-enabled.html