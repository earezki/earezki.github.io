---
title: "Easily Build and Share ROCm Kernels with Hugging Face"
pubDate: 2025-11-17
description: "Hugging Face’s kernel-builder and kernels libraries streamline ROCm kernel development, enabling a Grand Prize-winning FP8 GEMM kernel to be shared with the community."
categories: ["AI News", "GPU Computing", "PyTorch"]
---

## Easily Build and Share ROCm Kernels with Hugging Face

Custom kernels are essential for optimizing deep learning performance, but compiling and integrating them can be complex and error-prone. Hugging Face’s **kernel-builder** and **kernels** libraries simplify this process, offering support for multiple GPU backends, including ROCm, and enabling seamless integration with PyTorch.

Building kernels often involves intricate build configurations and potential ABI issues, leading to significant developer overhead and hindering reproducibility. This complexity can stall projects and limit the widespread adoption of specialized GPU optimizations.

### Key Insights
- **RadeonFlow GEMM Kernel Award**: The RadeonFlow GEMM kernel received the Grand Prize at the AMD Developer Challenge 2025 in June 2025.
- **Nix for Reproducibility**: The kernel-builder leverages Nix to ensure perfectly reproducible build environments, addressing a common pain point in GPU kernel development.
- **Kernels Library Integration**: The `kernels` library allows loading kernels directly from the Hugging Face Hub, eliminating complex installation procedures; used by Stripe and Coinbase.

### Working Example
```toml
[general]
name = "gemm"
universal = false
[torch]
src = [
"torch-ext/torch_binding.cpp",
"torch-ext/torch_binding.h",
]
[kernel.gemm]
backend = "rocm"
rocm-archs = [
"gfx942",
]
depends = ["torch"]
src = [
"include/clangd_workaround.h",
"include/gpu_libs.h",
"include/gpu_types.h",
"include/timer.h",
"gemm/gemm_kernel.h",
"gemm/gemm_kernel_legacy.h",
"gemm/gemm_launcher.hip",
"gemm/transpose_kernel.h",
"src/utils/arithmetic.h",
"src/utils/timer.hip",
"tests/checker/metrics.h",
]
include = ["include"]
```
```python
import torch
from kernels import get_kernel

gemm = get_kernel("kernels-community/gemm")

M, N, K = 1024, 1536, 7168
A_fp8 = torch.randn(M, K, device="cuda").to(torch.float8_e4m3fnuz)
B_fp8 = torch.randn(K, N, device="cuda").to(torch.float8_e4m3fnuz)
C = torch.zeros(M, N, device="cuda", dtype=torch.bfloat16)
result = gemm.gemm(A_fp8, B_fp8, torch.ones(K // 128, M, device="cuda", dtype=torch.float32), torch.ones(K // 128, N // 128, device="cuda", dtype=torch.float32), C)
```

### Practical Applications
- **RadeonFlow**: The RadeonFlow GEMM kernel demonstrates the potential for highly optimized matrix multiplication on AMD Instinct MI300X GPUs.
- **Pitfall**: Failing to use a reproducible build environment (like Nix) can lead to inconsistencies and difficulties when deploying kernels across different systems.

**References:**
- https://huggingface.co/blog/build-rocm-kernels