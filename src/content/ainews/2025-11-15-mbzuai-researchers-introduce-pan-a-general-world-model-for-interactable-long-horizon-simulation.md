---
title: "MBZUAI Researchers Introduce PAN: A General World Model For Interactable Long Horizon Simulation"
pubDate: 2025-11-15
description: "MBZUAI’s PAN world model achieves 70.3% agent simulation accuracy, enabling interactive long-horizon video generation."
categories: ["AI News", "Generative AI", "Artificial Intelligence"]
---

## PAN: A General World Model For Interactable Long Horizon Simulation

MBZUAI’s PAN model introduces a novel approach to interactive long-horizon simulation, achieving 70.3% accuracy in agent-based action execution. It combines Qwen2.5-VL and Wan2.1 diffusion models to maintain a persistent latent world state across sequential actions.

### Why This Matters
Most video generation models produce isolated clips without tracking evolving world states, limiting their use in dynamic simulations. PAN addresses this by using a Generative Latent Prediction (GLP) architecture, which separates world dynamics from visual rendering. This allows for stable, action-conditioned simulations over extended sequences, a critical step toward practical AI agents. Failure to maintain state consistency in long-rollouts often leads to error accumulation, but PAN’s Causal Swin DPM mechanism reduces drift by 40% compared to naive frame-based approaches.

### Key Insights
- "70.3% agent simulation accuracy, 47% environment simulation accuracy (2025 benchmarks)"
- "Sagas over rigid ACID constraints: PAN uses GLP to model open-domain, action-conditioned dynamics"
- "Temporal stability via Causal Swin DPM, adopted by MBZUAI for long-horizon video generation"

### Practical Applications
- **Use Case**: Robotics simulation with natural language commands (e.g., "grasp the red cube and navigate to the shelf")
- **Pitfall**: Over-reliance on text-conditioned actions may fail in visually ambiguous environments without sensor fusion

**References:**
- https://www.marktechpost.com/2025/11/15/mbzuai-researchers-introduce-pan-a-general-world-model-for-interactable-long-horizon-simulation/
---