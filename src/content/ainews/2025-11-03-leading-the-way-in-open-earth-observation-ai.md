---
title: "Leading the Way in Open Earth Observation AI"
pubDate: 2021-02-09
description: "IBM Research, in collaboration with NASA and ESA, is advancing Earth observation AI through open-source models, compression techniques, and real-world applications, setting new standards for geospatial intelligence."
categories: ["AI News", "Earth Observation", "AI Models", "Open Source"]
---

## Leading the Way in Open Earth Observation AI

IBM Research, in partnership with NASA, the European Space Agency (ESA), and other institutions, is pioneering advancements in Earth observation (EO) AI. By leveraging foundational models, neural compression, and open-source collaboration, the team addresses critical challenges in agriculture, environmental monitoring, and disaster response, while democratizing access to geospatial intelligence.

---

## Building Models That Push the State of the Art

### Key Innovations in EO AI
- **Prithvi-EO (2023)**: First large-scale vision transformer (ViT) for multi-temporal EO data, later upgraded to **Prithvi-EO-2.0** with enhanced metadata understanding and temporal capabilities.
- **Prithvi-WxC (2023)**: A foundation model for weather and climate data, supporting forecasting and zero-lead-time inference.
- **TerraMind (2025)**: Developed with ESA and Jülich Supercomputing Centre, introduces:
  - Multi-modal correlation learning and generative capabilities.
  - "Thinking in Modalities" algorithm for self-improvement via self-generated data.
  - **10,000+ weekly downloads** on Hugging Face, leading **PANGAEA** and **GEO-Bench-2** benchmarks.
- **Surya (2025)**: First foundation model for solar physics, addressing impacts of solar activity on Earth’s infrastructure, paired with **SuryaBench** for heliophysics ML.

### Neural Compression for EO Data
- **TerraCodec**: Achieves **10× more efficient compression** than JPEG 2000/HEVC at equal quality, trained on Sentinel-2 data. Includes lightweight multispectral models (1M–10M parameters) and seasonal temporal transformers.

---

## Commitment to Openness and Scientific Rigor

### Open-Source Infrastructure
- **TerraMesh**: Largest AI-ready, multi-modal open EO dataset, used to train TerraMind and featured at CVPR.
- **Permissive Licenses**: All models, code, and datasets released under **Apache 2.0**, contrasting with proprietary models like Google’s AlphaEarth.

### Performance Benchmarks
- **GEO-Bench-2**: Evaluates models across 19 geospatial datasets. TerraMind outperforms general-purpose CV models (e.g., Meta’s DinoV3) in EO-specific tasks like agriculture and disaster response.
- **Ablation Study**: Using only RGB data instead of multispectral bands caused up to **25% performance drops** in tasks like crop segmentation and burn scar detection.

---

## Building an Ecosystem for Impact

### Tools and Frameworks
- **TerraTorch**: First fine-tuning and deployment library for EO foundation models, widely used for customizing open-source models.
- **vLLM Expansion**: Supports non-text inputs/outputs for high-performance inference, with **Prithvi-EO-2.0** as the first non-text model onboarded.
- **Benchmarks**:
  - **GEO-Bench-2**: Evaluates model capabilities beyond performance metrics.
  - **NeuCo-bench**: Focuses on compressed and small embeddings for EO tasks.

### Community Engagement
- All models and datasets hosted on **Hugging Face** for benchmarking and collaboration.
- Tutorials, workshops, and seminars at major events to foster community growth.

---

## Real-World Applications Across the Globe

### Case Studies
- **Flood Detection**: Prithvi-EO adapted for UK/Ireland and used in **Kenya’s 2024 flooding disaster**.
- **Reforestation**: Supports Kenya’s national reforestation efforts under President William Ruto’s climate initiatives.
- **Heat Islands**: Analyzed land-surface temperature data in South Africa to study urban heat islands.
- **Marine Ecosystems**: **Granite-Geospatial-Ocean** model, developed with Plymouth Marine Lab, monitors marine health and carbon uptake.

### Ongoing Challenges
- **TerraMind Blue-Sky Challenge** (with ESA’s Φ-Lab): Encourages novel EO applications, with proposals for flood prediction, ship detection, and ecosystem degradation monitoring.

---

## Setting the Standard for Earth Observation AI

IBM Research combines **cutting-edge research** with **practical usability**, ensuring models operate on edge devices (e.g., satellites, smartphones) while maintaining high performance. Key achievements include:
- **Edge Deployment**: "Small" and "tiny" versions of TerraMind/Prithvi-EO-2.0 for resource-constrained environments.
- **Scientific Collaboration**: Co-development with domain experts from NASA, ESA, and academia ensures rigorous validation and alignment with scientific needs.

By prioritizing **openness, transparency, and collaboration**, IBM is lowering barriers to entry for industries, scientists, and communities, enabling critical decisions in disaster response, urban planning, and climate action.

---

## Reference
[IBM Research Blog: Leading the way in open Earth observation AI](https://research.ibm.com/blog/earth-observation-leadership?utm_medium=rss&utm_source=rss)