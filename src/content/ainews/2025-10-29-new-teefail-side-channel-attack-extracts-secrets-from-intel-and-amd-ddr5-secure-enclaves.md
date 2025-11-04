---
title: "TEE.Fail: A Side-Channel Attack Exploiting DDR5 Secure Enclaves"
pubDate: 2025-10-29
description: "A new side-channel attack, TEE.Fail, exploits DDR5 secure enclaves to extract cryptographic keys from Intel and AMD processors using affordable hardware."
categories: ["AI News", "cyber security news", "software vulnerability"]
---

## TEE.Fail: A Side-Channel Attack Exploiting DDR5 Secure Enclaves

### Overview of the Attack
- **TEE.Fail** is a novel side-channel attack developed by researchers from Georgia Tech, Purdue University, and Synkhronix, capable of extracting cryptographic secrets from **Intel and AMD DDR5 secure enclaves**.
- The attack leverages **off-the-shelf hardware costing under $1,000** to monitor memory traffic in DDR5 servers, bypassing physical security measures.
- This is the **first demonstrated attack targeting DDR5 memory**, unlike prior attacks (e.g., Battering RAM, WireTap) that focused on DDR4.

### Technical Details
- **Attack Mechanism**:
  - Uses an **interposition device** to capture memory traffic between the CPU and DRAM during read/write operations.
  - Exploits the **AES-XTS encryption mode** used by Intel and AMD, which is **deterministic** and vulnerable to side-channel analysis.
- **Impact**:
  - Extracts **cryptographic keys** (e.g., ECDSA attestation keys) from secure enclaves like Intel's Provisioning Certification Enclave (PCE) and AMD's SEV-SNP with Ciphertext Hiding.
  - Compromises **Nvidia GPU Confidential Computing** by using stolen attestation keys to run AI workloads without TEE protections.
- **Vulnerabilities Highlighted**:
  - **Deterministic encryption** (AES-XTS) allows attackers to infer data patterns from memory traffic.
  - **Ciphertext Hiding** in SEV-SNP is **insufficient** to prevent physical bus interposition attacks.
  - Even **constant-time cryptographic code** (e.g., OpenSSL's ECDSA) is vulnerable when Ciphertext Hiding is enabled.

### Implications and Risks
- **Confidentiality Breach**:
  - Attackers can **read data** from confidential virtual machines (CVMs) and **forge attestation proofs**, making it appear as though data is securely processed in a TEE when it is not.
- **Broader Ecosystem Impact**:
  - Enables **compromise of AI workloads** on GPUs by bypassing TEE protections.
  - Undermines **trust in hardware-based security** (e.g., Intel SGX, AMD SEV-SNP) for sensitive applications.
- **Mitigation Challenges**:
  - **Software countermeasures** are recommended but may be costly and complex.
  - Both **Intel and AMD** state that physical attack vectors are **out of scope** for their security guarantees.

### Vendor Responses
- **Intel**:
  - Confirmed that TEE.Fail does not alter its existing stance on **physical attacks** being outside the scope of TDX and SGX protections.
- **AMD**:
  - Declined to provide mitigations, citing that **physical vector attacks** are not covered under SEV-SNP's security model.

### Reference
https://thehackernews.com/2025/10/new-teefail-side-channel-attack.html
---