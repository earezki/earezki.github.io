---
title: "IBM Advances Open-Source AI with vLLM, torch.compile, and Spyre Accelerator Integration"
pubDate: "2021-02-09"
description: "IBM is significantly contributing to the open-source AI ecosystem by enhancing vLLM with hardware-agnostic kernels, achieving efficient LLM training with torchtitan, and integrating its Spyre AI accelerator for improved inference."
categories: ["AI News", "Open Source", "Hardware Acceleration"]
---

## Summary of IBM's Contributions to Open-Source AI

IBM is actively expanding its contributions to the open-source AI community, particularly within the PyTorch and vLLM ecosystems. At PyTorch 2025, the company showcased advancements in model training, inference, and accelerator integration, demonstrating a commitment to efficient, transparent, and community-driven AI infrastructure. These efforts involve developing hardware-agnostic kernels for vLLM, achieving significant cost and efficiency improvements in LLM training with torchtitan, and integrating its Spyre AI accelerator for enhanced inference capabilities.

### Improving vLLM with Hardware-Agnostic Kernels

**Overview:** IBM Research has developed Triton kernels to enhance the performance of vLLM, a popular open-source LLM inference framework. This initiative aims to provide a fully contained attention backend that works efficiently on multiple GPU platforms, including AMD, without relying on proprietary libraries like FlashAttention.

**Key Details:**
*   **Problem:** The previous version of vLLM (V1) relied on external FlashAttention libraries, limiting hardware support to NVIDIA GPUs.
*   **Solution:** IBM researchers developed Triton kernels, a platform-independent framework for writing GPU kernels, to enable vLLM to run efficiently on AMD GPUs.
*   **Performance Improvement:** Through extensive kernel-level optimizations, IBM achieved a more than 10% improvement in token throughput for vLLM V1 on AMD hardware compared to vLLM V0.
*   **Technical Details:** The team addressed performance bottlenecks arising from the scheduler's interleaving of prefill and decode requests, leading to significant optimizations for models using grouped query attention, such as IBM's Granite 3.0 family.
*   **Community Benefit:** The newly developed attention backend is self-contained, doesn't depend on external libraries, and is maintained by the vLLM team, allowing for flexibility in adapting to new models.
*   **Future Work:** IBM is working on reducing the launch overhead of these Triton kernels and expanding optimizations to other model architectures, including IBM's Granite 4, which utilizes Mamba layers. Meta's PyTorch Team is also announcing a public beta for Helion, a domain-specific language for kernel development, which compiles down to Triton.

### A New Model Training Milestone with torchtitan

**Overview:** IBM Research has successfully trained a new branch of the Llama 3 70B model using torchtitan, a new PyTorch-native training framework. This achievement demonstrates the framework's capability to achieve production-grade efficiency with significantly reduced resources.

**Key Details:**
*   **Switch to torchtitan:** IBM's research scientist Linsong Chu's team transitioned from a proprietary software stack to torchtitan to actively participate in the open-source community and streamline training workflows.
*   **Resource Efficiency:** The team achieved the same model quality with only one-third of the training budget compared to the original Llama 3 training, attributed to careful data curation and training in FP8 precision.
*   **FP8 Precision:** Utilizing FP8 precision resulted in a 1.5 times faster training speed and halved the required token count.
*   **torchtitan Features:** The project leveraged features contributed by IBM, including a high-throughput data loader that enables efficient checkpoint saving, workload distribution, and mid-job reconfiguration.
*   **Community Contribution:** This accomplishment showcases PyTorch's potential for training large-scale models using open-source frameworks, with IBM actively contributing kernels and new models to the community.

### Integration of Spyre AI Accelerator with vLLM and torch.compile

**Overview:** IBM is integrating its Spyre AI accelerator with the PyTorch ecosystem, specifically with vLLM and torch.compile, to enhance inference performance and expand the reach of its hardware.

**Key Details:**
*   **Spyre AI Accelerator:** IBM's Spyre is designed for IBM Z and Power Systems, offering a heterogeneous compute platform.
*   **vLLM Integration:** IBM developed a new compiler that seamlessly interfaces with torch.compile, enabling vLLM to utilize the Spyre accelerator with minimal code changes.
*   **Paged Attention Plugin:** A key component of the integration is a vLLM plugin that implements paged attention, a technique that improves memory efficiency and scalability for long LLM outputs.
*   **Paged Attention Mechanism:** This technique divides the model's KV cache into smaller, addressable memory blocks ("pages") fetched on demand, reducing memory bottlenecks.
*   **Ease of Use:** The plugin allows developers to transparently substitute vLLM endpoints with Spyre, requiring no changes to existing frameworks like BeeAI and LangChain.
*   **Future Plans:** IBM plans to deepen the integration in 2026, focusing on tighter compiler integration, unified runtime interfaces, and expanded multi-accelerator scheduling.

### Conclusion

IBM's multifaceted contributions to the open-source AI landscape, highlighted at PyTorch 2025, underscore its commitment to fostering a collaborative and innovative ecosystem. By advancing vLLM with hardware-agnostic kernels, achieving efficient training with torchtitan, and integrating its Spyre accelerator, IBM is paving the way for more powerful, accessible, and scalable AI solutions.

**Reference Link:** [https://research.ibm.com/blog/pytorch-expanding-ai-model-training-and-inference-for-the-open-source-community?utm_medium=rss&utm_source=rss](https://research.ibm.com/blog/pytorch-expanding-ai-model-training-and-inference-for-the-open-source-community?utm_medium=rss&utm_source=rss)