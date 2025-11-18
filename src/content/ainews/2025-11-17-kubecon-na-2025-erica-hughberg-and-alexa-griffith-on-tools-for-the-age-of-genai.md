---
title: "KubeCon NA 2025 - Erica Hughberg and Alexa Griffith on Tools for the Age of GenAI"
pubDate: 2025-11-17
description: "KubeCon 2025 highlighted the need for new tools to support GenAI, with speakers advocating for Kubernetes, Envoy AI Gateway, and KServe."
categories: ["AI News", "Kubernetes", "Cloud Native"]
---

## Tools for the Age of GenAI

Erica Hughberg (Tetrate) and Alexa Griffith (Bloomberg) presented at KubeCon + CloudNativeCon North America 2025, detailing the infrastructure challenges of scaling generative AI applications; these applications require a new approach to traffic management and resource allocation. They emphasized that existing tools are insufficient for the unique demands of GenAI.

### Why This Matters
Traditional application infrastructure is optimized for stateless, request-response patterns. GenAI introduces stateful, token-based workloads that demand dynamic routing, fine-grained rate limiting, and robust observability, which legacy systems struggle to provide effectively, leading to increased costs and potential service disruptions. For example, inefficient token handling can rapidly escalate cloud costs.

### Key Insights
- **Two-Tier Gateway Pattern**:  Envoy AI Gateway utilizes a two-tier gateway architecture for centralized control and fine-grained access management.
- **KServe CRD**: KServe leverages Kubernetes Custom Resource Definitions (CRDs) for declarative model deployment and management.
- **llm-d Framework**: KServe is built on llm-d, a Kubernetes-native framework for LLM inference, supporting diverse model frameworks.

### Working Example
```yaml
apiVersion: serving.knative.dev/v1
kind: InferenceService
metadata:
  name: my-model
spec:
  predictor:
    model: "my-model:latest"
    llm:
      type: OpenAI
      modelName: "gpt-3.5-turbo"
      apiKeyRef:
        name: openai-api-key
```

### Practical Applications
- **Bloomberg**: Uses Envoy AI Gateway for centralized management and secure access to its internal GenAI services.
- **Pitfall**: Relying on request-based rate limiting for GenAI can lead to uneven cost control and potential abuse, as token consumption varies significantly per request.

**References:**
- https://www.infoq.com/news/2025/11/tools-genai/