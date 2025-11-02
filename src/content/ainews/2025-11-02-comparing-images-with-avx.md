---
title: "Optimizing Image Comparison with AVX512 Assembly in odiff"
pubDate: 2025-11-02
description: "A detailed exploration of rewriting the odiff image comparison tool using AVX512 assembly for performance improvements, including technical implementation details and best practices."
categories: ["AI News", "Image Processing", "Assembly Language", "SIMD Optimization"]
---

## Optimizing Image Comparison with AVX512 Assembly in odiff

This article details the author's contribution to the **odiff** image comparison tool by rewriting its core algorithm using **AVX512 assembly** to achieve significant performance gains. The implementation, named **vxdiff**, leverages SIMD (Single Instruction, Multiple Data) capabilities to process image data in parallel, reducing computation time for pixel-by-pixel comparisons. The work was part of the 2025 Hacktoberfest challenge and integrates into odiff via the `--enable-asm` flag.

---

### Key Concepts and Implementation Details

#### **1. Background on odiff**
- **Purpose**: odiff is a high-performance image comparison tool that uses the **YIQ color space** (instead of RGB) to better detect perceptual differences between images.
- **Rewritten in Zig**: Originally in OCaml, odiff was transitioned to Zig for better SIMD support, but the core algorithm remained unoptimized for AVX512.
- **vxdiff**: A pure AVX512 assembly reimplementation of odiff's core logic, focusing on the default comparison options.

#### **2. SIMD and AVX512 Overview**
- **SIMD Architecture**: Traditional CPUs process one data element at a time, but SIMD extensions (like AVX512) allow parallel operations on **64-byte (512-bit)** chunks of data.
- **AVX512 Capabilities**:
  - Processes **16 RGBA pixels at once** (each pixel is 4 bytes).
  - Supports advanced masking and vector operations for efficient data manipulation.
  - Enables array-like operations at the hardware level, similar to functional programming languages.

#### **3. Core Algorithm in AVX512 Assembly**
The algorithm processes images in **RGBA8 format** (3 color channels + 1 alpha channel, 8 bits per channel). Key steps include:

##### **Step 1: Image Preprocessing**
- Load image data into registers (`xmm1`, `xmm2`) using `vmovdqu8`.
- Replace transparent pixels (alpha = 0) with white using mask registers (`k6`, `k7`) and `vpcmpequb` for comparison, followed by `vmovdqu8` to apply the replacement.

```assembly
kxor k6, k6, k6
vpcmpequb k6 {k4}, xmm1, xmm0  ; Compare alpha channel to 0
kshiftlb k6, k6, 1             ; Propagate mask to RGB channels
vmovdqu8 xmm1 {k7}, xmm31      ; Replace masked pixels with white
```

##### **Step 2: Data Conversion and Normalization**
- Convert bytes to 32-bit integers with `vpmovzxbd`, then to floats using `vcvtudq2ps`.
- Normalize alpha values from `0-255` to `0.0-1.0` using `vmulps` with a scaling factor.

```assembly
vpmovzxbd zmm1, xmm1
vcvtudq2ps zmm1, zmm1
vmulps zmm1 {k4}, zmm1, zmm3  ; Scale alpha to [0.0, 1.0]
```

##### **Step 3: Alpha Blending and YIQ Conversion**
- Blend RGB channels with white using alpha via `(RGB - 255.0) * A + 255.0`.
- Convert RGB to YIQ using precomputed matrices (`zmm7`, `zmm8`, `zmm9`) and `vmulps`.

```assembly
vmulps zmm10, zmm1, zmm7  ; Y component
vmulps zmm11, zmm1, zmm8  ; I component
vmulps zmm12, zmm1, zmm9  ; Q component
```

##### **Step 4: Difference Calculation**
- Compute the difference between base and comparison image YIQ values.
- Square the differences and multiply by a delta coefficient (`zmm29`).

```assembly
vsubps zmm16, zmm16, zmm26  ; YIQ difference
vmulps zmm16, zmm16, zmm16  ; Square the differences
vmulps zmm16, zmm16, zmm29  ; Multiply by delta coefficient
```

##### **Step 5: Summing Differences and Counting Pixels**
- Aggregate YIQ channel differences into a single value using `vaddps`.
- Compare against a threshold (`xmm28`) and count differing pixels with `popcnt`.

```assembly
vcmpgtps k6, xmm16, xmm28
kmov eax, k6
popcnt eax, eax            ; Count differing pixels
```

---

### Working Example (AVX512 Assembly)

```assembly
section .data
    ; Precomputed YIQ conversion matrix
    zmm7: dd 0.299, 0.587, 0.114, 0.0, 0.0, 0.0, 0.0, 0.0, ...
    zmm8: dd 0.5957, -0.2744, -0.3213, 0.0, 0.0, 0.0, 0.0, 0.0, ...
    zmm9: dd 0.2114, -0.5226, 0.3112, 0.0, 0.0, 0.0, 0.0, 0.0, ...

section .text
global vxdiff
vxdiff:
    ; Load image data into registers
    vmovdqu8 xmm1, [rdi]  ; Base image
    vmovdqu8 xmm2, [rsi]  ; Comparison image

    ; Replace alpha=0 with white
    kxor k6, k6, k6
    vpcmpequb k6 {k4}, xmm1, xmm0
    kshiftlb k6, k6, 1
    kor k7, k7, k6
    kshiftlb k6, k6, 1
    kor k7, k7, k6
    kshiftlb k6, k6, 1
    kor k7, k7, k6
    vmovdqu8 xmm1 {k7}, xmm31

    ; Convert to float and normalize alpha
    vpmovzxbd zmm1, xmm1
    vcvtudq2ps zmm1, zmm1
    vmulps zmm1 {k4}, zmm1, zmm3  ; zmm3 = 1/255.0

    ; Alpha blending and YIQ conversion
    ; ... (omitted for brevity)

    ; Final difference count
    vcmpgtps k6, xmm16, xmm28
    kmov eax, k6
    popcnt eax, eax
    ret
```

---

### Recommendations for AVX512 Implementation

- **Start Simple**: Focus on core functionality (e.g., basic pixel comparison) before adding advanced features like alpha blending or YIQ conversion.
- **Use Mask Registers**: Leverage AVX512 masks (`k0`–`k7`) to conditionally apply operations to specific data elements (e.g., alpha channel).
- **Test for Compatibility**: Ensure your code works on CPUs that support AVX512 (Intel Xeon Silver/Gold, AMD EPYC Zen 3+).
- **Profile Performance**: Use tools like `perf` or `valgrind` to identify bottlenecks and optimize register usage.
- **Avoid Over-Vectorization**: Balance between parallelism and readability; overly complex vector operations can reduce maintainability.

---

### Potential Pitfalls

- **Mask Register Misuse**: Incorrect mask propagation (e.g., `kshiftlb`) can lead to unintended data modifications.
- **Data Alignment**: AVX512 requires **64-byte aligned memory** for optimal performance (use `align 64` in assembly).
- **Floating-Point Precision**: Conversions between integers and floats (`vpmovzxbd`, `vcvtudq2ps`) may introduce rounding errors.
- **Portability**: AVX512 is not supported on ARM or older x86 CPUs; use `#ifdef` guards or fallback implementations if needed.

---

### Integration with odiff

vxdiff is now part of the odiff project. To use it, activate the AVX512 backend with:

```bash
odiff --enable-asm image1.png image2.png
```

This provides a significant speed boost for large-scale image comparisons, leveraging hardware-level parallelism.

---

### Reference
[https://dev.to/serpent7776/comparing-images-with-avx-3fo2](https://dev.to/serpent7776/comparing-images-with-avx-3fo2)