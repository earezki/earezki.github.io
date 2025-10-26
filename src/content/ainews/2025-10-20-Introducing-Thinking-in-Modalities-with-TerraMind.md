---
title: Introducing Thinking-in-Modalities with TerraMind: A Novel Approach to Foundation Models
pubDate: 2021-02-09
description: IBM Research introduces TerraMind, a foundation model leveraging "Thinking in Modalities" (TiM) to enhance Earth observation analysis by generating missing data representations.
categories: ["AI News", "Earth Observation", "Machine Learning"]
---

## Introduction to TerraMind and Thinking-in-Modalities (TiM)

TerraMind is a new foundation model developed by IBM Research, ESA Φ-lab, and Jülich Supercomputing Centre for Earth observation. It's a dual-scale, any-to-any model capable of learning joint representations across nine different modalities, including satellite imagery (like Sentinel-1 and Sentinel-2), land-cover (LULC), and vegetation indices (NDVI). A key innovation of TerraMind is **Thinking in Modalities (TiM)**, which allows the model to generate missing modalities as intermediate tokens rather than full feature maps. This approach enables the model to overcome data limitations and improve prediction performance.

### Key Features and Capabilities

*   **Dual-Scale Foundation Model:** TerraMind is designed for flexibility and adaptability across various Earth observation tasks.
*   **Nine Modalities:** The model can process and learn from a diverse set of data types, enhancing its understanding of complex environmental relationships.
*   **Thinking in Modalities (TiM):** This core capability allows the model to "imagine" missing data, filling in gaps and improving accuracy.  Instead of generating full feature maps, TiM uses compact tokens to represent these missing aspects.
*   **Outperforms on PANGAEA Benchmark:** TerraMind demonstrates superior performance compared to other existing models on the PANGAEA benchmark, a standard evaluation for Earth observation models.

## How Thinking in Modalities (TiM) Works

During pre-training, TerraMind learns the correlations between different modalities, such as Sentinel-1 and Sentinel-2 imagery, and other data like LULC and NDVI. This allows the model to predict and understand relationships between them.  The TiM process involves:

1.  **Imagination:** The model pauses during fine-tuning or inference and "imagines" a helpful, but absent, layer of data.
2.  **Token Appending:** It appends these imagined representations as tokens to its input sequence.
3.  **Fine-tuning/Inference:** The fine-tuned encoder continues processing the input, incorporating the imagined tokens. This approach avoids the computationally expensive process of full image synthesis.

### Performance Improvements with TiM

*   **Flood Segmentation (Sen1Floods11 dataset):** Adding a synthetic LULC layer using TiM increased the mean Intersection over Union (mIoU) by approximately 2 percentage points (pp).
*   **South Africa Crop-Type Data:** Fine-tuning with generated NDVI/LULC maps raised the mIoU from 41.9% to 42.7%.
*   **Runtime:** TiM increases runtime by approximately 2x due to multiple forward passes and processing tokens twice, but it avoids the need for multiple modalities as raw inputs.
*   **Modality Suitability:** TiM performs best with modalities containing limited information and complementary information.  For example, the benefits of TiM for optical Sentinel-2 data are often limited (<2pp), while Sentinel-1 SAR inputs can gain up to 5pp by generating land-cover or NDVI tokens.

## Practical Implementation with TerraTorch

TerraMind backbones (both standard and TiM-enabled) are accessible through TerraTorch, a fine-tuning toolkit for Earth observation foundation models.

*   **Configuration:** To enable TiM, modify the configuration YAML file.  The change involves adding a statement to the `backbone_tim_modalities` field.
*   **Training Time:** Training with TiM takes approximately twice as long as standard fine-tuning but remains more efficient than detokenizing full-resolution images or using larger models.
*   **Multi-Step TiM:**  The `backbone_tim_modalities` field allows specifying multiple targets for multi-step TiM.
*   **TerraMind.tiny:**  Experiments with TerraMind.tiny showed that it can outperform the standard .base and .large versions in some use cases, despite the added computational cost of TiM.

## Applications Beyond Earth Observation

While initially designed for Earth observation, the TiM methodology is applicable to any multimodal vision model where one modality is missing, expensive, or noisy. Potential applications include:

*   **Nighttime Tracking:** Generating infrared image tokens from RGB-text inputs to improve tracking in low-light conditions.
*   **Robotics and Augmented Reality:** Generating depth or 3D skeleton tokens from 2D inputs to enhance navigation and spatial understanding.
*   **Remote Sensing:** Topography-aware landslide mapping, water mask-guided ship detection, and chained estimations (e.g., NDVI → biomass → yield).

## Further Resources

*   **Hugging Face:** [https://huggingface.co/](https://huggingface.co/)
*   **arXiv:** [https://arxiv.org/](https://arxiv.org/)
*   **TerraTorch Tutorial:** [https://huggingface.co/docs/terratorch/latest/tutorial/fine-tuning](https://huggingface.co/docs/terratorch/latest/tutorial/fine-tuning)
*   **Tiled Inference Notebook:** [https://github.com/huggingface/terratorch/blob/main/notebooks/tiled_inference.ipynb](https://github.com/huggingface/terratorch/blob/main/notebooks/tiled_inference.ipynb)