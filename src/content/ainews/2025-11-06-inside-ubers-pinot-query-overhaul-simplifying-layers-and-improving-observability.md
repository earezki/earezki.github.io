---
title: "Inside Uber’s Pinot Query Overhaul: Simplifying Layers and Improving Observability"
pubDate: 2025-11-06
description: "Uber redesigned its Apache Pinot query architecture by replacing the Presto-based Neutrino system with a lightweight proxy called Cellar and Pinot’s Multi-Stage Engine Lite Mode to simplify SQL execution, improve resource management, and ensure predictable performance for large-scale analytics."
categories: ["AI News", "Architecture & Design", "Optimization", "Data Analytics"]

---

## Uber’s Apache Pinot Query Architecture Redesign

Uber has overhauled its Apache Pinot query architecture to address scalability, performance, and observability challenges in its analytics workloads. The redesign replaces the complex Presto-based Neutrino system with a streamlined architecture centered on **Cellar**, a lightweight proxy, and **Pinot’s Multi-Stage Engine Lite Mode (MSE Lite Mode)**. This shift simplifies query execution, enforces resource limits, and enhances isolation for multi-tenant environments.

---

### **Previous Architecture: Neutrino System**

- **Complex Layered Design**: Neutrino combined **Presto coordinator and worker processes** with Pinot, creating a hybrid execution model. User-submitted PrestoSQL queries were partially translated to PinotSQL and executed in Neutrino, while remaining logic ran in the proxy.
- **Limitations**:
  - **Resource Overhead**: Multi-stage queries on terabyte-scale Pinot tables (with billions of records) risked exceeding resource or latency thresholds.
  - **Semantic Complexity**: Query plans were hard to interpret due to the layered execution model.
  - **Limited Tenant Isolation**: Shared proxies led to unpredictable performance for multi-tenant workloads.

---

### **New Architecture: Cellar and MSE Lite Mode**

#### **1. Cellar: Lightweight Query Proxy**
- **Purpose**: Acts as a direct gateway to Pinot brokers, reducing overhead and complexity.
- **Features**:
  - **Direct-Connection Mode**: Tenants can bypass Cellar and connect directly to Pinot brokers for complete isolation.
  - **Time Series Plugin**: Integrates M3QL support for time-series data analysis.
  - **Client Libraries**: Official Java and Go libraries simplify interaction with Cellar, handling response formatting, partial results, timeouts, and metrics emission.

#### **2. Multi-Stage Engine Lite Mode (MSE Lite Mode)**
- **Purpose**: Optimizes complex queries for predictable performance while enforcing resource limits.
- **Key Features**:
  - **Configurable Record Limits**: Enforces maximum leaf-stage record limits to prevent resource exhaustion.
  - **Scatter-Gather Pattern**: Leaf stages execute on Pinot servers, while aggregation and joins occur on brokers.
  - **Explain Plan Transparency**: Surfaces resource limits and execution plans for debugging.
  - **Monitoring Enhancements**: Tracks query performance and latency, enabling troubleshooting for high-latency requests.

---

### **Key Improvements and Metrics**

- **Performance Predictability**: MSE Lite Mode ensures consistent execution time for complex queries, even at high query-per-second (QPS) rates (single-digit to thousands of QPS).
- **Isolation**: Direct-connection mode and MSE Lite Mode provide stronger tenant isolation, preventing resource contention.
- **Adoption Progress**: As of 2025, Cellar handles **20% of Neutrino’s prior query volume**, with plans for full replacement.
- **Operational Tools**: Grafana dashboards offer out-of-the-box visibility for new users, while client libraries emit metrics for latency, success rates, and warnings.

---

### **Real-World Applications**

- **Internal Analytics Workloads**: Powers tracing, log search, and segmentation for Uber’s operations.
- **Scalability**: Supports Pinot tables with hundreds of terabytes and billions of records, critical for real-time OLAP scenarios.

---

### **Recommendations for Implementation**

- **Use Cases for Cellar**:
  - Prefer direct-connection mode for high-isolation requirements.
  - Leverage MSE Lite Mode for complex SQL queries requiring joins or window functions.
- **Best Practices**:
  - Configure leaf-stage record limits to avoid resource exhaustion.
  - Monitor query performance via Grafana dashboards and client library metrics.
  - Gradually migrate workloads from Neutrino to Cellar to ensure compatibility.
- **Pitfalls to Avoid**:
  - Overlooking MSE Lite Mode’s configurable limits, which could lead to unexpected query failures.
  - Underutilizing monitoring tools, risking undetected performance bottlenecks.

---

## Working Example (Client Library Usage in Java)

```java
// Example of using Uber's Java client library with Cellar
PinotClient client = new PinotClient("http://cellar-proxy:8080");
QueryRequest request = new QueryRequest("SELECT * FROM metrics WHERE timestamp > '2025-01-01'");
QueryResponse response = client.executeQuery(request);

if (response.hasWarnings()) {
    System.out.println("Query warnings: " + response.getWarnings());
}
System.out.println("Query result: " + response.getResults());
```

---

## References

- [Uber’s Pinot Query Redesign (InfoQ)](https://www.infoq.com/news/2025/11/uber-pinot-query-redesign/)