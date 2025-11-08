---
title: "Comparing the Top 6 Inference Runtimes for LLM Serving in 2025"
pubDate: 2025-11-07
description: "A comprehensive analysis of six leading inference runtimes for LLM serving in 2025, focusing on performance tradeoffs, KV cache strategies, and use cases."
categories: ["AI News", "AI Infrastructure", "Artificial Intelligence", "Technology"]
---

## Comparing the Top 6 Inference Runtimes for LLM Serving in 2025

This article evaluates six prominent inference runtimes for large language model (LLM) serving in 2025, emphasizing their design principles, performance metrics, and suitability for specific workloads. The key factors influencing their effectiveness are **KV cache management**, **throughput**, **latency**, and **hardware compatibility**.

---

### **1. vLLM: PagedAttention for High Throughput**
- **Design**: Uses **PagedAttention**, a block-based KV cache system that partitions sequences into fixed-size blocks, reducing fragmentation to **<4%** compared to **60–80%** in naive allocators.
- **Performance**:
  - **14–24× higher throughput** than Hugging Face Transformers and **2.2–3.5× higher** than early TGI for LLaMA models on NVIDIA GPUs.
  - Integrates **FP8 KV quantization** to reduce memory usage and improve decode throughput.
- **KV & Memory Behavior**: Optimized for GPU utilization with continuous batching and native support for prefix sharing.
- **Use Case**: Default choice for general-purpose LLM serving requiring high throughput and hardware flexibility.

---

### **2. TensorRT LLM: NVIDIA-Centric Latency Optimization**
- **Design**: Built on **NVIDIA TensorRT**, generating fused kernels per model and shape. Features **paged KV cache**, **quantized KV (INT8/FP8)**, and **offloading to CPU**.
- **Performance**:
  - **14× reduction in time-to-first-token (TTFT)** for CPU-based KV reuse on H100/NGH200 GPUs.
  - Low single-request latency when compiled for exact models/configurations.
- **KV & Memory Behavior**: Strong control over memory via paged and quantized KV, with application-level cache-aware routing.
- **Use Case**: Latency-critical workloads in **NVIDIA-only environments** requiring per-model tuning.

---

### **3. Hugging Face TGI v3: Long Prompt Optimization**
- **Design**: Server-focused stack with **chunked prefill** for long inputs and **prefix KV caching** for chat histories. Supports PyTorch/TensorRT backends.
- **Performance**:
  - **3× higher tokens per second** and **13× faster** than vLLM for long prompts with prefix caching.
  - Similar P50 latency to vLLM for short/mid-length prompts.
- **KV & Memory Behavior**: Uses paged attention and reduces memory via chunking and quantization (e.g., bitsandbytes, GPTQ).
- **Use Case**: Production stacks on Hugging Face, especially for **chat workloads with long histories**.

---

### **4. LMDeploy: TurboMind for Throughput Maximization**
- **Design**: Combines **TurboMind (NVIDIA CUDA kernels)** and a PyTorch fallback. Features **blocked KV cache**, dynamic splitting, and **weight/KV quantization (AWQ, INT8/INT4)**.
- **Performance**:
  - **1.8× higher request throughput** than vLLM, attributed to persistent batching and blocked KV.
  - **4-bit inference 2.4× faster than FP16** for supported models.
- **KV & Memory Behavior**: Blocked KV trade contiguous buffers for a grid of chunks, similar to PagedAttention but with different layout.
- **Use Case**: NVIDIA-centric deployments prioritizing **maximum throughput** with TurboMind tooling.

---

### **5. SGLang: RadixAttention for Structured Workloads**
- **Design**: Implements **RadixAttention**, a prefix-sharing mechanism using a **radix tree** for KV storage. Also supports a **DSL** for structured LLM programs (e.g., agents, RAG).
- **Performance**:
  - **6.4× higher throughput** and **3.7× lower latency** than vLLM on structured workloads.
  - **50–99% KV cache hit rates** for multi-turn chats or repeated contexts.
- **KV & Memory Behavior**: Focuses on **reuse** via radix trees, integrating with hierarchical caching systems (GPU/CPU).
- **Use Case**: Agentic systems, **RAG pipelines**, and toolchains with **heavy prefix reuse**.

---

### **6. DeepSpeed Inference / ZeRO Inference: Offloading for Large Models**
- **Design**: Uses **ZeRO Inference** to offload model weights and KV cache to **CPU/NVMe** for running models exceeding GPU memory.
- **Performance**:
  - **43 tokens/second** on CPU offload (V100 32GB), **30 tokens/second** on NVMe.
  - **1.3–2.4× faster** than partial offload due to larger batch sizes.
- **KV & Memory Behavior**: Offloads weights/KV to reduce GPU memory usage, but suffers from **high TTFT/P99 latency**.
- **Use Case**: **Very large models** on constrained GPUs (e.g., 32GB V100) for **offline/batch inference**.

---

### **Comparison Summary Table**
| Runtime         | Main Design Idea               | Relative Strength                              | KV Strategy                          | Typical Use Case                          |
|----------------|--------------------------------|------------------------------------------------|--------------------------------------|-------------------------------------------|
| **vLLM**       | PagedAttention, continuous batching | High throughput at given TTFT                  | Paged KV blocks, FP8 support         | General-purpose GPU serving               |
| **TensorRT LLM** | Compiled kernels + KV reuse | Low latency, high throughput on NVIDIA         | Paged/quantized KV, offload          | NVIDIA-only, latency-sensitive workloads  |
| **TGI v3**     | Long prompt pipeline           | Strong long-prompt performance                 | Paged KV, chunked prefill            | Hugging Face APIs, long chat histories    |
| **LMDeploy**   | TurboMind + blocked KV         | 1.8× vLLM throughput for 4-bit models          | Blocked KV, weight/KV quantization   | NVIDIA deployments, raw throughput        |
| **SGLang**     | RadixAttention + structured programs | 6.4× throughput for structured workloads       | Radix tree KV reuse                  | Agents, RAG, high prefix reuse            |
| **DeepSpeed**  | Offloading for huge models     | Enables large models on small GPUs             | CPU/NVMe offload                     | Offline inference, low-QPS services       |

---

### **Practical Recommendations**
- **Default Choice**: Use **vLLM** for balanced throughput, TTFT, and hardware flexibility.
- **NVIDIA Focus**: Opt for **TensorRT LLM** if fine-grained latency control and NVIDIA-specific tuning are needed.
- **Hugging Face Integration**: Choose **TGI v3** for long chat workflows with prefix caching.
- **Max Throughput**: Use **LMDeploy** with TurboMind for 4-bit models on NVIDIA GPUs.
- **Structured Workloads**: Deploy **SGLang** for agents/RAG with high prefix reuse.
- **Large Models on Small GPUs**: Use **DeepSpeed/ZeRO** for offloading, accepting higher latency.

---

### **Conclusion**
All six runtimes prioritize **KV cache optimization** as the critical bottleneck for LLM serving. The most effective solutions treat KV as a first-class data structure, employing techniques like **paging, quantization, reuse, and offloading** to maximize throughput and minimize latency. The choice depends on workload type, hardware constraints, and performance priorities.

**Reference**: [Comparing the Top 6 Inference Runtimes for LLM Serving in 2025](https://www.marktechpost.com/2025/11/07/comparing-the-top-6-inference-runtimes-for-llm-serving-in-2025/)