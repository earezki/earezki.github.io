---
title: "Understanding Amazon EBS: Persistent Storage for EC2 Instances"
pubDate: 2025-11-07
description: "A comprehensive guide to Amazon EBS (Elastic Block Store), AWS's persistent block storage for EC2 instances. Learn its features, AZ alignment, snapshot usage, and key configurations like 'Delete on Termination'."
categories: ["AI News", "aws", "cloud", "ebs", "beginners", "software", "coding", "development", "engineering", "inclusive", "community"]
---

## Understanding Amazon EBS: Persistent Storage for EC2 Instances

Amazon EBS (Elastic Block Store) is a critical component of AWS's EC2 (Elastic Compute Cloud) service, providing durable, block-level storage for virtual servers. It enables data persistence, flexible volume management, and seamless integration with EC2 instances, making it indispensable for cloud computing workflows.

---

### **What is EBS?**

- **Definition**: EBS is AWS's **block storage service** that functions like a "network-connected USB drive," allowing EC2 instances to store and retrieve data persistently.
- **Purpose**: Ensures data remains accessible even after an EC2 instance is stopped or terminated. Ideal for databases, logs, and application data.
- **Impact**: Eliminates the need for local storage, enabling scalable, on-demand storage solutions.

---

### **Key Features of EBS**

#### **1. Data Persistence**
- **Function**: Retains data even if the EC2 instance is stopped or terminated (unless configured otherwise).
- **Use Case**: Critical for applications requiring data durability, such as databases or stateful services.
- **Metric**: No data loss by default (unless "Delete on Termination" is enabled).

#### **2. Zone Affinity and Snapshots**
- **AZ Alignment**: Volumes are tied to a specific **Availability Zone (AZ)** (e.g., `us-east-1a`). Direct cross-AZ attachment is not possible.
- **Snapshot Workaround**: 
  - **Snapshots** (point-in-time backups) can be created to **migrate volumes** to other AZs.
  - Snapshots are stored in **S3** and can be used to create new volumes in different AZs.
- **Impact**: Enables disaster recovery and multi-AZ redundancy strategies.

#### **3. Volume Management**
- **Flexibility**: 
  - Volumes can be **detached** from one EC2 instance and **reattached** to another.
  - Supports **multiple volumes** per instance (e.g., root volume + data volumes).
- **Limitation**: A single volume can only be attached to **one instance at a time** (basic EC2 level).
- **Use Case**: Facilitates failover, maintenance, and data migration.

#### **4. Performance Metrics**
- **IOPS (Input/Output Operations Per Second)**: 
  - Determines volume performance; higher IOPS = faster data access.
  - Example: General-purpose volumes (e.g., `gp3`) offer 3,000 IOPS baseline, while provisioned IOPS (e.g., `io1`) allow up to 64,000 IOPS.
- **Latency**: Slight network-induced delay, but negligible for most applications with proper volume selection.

#### **5. Provisioning and Cost**
- **Configuration**:
  - **Size**: Defined in gigabytes (e.g., 100 GB, 1 TB).
  - **IOPS**: Configurable during creation or later (e.g., 1,000 IOPS for high-performance workloads).
- **Billing**: Charged based on **provisioned capacity**, not actual usage (e.g., $0.10 per GB-month for `gp3` volumes).

---

### **Critical Configuration: Delete on Termination**

- **Purpose**: Controls whether a volume is deleted when its EC2 instance is terminated.
- **Behavior**:
  - **Enabled**: Volume is **deleted** with the instance (default for root volumes).
  - **Disabled**: Volume **persists** after termination (recommended for data retention).
- **Example**: 
  - Root volume: Delete on Termination = **Enabled** (default).
  - Data volume: Delete on Termination = **Disabled** (to preserve backups).

---

### **Summary Table of Key Concepts**

| **Concept**               | **Meaning**                                                                 | **Dive**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **EBS**                  | AWS block storage for EC2; acts as a network-connected drive.              | Ensures data persistence and flexibility.                                |
| **Persistência**         | Data remains after EC2 termination.                                        | Ideal for databases, logs, and stateful apps.                            |
| **AZ Alignment**         | Volumes are tied to a specific AZ.                                         | Use snapshots for cross-AZ migration.                                    |
| **IOPS**                 | Measures volume performance (e.g., 3,000 IOPS for `gp3`).                  | Higher IOPS = faster access for databases or analytics.                  |
| **Delete on Termination**| Controls volume deletion when EC2 instance is terminated.                  | Disable for critical data; enable for temporary workloads.               |

---

### **Real-World Applications**
- **Database Hosting**: Use high-IOPS volumes (`io1`) for relational databases (e.g., MySQL, PostgreSQL).
- **Data Backup**: Create snapshots for disaster recovery and cross-AZ redundancy.
- **Cost Optimization**: Choose `gp3` volumes for general workloads and disable "Delete on Termination" for critical data.

---

### **Reference**
[https://dev.to/sinngjpeg/ebs-entendendo-o-armazenamento-do-ec2-2bgf](https://dev.to/sinngjpeg/ebs-entendendo-o-armazenamento-do-ec2-2bgf)