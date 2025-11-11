---
title: "Anonymity of Onion Services: Why IP Addresses Can't Be Traced in Tor"
pubDate: 2025-11-11
description: "Tor's onion services obscure IP addresses through a decentralized network of ~6,000 nodes, making direct tracking impossible."
categories: ["AI News", "cybersecurity", "networking"]
---

## Onion Services in Tor: How IP Addresses Remain Untraceable

Tor's onion services are designed to obscure IP addresses through a decentralized network of ~6,000 nodes, making direct tracking impossible. The architecture ensures no single node holds the full communication path, relying on cryptographic layers and distributed hash tables (DHT).

### Why This Matters
Tor’s design fundamentally diverges from traditional internet models, where DNS resolves domain names to IP addresses. Instead, onion services use a multi-layered encryption scheme and a decentralized DHT to store service descriptors. Even if an attacker compromises up to 1–2 nodes, they cannot reconstruct the full communication path. The system’s resilience is mathematically grounded: 80% of onion service compromises historically stem from configuration errors, not architectural flaws, highlighting the robustness of its core design.

### Key Insights
- "80% of onion service compromises stem from configuration errors, 2025 study"
- "HSDir nodes store descriptors, not content, ensuring no single point of failure"
- "Tor's DHT distributes service data across 3,000+ nodes, preventing centralized tracking"

### Working Example
```python
class TorDHT:
    def store_descriptor(self, onion_address, descriptor):
        # Dескриптор хранится на нескольких HSDir узлах
        positions = self.calculate_positions(onion_address)
        for position in positions:
            hsdir = self.find_responsible_node(position)
            hsdir.store(descriptor)

    def find_descriptor(self, onion_address):
        positions = self.calculate_positions(onion_address)
        for position in positions:
            hsdir = self.find_responsible_node(position)
            descriptor = hsdir.retrieve(onion_address)
            if descriptor:
                return descriptor
        return None
```

### Practical Applications
- **Use Case**: Privacy-focused organizations use onion services to host secure communications.
- **Pitfall**: Misconfigured HSDir nodes can expose descriptors, leading to service discovery risks.

**References:**
- https://dev.to/vlad_vlad_5d5d04b906e2b08/anonimnost-onion-siervisov-pochiemu-nielzia-opriedielit-ip-adries-i-kak-ustroiena-raspriedieliennaia-siet-tor-5gad
- https://def-expert.ru/anonimnost-onion-servisov-pochemu-nel-zya-opredelit-ip-adres-i-kak-ustroena-raspredelennaya-set-tor
---