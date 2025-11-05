---
title: "Apple Releases Pico-Banana-400K Dataset for Text-Guided Image Editing"
pubDate: 2025-11-03
description: "Apple introduces Pico-Banana-400K, a dataset of 400,000 images for advancing text-guided image editing models, generated using Google's Nano-Banana and filtered with Gemini-2.5-Pro."
categories: ["AI News", "AI", "ML & Data Engineering", "Apple", "Large language models"]
---

## Apple Releases Pico-Banana-400K Dataset for Text-Guided Image Editing

Apple researchers have introduced **Pico-Banana-400K**, a large-scale dataset of 400,000 images designed to facilitate the development of text-guided image editing models. This dataset addresses a critical gap in the availability of high-quality, shareable image editing data by combining real-world photographs with systematic editing processes and rigorous quality filtering. The dataset is publicly accessible under a Creative Commons license, aiming to democratize research in this domain.

---

### **Dataset Overview**

- **Size**: 400,000 images, with 257,000 generated via single-turn prompts and 56,000 retained as failure cases.
- **Purpose**: Enable training of text-guided image editing models by providing diverse, high-quality, and curated examples.
- **Key Differentiators**:
  - Systematic quality control via MLLM-based scoring (Gemini-2.5-Pro).
  - Focus on **instruction faithfulness** (alignment between text prompts and visual edits).
  - Coverage of **35 edit types** across eight categories, including object-level semantics and stylistic transformations.

---

### **Creation Process**

1. **Source Data**:
   - Real photographs from the **Open Images collection** (licensed under CC BY 2.0).
   - Images include humans, objects, and textual scenes.

2. **Editing Pipeline**:
   - **Nano-Banana** (Google's model) was used to apply text-guided edits to the source images.
   - **Gemini-2.5-Pro** filtered results based on four criteria:
     - **Instruction compliance** (40% weight): Ensures edits match the prompt.
     - **Editing realism** (25%): Measures how natural the edits appear.
     - **Preservation balance** (20%): Maintains original content integrity.
     - **Technical quality** (15%): Evaluates resolution, artifacts, and other technical aspects.

3. **Prompt Generation**:
   - **Gemini-2.5-Flash** generated initial prompts, which were then condensed into human-like instructions using **Qwen2.5-7B-Instruct**.

---

### **Specialized Subsets**

The dataset includes three subsets tailored for specific research goals:

- **Multi-Turn Instructions (72K examples)**:
  - Designed for sequential editing tasks, enabling research into reasoning and planning across multiple edits.
- **Failed Edits (56K examples)**:
  - Retained for robustness training and reward model development.
- **Instruction Rewriting Subset**:
  - Pairs long and short prompts to aid in instruction summarization and rewriting capabilities.

---

### **Licensing and Accessibility**

- **Pico-Banana-400K**: Available on Apple's CDN via GitHub under **CC BY-NC-ND 4.0** (non-commercial, no derivatives).
- **Open Images Originals**: Licensed under **CC BY 2.0** for research and commercial use.

---

### **Impact and Use Cases**

- **Research Advancement**: Addresses limitations of existing datasets (e.g., small size or proprietary synthetic data).
- **Model Training**: Supports alignment research, reward modeling, and instruction-following capabilities in AI systems.
- **Practical Applications**: Potential use in tools for photo editing, content creation, and AI-assisted design workflows.

---

### **Reference**
https://www.infoq.com/news/2025/11/apple-pico-banana-image-editing/