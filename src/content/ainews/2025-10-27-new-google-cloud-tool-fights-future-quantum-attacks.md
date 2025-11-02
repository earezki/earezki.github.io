---
title: "New Google Cloud tool fights future quantum attacks"
pubDate: 2025-10-27
description: "Google Cloud introduces post-quantum encryption options in its Key Management Service (KMS) to defend against 'Harvest Now, Decrypt Later' attacks, addressing emerging quantum computing threats."
categories: ["AI News", "Cloud Cybersecurity", "Encryption & Data Privacy", "Identity & Access", "Quantum & Cloud"]
---

## Google Cloud Introduces Post-Quantum Encryption to Counter Future Quantum Threats

Google Cloud has expanded its Key Management Service (Cloud KMS) to include **post-quantum encryption algorithms**, a critical step in preparing for threats posed by future quantum computers. This update, now in preview, introduces **post-quantum Key Encapsulation Mechanisms (KEMs)** to protect data from "Harvest Now, Decrypt Later" attacks, where adversaries store encrypted data today to decrypt it later using quantum computing capabilities. The feature aligns with Google’s broader strategy to integrate quantum-safe cryptography into its infrastructure by 2026.

---

### Threat Landscape: Quantum Computing and "Harvest Now, Decrypt Later"

- **Quantum Computing Threats**: Quantum computers could break classical encryption algorithms like RSA and ECC, rendering current encryption obsolete. This poses a risk to data requiring long-term confidentiality (e.g., classified government data, financial records).
- **"Harvest Now, Decrypt Later" Strategy**: Cybercriminals or state actors may intercept and store encrypted data today, planning to decrypt it later when quantum computers become available.
- **Urgency of Preparation**: Only **9% of organizations** have a post-quantum roadmap, according to Bain & Co. Most are still "evaluating options," creating a false sense of security.

---

### Technical Implementation: Post-Quantum KEMs in Cloud KMS

Google Cloud KMS now supports multiple post-quantum KEMs, including:

- **ML-KEM-768 and ML-KEM-1024**: NIST-standardized lattice-based KEMs (FIPS 203).  
  - **ML-KEM-768** keys are **18 times larger** than classical P-256 keys, impacting storage and bandwidth.
- **X-Wing (Hybrid KEM)**: Combines classical X25519 with ML-KEM-768 for general-purpose applications, ensuring backward compatibility and security.

**Key Differences from Classical Encryption**:
- **Key Generation**: KEMs generate secret keys during the encapsulation process, unlike classical methods where keys are pre-shared.
- **Architectural Changes**: Developers must rework systems to integrate post-quantum algorithms, as existing encryption functions cannot be swapped directly.

---

### Transition Challenges and Recommendations

- **Performance Overhead**: Larger key sizes increase computational and storage demands. For example, ML-KEM-768 ciphertexts are significantly larger than classical counterparts, affecting systems with strict resource limits.
- **Hybrid Public Key Encryption (HPKE)**: Google recommends using **HPKE**, a standardized approach that combines classical and post-quantum algorithms. HPKE is available via Google’s open-source **Tink library** and will expand to Java, C++, Go, and Python later in 2025.

---

## Working Example: HPKE Implementation with Tink

```python
# Hypothetical example using Google's Tink library for HPKE
from tink import hybrid
from tink.hybrid import HybridEncrypt, HybridDecrypt

# Load HPKE keyset (requires pre-generated keys)
keyset_handle = hybrid.HybridKeyManager().get_keyset_handle()
keyset_handle = keyset_handle.with_keyset_serialization_options(
    hybrid.HybridKeysetSerializationOptions())

# Encrypt data
encrypter = keyset_handle.primitive(HybridEncrypt)
ciphertext = encrypter.encrypt(b"Secret Data", b"Additional Auth Data")

# Decrypt data
decrypter = keyset_handle.primitive(HybridDecrypt)
plaintext = decrypter.decrypt(ciphertext, b"Additional Auth Data")
```

**Note**: This is a simplified example. Actual implementation requires proper key management and integration with Tink’s APIs.

---

## Recommendations and Best Practices

- **Adopt Hybrid Encryption (HPKE)**: Use HPKE to gradually transition systems, ensuring compatibility with classical and post-quantum algorithms.
- **Assess Resource Constraints**: Evaluate storage, bandwidth, and computational requirements for post-quantum keys (e.g., ML-KEM-768’s 18x size increase).
- **Plan for Architectural Changes**: Reengineer systems where encryption functions are tightly coupled with application logic.
- **Monitor Industry Standards**: Follow NIST and Google’s updates on post-quantum cryptography standards.
- **Prioritize Sensitive Data**: Focus on protecting data with long-term confidentiality needs (e.g., legal, medical, or financial records).

---

## Organizational Readiness and Industry Context

- **Current Gaps**: Most organizations are unprepared for quantum threats, despite growing awareness. Only 9% have a defined post-quantum roadmap.
- **Google’s Roadmap**: Full integration of post-quantum algorithms into Google Cloud infrastructure is planned for **2026**.
- **Open-Source Support**: Google’s **BoringCrypto** and **Tink** libraries already include post-quantum implementations, enabling developers to test and adopt these algorithms early.

---

**Reference**: [New Google Cloud tool fights future quantum attacks](https://www.cloudcomputing-news.net/news/new-google-cloud-tool-fights-future-quantum-attacks/)