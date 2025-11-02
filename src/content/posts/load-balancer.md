---
title: Load balancers, the traffic cops of your architecture
pubDate: '2025-11-02 00:00:00 +0100'
description: "Overview of load balancer types, trade-offs between L4 and L7, operational best practices, and deployment recommendations."
categories:
  - Software architecture
  - Networking
  - System design
---

Load balancers are the traffic controllers that keep your fleet healthy and responsive. They distribute incoming requests across multiple servers, perform health checks, and can offer features like TLS termination, sticky sessions, and request routing.

When to use a load balancer
- Any multi-instance service: if you have more than one backend instance, put a load balancer in front.
- When you need graceful rolling updates, blue/green deployments, or safe autoscaling.

Types & trade-offs
- L4 (transport): low overhead, very high throughput; works at TCP/UDP level but lacks application awareness.
- L7 (application): understands HTTP(S), headers, paths, and can route based on content; slightly more CPU work but enables smarter routing (A/B tests, canary releases).

Common implementations
- Self-hosted: nginx, HAProxy, Traefik, flexible and cost-effective for smaller fleets.
- Managed: AWS ALB/NLB, Google Cloud Load Balancer, Cloudflare, reduce operational load and integrate with platform services.

Operational advice
- Terminate TLS at the balancer for simpler certificate management unless strict end-to-end encryption is required.
- Use active health checks and short deregistration/drain time to avoid serving requests from unhealthy instances.
- Beware of becoming a single point of failure: deploy balancers in HA pairs or rely on the cloud provider's redundant offering.
- Consider connection draining and request timeouts to avoid cutting in-flight work during scale-in.

Practical tips
- Prefer sticky sessions only when absolutely required, externalize session state first.
- Monitor request distribution, backend latencies, and error rates; use metrics to tune balancing algorithms.

Recommendation
- Start with a managed load balancer unless you need advanced, custom routing. Managed services reduce operational burden and handle HA and scaling for you.
