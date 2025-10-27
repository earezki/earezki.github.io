---
title: "Hugging Face Enhances Dataset Streaming for 100x Efficiency"
pubDate: 2025-07-25
description: "Hugging Face has significantly improved dataset streaming capabilities in their 'datasets' and 'huggingface_hub' libraries, enabling faster and more efficient training on large datasets. Key improvements include reduced API requests, faster data resolution, and enhanced control over streaming pipelines."
categories: ["AI News", "Data Science", "Machine Learning"]
---

## Streaming datasets: 100x More Efficient

This article details significant performance improvements to Hugging Face's `datasets` library, specifically focusing on enhancing the efficiency of streaming datasets. These updates allow users to train on massive datasets without the traditional bottlenecks of downloading and local storage, resulting in substantial speed gains and reduced resource consumption.

### Summary

Hugging Face has made substantial improvements to dataset streaming, achieving up to 100x more efficient data resolution, 10x faster data file resolution, 2x faster streaming speed, and 2x more efficient in-flight requests. These enhancements are achieved through optimizations in both startup and streaming phases, significantly reducing the time and resources required to work with large datasets.

### Key Improvements and Details

#### 1. The Challenge: Scaling Streaming
Previously, streaming large datasets led to a high volume of redundant API requests, particularly during startup. This was due to each DataLoader worker independently resolving the dataset file list.  Hugging Face addressed this issue to enable efficient training on multi-terabyte datasets.

#### 2. Startup Optimizations
The team implemented two key changes to optimize the startup phase:
- **Persistent Data Files Cache:** A local cache of data file lists is now shared across all DataLoader workers, eliminating redundant API calls and dramatically reducing resolution time.
- **Optimized Resolution Logic:**  API requests for fetching the file list have been bundled and optimized to minimize latency.

#### 3. Streaming Enhancements
To improve throughput during streaming, the following features were introduced:
- **Prefetching for Parquet:**  The library now pre-fetches the next chunk of data while the current chunk is being processed, ensuring the GPU is continuously supplied with data.
- **Configurable Buffering:** Advanced users can now fine-tune streaming performance by configuring the buffer's block size and prefetch volume using `pyarrow.dataset.ParquetFragmentScanOptions`.

#### 4. Performance Gains
The combined effect of these improvements yields significant performance gains:
- **Data file resolution time:** 10x faster
- **Startup requests:** Up to 100x more efficient
- **Streaming speed:** Up to 2x faster
- **In-flight requests:** Up to 2x more efficient

#### 5.  Xet Integration for Faster Uploads and Downloads
Hugging Face leverages Xet, a deduplication-based storage system, to accelerate data transfers.  Duplicated data is transferred only once, leading to faster uploads and downloads. Parquet Content Defined Chunking (CDC) enables deduplication for Parquet files. The `pyspark_huggingface` package facilitates these faster transfers.

#### 6. Custom Streaming Pipelines
For scenarios requiring more control over the streaming process, Hugging Face has improved the `HfFileSystem` in the `huggingface_hub` library. This allows users to efficiently read and stream data from remote repositories using `HfFileSystem`.  The `HfFileSystem` also eliminates unnecessary requests when listing data files.

#### 7. Real-World Impact
These enhancements have been successfully implemented in nanoVLM, enabling faster training than using local SSDs.  Previously, data transfer to local SSDs caused a 3-hour delay.  Streaming now matches the performance of local SSDs.

### Getting Started

To take advantage of these improvements, update your libraries:

```
pip install --upgrade datasets huggingface_hub
```

A combined dataset, `FineVisionMax`, has been pre-concatenated and shuffled for easy training.

### References

*   [https://huggingface.co/blog/streaming-datasets](https://huggingface.co/blog/streaming-datasets)