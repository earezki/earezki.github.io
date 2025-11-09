---
title: "Cloud Resume Challenge - Chunk 4: Professional DevOps Practices with Terraform and AWS"
pubDate: 2025-11-09
description: "This article details the implementation of infrastructure-as-code, supply chain security, and AWS best practices for a production-ready Cloud Resume project using Terraform, GitHub Actions, and AWS services."
categories: ["AI News", "DevOps", "Cloud Computing", "Terraform"]
---

## Cloud Resume Challenge - Chunk 4: Professional DevOps Practices with Terraform and AWS

This article documents the final phase of the Cloud Resume Challenge, focusing on implementing **professional-grade DevOps practices** to transform a personal portfolio project into a **production-ready system**. Key achievements include infrastructure-as-code (IaC) with Terraform, supply chain security hardening, and architectural documentation for transparency and scalability.

---

### 🌍 Terraforming the Cloud Resume

**Terraform** was used to define and manage AWS infrastructure as code, ensuring repeatability, auditability, and security. Key components included:

- **S3 Bucket Configuration**  
  - Enabled versioning and lifecycle rules to retain noncurrent versions for 30 days.  
  - Set `acl = "private"` and `force_destroy = false` to prevent accidental deletion.  
  - Example Terraform snippet:

    ```hcl
    resource "aws_s3_bucket" "resume_site" {
      bucket = "my-cloud-resume-site"
      acl    = "private"
      versioning {
        enabled = true
      }
      lifecycle_rule {
        id = "expire-old-versions"
        enabled = true
        noncurrent_version_expiration {
          days = 30
        }
      }
    }
    ```

- **CloudFront Distribution**  
  - Integrated with **Origin Access Control (OAC)** to restrict direct access to S3.  
  - Configured **ACM-managed TLS certificates** for HTTPS and custom error responses.  

- **DynamoDB**  
  - Stored visit counts and managed Terraform **remote state locking** to prevent concurrent modifications.  

- **Lambda + API Gateway**  
  - Implemented a **serverless visitor counter API** with fine-grained IAM roles.  

- **Security Best Practices**  
  - Applied **least-privilege IAM policies** to all resources.  
  - Used **modular Terraform code** for reusability across environments (e.g., staging, production).  

**Impact**: Infrastructure is now fully reproducible, auditable, and secure, reducing manual errors and drift.

---

### 🔐 Securing the Software Supply Chain

To harden the CI/CD pipeline, the following measures were implemented:

- **OIDC Integration**  
  - Replaced long-lived AWS credentials with **GitHub Actions OIDC tokens** for temporary, scoped access.  

- **Dependency Integrity**  
  - Pinned GitHub Actions versions (e.g., `uses: actions/checkout@v4`) to avoid malicious updates.  
  - Verified checksums for **Hugo themes**, **Node modules**, and **Terraform providers**.  

- **Tight IAM Scoping**  
  - CI/CD roles were limited to deploying only the resources they own.  

- **Auditability**  
  - Enabled **AWS CloudTrail logging** for all actions.  
  - Applied **lifecycle policies** to S3 for version retention and forensic traceability.  

**Impact**: Reduced attack surface and ensured compliance with **OWASP Supply Chain Security guidelines**.

---

### 🏗️ Architecture Diagrams

Visual documentation was added to explain system components and workflows:

- **Frontend Stack**  
  - **Hugo** static site hosted on **S3**, delivered via **CloudFront** with **OAC**.  
  - **Lifecycle rules** manage version retention and storage class transitions.  

- **Backend Stack**  
  - **API Gateway** routes requests to **Lambda** functions, which update **DynamoDB** for visit counts.  

- **CI/CD Pipeline**  
  - **GitHub Actions** (OIDC) triggers **Terraform** deployments to AWS.  

- **Monitoring & Cost Control**  
  - **Billing alerts** set to $0.01 to detect unintended costs.  
  - **MFA enforcement** and **root account lockdown** for AWS security.  

---

### 🧱 AWS Account Structure

The AWS environment was hardened with enterprise-grade practices:

- **Organizational Units (OUs)**  
  - Separated `production` and `test` environments into distinct OUs.  

- **Cost & Security Controls**  
  - **Root account** locked, used only for billing.  
  - **Budget alerts** for early cost detection.  

- **Isolation**  
  - Dedicated accounts for isolated workloads to minimize blast radius.  

**Impact**: Ensured scalability, compliance, and cost control as the project grows.

---

### 🌐 Final Product & Transparency

- **Live Website**: [https://www.trinityklein.dev/](https://www.trinityklein.dev/)  
- **GitHub Repository**: [https://github.com/tlklein/portfolio-website/](https://github.com/tlklein/portfolio-website/)  

Both are **public, versioned, and reproducible**, enabling full auditability.

---

## Working Example: Terraform S3 Module

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

module "s3_bucket" {
  source = "./modules/s3"
  bucket_name = "my-cloud-resume-site"
}
```

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "resume_site" {
  bucket = var.bucket_name
  acl    = "private"
  versioning {
    enabled = true
  }
  lifecycle_rule {
    id = "expire-old-versions"
    enabled = true
    noncurrent_version_expiration {
      days = 30
    }
  }
}
```

---

## Recommendations

- **Use Terraform Modules** for reusability and maintainability.  
- **Pin GitHub Actions versions** to avoid security risks.  
- **Enable remote state locking** (DynamoDB) for concurrent CI/CD runs.  
- **Document architecture visually** to simplify onboarding and troubleshooting.  
- **Avoid long-lived credentials**; use OIDC or temporary tokens for CI/CD.  

---

## References

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)  
- [OWASP Supply Chain Security Guide](https://owasp.org/www-project supply-chain-security/)  
- [GitHub Repository](https://github.com/tlklein/portfolio-website/)  
- [Live Website](https://www.trinityklein.dev/)