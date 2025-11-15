---
title: "ComfyDeploy Local Development Setup Guide"
pubDate: 2025-11-15
description: "ComfyDeploy's local setup guide covers full-stack development, serverless GPU compute, and $5 in Modal credits for AI workflows."
categories: ["AI News", "Full Stack Development", "Serverless Computing"]
---

## ComfyDeploy Local Development Setup Guide

Getting ComfyDeploy running locally involves configuring a full-stack environment with React/Vite, FastAPI, PostgreSQL, and serverless GPU compute via Modal. A critical step is setting `CURRENT_API_URL` to an ngrok tunnel, as Modal functions cannot reach localhost.

### Why This Matters
Local development with ComfyDeploy mirrors production complexity, requiring coordination of Docker, Modal volumes, and third-party APIs. Misconfigurations—like missing ngrok tunnels or unpushed Autumn billing plans—can cause workflows to fail silently, costing hours in debugging. For example, a missing user record in PostgreSQL triggers `ForeignKeyViolationError`, halting all API operations until resolved.

### Key Insights
- "8-hour App Engine outage, 2012": While not directly referenced, ComfyDeploy’s reliance on external services (Modal, AWS) highlights the risks of single points of failure.
- "Sagas over ACID for e-commerce": ComfyDeploy’s use of Autumn for billing and feature limits reflects distributed transaction patterns in SaaS.
- "Temporal used by Stripe, Coinbase": Modal’s serverless architecture shares similarities with Temporal, enabling scalable GPU workflows for AI.

### Working Example
```bash
# Configure AWS S3 CORS for ComfyDeploy
cat > cors.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF
aws s3api put-bucket-cors --bucket comfydeploy-dev-storage --cors-configuration file://cors.json --region us-east-1
```

### Practical Applications
- **Use Case**: AI image generation workflows using ComfyUI on Modal with GPU credits.
- **Pitfall**: Forgetting to deploy the `volume-operations` Modal app causes model download failures.

**References:**
- https://dev.to/ogkai/comfydeploy-local-development-setup-guide-h6m
- https://clerk.com/
- https://useautumn.com/
- https://aws.amazon.com/s3/
- https://modal.com/
- https://ngrok.com/
- https://github.com/