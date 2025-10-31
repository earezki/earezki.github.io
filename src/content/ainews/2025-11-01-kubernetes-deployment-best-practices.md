---
title: 'Kubernetes Deployment Best Practices: Production-Ready Guide'
pubDate: '2025-11-01 12:00:00 +0000'
description: 'Comprehensive guide to deploying applications on Kubernetes. Learn deployment strategies, resource management, health checks, scaling, security, and monitoring best practices.'
categories:
  - Kubernetes
  - DevOps
  - Cloud Native
---

# Kubernetes Deployment Best Practices: Production-Ready Guide

Deploying applications to Kubernetes is more than just writing a Deployment YAML. This comprehensive guide covers everything you need to know to run production-grade applications on Kubernetes successfully.

## Table of Contents

1. [Deployment Fundamentals](#fundamentals)
2. [Resource Management](#resources)
3. [Health Checks and Probes](#health-checks)
4. [Deployment Strategies](#deployment-strategies)
5. [Configuration Management](#configuration)
6. [Scaling and Autoscaling](#scaling)
7. [Security Best Practices](#security)
8. [Monitoring and Logging](#monitoring)
9. [Production Checklist](#checklist)

## Deployment Fundamentals {#fundamentals}

### Basic Deployment Structure

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
  labels:
    app: myapp
    version: v1.0.0
    environment: production
spec:
  replicas: 3
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1.0.0
    spec:
      containers:
      - name: myapp
        image: myregistry.com/myapp:1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
```

### Key Components Explained

**Deployment Spec:**
- `replicas`: Number of pod instances
- `revisionHistoryLimit`: Number of old ReplicaSets to retain
- `selector`: Identifies pods managed by this deployment
- `template`: Pod template specification

## Resource Management {#resources}

### 1. Resource Requests and Limits

**Critical for production stability:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

**Understanding Resources:**

- **Requests**: Guaranteed resources (used for scheduling)
- **Limits**: Maximum resources (hard caps)
- **CPU**: Measured in millicores (m)
- **Memory**: Measured in bytes (Mi, Gi)

**Best Practices:**
```yaml
# Good: Requests = Limits for critical workloads (Guaranteed QoS)
resources:
  requests:
    memory: "1Gi"
    cpu: "1000m"
  limits:
    memory: "1Gi"
    cpu: "1000m"

# Good: Slightly higher limits for burstable workloads
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"

# Bad: No limits (risk of resource exhaustion)
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  # No limits defined!
```

### 2. Quality of Service (QoS) Classes

**Guaranteed:**
```yaml
# Highest priority, won't be evicted
resources:
  requests:
    memory: "1Gi"
    cpu: "1"
  limits:
    memory: "1Gi"
    cpu: "1"
```

**Burstable:**
```yaml
# Medium priority, can use extra resources
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "2"
```

**BestEffort:**
```yaml
# Lowest priority, first to be evicted
# No resources specified
```

### 3. ResourceQuota and LimitRange

**Namespace ResourceQuota:**
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "100"
    requests.memory: "200Gi"
    limits.cpu: "200"
    limits.memory: "400Gi"
    pods: "50"
    services: "20"
```

**LimitRange for defaults:**
```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: production
spec:
  limits:
  - default:
      memory: "512Mi"
      cpu: "500m"
    defaultRequest:
      memory: "256Mi"
      cpu: "250m"
    type: Container
```

## Health Checks and Probes {#health-checks}

### 1. Liveness Probe

Determines if container is running. Restarts on failure.

```yaml
spec:
  containers:
  - name: myapp
    image: myapp:1.0.0
    livenessProbe:
      httpGet:
        path: /actuator/health/liveness
        port: 8080
        scheme: HTTP
      initialDelaySeconds: 60
      periodSeconds: 10
      timeoutSeconds: 5
      successThreshold: 1
      failureThreshold: 3
```

**Alternative Probe Types:**

**Exec Probe:**
```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - "pgrep java || exit 1"
  initialDelaySeconds: 30
  periodSeconds: 10
```

**TCP Socket Probe:**
```yaml
livenessProbe:
  tcpSocket:
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10
```

**gRPC Probe (Kubernetes 1.24+):**
```yaml
livenessProbe:
  grpc:
    port: 9090
  initialDelaySeconds: 30
```

### 2. Readiness Probe

Determines if container can accept traffic.

```yaml
spec:
  containers:
  - name: myapp
    readinessProbe:
      httpGet:
        path: /actuator/health/readiness
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 5
      timeoutSeconds: 3
      successThreshold: 1
      failureThreshold: 3
```

### 3. Startup Probe (for slow-starting apps)

```yaml
spec:
  containers:
  - name: myapp
    startupProbe:
      httpGet:
        path: /actuator/health/startup
        port: 8080
      initialDelaySeconds: 0
      periodSeconds: 10
      failureThreshold: 30  # Allow up to 5 minutes for startup
      timeoutSeconds: 5
```

**Complete Health Check Example:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
        
        # Startup probe - gives app time to start
        startupProbe:
          httpGet:
            path: /health/startup
            port: 8080
          failureThreshold: 30
          periodSeconds: 10
        
        # Readiness probe - determines traffic eligibility
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 3
        
        # Liveness probe - restarts if unhealthy
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
          failureThreshold: 3
```

## Deployment Strategies {#deployment-strategies}

### 1. Rolling Update (Default)

Gradually replaces old pods with new ones.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1      # Max pods unavailable during update
      maxSurge: 2            # Max extra pods during update
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:2.0.0
```

**Characteristics:**
- ✅ Zero downtime
- ✅ Gradual rollout
- ⚠️ Both versions run simultaneously
- ⚠️ Slower deployment

### 2. Blue-Green Deployment

Run new version alongside old, switch traffic when ready.

```yaml
# Blue deployment (current)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
  labels:
    app: myapp
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0

---
# Green deployment (new)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
  labels:
    app: myapp
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: myapp:2.0.0

---
# Service (switch selector to green when ready)
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue    # Change to 'green' when ready to switch
  ports:
  - port: 80
    targetPort: 8080
```

**Characteristics:**
- ✅ Instant rollback
- ✅ Full testing before switch
- ⚠️ Requires 2x resources
- ⚠️ Database migrations complex

### 3. Canary Deployment

Gradually shift traffic to new version.

**Using Istio:**
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp
  http:
  - match:
    - headers:
        user-type:
          exact: beta-tester
    route:
    - destination:
        host: myapp
        subset: v2
  - route:
    - destination:
        host: myapp
        subset: v1
      weight: 90
    - destination:
        host: myapp
        subset: v2
      weight: 10

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: myapp
spec:
  host: myapp
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

**Using Argo Rollouts:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: myapp
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 5m}
      - setWeight: 25
      - pause: {duration: 5m}
      - setWeight: 50
      - pause: {duration: 5m}
      - setWeight: 75
      - pause: {duration: 5m}
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:2.0.0
```

## Configuration Management {#configuration}

### 1. ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: production
data:
  application.yaml: |
    server:
      port: 8080
    spring:
      datasource:
        url: jdbc:postgresql://db:5432/mydb
  log-level: "INFO"
  cache-size: "1000"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: myapp-config
              key: log-level
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: myapp-config
```

### 2. Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
  namespace: production
type: Opaque
stringData:
  database-password: "supersecret"
  api-key: "abc123def456"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-password
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: api-key
```

**Best Practice: Use External Secrets Operator**

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: myapp-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: myapp-secrets
  data:
  - secretKey: database-password
    remoteRef:
      key: prod/myapp/db
      property: password
```

## Scaling and Autoscaling {#scaling}

### 1. Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

### 2. Vertical Pod Autoscaler (VPA)

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: myapp
      minAllowed:
        cpu: "250m"
        memory: "256Mi"
      maxAllowed:
        cpu: "2"
        memory: "4Gi"
```

### 3. Custom Metrics (KEDA)

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: myapp-scaler
spec:
  scaleTargetRef:
    name: myapp
  minReplicaCount: 2
  maxReplicaCount: 100
  triggers:
  - type: rabbitmq
    metadata:
      queueName: tasks
      queueLength: "10"
  - type: prometheus
    metadata:
      serverAddress: http://prometheus:9090
      metricName: http_requests_total
      threshold: '100'
      query: sum(rate(http_requests_total[1m]))
```

## Security Best Practices {#security}

### 1. Pod Security Standards

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### 2. Security Context

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: myapp
        image: myapp:1.0.0
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
```

### 3. Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: myapp-network-policy
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          role: database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
```

## Monitoring and Logging {#monitoring}

### 1. Prometheus Monitoring

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
  labels:
    app: myapp
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/actuator/prometheus"
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
```

### 2. ServiceMonitor (Prometheus Operator)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
  - port: http
    path: /actuator/prometheus
    interval: 30s
```

### 3. Logging with Fluentd

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      <parse>
        @type json
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch
      port 9200
      logstash_format true
    </match>
```

## Production Checklist {#checklist}

### Pre-Deployment:
- [ ] Resource requests and limits defined
- [ ] Health probes configured (liveness, readiness, startup)
- [ ] Security context applied
- [ ] Network policies in place
- [ ] Secrets externalized
- [ ] Monitoring and logging configured
- [ ] HPA configured for scaling
- [ ] PodDisruptionBudget defined
- [ ] Multi-zone deployment
- [ ] Backup strategy defined

### During Deployment:
- [ ] Use rolling update strategy
- [ ] Monitor error rates
- [ ] Watch resource usage
- [ ] Check logs for errors
- [ ] Verify health probes passing

### Post-Deployment:
- [ ] Run smoke tests
- [ ] Verify metrics collection
- [ ] Check log aggregation
- [ ] Test rollback procedure
- [ ] Document deployment
- [ ] Update runbooks

## Conclusion

Successful Kubernetes deployments require attention to:

1. **Resource Management** - Right-size your applications
2. **Health Checks** - Ensure reliability
3. **Security** - Follow least privilege principle
4. **Observability** - Monitor everything
5. **Scalability** - Plan for growth

Remember: Start simple, iterate based on actual needs and metrics.

## Resources

- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

---

*What Kubernetes practices have helped your team the most? Share your experiences!*
