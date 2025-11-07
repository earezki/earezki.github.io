---
title: "Moonshot AI Introduces Kimi K2 Thinking: A Breakthrough in Long-Horizon Reasoning and Tool Use"
pubDate: 2025-11-06
description: "Moonshot AI releases Kimi K2 Thinking, an open-source thinking model capable of executing 200–300 sequential tool calls without human intervention, optimized for long-horizon reasoning and agentic tasks."
categories: ["AI News", "Agentic AI", "Artificial Intelligence", "Large Language Model", "Machine Learning", "New Releases"]

---

## Moonshot AI Introduces Kimi K2 Thinking: A Breakthrough in Long-Horizon Reasoning and Tool Use

Moonshot AI has introduced **Kimi K2 Thinking**, an open-source thinking agent model designed to perform deep reasoning, long-horizon tool use, and stable agentic behavior across hundreds of sequential steps. This model extends the Kimi K2 Mixture of Experts (MoE) architecture, enabling it to interleave reasoning with tool calls for complex tasks. Key features include a 256K token context window, native INT4 quantization, and state-of-the-art performance on reasoning, coding, and agentic search benchmarks.

---

### **Key Features and Architecture**

- **Mixture of Experts (MoE) Design**:
  - **Total Parameters**: 1T, with **32B active parameters per token**.
  - **Layers and Experts**: 61 layers (1 dense, 384 experts, 8 selected per token), 64 attention heads, and an attention hidden dimension of 7168.
  - **Quantization**: Native **INT4 quantization** with **Quantization Aware Training (QAT)**, enabling **2x faster inference** while maintaining performance.

- **Context Window**: 256K tokens, supporting extended reasoning and long-form tasks.
- **Attention Mechanism**: Multi-head Latent Attention with **SwiGLU** activation function.
- **Deployment**: Available via `kimi.com` in chat mode and through the Moonshot API, with a future agentic mode for full tool use.

---

### **Performance Benchmarks**

- **Reasoning Tasks**:
  - **Humanity’s Last Exam (HLE)**:
    - No tools: 23.9
    - With tools: 44.9 (heavy mode: 51.0)
  - **AIME25 (Math)**: 99.1 (with Python)
  - **HMMT25 (Math)**: 95.1 (with Python)
  - **IMO AnswerBench**: 78.6
  - **GPQA (General Physics)**: 84.5

- **Agentic Search and Coding**:
  - **BrowseComp**: 60.2
  - **BrowseComp ZH (Chinese)**: 62.3
  - **SWE Bench Verified (Coding)**: 71.3 (with tools)
  - **LiveCodeBenchV6**: 83.1
  - **OJ Bench (C++)**: 48.7

- **General Knowledge**:
  - **MMLU Pro**: 84.6
  - **MMLU Redux**: 94.4
  - **Longform Writing**: 73.8

---

### **Optimized for Long-Horizon Reasoning**

- **Test Time Scaling**:
  - The model dynamically expands reasoning length and tool call depth for complex tasks.
  - **Step Limits**:
    - **HLE**: 120 steps (48K reasoning per step)
    - **Agentic Tasks**: 300 steps (24K reasoning per step)
  - **Heavy Mode**: Runs 8 parallel trajectories to aggregate answers, improving accuracy.

- **Token Budgets**:
  - HLE, AIME25, HMMT25, GPQA: 96K thinking tokens
  - IMO AnswerBench, LiveCodeBench, OJ Bench: 128K thinking tokens
  - Longform Writing: 32K completion tokens

---

### **Deployment and Practical Use**

- **Quantization and Inference**:
  - **INT4 Inference**: Reduces latency and GPU memory usage.
  - **Compressed Tensors**: Checkpoints can be unpacked to FP8/BF16 using official tools.
  - **Recommended Engines**: vLLM, SGLang, KTransformers.

- **Use Cases**:
  - **Agentic Search**: Automating complex web searches and data retrieval.
  - **Code Generation**: Solving coding challenges and debugging.
  - **Long-Form Writing**: Generating detailed technical or creative content.

---

### **Key Takeaways**

- **Open-Source Accessibility**: Kimi K2 Thinking is open weights, enabling researchers and developers to experiment with long-horizon reasoning and tool use.
- **State-of-the-Art Performance**: Outperforms previous models in reasoning, coding, and agentic tasks while maintaining efficiency.
- **Scalability**: Designed for production use with hundreds of sequential tool calls, making it suitable for real-world applications like autonomous systems and enterprise workflows.

---

### **Reference**
[https://www.marktechpost.com/2025/11/06/moonshot-ai-releases-kimi-k2-thinking-an-impressive-thinking-model-that-can-execute-up-to-200-300-sequential-tool-calls-without-human-interference/](https://www.marktechpost.com/2025/11/06/moonshot-ai-releases-kimi-k2-thinking-an-impressive-thinking-model-that-can-execute-up-to-200-300-sequential-tool-calls-without-human-interference/)