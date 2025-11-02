---
title: Vertical scaling, when you need raw power
pubDate: '2025-11-02 00:00:00 +0100'
description: "When to scale up a single machine, practical tuning tips for CPU, memory, and storage, and operational cautions for large-instance deployments."
categories:
  - Software architecture
  - System design
  - Architecture
---

Vertical scaling—adding CPU, RAM, or faster local disks to a single machine—is often the fastest way to address performance bottlenecks. It's a pragmatic lever: cheaper and quicker for short-term relief than re-architecting, and sometimes the right long-term choice for workloads that fundamentally resist distribution (for example, single-node databases with strong consistency requirements).

When to choose vertical scaling
- I/O-bound databases where latency matters and sharding or distribution would introduce significant complexity.
- Fast remediation for sudden load spikes or when you need breathing room to design a long-term horizontal solution.
- Workloads that require tight locality (large in-memory caches, high per-core performance) where moving state off-node would be inefficient.

Key areas to optimize
- Storage: use NVMe, tune filesystem options, pick the right RAID or instance-local SSD config for predictable I/O.
- Memory: size RAM to avoid swapping; tune DB caches and OS page cache for your workload.
- CPU: identify hot paths to parallelize and tune thread pools; ensure affinity/NUMA is considered on multi-socket boxes.

Example: PostgreSQL tune for a large instance
```conf
# postgresql.conf (excerpt)
shared_buffers = '25GB'
work_mem = '64MB'
effective_cache_size = '80GB'
max_wal_size = '2GB'
checkpoint_completion_target = 0.7
```

Operational cautions
- NUMA effects: large instances expose NUMA topology—pin hot processes or tune the JVM/native allocator to avoid cross-node memory access penalties.
- Diminishing returns: each upgrade costs more while delivering smaller gains; measure before and after.
- Single point of failure: combine vertical scale-ups with replication and proven recovery plans (backups, PITR, failover testing).

Recommended practices
- Automate instance type changes in infrastructure-as-code so upgrades are repeatable and auditable.
- Keep boots and configuration idempotent to make rapid replacement reliable.
- Monitor OS-level metrics (iostat, vmstat, sar) plus application signals (query latency, GC pauses, lock contention).
- Use performance testing to validate that the upgrade addresses the bottleneck—measure throughput and tail latency under load.

Final thought
Vertical scaling is a pragmatic tool in the architect's toolbox. Use it deliberately: when it buys time, reduces complexity, or is the best fit for your workload. But treat it as part of a broader strategy rather than the only answer.
