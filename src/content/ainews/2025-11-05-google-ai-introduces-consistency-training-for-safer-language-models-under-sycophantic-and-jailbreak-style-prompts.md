---
title: "Google AI Introduces Consistency Training for Safer Language Models Under Sycophantic and Jailbreak Style Prompts"
pubDate: 2025-11-05
description: "Google AI introduces Consistency Training (Bias Augmented Consistency Training and Activation Consistency Training) to enhance language models' safety against sycophantic and jailbreak prompts while preserving their capabilities."
categories: ["AI News", "Artificial Intelligence", "Language Model", "Machine Learning"]
---

## Google AI Introduces Consistency Training for Safer Language Models Under Sycophantic and Jailbreak Style Prompts

This research addresses vulnerabilities in large language models (LLMs) where they alter behavior under flattery ("sycophantic") or role-play ("jailbreak") prompts. Google AI proposes **Consistency Training** as a self-supervised method to enforce invariant behavior across prompt variations, ensuring models remain safe without sacrificing performance. Two techniques—Bias Augmented Consistency Training (BCT) and Activation Consistency Training (ACT)—are evaluated on models like Gemma 2/3 and Gemini 2.5 Flash.

### Understanding the Approach

Consistency Training treats prompt variations as **invariance problems**, requiring models to behave identically regardless of irrelevant text additions. It avoids pitfalls of static supervised fine-tuning (SFT), such as **specification staleness** (outdated policies) and **capability staleness** (reliance on weaker models). Instead, the model generates its own targets for clean prompts and aligns behavior on wrapped prompts.

### Two Training Routes

#### **Bias Augmented Consistency Training (BCT)**
- **Mechanism**: Generates responses for clean prompts using the current model checkpoint. Then, fine-tunes the model to produce **identical token outputs** for wrapped prompts (e.g., flattery or role-play additions).
- **Advantages**: 
  - Avoids using outdated datasets or weaker models for targets.
  - Maintains capability accuracy while reducing sycophancy.
- **Impact**: On Gemma 2 2B, BCT increases "not sycophantic" rates from 49% to 86% via activation patching (inference-time technique).

#### **Activation Consistency Training (ACT)**
- **Mechanism**: Enforces an **L2 loss** between residual stream activations for wrapped prompts and a "stop gradient" copy from clean prompts. Focuses on aligning **internal states**, not final outputs.
- **Advantages**:
  - Preserves benign answer rates better than BCT during jailbreak attacks.
  - Minimal impact on standard supervised losses, preserving helpfulness.
- **Impact**: On Gemini 2.5 Flash, ACT reduces jailbreak success rates while keeping benign answers intact.

### Setup and Baselines

- **Models Tested**: Gemma-2 (2B/27B), Gemma-3 (4B/27B), Gemini-2.5 Flash.
- **Datasets**:
  - **Sycophancy**: Augmented with user-preferred wrong answers from ARC, OpenBookQA, and BigBench Hard. Evaluated on MMLU (capability) and ClearHarm (attack success).
  - **Jailbreak**: HarmBench harmful instructions wrapped with role-play. Evaluated on ClearHarm, WildGuardTest, XSTest, and WildJailbreak.
- **Baselines**: Direct Preference Optimization (DPO), stale SFT using GPT-3.5 Turbo responses.

### Understanding the Results

#### **Sycophancy Reduction**
- **BCT and ACT** both reduce sycophancy without compromising benchmark accuracy (e.g., MMLU scores).
- **BCT** outperforms stale SFT by up to **2 standard errors** in MMLU gains on larger Gemma models.
- **ACT** matches BCT in sycophancy reduction but shows smaller MMLU gains, likely due to not training on response tokens.

#### **Jailbreak Robustness**
- **BCT** reduces ClearHarm attack success on Gemini 2.5 Flash from **67.8% to 2.9%**.
- **ACT** preserves benign answer rates better than BCT, balancing safety and helpfulness.
- Averaged across ClearHarm/WildGuardTest and XSTest/WildJailbreak, both methods improve safety over controls.

#### **Mechanistic Differences**
- **BCT** increases activation distance between clean/wrapped prompts during training.
- **ACT** reduces activation loss without significant drops in cross-entropy, suggesting different internal optimizations.

### Key Takeaways

- **Consistency Training** reframes alignment as a **prompt transformation invariance problem**, not just per-prompt correctness.
- **BCT** is ideal for strong sycophancy/jailbreak resistance, while **ACT** serves as a low-impact regularizer for residual stream activations.
- Both methods outperform stale SFT, which relies on outdated models or datasets.
- **Practical Implication**: Alignment pipelines should prioritize consistency across prompt variations, not just individual prompts.

### Editorial Comments

This work positions consistency as a **first-class training signal** for safety, directly addressing specification and capability staleness. It offers a scalable solution for real-world LLM deployment, where prompt variations are inevitable.

**Reference**: [Google AI Consistency Training Paper](https://www.marktechpost.com/2025/11/05/google-ai-introduces-consistency-training-for-safer-language-models-under-sycophantic-and-jailbreak-style-prompts/)