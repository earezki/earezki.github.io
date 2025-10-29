---
title: "BASF Digital Farming Leverages STAC and EKS for Scalable Geospatial Data Platform on AWS"
pubDate: "2025-10-22"
description: "BASF Digital Farming details their architecture for a scalable geospatial data platform built on Amazon EKS, STAC, and other AWS services, achieving significant improvements in data processing and cost efficiency."
categories: ["AI News", "Agriculture"]
---

## BASF Digital Farming Builds a STAC-Based Solution on Amazon EKS

This article details how BASF Digital Farming, through its xarvio platform, built a scalable geospatial data solution on Amazon Web Services (AWS) leveraging the SpatioTemporal Asset Catalog (STAC) specification and the open-source eoAPI ecosystem. The platform efficiently catalogs, manages, and visualizes vast amounts of geospatial data, including satellite imagery, drone data, and application maps.

### Executive Summary

BASF Digital Farming's xarvio platform processes hundreds of millions of satellite images daily, translating into billions of geospatial artifacts. To manage this growing archive, they adopted the STAC standard and built a solution on Amazon EKS, Amazon S3, and Amazon RDS. This architecture enables rapid onboarding of new data sources, supports advanced analytics like biomass estimation, and has resulted in a 50% cost reduction while processing twice the data in a single day.

### Requirements for a Scalable Geospatial Data Solution

The xarvio FIELD MANAGER platform operates at a massive scale, ingesting near-daily satellite imagery from diverse global sources. Key requirements include:

*   **High Data Velocity and Volume:** Processing hundreds of millions of satellite images, resulting in billions of geospatial artifacts.
*   **Dynamic Environment:** Handling near-daily data ingestion from various sensors and providers.
*   **Advanced Quality Assurance:** Implementing cloud and anomaly detection algorithms.
*   **Machine Learning Integration:** Transforming raw data into actionable insights, such as estimating Leaf Area Index (LAI) for optimized crop yield.
*   **Scalability:** The platform must be able to handle increasing data volumes and user demand.

### STAC and eoAPI Ecosystem

To address these requirements, BASF Digital Farming adopted the STAC specification, an open standard for describing and cataloging geospatial datasets. This provides a standardized language for metadata across different data sources. The platform utilizes the eoAPI ecosystem, an integrated suite of open-source tools for managing the lifecycle of geospatial data on the cloud. Key components include:

*   **pgSTAC:** A PostGIS-backed STAC API implementation for efficient indexing of STAC items.
*   **Tiles in PostGIS (TiPG):** Used to serve tiled vector data as Mapbox Vector Tiles (MVT) directly from the PostGIS database.
*   **TiTiler:** A dynamic tile server for Cloud Optimized GeoTIFFs (COGs), enabling streaming imagery as WMTS or XYZ tiles and dynamic rendering.

### Solution Architecture

The architecture is built on Amazon EKS, Amazon S3, and Amazon RDS, organized into four main layers:

*   **Core Services Layer:**
    *   **stac-service:** Implements the STAC API for cataloging and serving metadata.
    *   **raster-service:** Dynamically renders and tiles cloud-optimized raster data using TiTiler.
    *   **vector-service:** Serves vector data as tiled MVT layers from the database or S3 using TiPG.
    These services are containerized and orchestrated within Kubernetes for high availability and simplified CI/CD.
*   **Storage Layer:** All raw and processed geospatial assets are stored in S3 buckets in optimized formats like COGs for raster data and FlatGeobuf for vector data.
*   **Database Layer:** A PostgreSQL database hosted on Amazon RDS, extended with the pgSTAC plugin, serves as the metadata backbone. An RDS proxy ensures connection pooling and resiliency.
*   **Ingestion Layer:** An independent component handles batch and streaming data inputs, processing satellite imagery, drone data, and prescription maps, and pushing metadata to the STAC API and assets to S3.

### Key Technologies and Features

*   **Kubernetes Event-Driven Autoscaling (KEDA):** Dynamically scales platform services based on real-time workloads, such as STAC ingestion queue depth or visualization request load.
*   **Amazon API Gateway:** Provides secure public access to the platform, applying rate limiting, authorization, and routing policies.
*   **COGs (Cloud Optimized GeoTIFFs):** Essential for fast, scalable visualization of large raster datasets.
*   **STAC Standardization:** Significantly reduced onboarding time for new data domains.
*   **Custom STAC Ingestor:** Supports both real-time and batch ingestion of geospatial metadata.

### Benefits

*   **Rapid Onboarding:** Standardized metadata modeling and integration using STAC.
*   **Optimized Storage:** Reduced storage costs and low-latency access using COGs and S3.
*   **Large-Scale Ingestion:** High-throughput data integration with the custom STAC ingestor.
*   **Scalable Metadata Backbone:** Reliable spatial-temporal querying with PostgreSQL, pgSTAC, and RDS Proxy.
*   **Scalable Deployment:** Dynamic compute capacity adjustment with Amazon EKS and KEDA.

### Learnings

*   **RDS Proxy is critical** for managing connections in automatically scaled environments.
*   **Custom STAC ingestor** is essential for large-scale data onboarding.
*   **COGs are non-negotiable** for fast, scalable raster visualization.
*   While the architecture is designed for serverless compatibility, **Amazon EKS** was chosen initially for components like TiTiler and TiPG.

### Conclusion

BASF Digital Farming successfully implemented a scalable STAC-based geospatial data platform on Amazon EKS, enabling efficient management, visualization, and analysis of geospatial data. The new platform has improved data discoverability, reduced search latency, and significantly improved cost efficiency and data processing capacity. Organizations seeking similar solutions can leverage AWS services and open-source tools like STAC and eoAPI.

**Reference Link:** [https://aws.amazon.com/blogs/architecture/basf-digital-farming-builds-a-stac-based-solution-on-amazon-eks/](https://aws.amazon.com/blogs/architecture/basf-digital-farming-builds-a-stac-based-solution-on-amazon-eks/)