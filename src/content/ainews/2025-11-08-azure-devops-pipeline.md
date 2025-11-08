---
title: "Azure DevOps Pipeline: CI/CD Automation with Self-Hosted Agents"
pubDate: 2025-11-08
description: "A comprehensive guide to setting up Azure DevOps Pipelines for CI/CD workflows, including self-hosted agent configuration and practical implementation examples."
categories: ["AI News", "devops", "cicd", "azure"]
---

## Azure DevOps Pipeline: CI/CD Automation with Self-Hosted Agents

This article provides a step-by-step tutorial on configuring Azure DevOps Pipelines for Continuous Integration/Continuous Deployment (CI/CD) workflows, with a focus on self-hosted agent setup and practical pipeline implementation. It builds on previous tutorials and covers integration with GitHub, Docker, and Azure Web Apps.

---

### Overview of Azure DevOps Pipelines

Azure DevOps Pipelines are a core component of Microsoft's DevOps ecosystem, enabling automated CI/CD processes for software development. Key features include:

- **Integration**: Seamless compatibility with Azure tools (e.g., Azure Web Apps, Docker) and external platforms like GitHub.
- **Flexibility**: Supports both cloud-hosted and self-hosted agents (similar to Jenkins slaves or GitLab Runners).
- **Scalability**: Hierarchical structure (Stages > Jobs > Steps) for organizing complex workflows.
- **Alternatives**: Competitors include Jenkins, GitLab CI, and GitHub Actions.

---

### Pipeline Structure and Syntax

Azure Pipelines use a YAML file (`azure-pipelines.yml`) to define workflows. The hierarchical structure is critical for clarity in large projects:

#### Key Components:
- **Stages**: Logical groupings of jobs (e.g., Build, Test, Deploy).
- **Jobs**: Units of work within a stage (e.g., Build Docker image, Deploy to Azure).
- **Steps**: Specific tasks or scripts executed within a job (e.g., `echo` commands, Docker builds).

#### Example YAML Configuration:
```yaml
trigger:
- main
pool:
  name: Self-Hosted Agent Pool
stages:
- stage: Build
  jobs:
  - job: BuildDocker
    steps:
    - script: echo "Building Docker image..."
    - script: docker build -t myapp .
- stage: Deploy
  jobs:
  - job: DeployToAzure
    steps:
    - script: echo "Deploying to Azure Web Apps..."
    - script: az webapp deploy --name mywebapp --resource-group mygroup --package .
```

---

### Self-Hosted Agent Setup

Self-hosted agents allow running pipelines on private infrastructure. The setup involves:

#### Steps:
1. **Generate a Personal Access Token (PAT)**:
   - Navigate to **User Settings > Personal Access Tokens**.
   - Grant **Read and Manage** permissions for **Agent Pools**.

2. **Create a Self-Hosted Agent Pool**:
   - Go to **Project Settings > Agent Pools > New Pool**.
   - Configure the pool name (e.g., `MySelfHostedAgent`).

3. **Install and Configure the Agent**:
   - On a Linux server, execute:
     ```bash
     wget https://download.agent.dev.azure.com/agent/4.264.2/vsts-agent-linux-x64-4.264.2.tar.gz
     tar xvfz vsts-agent-linux-x64-4.264.2.tar.gz
     ./config.sh
     ```
   - Input:
     - **Server URL**: `https://dev.azure.com/your-organization`
     - **Authentication Type**: PAT
     - **Agent Pool**: `MySelfHostedAgent`
     - **Agent Name**: `pipeline-agent`

4. **Run the Agent as a Systemd Service**:
   - Use `./svc.sh install` to create a systemd service.
   - Start the service:
     ```bash
     systemctl restart vsts.agent.your-organization.MySelfHostedAgent.pipeline\x2dagent.service
     ```

#### Common Pitfalls:
- **Offline Agents**: Ensure the agent runs as a background service (e.g., systemd) to avoid disconnection on terminal closure.
- **Incorrect PAT Permissions**: Verify the PAT has **Read and Manage** access to agent pools.

---

### Practical Pipeline Example: Docker Build and Azure Deployment

This pipeline builds a Docker image and deploys it to Azure Web Apps:

#### YAML Code:
```yaml
trigger:
- main
pool:
  name: Self-Hosted Agent Pool
jobs:
- job: BuildDocker
  steps:
  - script: echo "Building Docker image..."
  - script: docker build -t myapp .
  - script: docker tag myapp mydockerhub/myapp:latest
  - script: docker push mydockerhub/myapp:latest
- job: DeployToAzure
  steps:
  - script: echo "Deploying to Azure Web Apps..."
  - script: az webapp deploy --name mywebapp --resource-group mygroup --package .
```

#### Key Tasks:
- **Docker Build**: Uses `docker build` and `docker push` to upload the image to Docker Hub.
- **Azure Deployment**: Leverages Azure CLI (`az webapp deploy`) for deploying the image to Azure Web Apps.

---

### Recommendations

- **Use Stages for Organization**: Group related jobs (e.g., Build, Test, Deploy) into stages for clarity.
- **Secure PATs**: Store PATs in Azure Key Vault or environment variables to avoid exposure.
- **Monitor Agent Status**: Ensure agents are online via **Agent Pools > Agent** in Azure DevOps.
- **Leverage Templates**: Use Azure Pipeline templates for reusable workflows (e.g., `starter-pipeline`).
- **Test Locally First**: Validate scripts (e.g., `docker build`) locally before integrating into pipelines.

---

## Working Example (Docker Build and Azure Deployment)

```yaml
trigger:
- main
pool:
  name: Self-Hosted Agent Pool
jobs:
- job: BuildDocker
  steps:
  - script: echo "Building Docker image..."
  - script: docker build -t myapp .
  - script: docker tag myapp mydockerhub/myapp:latest
  - script: docker push mydockerhub/myapp:latest
- job: DeployToAzure
  steps:
  - script: echo "Deploying to Azure Web Apps..."
  - script: az webapp deploy --name mywebapp --resource-group mygroup --package .
```

---

## Recommendations

- **When to Use Self-Hosted Agents**: For private infrastructure, compliance needs, or running non-cloud-compatible tasks.
- **Best Practices**:
  - Regularly update agent software to avoid compatibility issues.
  - Use `displayName` in steps for better pipeline visibility.
  - Avoid hardcoding secrets (e.g., PATs) in YAML files.
- **Common Mistakes**:
  - Forgetting to install the agent as a systemd service, leading to agent downtime.
  - Incorrectly configuring the agent pool name or server URL during setup.

---

**Reference**: [Azure DevOps Pipeline Tutorial](https://dev.to/suleymanakturk/azure-devops-pipeline-1dd1)