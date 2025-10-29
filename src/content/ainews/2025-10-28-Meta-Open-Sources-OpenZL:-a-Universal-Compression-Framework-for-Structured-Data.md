---
title: "Meta Open Sources OpenZL: A Structured Data Compression Framework"
pubDate: "2025-10-28"
description: "Meta has released OpenZL, an open-source compression framework designed for highly structured data. It leverages schema modeling for superior compression ratios and speeds compared to general-purpose tools like Zstandard, while maintaining operational simplicity through a universal decompressor."
categories: ["AI News", "Data Storage", "Data Management", "Architecture"]
---

## OpenZL: A Novel Approach to Data Compression

Meta has recently open-sourced OpenZL, a new data compression framework specifically engineered for highly structured datasets. This framework represents a significant advancement over traditional compression methods like Zstandard (Zstd) by explicitly leveraging data schemas to achieve higher compression ratios and faster speeds. OpenZL's design prioritizes operational simplicity through a universal decompressor, eliminating the need for external metadata and enabling streamlined deployment across data infrastructures.

### Background and Motivation

Traditional data compression techniques often treat data as a sequence of byte streams, failing to capitalize on the inherent structure present in modern datasets. This limitation is particularly evident when dealing with structured formats like Protocol Buffers, database tables, and machine learning tensors.  Meta's earlier work with Zstd, while successful, revealed untapped potential for improvement when addressing these structured workloads. OpenZL directly addresses this by modeling data structures, such as columnar layouts, enumerations, and repetitive patterns, rather than treating data as undifferentiated.

### How OpenZL Works

OpenZL's core innovation lies in its structured compression approach.  Instead of applying generic compression algorithms, OpenZL analyzes the data schema and applies a configurable sequence of reversible transforms to expose latent order within the data before employing an entropy-coding stage. This process allows for a more efficient compression of structured data.

**Key Components:**

*   **Trainer:** This component analyzes the data schema and generates an optimized Compression Plan offline.
*   **Compression Plan:**  A sequence of reversible transforms tailored to the specific data structure.
*   **Universal Decompressor:** A single binary that can decompress any OpenZL file, regardless of the specific transformation sequence used.  The decompression recipe is embedded within the compressed frame.
*   **Simple Data Description Language (SDDL):**  A language used to describe the data structure to the trainer.

### Operational Advantages

OpenZL offers significant operational advantages, particularly for data center deployments:

*   **Single Decompression Surface:**  The universal decompressor simplifies infrastructure management by reducing the number of decompression binaries required.
*   **Fleet-Wide Updates:**  Updates to compression plans can be deployed across the entire infrastructure from a single binary, ensuring backward compatibility.
*   **Clear Version Control:**  The deterministic nature of OpenZL simplifies version control across large data infrastructures.

### Performance Benchmarks

Internal benchmarks on structured datasets, specifically using the Silesia Compression Corpus’s "sao star" records, demonstrated substantial gains:

| Compressor | Compressed Size | Compression Ratio | Compression Speed | Decompression Speed |
|---|---|---|---|---|
| zstd -3 | 5,531,935 B | × 1.31 | 220 MB/s | 850 MB/s |
| xz -9 | 3,516,649 B | × 2.06 | 3.5 MB/s | 45 MB/s |
| OpenZL | 4,414,351 B | × 1.64 | 340 MB/s | 1200 MB/s |

These results show that OpenZL achieves a better compression ratio while maintaining or improving both compression and decompression speeds compared to zstd -3.

### Deterministic Decompression

A crucial aspect of OpenZL is its deterministic decompression. Unlike some experimental formats that rely on WebAssembly for decompression, OpenZL's approach limits execution to a deterministic graph. This guarantees reproducible decoding, which is essential for long-term data archival. This deterministic behavior contrasts with WebAssembly, where function calls can potentially be non-deterministic.

### Data Suitability

OpenZL performs best on structured data such as time-series datasets, ML tensors, and database tables. For data with minimal structure (e.g., pure text), OpenZL intelligently falls back to using Zstd.  Abelardo Fukasawa of Quantls Infinity noted that OpenZL adapts its compression to the specific structure of the data using SDDL, often yielding better ratios and throughput on structured workloads compared to general-purpose compressors like gzip.

### Availability

OpenZL is publicly available on GitHub, allowing developers to experiment with the framework and contribute to its development.

**Reference:** [https://www.infoq.com/news/2025/10/openzl-structured-compression/](https://www.infoq.com/news/2025/10/openzl-structured-compression/)