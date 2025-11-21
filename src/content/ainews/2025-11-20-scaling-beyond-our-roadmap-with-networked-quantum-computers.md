---
title: "Networking quantum computers"
pubDate: 2025-11-20
description: "IBM initiates research and collaboration to build networked quantum computers, aiming for entanglement of cryogenically separated processors within five years."
categories: ["AI News", "Quantum Computing", "Networking"]
---

## Networking quantum computers

IBM is initiating research and collaborations to build the quantum computing internet of the future, with a goal to entangle cryogenically separated quantum processors within the next five years. The company aims to move beyond its 2033 roadmap of a 2,000-qubit, one billion operation quantum computer by exploring distributed quantum computing with connected systems.

### Why This Matters
Current quantum computers are limited by qubit count and circuit complexity. While fault-tolerant quantum computing is a present goal, scaling to significantly larger systems requires connecting multiple quantum processors. The cost of building monolithic quantum computers with extremely high qubit counts is currently prohibitive, making a networked approach essential for realizing the full potential of quantum computation.

### Key Insights
- **Quantum no-communication theorem, 1997**: Prevents faster-than-light communication via quantum entanglement.
- **Entanglement vs. Classical Links**: Quantum links create entanglement, causing nodes to act as a single entity, unlike classical cause-and-effect links.
- **QNUs (Quantum Networking Units)**: Act as interfaces translating qubits between processors and interconnects using “flying” qubits, often photons.

### Working Example
```python
# Simplified example of entanglement (conceptual, not runnable)
class Qubit:
    def __init__(self, state):
        self.state = state  # 0 or 1

    def measure(self):
        # In reality, measurement collapses the superposition
        return self.state

# Create two entangled qubits
qubit_a = Qubit(0)
qubit_b = Qubit(0)

# Simulate entanglement (in reality, requires quantum interaction)
# If qubit_a is measured as 1, qubit_b will also be 1
# and vice versa.

# Measure qubit_a
result_a = qubit_a.measure()
print(f"Qubit A measured: {result_a}")

# Measure qubit_b
result_b = qubit_b.measure()
print(f"Qubit B measured: {result_b}")
```

### Practical Applications
- **Quantum Datacenters**: Connecting multiple quantum computers to achieve higher qubit counts and larger circuits, as explored with Fermilab.
- **Pitfall**: Building high-fidelity l-couplers for short-range connections is crucial; low fidelity significantly increases error rates and hinders fault tolerance.

**References:**
- https://www.ibm.com/quantum/blog/networked-quantum-computers