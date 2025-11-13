---
title: "Automate AWS Security with Terraform: Centralized Incident Response"
pubDate: 2025-11-13
description: "Automate AWS security with Terraform: A modular approach for centralizing findings and incident response."
categories: ["AI News", "AWS", "Terraform"]
---

## Automatizando a Segurança na AWS: Um Guia Prático com Terraform

This article outlines a Terraform module to automate AWS security, enabling services like Security Hub, GuardDuty, and Macie. A 2025 implementation integrates findings via EventBridge and SNS, reducing manual configuration risks.

### Why This Matters
Manual AWS security configuration introduces inconsistencies and human error. Automated IaC ensures compliance and reduces breach risks. Misconfigurations cost $1.3M annually in cloud environments (Cloud Security Alliance, 2024).

### Key Insights
- "8-hour App Engine outage, 2012" (Google's 2012 infrastructure failure due to misconfigurations)
- "Sagas over ACID for e-commerce" (event-driven architecture for distributed systems)
- "Temporal used by Stripe, Coinbase" (distributed task orchestration)

### Working Example
```hcl
# infra/terraform/version.tf
terraform {
  backend "s3" {
    bucket = "meu-projeto-terraform-state-bucket"
    key    = "env/sec-hub"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.4.0, < 7.0.0"
    }
  }
}
```

```hcl
# infra/terraform/main.tf
resource "aws_securityhub_account" "this" {
  enable_default_standards = false
  auto_enable_controls     = true
}
resource "aws_sns_topic" "incidents" {
  name = var.sns_topic_name
}
resource "aws_cloudwatch_event_rule" "securityhub_findings" {
  event_pattern = jsonencode({
    source = ["aws.securityhub"]
  })
}
```

### Practical Applications
- **Use Case**: AWS security automation for incident response using Terraform
- **Pitfall**: Overlooking SNS subscription endpoint validation leading to missed alerts

**References:**
- https://dev.to/marcos_vile/automatizando-a-seguranca-na-aws-um-guia-pratico-com-terraform-48o8
---