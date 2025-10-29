---
title: "Hugging Face Enhances Dataset Streaming for 100x Efficiency"
pubDate: "2025-10-28"
description: "Hugging Face has significantly improved dataset streaming capabilities, enabling faster and more efficient training on large datasets. Key improvements include reduced API requests, faster data resolution, and optimized prefetching for Parquet files."
categories: ["AI News", "Data Science", "Machine Learning"]
---

## Streaming datasets: 100x More Efficient

This article details significant improvements made by Hugging Face to their `datasets` library, dramatically enhancing the efficiency of streaming datasets. These enhancements allow users to train on massive datasets – even those exceeding terabytes – without the traditional bottlenecks associated with downloading and local storage. The key improvements result in a 100x reduction in startup requests, 10x faster data resolution, and up to 2x faster streaming speed, ultimately leading to faster and more efficient machine learning workflows.

### Main Improvements & Impact

Hugging Face has focused on optimizing both the startup phase and the streaming process of datasets. The core goal was to address the issue of excessive API requests during dataset initialization, which could lead to IP blocking and slow down training.

**1. Startup Optimization:**

*   **Persistent Data Files Cache:** The library now caches the list of data files across all DataLoader workers. This means that only the first worker resolves the file list from the Hugging Face Hub, and subsequent workers read from the local cache, significantly reducing startup requests.
    *   **Impact:** Virtually eliminates startup requests and drastically reduces resolution time.
*   **Optimized Resolution Logic:** The code has been refined to bundle API requests more efficiently, minimizing latency during the initial file list retrieval.
    *   **Impact:** Further reduces the number of API calls required for dataset initialization.

**2. Streaming Optimization:**

*   **Prefetching for Parquet:**  The library now prefetches data chunks in the background while the model is processing the current chunk. This ensures the data pipeline remains full and prevents the GPU from being idle.
    *   **Impact:**  Increases data throughput and reduces waiting time for data.
*   **Configurable Buffering:** Advanced users can now fine-tune streaming performance by configuring the buffer's block size and prefetch volume.
    *   **Impact:** Provides greater control over I/O operations for optimized performance based on specific hardware and network configurations.

### Performance Gains

The improvements have yielded substantial performance gains:

*   **Data files resolution time:** 10x faster
*   **Startup requests:** Up to 100x more efficient
*   **Streaming speed:** Up to 2x faster
*   **In-flight requests:** Up to 2x more efficient

These improvements allow Hugging Face to achieve streaming performance comparable to reading data from local SSDs, eliminating the three-hour delays previously encountered when training on large datasets.

### Xet and Deduplication

Hugging Face leverages Xet, a deduplication-based storage system, to accelerate data transfers. Xet ensures that duplicated data is transferred only once, significantly speeding up uploads and downloads. Parquet Content Defined Chunking (CDC) enables efficient deduplication for Parquet files.

### Custom Streaming Pipelines

For scenarios where standard streaming capabilities are insufficient, Hugging Face provides tools for building custom streaming pipelines. This is achieved through improvements to the `HfFileSystem` in the `huggingface_hub` library, enabling efficient file reading and streaming from remote repositories.

### Getting Started

To take advantage of these enhancements, users need to upgrade their `datasets` and `huggingface_hub` libraries:

```
pip install --upgrade datasets huggingface_hub
```

A combined dataset, `FineVisionMax`, has been created to showcase the new capabilities. Users can load and stream this dataset using the standard `load_dataset` function.

### References

*   **Blog Post:** [https://huggingface.co/blog/streaming-datasets](https://huggingface.co/blog/streaming-datasets)