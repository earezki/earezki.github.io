---
title: "Deploying a Node.js App on Kubernetes with Minikube"
pubDate: 2025-11-11
description: "Deploying a Node.js app on Kubernetes with Minikube on Windows: A hands-on DevOps guide."
categories: ["AI News", "DevOps", "Kubernetes"]
---

## Deploying a Node.js App on Kubernetes with Minikube

A DevOps engineer successfully deployed a Node.js application on a Kubernetes cluster using Minikube on Windows 11, avoiding Hyper-V dependencies. The setup utilized Docker, Git, and PowerShell to containerize, deploy, and debug the app locally.

### Why This Matters
Ideal Kubernetes models assume seamless deployments, but real-world scenarios involve debugging tunnel failures, IP routing, and version consistency. For example, the author encountered tunnel startup issues, resolving them via Minikube restarts, highlighting the gap between theoretical workflows and practical troubleshooting.

### Key Insights
- "Minikube v1.37.0 used with kicbase:v0.0.48 base image": The author leveraged specific versions for compatibility on Windows 11 Home.
- "NodePort service for local Kubernetes access": Exposed the app externally using NodePort at `30080` for local testing.
- "Git used for version control in DevOps workflows": Git tracked all setup steps, ensuring reproducibility and documentation.

### Working Example
```javascript
// app.js
const http = require("http");
const PORT = 3000;
const server = http.createServer((req, res) => {
  res.end("Hello from Node.js running inside Kubernetes!");
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-k8s-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-k8s
  template:
    metadata:
      labels:
        app: node-k8s
    spec:
      containers:
      - name: node-k8s
        image: node-k8s-demo
        ports:
        - containerPort: 3000
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: node-k8s-service
spec:
  type: NodePort
  selector:
    app: node-k8s
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30080
```

```go
// iso_test.go (partial)
{
  "iso_version": "v1.37.0-1758198818-20370",
  "kicbase_version": "v0.0.48",
  "minikube_version": "v1.37.0",
  "commit": "a4f96d0469d67330691be52a99ff1f91e31ba77f"
}
```

### Practical Applications
- **Use Case**: Local Kubernetes testing with Minikube on Windows for DevOps workflows.
- **Pitfall**: Assuming Hyper-V is required for Minikube on Windows; the author used Docker as a driver instead.

**References:**
- https://dev.to/babjisheik/deploying-a-nodejs-app-on-kubernetes-with-minikube-52f
---