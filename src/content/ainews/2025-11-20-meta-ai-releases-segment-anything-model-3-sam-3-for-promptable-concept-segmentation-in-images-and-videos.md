---
title: "Meta AI Releases Segment Anything Model 3 (SAM 3) for Promptable Concept Segmentation in Images and Videos"
pubDate: 2025-11-20
description: "Meta AI’s SAM 3 achieves 75-80% of human performance on the SA-Co benchmark, outperforming existing models in promptable concept segmentation."
categories: ["AI News", "Computer Vision", "AI Paper Summary"]
---

## Meta AI Releases Segment Anything Model 3 (SAM 3) for Promptable Concept Segmentation in Images and Videos

Meta AI has released Segment Anything Model 3 (SAM 3), a new 848M parameter foundation model capable of promptable concept segmentation in both images and videos. Unlike previous models requiring manual pixel-level input, SAM 3 operates directly on visual concepts using text prompts, exemplars, points, or boxes.

### Why This Matters
Traditional image segmentation relies on precise annotations, which are expensive and don’t scale to diverse real-world scenarios. SAM 3 addresses this by enabling segmentation based on *concepts* – like "red baseball cap" – across large datasets. The cost of manual annotation for large-scale video datasets can easily exceed millions of dollars; SAM 3 offers a path toward drastically reducing this expense.

### Key Insights
- **SA-Co Dataset**: Meta introduced the SA-Co dataset with 270K unique concepts, 50x larger than previous benchmarks.
- **Promptable Concept Segmentation (PCS)**: SAM 3 formalizes PCS, combining noun phrases with visual examples for accurate object identification.
- **Presence Token**: A novel component that improves precision by predicting whether a candidate mask corresponds to the requested concept, especially when dealing with similar entities.

### Working Example
```python
# Example usage (conceptual - actual API details would vary)
from segment_anything import sam3

# Load the model
model = sam3.Sam3(checkpoint="path/to/sam3_checkpoint.pth")

# Define a concept prompt
prompt = "yellow school bus"

# Provide an image
image = load_image("school_bus_image.jpg")

# Perform segmentation
masks, scores, logits = model.segment(image, prompt)

# Visualize the results
visualize_masks(image, masks, scores)
```

### Practical Applications
- **Autonomous Vehicles**: Identifying pedestrians, traffic signs, and other objects in real-time using natural language prompts.
- **Pitfall**: Relying solely on text prompts can lead to ambiguity; incorporating exemplar images improves accuracy.

**References:**
- https://www.marktechpost.com/2025/11/20/meta-ai-releases-segment-anything-model-3-sam-3-for-promptable-concept-segmentation-in-images-and-videos/