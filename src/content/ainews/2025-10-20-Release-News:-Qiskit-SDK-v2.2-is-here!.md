## Qiskit SDK v2.2 Release Summary

### Title: Release News: Qiskit SDK v2.2 is here! | IBM Quantum Computing Blog
### Pub Date: 2025-10-20
### Description: Technical release summary for Qiskit SDK v2.2, including updates on the new end-to-end quantum + HPC workflow demo enabled by Qiskit's C API.
### Categories: ["AI News", "Quantum Computing", "Software Development"]
### URL: https://www.ibm.com/quantum/blog/qiskit-2-2-release-summary

**Summary:**

Qiskit SDK v2.2 is a new release of the Qiskit SDK that introduces significant performance improvements, new features, and addresses important considerations for users. The release focuses on enhancing the Qiskit C API, improving support for fault-tolerant quantum computing, and addressing end-of-life and deprecation announcements.

---

## Main Heading: Qiskit SDK v2.2 Release Overview

This document details the key features and improvements included in Qiskit SDK v2.2, a minor release of the Qiskit v2.x series. This release brings notable performance enhancements, expands the capabilities of the C API, and introduces features for improved hardware targeting and error mitigation.

### Key Highlights:

*   **Enhanced C API:**  A major focus of this release is the advancement of the Qiskit C API, enabling seamless integration with high-performance computing (HPC) environments.
*   **Improved Fault-Tolerance Support:** The introduction of the `LitinskiTransformation` pass and enhancements to the `Target` model contribute to better support for fault-tolerant quantum computing.
*   **Performance Improvements:** Circuit transpilation is now 10-20% faster on average.
*   **Deprecation and Upgrade Considerations:**  Important updates regarding Python version support, Rust version requirements, and deprecated features are outlined.

## Detailed Breakdown of Features and Improvements

### 1. Qiskit C API Enhancements

**Description:**  Qiskit v2.2 significantly strengthens the Qiskit C API, providing a more robust and efficient way to build quantum workflows in C and other compiled languages.

**Key Features:**

*   **Standalone Transpiler Function:** The introduction of the `qk_transpile()` function enables direct transpilation of circuits via the C API.
    *   **Purpose:**  This function mirrors the functionality of the Python API's preset pass managers, allowing users to transpile circuits in pure-C environments without relying on Python interpreters.
    *   **Impact:**  Facilitates the creation of end-to-end quantum workflows that can be executed natively in C and other compiled languages.
*   **Qiskit C API Workflow Demo:** A new demo showcases the construction of a complete implementation of the SQD (Surface Code) in C++.
    *   **Purpose:**  Demonstrates the practical application of the C API for building quantum algorithms in compiled languages.
    *   **Reference:** [https://www.ibm.com/quantum/blog/qiskit-2-2-release-summary](https://www.ibm.com/quantum/blog/qiskit-2-2-release-summary)

### 2.  Accessing Layout Information using the C API

**Description:** This update allows users to apply transpilation layouts to observables, providing more control over the arrangement of qubits.

**Key Features:**

*   **`QkTranspileLayout` Object:** A new object is introduced to store qubit mappings and permutations.
*   **`apply_layout()` Function:** The `apply_layout()` function allows applying the `QkTranspileLayout` to observables.
*   **`WRAP_ANGLE` Registry:** A new callback function can be registered with the `WRAP_ANGLE` registry to apply angle constraints to gates.

### 3. Performance Improvements

**Description:**  Significant performance gains have been achieved in circuit transpilation.

**Key Details:**

*   **Average Speedup:** Circuit transpilation is now 10-20% faster on average.
*   **Benchmarking:**  The improvements were observed through benchmarking using the Qiskit Benchmarks.
*   **Rust Contribution:** The performance improvements are attributed to the ongoing conversion of Qiskit code to Rust.

### 4.  `LitinskiTransformation` for Fault Tolerance

**Description:** The `LitinskiTransformation` pass is introduced to support the implementation of fault-tolerant quantum computing.

**Key Features:**

*   **Purpose:**  Implements the Litinski algorithm, which transforms circuits into a form suitable for fault-tolerant operations.
*   **Functionality:**  The pass converts gates into equivalent Pauli-based gates, facilitating the use of hardware with limited gate sets.
*   **Target:**  The pass is designed for circuits with `Qk` and `X` gates.
*   **Callback Function:**  The `wrap_angles` function allows for specifying angle bounds and additional constraints.

### 5. Expanded `Target` Model

**Description:** The `Target` model has been enhanced to provide more granular control over hardware constraints.

**Key Features:**

*   **Angle Bounds:**  Users can specify angle bounds for instructions, allowing for the definition of hardware-specific constraints (e.g., limited rotation angles).
*   **`add_bound` Function:** This function allows specifying bounds on a given instruction.
*   **`WrapAngles` Pass:** A new pass applies angle constraints to gates, ensuring that the resulting circuit is compatible with the target hardware.
*   **`_to_target` Function:**  This function allows for specifying a target for a given circuit.

### 6.  Qiskit v2.0 Deprecations and Removal

**Description:**  Several classes have been deprecated and will be removed in Qiskit v3.0.

**Deprecated Classes:**

*   `Qiskit.circuit.library.ManyQubitGate`
*   `Qiskit.circuit.library.PhaseGate`
*   `Qiskit.circuit.library.ParameterizedGate`
*   `Qiskit.circuit.library.QiskitGate`
*   `Qiskit.circuit.library.OneQubitGate`
*   `Qiskit.circuit.library.TwoQubitGate`
*   `Qiskit.circuit.library.CliffordGate`
*   `Qiskit.circuit.library.PauliGate`
*   `Qiskit.circuit.library.RotGate`
*   `Qiskit.circuit.library.RZGate`
*   `Qiskit.circuit.library.XGate`
*   `Qiskit.circuit.library.YGate`
*   `Qiskit.circuit.library.ZGate`
*   `Qiskit.circuit.library.HGate`
*   `Qiskit.circuit.library.CNGate`
*   `Qiskit.circuit.library.CZGate`
*   `Qiskit.circuit.library.CXGate`
*   `Qiskit.circuit.library.TGate`
*   `Qiskit.circuit.library.TdaggerGate`
*   `Qiskit.circuit.library.PhaseOracle`
*   `Qiskit.circuit.library.XGate`
*   `Qiskit.circuit.library.ZGate`
*   `Qiskit.circuit.library.HGate`
*   `Qiskit.circuit.library.CNGate`
*   `Qiskit.circuit.library.CZGate`
*   `Qiskit.circuit.library.CXGate`
*   `Qiskit.circuit.library.TGate`
*   `Qiskit.circuit.library.TdaggerGate`
*   `Qiskit.circuit.library.PhaseOracle`
*   `Qiskit.circuit.library.XGate`
*   `Qiskit.circuit.library.ZGate`
*   `Qiskit.circuit.library.HGate`
*   `Qiskit.circuit.library.CNGate`
*   `Qiskit.circuit.library.CZGate`
*   `Qiskit.circuit.library.CXGate`
*   `Qiskit.circuit.library.TGate`
*   `Qiskit.circuit.library.TdaggerGate`

**Replacement Classes:**

*   `Qiskit.circuit.library.ManyQubitGate` -> `Qiskit.circuit.library.MultiQubitGate`
*   `Qiskit.circuit.library.PhaseGate` -> `Qiskit.circuit.library.Phase`
*   `Qiskit.circuit.library.ParameterizedGate` -> `Qiskit.circuit.library.Parameterized`
*   `Qiskit.circuit.library.QiskitGate` -> `Qiskit.circuit.library.Gate`
*   `Qiskit.circuit.library.OneQubitGate` -> `Qiskit.circuit.library.OneQubit`
*   `Qiskit.circuit.library.TwoQubitGate` -> `Qiskit.circuit.library.TwoQubit`
*   `Qiskit.circuit.library.CliffordGate` -> `Qiskit.circuit.library.Clifford`
*   `Qiskit.circuit.library.PauliGate` -> `Qiskit.circuit.library.Pauli`
*   `Qiskit.circuit.library.RotGate` -> `Qiskit.circuit.library.Rot`
*   `Qiskit.circuit.library.RZGate` -> `Qiskit.circuit.library.RZ`
*   `Qiskit.circuit.library.XGate` -> `Qiskit.circuit.library.X`
*   `Qiskit.circuit.library.YGate` -> `Qiskit.circuit.library.Y`
*   `Qiskit.circuit.library.ZGate` -> `Qiskit.circuit.library.Z`
*   `Qiskit.circuit.library.HGate` -> `Qiskit.circuit.library.H`
*   `Qiskit.circuit.library.CNGate` -> `Qiskit.circuit.library.CN`
*   `Qiskit.circuit.library.CZGate` -> `Qiskit.circuit.library.CZ`
*   `Qiskit.circuit.library.CXGate` -> `Qiskit.circuit.library.CX`
*   `Qiskit.circuit.library.TGate` -> `Qiskit.circuit.library.T`
*   `Qiskit.circuit.library.TdaggerGate` -> `Qiskit.circuit.library.Tdagger`
*   `Qiskit.circuit.library.PhaseOracle` -> `Qiskit.circuit.library.Phase`
*   `Qiskit.circuit.library.XGate` -> `Qiskit.circuit.library.X`
*   `Qiskit.circuit.library.ZGate` -> `Qiskit.circuit.library.Z`
*   `Qiskit.circuit.library.HGate` -> `Qiskit.circuit.library.H`
*   `Qiskit.circuit.library.CNGate` -> `Qiskit.circuit.library.CN`
*   `Qiskit.circuit.library.CZGate` -> `Qiskit.circuit.library.CZ`
*   `Qiskit.circuit.library.CXGate` -> `Qiskit.circuit.library.CX`
*   `Qiskit.circuit.library.TGate` -> `Qiskit.circuit.library.T`
*   `Qiskit.circuit.library.TdaggerGate` -> `Qiskit.circuit.library.Tdagger`

### 7.  Python Version and Rust Requirements

*   **Python 3.9 End of Life:**  Qiskit v2.2 is the final version to support Python 3.9.  Future versions will require Python 3.10 or higher.
*   **Rust Version:** Qiskit v2.2 requires Rust version 1.85 or higher.

### 8.  Intel Mac Support

*   **Deprecation:** Support for Intel Macs will be discontinued in Qiskit v2.3.

### 9.  Additional Notes

*   **Documentation:**  The Qiskit documentation is available for more detailed information.
*   **Contribution:**  Users are encouraged to contribute to Qiskit development.

### 10. Acknowledgements

The release was made possible by contributions from a team of developers.

---