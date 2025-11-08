---
title: "Docker Labs: From Beginner to Advanced on Azure"  
pubDate: 2025-11-06  
description: "A comprehensive guide to Docker labs on Azure, covering setup, operations, orchestration, security, and integration with Azure Container Registry."  
categories: ["AI News", "DevOps", "Docker", "Cloud Computing"]  
---

## Docker Labs: From Beginner to Advanced on Azure

This article provides a step-by-step guide to mastering Docker on Azure, covering foundational concepts, advanced techniques, and integration with Azure services. It includes practical labs for setting up environments, building custom images, orchestrating containers, and implementing security best practices.

---

### 1. **Initial Azure Setup and Docker Installation**

**Purpose**: Create an Azure VM with Docker pre-installed for lab environments.  
**Steps**:  
- **Create Azure VM**:  
  ```bash
  az group create --name DockerLabs --location eastus
  az vm create \
  --resource-group DockerLabs \
  --name DockerVM \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --size Standard_B2s \
  --custom-data cloud-init-docker.txt
  ```  
  - **cloud-init-docker.txt** automates Docker installation, package upgrades, and user permissions.  

- **Verify Installation**:  
  ```bash
  ssh azureuser@<your-vm-ip>
  docker --version
  docker run hello-world
  ```  
  **Impact**: Streamlines environment setup for consistent Docker development.

---

### 2. **Basic Docker Operations**

**Purpose**: Learn container lifecycle management and networking.  
**Key Commands**:  
- **Container Lifecycle**:  
  ```bash
  docker pull nginx:alpine
  docker run -d --name web-server -p 80:80 nginx:alpine
  docker stop web-server
  docker rm web-server
  ```  
- **Networking**:  
  ```bash
  docker network create my-network
  docker run -d --name web1 --network my-network nginx:alpine
  docker exec web1 ping web2
  ```  
  **Impact**: Enables understanding of container isolation and communication.

---

### 3. **Building Custom Images**

**Purpose**: Package applications into Docker images.  
**Example**:  
- **Project Structure**:  
  ```
  my-webapp/
  ├── app.py
  ├── requirements.txt
  └── Dockerfile
  ```  
- **Dockerfile**:  
  ```dockerfile
  FROM python:3.9-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 5000
  CMD ["python", "app.py"]
  ```  
- **Build & Run**:  
  ```bash
  docker build -t my-webapp .
  docker run -d --name my-app -p 5000:5000 my-webapp
  ```  
  **Impact**: Facilitates reproducible deployments and version control.

---

### 4. **Docker Compose - Multi-Container Applications**

**Purpose**: Orchestrate multiple services (e.g., Flask app + Redis).  
**Example**:  
- **docker-compose.yml**:  
  ```yaml
  version: '3.8'
  services:
    web:
      build: .
      ports: ["5000:5000"]
      depends_on: ["redis"]
    redis:
      image: redis:7-alpine
    nginx:
      image: nginx:alpine
      ports: ["80:80"]
  ```  
- **Commands**:  
  ```bash
  docker compose up -d
  docker compose logs -f
  docker compose up -d --scale web=3
  ```  
  **Impact**: Simplifies managing complex applications with interdependent services.

---

### 5. **Data Management with Volumes**

**Purpose**: Persist and manage container data.  
**Commands**:  
- **Named Volumes**:  
  ```bash
  docker volume create app-data
  docker run -d -v app-data:/var/lib/mysql mysql:8.0
  ```  
- **Bind Mounts**:  
  ```bash
  docker run -d -v $(pwd):/app python:3.9-slim sh -c "pip install -r requirements.txt && python app.py"
  ```  
  **Impact**: Ensures data persistence across container lifecycles.

---

### 6. **Advanced Dockerfile Techniques**

**Purpose**: Optimize image security and size.  
**Example**:  
- **Multi-Stage Build**:  
  ```dockerfile
  # Build stage
  FROM python:3.9-slim as builder
  RUN pip install --user -r requirements.txt

  # Runtime stage
  FROM python:3.9-slim
  COPY --from=builder /root/.local /home/appuser/.local
  USER appuser
  CMD ["python", "app.py"]
  ```  
- **Health Checks**:  
  ```dockerfile
  HEALTHCHECK --interval=30s CMD curl -f http://localhost:5000/ || exit 1
  ```  
  **Impact**: Reduces image size and enhances security.

---

### 7. **Container Orchestration with Docker Swarm**

**Purpose**: Scale and manage container clusters.  
**Commands**:  
```bash
docker swarm init
docker network create -d overlay app-overlay
docker stack deploy -c docker-compose.swarm.yml myapp
```  
**docker-compose.swarm.yml**:  
```yaml
services:
  web:
    image: my-webapp:secure
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 256M
```  
**Impact**: Enables high availability and resource management.

---

### 8. **Monitoring and Logging**

**Purpose**: Track container performance and logs.  
**Example**:  
- **Prometheus + Grafana**:  
  ```yaml
  services:
    prometheus:
      image: prom/prometheus:latest
      ports: ["9090:9090"]
    grafana:
      image: grafana/grafana:latest
      ports: ["3000:3000"]
  ```  
- **Metrics Configuration**:  
  ```yaml
  scrape_configs:
    - job_name: 'node-exporter'
      static_configs:
        - targets: ['node-exporter:9100']
  ```  
  **Impact**: Provides real-time insights into system health.

---

### 9. **Security Best Practices**

**Purpose**: Secure Docker images and infrastructure.  
**Commands**:  
- **Vulnerability Scanning**:  
  ```bash
  grype my-webapp:secure
  docker run docker/docker-bench-security
  ```  
- **Content Trust**:  
  ```bash
  export DOCKER_CONTENT_TRUST=1
  docker push myregistry.azurecr.io/my-webapp:1.0
  ```  
  **Impact**: Mitigates risks from untrusted images and misconfigurations.

---

### 10. **Azure Container Registry (ACR) Integration**

**Purpose**: Store and manage Docker images in Azure.  
**Commands**:  
```bash
az acr create --name myDockerRegistry --sku Basic
docker tag my-webapp:secure mydockerregistry.azurecr.io/my-webapp:1.0
docker push mydockerregistry.azurecr.io/my-webapp:1.0
```  
**Automated Builds**:  
```bash
az acr task create \
--name buildwebapp \
--image my-webapp:{{.Run.ID}} \
--context https://github.com/yourusername/my-webapp.git
```  
**Impact**: Enables CI/CD pipelines and secure image storage.

---

### Final Project: Microservices Application

**Purpose**: Deploy a production-ready microservices stack.  
**docker-compose.prod.yml**:  
```yaml
services:
  frontend:
    image: mydockerregistry.azurecr.io/my-webapp:1.0
    deploy:
      replicas: 3
  api:
    image: mydockerregistry.azurecr.io/api-service:1.0
    deploy:
      replicas: 2
  redis:
    image: redis:7-alpine
  db:
    image: postgres:13
  traefik:
    image: traefik:v2.9
    ports: ["80:80", "443:443"]
```  
**Impact**: Demonstrates end-to-end deployment with load balancing and persistent storage.

---

## Working Example (Docker Compose for Multi-Container App)

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## Recommendations

- **Use Docker Compose** for local development to simplify multi-container setups.  
- **Enable Content Trust** (`DOCKER_CONTENT_TRUST=1`) to ensure signed images.  
- **Leverage Multi-Stage Builds** to minimize image size and reduce attack surfaces.  
- **Monitor with Prometheus** for real-time metrics and set up alerts.  
- **Avoid Hardcoding Secrets**; use environment variables or Azure Key Vault.  
- **Test Networking** configurations to ensure service discovery works across containers.  

**Reference**: [Docker Labs on Azure](https://dev.to/sudlo2014/docker-labs-from-beginner-to-advanced-on-azure-54om)