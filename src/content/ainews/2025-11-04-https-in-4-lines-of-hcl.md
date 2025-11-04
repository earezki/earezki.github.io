---
title: "Automating HTTPS Setup with Terraform in 4 Lines of HCL"
pubDate: 2025-11-04
description: "A Terraform template reduces manual HTTPS configuration in AWS from 47 console clicks to 4 lines of HCL, enabling version control, rollback, and automation."
categories: ["AI News", "DevOps", "Infrastructure as Code", "AWS"]
---

## Automating HTTPS Setup with Terraform in 4 Lines of HCL

This article demonstrates how to automate HTTPS configuration on AWS using Terraform (HCL) to eliminate manual, error-prone console operations. By replacing 47 manual clicks with a reusable code template, developers achieve version-controlled infrastructure, automated validation, and seamless deployment.

### 📌 Before: Manual Console Click-Ops (47 Steps)
- **Process**: 
  - Request an ACM certificate.
  - Configure Route 53 DNS alias.
  - Set up CloudFront distribution.
- **Issues**:
  - No Git history or rollback capability.
  - High risk of human error during multi-step setup.
  - Time-consuming and disruptive (e.g., "3 AM coffee spill" metaphor).
  - No automation for validation or updates.

### 📌 After: Automated HTTPS with Terraform
The solution uses four HCL resources to automate certificate creation, DNS validation, and CloudFront integration.

#### 🔧 Key Resources in the HCL Template
- **`aws_acm_certificate`**:
  - **Purpose**: Requests an SSL/TLS certificate for the domain.
  - **Config**:
    ```hcl
    domain_name = var.domain
    validation_method = "DNS"
    lifecycle {
      create_before_destroy = true  # Ensures zero-downtime certificate rotation
    }
    ```
  - **Impact**: Automates certificate generation and enforces safe updates.

- **`aws_route53_record`**:
  - **Purpose**: Creates DNS records for ACM validation.
  - **Config**:
    ```hcl
    for_each = aws_acm_certificate.cert.domain_validation_options
    name   = each.value.resource_record_name
    type   = each.value.resource_record_type
    records = [each.value.resource_record_value]
    ttl = 60
    ```
  - **Impact**: Dynamically provisions DNS records required for certificate validation.

- **`aws_acm_certificate_validation`**:
  - **Purpose**: Validates the certificate using Route 53 records.
  - **Config**:
    ```hcl
    certificate_arn = aws_acm_certificate.cert.arn
    validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
    ```
  - **Impact**: Ensures the certificate is validated automatically without manual intervention.

- **`aws_cloudfront_distribution`**:
  - **Purpose**: Configures CloudFront to use the validated certificate.
  - **Note**: The full configuration is truncated in the article but includes settings for SSL protocols, custom domains, and caching.

### 🔐 Key Takeaways
- **Automation Benefits**:
  - Eliminates manual steps, reducing errors and deployment time.
  - Enables version control, rollback, and auditability via Git.
  - Ensures consistent, repeatable infrastructure setups.
- **Best Practices**:
  - Use `create_before_destroy` lifecycle policies to avoid downtime during certificate rotation.
  - Parameterize domains using `var.domain` for reusability.
  - Validate DNS records dynamically to avoid misconfigurations.

### 🧪 Working Example (HCL Template)
```hcl
resource "aws_acm_certificate" "cert" {
  domain_name         = var.domain
  validation_method   = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = aws_acm_certificate.cert.domain_validation_options
  name     = each.value.resource_record_name
  type     = each.value.resource_record_type
  records  = [each.value.resource_record_value]
  ttl      = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_cloudfront_distribution" "cdn" {
  # Full configuration includes settings like:
  # - origins, default_cache_behavior, viewer_certificate, etc.
}
```

### 📌 Recommendations
- **When to Use**: For teams managing multiple domains or requiring frequent HTTPS updates.
- **Best Practices**:
  - Store sensitive variables (e.g., domain names) in Terraform modules or secure vaults.
  - Test the template in a staging environment before production deployment.
- **Common Pitfalls**:
  - Forgetting to set `validation_method = "DNS"` (default is email, which requires manual input).
  - Misconfiguring Route 53 records, leading to certificate validation failures.
  - Not using `create_before_destroy` when rotating certificates, risking service outages.

🔗 [Full Template Repository](https://dev.to/mthulisi28/https-in-4-lines-of-hcl-terraform-template-that-replaced-my-console-click-ops)