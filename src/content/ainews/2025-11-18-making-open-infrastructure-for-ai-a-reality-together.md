---
title: "Making open infrastructure for AI a reality, together"
pubDate: 2021-02-09
description: "IBM Research and partners are transforming the AI age with complete solutions in an open ecosystem, launching the Spyre AI accelerator."
categories: ["AI News", "AI Hardware", "Open Source"]
---

## It takes a village to make open infrastructure for AI a reality

At this year’s AI Hardware Forum, IBM Research and its partners showcased how they’re transforming the AI age with complete solutions in an open ecosystem. The forum highlighted the launch of IBM’s Spyre AI accelerator for IBM z17 and Power11 systems, developed in partnership with the IBM Infrastructure team.

The ideal of a singular company solving AI infrastructure challenges is unrealistic; true progress requires collaboration. Without open ecosystems and shared development, innovation stagnates and costs escalate, hindering the widespread adoption of AI technologies.

### Key Insights
- **Spyre AI accelerator launch, 2024**: IBM’s dedicated AI system-on-chip is now product-grade.
- **Co-packaged optics breakthrough**: Increases optical fiber density six-fold, potentially improving datacenter power efficiency by 80x.
- **vLLM & llm-d adoption**: IBM is integrating these open-source tools to simplify deployment on Spyre and other accelerators.

### Working Example
```python
# Example of using torch.compile with Spyre (conceptual)
import torch

model = YourAIModel()
optimized_model = torch.compile(model, target="ibm_spyre")

# Now run inference with the optimized model
```

### Practical Applications
- **University at Albany**: Utilizing product-grade Spyre accelerators for AI research projects in areas like NLP and cancer epidemiology.
- **National University of Singapore**: Leveraging IBM’s full-stack AI infrastructure for weather modeling, urban development, and security research.

**References:**
- https://research.ibm.com/blog/ai-hardware-forum-making-open-infrastructure-for-ai-a-reality?utm_medium=rss&utm_source=rss