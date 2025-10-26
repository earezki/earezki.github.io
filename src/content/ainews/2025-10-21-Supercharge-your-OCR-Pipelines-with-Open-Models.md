## Supercharge your OCR Pipelines with Open Models

---
title: "Supercharge your OCR Pipelines with Open Models"
pubDate: 2025-10-23
description: "We’re on a journey to advance and democratize artificial intelligence through open source and open science."
categories: ["AI News", "Document AI"]
---

## Summary

This article from Hugging Face discusses the advancements in Optical Character Recognition (OCR) powered by Vision-Language Models (VLMs). It explores the landscape of open-source OCR models, their capabilities, evaluation metrics, and deployment options. The article also covers tools for running these models and discusses how to go beyond basic OCR to leverage them for document understanding tasks like multimodal retrieval and question answering.

## Detailed Explanation

### Introduction

The article highlights the evolution of OCR, driven by the rise of VLMs.  Traditional OCR focused on converting printed text to digital format, but now, VLMs enable more sophisticated tasks like understanding document layout, handling complex elements (tables, charts, images), and answering questions about documents.  Open-weight models are gaining traction due to their cost-efficiency and privacy benefits.

### Model Capabilities

Modern OCR models go beyond simple text extraction. They can:

*   **Transcription:** Convert handwritten text, various scripts (Latin, Arabic, Japanese), mathematical expressions, and chemical formulas into machine-readable text (HTML, Markdown, etc.).
*   **Handling Complex Components:**  Recognize and extract images, charts, and tables, understanding their placement and relationships within the document. Some models can generate captions for images and insert them appropriately.
*   **Output Formats:** Different models support different output formats:
    *   **DocTag:** XML-like format for location, text, and component information.
    *   **HTML:**  Popular for preserving document structure.
    *   **Markdown:** Human-readable, simpler format.
    *   **JSON:** Suitable for programmatic use and representing data in tables or charts.

The choice of output format depends on the intended use case:

*   **Digital Reconstruction:** DocTags or HTML for preserving layout.
*   **LLM Input/Question Answering:** Markdown and image captions for natural language processing.
*   **Programmatic Use:** JSON for structured data extraction.

**Locality Awareness:** Modern OCR models incorporate layout metadata ("anchor") to maintain reading order and improve accuracy, addressing the limitations of older methods.

**Model Prompting:**  Models can either be prompted for specific tasks or be pre-trained for OCR.  The article notes that while models like Qwen3-VL are versatile, they may not be optimized for OCR as effectively as fine-tuned models.

### Cutting-edge Open OCR Models

The article provides a comparison of several open-source OCR models, including:

*   **Nanonets-OCR2-3B:** Supports Markdown with semantic tagging, HTML tables, and handwriting.
*   **PaddleOCR-VL:** Supports Markdown, JSON, and HTML, handles handwriting and converts tables/charts to HTML.
*   **dots.ocr:** Supports Markdown and JSON, handles handwriting.
*   **OlmOCR-2:** Supports Markdown, HTML, and LaTeX, optimized for large-scale batch processing.
*   **Granite-Docling-258M:** Supports DocTags, prompt-based task switching, and handles various languages.
*   **DeepSeek-OCR:** Supports Markdown and HTML, handles handwriting, and is memory-efficient.
*   **Chandra:** Supports Markdown, HTML, and JSON, optimized for large-scale batch processing.
*   **Qwen3-VL:** Supports all formats, handles handwriting, and extracts images as is, but not optimized for OCR.

The table includes information on model size, multilingual support, and average scores on the OlmOCR benchmark.

### Evaluating Models

Evaluating OCR models is challenging due to the lack of standardized benchmarks. The article recommends:

*   **OmniDocBenchmark:**  Evaluates models on diverse document types (books, magazines, textbooks) with detailed evaluation criteria.
*   **OlmOCR-Bench:**  Focuses on unit tests and provides a more practical evaluation of OCR capabilities.
*   **CC-OCR:**  A multilingual benchmark, but with lower quality data.

The article emphasizes that performance varies depending on the model and the specific domain.  It suggests creating custom datasets and testing multiple models to determine the best fit.

### Tools to Run Models

The article outlines several ways to deploy and utilize these models:

*   **Locally:** Using libraries like `vllm` and `transformers`.  Provides code examples for running models locally.
*   **Remotely:** Using Hugging Face Inference Endpoints for managed deployment and utilizing Hugging Face Jobs for batch inference.
*   **Beyond OCR:**  Discusses using OCR for:
    *   **Document Retrieval:** Retrieving relevant documents based on queries.
    *   **Question Answering:** Answering questions based on document content.

### Conclusion

The article concludes by emphasizing the rapid progress in open-source OCR and the availability of tools to get started. It encourages readers to explore these models and tools for document understanding tasks.

## References

[https://huggingface.co/blog/ocr-open-models](https://huggingface.co/blog/ocr-open-models)