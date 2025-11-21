---
title: "Bitnami MySQL Docker Image Tags Deleted"
pubDate: 2025-11-21
description: "Bitnami removed its MySQL Docker image tags, causing 'manifest not found' errors for users relying on those images."
categories: ["AI News", "DevOps", "Docker"]
---

## mysql/mysql

Bitnami's acquisition by VMware resulted in the removal of all `bitnami/mysql` Docker image tags, disrupting existing deployments. This impacts users who depended on these tags for consistent database container versions.

### Why This Matters
Docker image tags provide version control and reproducibility; their unexpected removal forces engineers to immediately migrate to alternatives. The cost of such disruptions includes downtime, debugging efforts, and potential data inconsistencies if migrations are not handled carefully.

### Key Insights
- “manifest for bitnami/mysql:latest not found” error, 2025-11-21: Indicates the requested image tag no longer exists in the registry.
- Official Images vs. Third-Party: Utilizing official images (e.g., `mysql/mysql`) reduces dependency on potentially unstable third-party distributions.
- Docker Compose: Facilitates the definition and management of multi-container applications, simplifying database deployments.

### Working Example
```yaml
name: mydbname
services:
db:
  image: mysql
  restart: always
  environment:
    MYSQL_ROOT_PASSWORD: dev
    MYSQL_DATABASE: mydbname
  volumes:
    - mydbname-data:/var/lib/mysql
  ports:
    - 3306:3306
  healthcheck:
    test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-u', 'root', '-pdev']
    interval: 5s
    timeout: 3s
    retries: 10
volumes:
  mydbname-data:
    driver: local
```

```
DATABASE_URL="mysql://root:dev@localhost/mydbname"
```

### Practical Applications
- **Company/system**: Internal tooling reliant on `bitnami/mysql:latest` experienced deployment failures after the tag removal.
- **Pitfall**: Over-reliance on specific, non-official image tags without fallback strategies can lead to critical service disruptions.

**References:**
- https://dev.to/hacksore/bitnami-mysql-docker-image-tags-deleted-5acm