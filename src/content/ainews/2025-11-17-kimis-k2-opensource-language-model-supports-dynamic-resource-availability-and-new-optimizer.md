---
title: "Kimi’s K2 Opensource LLM Achieves 71.3% on SWE-Bench Verified"
pubDate: 2025-11-17
description: "Kimi released K2, a 1.04 trillion parameter Mixture-of-Experts model, achieving 71.3% on the SWE-Bench Verified benchmark."
categories: ["AI News", "Large Concept Models", "Generative AI"]
---

## Kimi’s K2 Opensource Language Model Supports Dynamic Resource Availability and New Optimizer

Kimi released K2, a Mixture-of-Experts (MoE) large language model with 1.04 trillion total parameters and 32 billion activated parameters, trained on 15.5 trillion tokens. The release includes MuonClip, a new optimizer that reportedly eliminates loss spikes during pre-training.

### Why This Matters
Traditional LLM training faces significant instability issues, requiring extensive manual tuning and often resulting in failed training runs—estimated to cost millions in compute resources. Kimi’s MuonClip optimizer aims to address these instabilities, enabling more reliable and scalable training of extremely large models like K2, pushing the boundaries of open-source LLM capabilities.

### Key Insights
- **K2 Performance**: Achieved 44.9% on Humanity's Last Exam (HLE) with tools, 60.2% on BrowseComp, and 71.3% on SWE-Bench Verified.
- **MuonClip Optimizer**: Builds on the Muon optimizer with a QK-clip technique to stabilize training.
- **Dynamic Resource Availability**: Kimi designed a parallelism strategy allowing training on any number of nodes as a multiple of 32, accommodating fluctuating compute resources.

### Working Example
```python
# Example of INT4 Quantization Aware Training (QAT)
# (Conceptual - actual implementation details are complex)
import torch

# Load pre-trained model
model = ...

# Enable QAT
model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
torch.quantization.prepare(model, inplace=True)

# Perform training with QAT
# ... training loop ...

# Convert to quantized model
torch.quantization.convert(model, inplace=True)

# Deploy quantized model for inference
# ... inference code ...
```

### Practical Applications
- **Use Case**: Kimi utilizes K2 for agentic tasks, enabling 200-300 sequential tool calls with long-horizon planning.
- **Pitfall**: Quantization, while improving inference speed, can degrade performance on long-output models; Kimi addressed this with Quantization-Aware Training (QAT).

**References:**
- https://www.infoq.com/news/2025/11/kimi-k2-open-source-moe-ai/
- https://kimi.com/