---
title: "Qiskit SDK v2.2 Release Summary"
pubDate: "2025-10-20"
description: "Technical release summary for Qiskit SDK v2.2, including updates on the new end-to-end quantum + HPC workflow demo enabled by Qiskit's C API."
categories: ["AI News", "Quantum Computing"]
---

## Qiskit SDK v2.2: Performance Boosts, Enhanced Capabilities, and Important Updates

This document summarizes the key features and changes introduced in Qiskit SDK v2.2, a significant release focused on performance improvements, expanded functionality, and addressing important platform and Python version considerations.  This release brings a 10-20% average speedup in transpilation, enhanced support for fault-tolerant quantum computing, and a modernized development experience.

### Key Highlights

*   **Performance Improvements:** Circuit transpilation is now 10-20% faster on average.
*   **C API Enhancements:**  A new `qk_transpile()` function enables transpilation using the C API, facilitating seamless integration with HPC environments.
*   **Fault-Tolerance Advancements:**  The `LitinskiTransformation` pass implements the Litinski algorithm, bringing Qiskit closer to supporting fault-tolerant quantum computing.
*   **Target Model Enhancements:**  Expanded `Target` model now supports specifying angle bounds, enabling more precise control over quantum circuits.
*   **Python Version & Platform Support:**  Important updates regarding Python version compatibility and platform support (Intel Macs) are outlined.
*   **Deprecations:**  Several classes in the Qiskit library have been deprecated and will be removed in Qiskit v3.0.

### Detailed Breakdown

#### 1. Performance Enhancements

*   **Significant Speedup:**  The Qiskit team has achieved a 10-20% average speedup in circuit transpilation.
*   **Rust Optimization:**  The performance gains are attributed to ongoing optimizations in the Rust codebase, driven by the use of more efficient libraries.
*   **Benchmarking:**  The improvements were validated through extensive benchmarking using the Qiskit Bench library.

#### 2. C API Integration

*   **`qk_transpile()` Function:**  The introduction of the `qk_transpile()` function allows developers to transpile circuits directly from C code.
*   **HPC Integration:**  This capability enables the construction of end-to-end quantum workflows within HPC environments.
*   **Targeted Use Cases:**  This is particularly beneficial for applications requiring integration with existing HPC infrastructure.

#### 3. Fault-Tolerance Advancements

*   **`LitinskiTransformation` Pass:** This new pass implements the Litinski algorithm, a key component of fault-tolerant quantum computing.
*   **Improved Gate Optimization:**  The `LitinskiTransformation` pass optimizes circuits by transforming them into a format suitable for fault-tolerant implementations.
*   **Callback Mechanism:**  A new callback mechanism allows users to define custom transformations for the `LitinskiTransformation` pass.

#### 4. Target Model Enhancements

*   **Angle Bounds:** The `Target` model now supports specifying bounds on the angles of quantum gates.
*   **Flexibility:** This allows for more precise control over circuit execution and enables the development of circuits for a wider range of hardware platforms.
*   **`wrap_angles` Pass:** This pass applies angle constraints, ensuring that the circuit remains valid for the target hardware.

#### 5. Python Version and Platform Support

*   **Python 3.9 End-of-Life:**  Qiskit v2.2 is the final version to support Python 3.9.  Users are encouraged to upgrade to Python 3.10 or later for future versions.
*   **Intel Mac Downgrade:**  Due to Intel's end-of-life support, Qiskit v2.3 will no longer support Intel Macs.
*   **Rust Version Update:** Qiskit v2.2 requires Rust version 1.85.

#### 6. Deprecations

The following classes have been deprecated and will be removed in Qiskit v3.0:

*   `Qiskit.circuit.library.Many` -> `Qiskit.circuit.library.Many`
*   `Qiskit.circuit.library.Qiskit` -> `Qiskit.circuit.library.Qiskit`
*   `Qiskit.circuit.library.Qiskit` -> `Qiskit.circuit.library.Qiskit`
*   `Qiskit.circuit.library.Qiskit` -> `Qiskit.circuit.library.Qiskit`

These changes are part of ongoing efforts to modernize the Qiskit library and improve its overall architecture.

### Resources

*   **Qiskit Documentation:** [https://qiskit.org/documentation/](https://qiskit.org/documentation/)
*   **Qiskit Blog:** [https://qiskit.org/blog/](https://qiskit.org/blog/)
*   **GitHub:** [https://github.com/Qiskit/qiskit](https://github.com/Qiskit/qiskit)

### Acknowledgements

The developers of Qiskit would like to thank the contributors and maintainers who made this release possible.

**Note:** This summary is based solely on the provided context and may not include all details or nuances of the release.
