---
title: "MMCTAgent enables multimodal reasoning over large video collections"
pubDate: 2025-11-12
description: "Microsoft's MMCTAgent boosts video analysis accuracy by 14% on MM-Vet, using Planner-Critic architecture for iterative reasoning."
categories: ["AI News", "Multimodal AI", "Video Analysis"]
---

## MMCTAgent enables multimodal reasoning over large video collections

Microsoft Research introduces MMCTAgent, a system that improves GPT-4V’s accuracy on MM-Vet from 60.20% to 74.24% by enabling iterative, tool-based reasoning over long-form video and image data.

### Why This Matters
Existing models perform single-pass inference, failing to handle tasks requiring temporal reasoning or cross-modal alignment. MMCTAgent addresses this by integrating Planner–Critic agents with tools like `get_relevant_frames()` and `critic_tool()`, enabling structured reflection and reducing errors in complex visual tasks.

### Key Insights
- "74.24% accuracy improvement on MM-Vet dataset, 2023"  
- "Planner–Critic architecture for iterative reasoning in video analysis"  
- "AutoGen framework used by Microsoft for multimodal agent coordination"

### Working Example
```python
# Example of VideoAgent's get_relevant_frames() tool
def get_relevant_frames(video_id, query):
    # Simulated retrieval of key frames based on query
    return [frame for frame in video_frames[video_id] if query in frame.metadata["keywords"]]
```

### Practical Applications
- **Use Case**: Azure AI Foundry Labs uses MMCTAgent for scalable video analysis in industrial inspection  
- **Pitfall**: Overlooking domain-specific tool integration reduces accuracy gains in specialized applications  

**References:**
- https://www.microsoft.com/en-us/research/blog/mmctagent-enabling-multimodal-reasoning-over-large-video-and-image-collections/
- [1] W. Yu et al., “MM-VET: Evaluating large multimodal models for integrated capabilities”, 2023  
- [2] X. Yue et al., “MMMU: A massive multi-discipline multimodal understanding and reasoning benchmark for expert AGI”, 2023  
- [3] Chaoyou Fu et al., “Video-MME: The first-ever comprehensive evaluation benchmark of multi-modal llms in video analysis”, 2024  
---