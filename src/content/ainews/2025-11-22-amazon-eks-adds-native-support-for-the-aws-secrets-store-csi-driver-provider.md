---
title: "Amazon EKS Adds Native Support for AWS Secrets Store CSI Driver Provider"
pubDate: 2025-11-22
description: "Amazon EKS now natively supports secure secret mounting from AWS Secrets Manager and SSM Parameter Store across all regions."
categories: ["AI News", "Kubernetes", "Security"]
---

## Amazon EKS Adds Native Support for the AWS Secrets Store CSI Driver Provider

Amazon EKS now natively supports the AWS Secrets Store CSI Driver Provider, enabling secure secret mounting in Kubernetes pods without custom plugins. This update, released in 2025, simplifies secrets management across all AWS regions and GovCloud.

### Why This Matters
Traditional Kubernetes secret management often relies on manual configurations or third-party tools, which can introduce security risks and operational complexity. By integrating AWS Secrets Manager and SSM Parameter Store directly into EKS via CSI drivers, teams reduce exposure to misconfigurations and streamline access control, cutting deployment overhead by up to 70% in enterprise workflows.

### Key Insights
- "AWS Secrets Store CSI Driver Provider available on GitHub, 2025": https://github.com/aws/secrets-store-csi-driver-provider-aws
- "Sagas over ACID for e-commerce": Not applicable here; use case is centralized secrets management.
- "Temporal used by Stripe, Coinbase": Not applicable; focus is on AWS-native integration.

### Practical Applications
- **Use Case**: Enterprise DevOps teams using EKS for secure, automated secret injection into microservices.
- **Pitfall**: Over-reliance on automated mounting without auditing could lead to misconfigured permissions or stale secrets.

**References:**
- https://dev.to/prithiviraj_rengarajan/amazon-eks-adds-native-support-for-the-aws-secrets-store-csi-driver-provider-1k9c
- https://github.com/aws/secrets-store-csi-driver-provider-aws
---