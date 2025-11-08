---
title: "Mysterious 'SmudgedSerpent' Hackers Target U.S. Policy Experts Amid Iran–Israel Tensions"
pubDate: 2025-11-05
description: "Proofpoint identifies UNK_SmudgedSerpent, an Iranian-linked group using fake Microsoft Teams apps to phish U.S. policy experts during heightened Iran-Israel tensions, with attacks spanning June–August 2025."
categories: ["AI News", "Cybersecurity", "Geopolitical Tensions", "Iran-Israel Relations"]

---

## Mysterious 'SmudgedSerpent' Hackers Target U.S. Policy Experts Amid Iran–Israel Tensions

### Attribution and Background
- **UNK_SmudgedSerpent** is a newly identified Iranian-linked cyber espionage group, attributed by Proofpoint for targeting U.S. academics and foreign policy experts between **June and August 2025**.
- The group’s tactics align with prior Iranian cyber units like **TA455 (Smoke Sandstorm)**, **TA453 (Charming Kitten)**, and **TA450 (MuddyWater)**, indicating a coordinated evolution in Iran’s espionage ecosystem.
- The campaign coincides with **heightened geopolitical tensions** between Iran and Israel, focusing on intelligence collection related to **Western policy analysis** and **strategic technology**.

### Attack Tactics and Technical Details
- **Phishing Campaigns**: 
  - Emails impersonated **U.S. foreign policy figures** and institutions like the **Brookings Institution** to gain trust.
  - Messages included **malicious URLs** disguised as Microsoft Teams links, leading to credential harvesting pages.
- **Malware Delivery**:
  - **MSI installers** masquerading as Microsoft Teams were distributed, which deployed **legitimate RMM tools** like **PDQ Connect** (used by MuddyWater).
  - A **spoofed OnlyOffice login page** on **thebesthomehealth[.]com** was used to harvest credentials after victims raised suspicions.
- **Domain Usage**:
  - Attackers leveraged **health-themed domains** (e.g., *thebesthomehealth[.]com*), a tactic previously seen with **TA455**.
  - **OnlyOffice** became a preferred hosting platform for malicious ZIP archives containing the MSI installer.

### Targets and Impact
- **Over 20 U.S. think tank experts** focused on **Iran-related policy** were targeted.
- Specific examples include:
  - A U.S. academic approached for research on **IRGC militarization**.
  - An individual solicited for collaboration on **Iran’s role in Latin America**.
- **Post-compromise activity**:
  - Attackers used **PDQ Connect** to install additional RMM tools like **ISL Online**, suggesting **hands-on-keyboard access** for deeper infiltration.
  - Decoy documents were used to mislead victims, while sensitive data was likely exfiltrated.

### Implications and Strategic Context
- **Shift in Iranian Espionage**: The campaign reflects **increased collaboration** between Iranian intelligence entities and cyber units, marking a **strategic evolution** in their espionage tactics.
- **Policy and Security Risks**: The attacks highlight vulnerabilities in **academic and think tank networks**, emphasizing the need for **enhanced email authentication** (e.g., SPF, DKIM) and **user education** on phishing.
- **Geopolitical Significance**: The timing aligns with **Iran-Israel tensions**, suggesting the attacks aim to **glean intelligence** on U.S. foreign policy responses and regional strategies.

### Reference
https://thehackernews.com/2025/11/mysterious-smudgedserpent-hackers.html
---