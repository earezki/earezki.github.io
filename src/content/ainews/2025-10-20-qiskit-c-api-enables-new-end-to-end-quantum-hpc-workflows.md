---
title: "Qiskit C API Enables End-to-End Quantum + HPC Workflows with New Demo"
pubDate: "2025-10-20"
description: "IBM Quantum introduces the Qiskit C API, enabling the creation of complete quantum-centric supercomputing workflows using compiled languages like C++. A new demo showcases this capability, leveraging the HPC-ready SQD addon for near-term quantum advantage demonstrations."
categories: ["AI News", "Quantum Computing", "High-Performance Computing"]
---

## Summary: Qiskit C API Facilitates Hybrid Quantum-Classical Computing

IBM Quantum has released the Qiskit C API, a significant advancement enabling the integration of quantum computing with traditional high-performance computing (HPC) workflows. This new interface, detailed in Qiskit v2.2, allows developers to build end-to-end quantum-centric supercomputing (QCSC) applications using compiled languages like C++ and Fortran, paving the way for demonstrating quantum advantage. A new demo, built upon this API, provides a practical example of this capability.

### Key Highlights:

*   **Qiskit C API Introduction:** The Qiskit C API is the first compiled language interface within the Qiskit framework. This is a crucial step toward realizing the full potential of QCSC.
*   **Qiskit v2.2 Release:** The release includes a dedicated transpiler function for quantum circuits, enabling the construction of complete QCSC applications.
*   **HPC-Ready SQD Addon:** A new SQD (selected basis diagonalization) addon, written in C++, is designed for efficient execution on HPC systems. It leverages MPI and OpenMP for parallel processing.
*   **Demo Workflow:** The demo demonstrates a real QCSC workflow using the SQD algorithm to approximate the ground state energy of Fe₄S₄, a molecular cluster.
*   **Integration with Existing Tools:** The C API demo integrates with various projects, including Qiskit C++, QRMI (Quantum Resource Management Interface), SBD (selected basis diagonalization) eigensolver, and `qiskit-addon-sqd-hpc`.

### Detailed Explanation:

#### 1. The Significance of the Qiskit C API

The Qiskit C API addresses a critical gap in quantum computing development. Previously, developers were limited to scripting languages like Python for building quantum algorithms. The C API unlocks the ability to integrate quantum computations seamlessly into existing HPC codebases, written in languages like C++ and Fortran, which are prevalent in scientific computing.

*   **Nature:** A compiled language interface for Qiskit.
*   **Purpose:** To enable the creation of end-to-end quantum-centric supercomputing workflows within HPC environments.
*   **Impact:** Facilitates the adoption of quantum computing by researchers and developers already familiar with HPC languages and tools.

#### 2. Core Components of the Qiskit C API Demo

The demo leverages several key components to showcase the capabilities of the C API:

*   **Qiskit C API:** The fundamental interface for building quantum applications in C++.
*   **HPC-Ready SQD Addon:** A C++17 library for performing selected basis diagonalization, optimized for HPC environments.
    *   **C++17:** Chosen for its balance of modernity and broad compiler support.
    *   **MPI and OpenMP:** Enables parallel execution across multiple processors and nodes.
    *   **Platform Support:** Tested on Linux, macOS (x86\_64 and ARMv8), and Windows (x86\_64).
    *   **Performance:** Includes a micro-benchmark suite for performance evaluation.
*   **QRMI (Quantum Resource Management Interface):** Provides a C++ interface to IBM Quantum hardware.
*   **SBD (selected basis diagonalization) eigensolver:** A RIKEN-developed eigensolver integrated into the workflow.
*   **`qiskit-addon-sqd-hpc`:** The HPC-ready SQD addon, specifically designed for parallel execution.

#### 3. Running the Demo

The provided instructions detail the steps to build and run the Qiskit C API demo.

*   **Prerequisites:** Rust v1.85+, a C++17 compiler, CMake, Make, OpenBLAS, OpenMPI, and Eigen3.
*   **Build Process:**  Involves building the Qiskit C extension, the QRMI service, and the demo itself using `make`.
*   **IBM Quantum Integration:** Requires setting environment variables with your IBM Quantum API token and instance.
*   **Execution:** The demo can be run with various command-line options to control the simulation parameters, such as the number of samples, the number of iterations, and the backend.

#### 4. Future Directions and Contributions

IBM Quantum encourages developers to explore the demo and contribute to the open-source projects it integrates. This includes contributing to Qiskit C++, QRMI, the SBD eigensolver, and `qiskit-addon-sqd-hpc`.

### Conclusion

The introduction of the Qiskit C API and the accompanying demo represent a significant step towards bridging the gap between quantum computing and traditional HPC. This enables a broader range of researchers and developers to leverage the power of quantum computation for solving complex problems in various fields. The development of such tools and the contributions to open-source projects are crucial for realizing the promise of quantum advantage.

**Reference:** [https://www.ibm.com/quantum/blog/c-api-enables-end-to-end-hpc-demo](https://www.ibm.com/quantum/blog/c-api-enables-end-to-end-hpc-demo)