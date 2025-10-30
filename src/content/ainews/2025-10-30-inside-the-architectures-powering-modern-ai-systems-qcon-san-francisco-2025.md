---
title: "Inside the Architectures Powering Modern AI Systems: QCon San Francisco 2025"
pubDate: 2025-10-30
description: "QCon San Francisco 2025 focuses on real-world AI architecture challenges, featuring insights from Netflix, Meta, Intuit, and Anthropic on building scalable, reliable AI systems and infrastructure."
categories: ["AI News", "AI Architecture", "Platform Engineering", "Generative AI", "Scalability"]
---

## Main Heading

QCon San Francisco 2025 (November 17–21, 2025) addresses the critical need for validated AI infrastructure patterns as organizations scale AI adoption. The conference emphasizes practical implementation over theoretical discussions, offering lessons from industry leaders on building reliable AI systems, agentic architectures, and scalable platforms. Early bird registration closes on November 11, 2025.

### AI Infrastructure at Scale

**Key Themes and Technical Details:**
- **Production-Grade GenAI Stacks**:  
  - Intuit’s session details their **100M-user RAG pipeline**, including vector stores, prompt management, and scalable retrieval-augmented generation (RAG) architectures.  
  - Metrics: Designed for high-throughput, low-latency retrieval at massive scale.  
- **Agentic System Design**:  
  - Anthropic’s Adam Wolff discusses **agentically accelerated software projects**, prioritizing speed over complexity in agentic architectures.  
  - Focus: Tradeoffs in state management, task orchestration, and computational efficiency.  
- **Post-Training LLM Optimization**:  
  - Pinterest and Google’s experts cover techniques like **fine-tuning, quantization, and prompt engineering** to ensure LLMs perform reliably in production.  
  - Example: Reducing inference latency by 30–40% through model compression.  

### Scaling AI Organizations

**Strategies for Organizational Growth:**
- **Zoox’s AI Scaling Blueprint**:  
  - Amit Navindgi presents **design patterns** for scaling AI teams, emphasizing developer productivity and modular architecture.  
  - Tools: Internal AI platforms with reusable components and standardized evaluation frameworks.  
- **LLM Ranking Improvements**:  
  - LinkedIn’s Nishant Lakshmikanth shares a **multi-year migration** from batch to real-time systems, achieving **90%+ reduction in offline compute costs** and **50% engagement boost** for 1B users.  
  - Techniques: Embedding-Based Retrieval, LLM-powered ranking, and decoupling candidate generation from scoring.  

### AI Platforms for Reliability

**Balancing Determinism and Exploration:**
- **NVIDIA’s DGX Cloud Applied AI Lab**:  
  - Aaron Erickson explores **hybrid AI platforms** combining deterministic tools (e.g., rule-based systems) with exploratory agents for robust decision-making.  
  - Use Case: Autonomous systems requiring fail-safe mechanisms.  
- **Meta’s Reinforcement Learning for Ad Text**:  
  - Alex Nikulkov details **RL-driven ad generation**, improving click-through rates by 25% while reducing manual tuning efforts.  

### Platform Engineering & CI/CD

**Managing Polyglot Monorepos:**
- **Uber’s MergeQueue System**:  
  - Dhruva Juloori explains **CI scheduling** for handling 100+ changes/hour across Java, Kotlin, Swift, and Python.  
  - Metrics: Reduced CI failures by 40% through dynamic prioritization.  
- **Netflix’s Fleet Automation**:  
  - Casey Bleifer outlines **automated updates** for secure, large-scale deployments across diverse environments.  

### Security in AI-Accelerated Development

**Mitigating Risks in AI Pipelines:**
- **AWS Agentic AI Threat Modeling**:  
  - Sriram Madapusi Vasudevan covers **prompt injection detection**, data sanitization, and AI-generated code validation.  
  - Tools: Static analysis for AI outputs and runtime monitoring for adversarial inputs.  

## Beyond AI: Architecture & Security

**Long-Term Infrastructure Design:**
- **American Express’s Resilient Platforms**:  
  - Matthew Liste shares **20+ years of infrastructure lessons**, balancing currency with client needs and maintaining security in mission-critical systems.  

**Data Deletion at Scale:**
- **Netflix’s Centralized Data Deletion Platform**:  
  - Vidhya Arvind and Shawn Liu detail **orchestration, observability, and journaling** for managing 100s of TBs of data under live traffic.  
  - Tradeoffs: Prioritizing safety over throughput in high-availability scenarios.  

## Recommendations

- **When to Use**: Focus on production-grade AI infrastructure when scaling beyond 1M users or handling mission-critical workloads.  
- **Best Practices**:  
  - Prioritize modular, observable architectures for agentic systems.  
  - Validate AI outputs with static and dynamic checks to prevent security risks.  
- **Pitfalls to Avoid**:  
  - Overlooking CI/CD complexity in polyglot environments.  
  - Neglecting post-training optimization for LLMs, leading to poor inference performance.  

For more details, visit the [QCon SF 2025 schedule](https://www.infoq.com/news/2025/10/qcon-sf-2025-sessions/).