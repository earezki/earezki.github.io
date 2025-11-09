---
title: "China-Linked Hackers Exploit Legacy Vulnerabilities for Global Espionage Campaigns"
pubDate: 2025-11-07
description: "A China-linked threat actor exploited multiple CVEs in April 2025 to target a U.S. non-profit organization, establishing long-term persistence. Other Chinese hacking groups have also launched campaigns across global sectors using advanced techniques like AitM attacks and IIS server compromises."
categories: ["AI News", "Cyber Security", "Espionage", "Vulnerability Exploits"]

---

## China-Linked Hackers Exploit Legacy Vulnerabilities for Global Espionage Campaigns

### Key Attack on U.S. Non-Profit Organization
- **Timeline and Methods**:  
  - On **April 5, 2025**, attackers conducted mass scanning using known exploits, including **CVE-2022-26134 (Atlassian)**, **CVE-2021-44228 (Log4j)**, **CVE-2017-9805 (Apache Struts)**, and **CVE-2017-17562 (GoAhead Web Server)**.  
  - Initial access was likely achieved via **brute-force or credential stuffing attacks**, as no exploitation of the CVEs was confirmed.  
  - On **April 16, 2025**, attackers executed **`curl` commands** to test connectivity, used **`netstat`** to gather network info, and set up **scheduled tasks** to run **`msbuild.exe`** and inject payloads into **`csc.exe`**.  
  - A **C2 server** at **`38.180.83[.]166`** was contacted, and a **RAT** (likely) was deployed in memory.  

- **Persistence and Stealth**:  
  - A scheduled task ran every **60 minutes** as a **SYSTEM user** to maintain access.  
  - Attackers used **DLL side-loading** via **`vetysafe.exe`** (Vipre AV component) to execute **`sbamres.dll`**, previously linked to **Salt Typhoon** and **Space Pirates**.  
  - Tools like **Dcsync** and **Imjpuexc** were observed, though the full success of the attack remains unclear.  

### Broader Campaigns by Chinese Threat Actors
- **Speccom (IndigoZebra/SMAC)**:  
  - Targeted **Central Asian energy sectors** in **July 2025** via phishing emails, delivering **BLOODALCHEMY**, **kidsRAT**, and **RustVoralix**.  

- **DigitalRecyclers**:  
  - Attacked **European organizations** in **July 2025** using the **Magnifier tool** to gain **SYSTEM privileges**.  

- **FamousSparrow**:  
  - Targeted **Latin American governments** (Argentina, Ecuador, etc.) between **June–September 2025** by exploiting **ProxyLogon** in Microsoft Exchange to deploy **SparrowDoor**.  

- **SinisterEye (LuoYu/Cascade Panda)**:  
  - Attacked **Taiwanese defense firms**, **U.S. trade groups**, and **Ecuadorian government bodies** between **May–September 2025** using **AitM attacks** to deliver **WinDealer** and **SpyDealer**.  

- **PlushDaemon**:  
  - Compromised **Cambodian companies** in **June 2025** via **AitM poisoning**, using **EdgeStepper** to redirect DNS traffic to attacker-controlled servers, deploying **SlowStepper** backdoors.  

### Targeting Misconfigured IIS Servers
- **TOLLBOOTH (HijackServer)**:  
  - A Chinese-speaking group (**REF3927**) exploited **publicly exposed ASP.NET machine keys** to install **TOLLBOOTH**, a backdoor with **SEO cloaking** and **web shell capabilities**.  
  - **Infection spread**: Over **hundreds of servers** globally, with concentrations in **India** and the **U.S.**.  
  - **Attack workflow**:  
    1. Use exposed machine keys to compromise IIS servers.  
    2. Deploy **Godzilla web shells**, **GotoHTTP**, **Mimikatz** (for credential harvesting), and **HIDDENDRIVER** (rootkit for stealth).  

### Attribution Challenges and Trends
- **Tool Sharing**: Chinese groups like **Salt Typhoon**, **Kelp**, and **Space Pirates** share malware components (e.g., `sbamres.dll`), complicating attribution.  
- **Geopolitical Motives**: Attacks align with **Beijing's priorities**, targeting sectors like energy, government, and defense.  
- **Persistence Focus**: Attackers prioritize **long-term network access** and **domain controller infiltration** to expand lateral movement.  

### Reference
[Read the full report on The Hacker News](https://thehackernews.com/2025/11/from-log4j-to-iis-chinas-hackers-turn.html)