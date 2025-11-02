---
title: "Creating a High-Availability Storage Account for a Public Website"
pubDate: 2025-11-02
description: "A step-by-step guide to configuring Microsoft Azure Storage Accounts for high availability, public access, and data resilience using features like geo-redundancy, soft delete, and blob versioning."
categories: ["AI News", "blobstorage", "webdev", "programming"]
---

## Creating a High-Availability Storage Account for a Public Website

This guide walks through setting up a **Microsoft Azure Storage Account** optimized for hosting a public website. The configuration ensures **high availability**, **public accessibility**, and **data resilience** through features like **geo-redundant storage (RA-GRS)**, **soft delete**, and **blob versioning**. The result is a robust environment suitable for testing, training, or live website hosting.

---

### Key Configuration Steps

#### 1. **Create a Storage Account with Geo-Redundancy**
- **Action**: Use Azure Portal to create a storage account named `publicwebsite` (or a unique variant if needed).
- **Redundancy Settings**:
  - Select **Read-access geo-redundant storage (RA-GRS)**.
  - Ensures data remains accessible during regional outages by replicating data to a secondary region.
- **Impact**: Minimizes downtime and data loss risks in case of regional failures.

#### 2. **Enable Anonymous Public Access**
- **Configuration**:
  - Navigate to **Settings** > **Configuration**.
  - Enable **Allow blob anonymous access**.
- **Purpose**: Allows users to access website content without authentication, ideal for public-facing sites.
- **Limitation**: Risks exposing sensitive data if not properly secured.

#### 3. **Create and Configure a Blob Container**
- **Steps**:
  - Create a container named `public`.
  - Set **Public access level** to **Blob (anonymous read access for blobs only)**.
- **Use Case**: Host static website assets (e.g., images, HTML files) accessible to all users.

#### 4. **Upload and Test Files**
- **Process**:
  - Upload files (e.g., images, text) to the `public` container.
  - Verify access by copying the file’s URL and testing in a browser.
- **Outcome**: Ensures files are publicly accessible and functional.

#### 5. **Enable Soft Delete for Blob Recovery**
- **Setup**:
  - Go to **Data protection** > **Blob service** > **Blob soft delete**.
  - Set **Retention period** to **21 days**.
- **Function**: Prevents accidental deletion by allowing recovery within 21 days.
- **Testing**:
  - Delete a file, toggle **Show deleted blobs**, and use **Undelete** to restore it.

#### 6. **Enable Blob Versioning**
- **Configuration**:
  - Navigate to **Blob service** > **Versioning**.
  - Enable **Versioning for blobs**.
- **Benefit**: Maintains historical versions of files, enabling recovery from overwrites or corruption.

---

### Conclusion

This setup ensures:
- **High availability** via RA-GRS redundancy.
- **Public access** for unauthenticated users.
- **Data resilience** through soft delete (21-day retention) and blob versioning.

Ideal for hosting static website content in a secure, scalable, and recoverable Azure environment.

---

### Reference
[Creating a High-Availability Storage Account for a Public Website](https://dev.to/ottah_chukwuebuka/creating-a-high-availability-storage-account-for-a-public-website-4l5k)