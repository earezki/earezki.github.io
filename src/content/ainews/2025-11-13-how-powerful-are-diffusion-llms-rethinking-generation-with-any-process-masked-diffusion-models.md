---
title: "AP-MDM: Diffusion LLMs Reach PSPACE with Edit Operations"
pubDate: 2025-11-13
description: "AP-MDM achieves 99.28% Sudoku accuracy with 100 training instances, outperforming autoregressive models."
categories: ["AI News", "Machine Learning", "AI Research"]
---

## How Powerful are Diffusion LLMs? Rethinking Generation with Any-Process Masked Diffusion Models

A new study from Toyota and MIT reveals that Any-Process Masked Diffusion Models (AP-MDM) can simulate PRAM algorithms with optimal parallel time and space, achieving PSPACE-level expressivity. The research demonstrates AP-MDM’s ability to solve NP-complete tasks like Sudoku with far fewer parameters than autoregressive models.

### Why This Matters
Masked Diffusion Models (MDM) and Autoregressive Models (ARM) share equivalent expressivity but differ in parallel efficiency. MDMs can match ideal parallel time for NC problems (e.g., graph connectivity) but remain limited to P-class problems under polynomial context. AP-MDM overcomes this by introducing **remask**, **insert**, and **delete** operations, enabling PSPACE-level computation and solving NP-hard tasks like generalized Sudoku with 99.28% accuracy using only 1.2M parameters and 100 training instances.

### Key Insights
- "AP-MDM achieves 99.28% Sudoku accuracy with 100 training instances, 2025 study"
- "Any-Process Generation enables PSPACE expressivity via remask/insert/delete, 2025 paper"
- "Structured edits in AP-MDM align with coding/math workflows, outperforming autoregressive models"

### Practical Applications
- **Use Case**: Sudoku solving with AP-MDM achieving 99.28% accuracy on generalized grids.
- **Pitfall**: Overlooking edit operations limits models to P-class problems, hindering NP-hard task performance.

**References:**
- https://www.marktechpost.com/2025/11/13/how-powerful-are-diffusion-llms-rethinking-generation-with-any-process-masked-diffusion-models/
---