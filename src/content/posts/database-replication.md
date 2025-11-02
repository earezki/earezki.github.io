---
title: Database replication, how to copy reliably and why it matters
pubDate: '2025-11-02 00:00:00 +0100'
description: "Overview of replication modes, when to use synchronous vs asynchronous replication, and operational practices for reliable failover and scaling."
categories:
  - Software architecture
  - Databases
  - Operations
---

Replication is how systems survive hardware failures and scale reads. Done right, it provides availability, read scalability, and a foundation for disaster recovery.

Replication modes
- Synchronous: writes are confirmed on replicas before the transaction completes, strong consistency but higher latency.
- Asynchronous: the master returns immediately and replicas lag, better write performance but eventual consistency.
- Multi-primary: multiple writable nodes with conflict resolution; useful for geo-distributed writes but operationally complex.
- Filtered/partial replication: replicate only subsets of data to reduce bandwidth and storage.

When to use which
- Use asynchronous replicas for read scaling and regional caching when eventual consistency is acceptable.
- Use synchronous replication selectively for critical data where losing acknowledged writes is unacceptable.
- Consider multi-primary only when you require local regional writes and can tolerate or resolve conflicts.

Operational practices
- Monitor replication lag and alert on thresholds; lag often signals bottlenecks downstream.
- Automate failover and have tested promotion scripts or managed failover from the provider.
- Regularly test backups and promote replicas to validate recovery procedures.
- Plan for network partitions and define your consistency/availability trade-offs explicitly.

Implementation notes
- PostgreSQL: streaming replication (physical) and logical replication for partial/table-level replication.
- MySQL: binlog-based replication, with semi-synchronous options for reduced data loss windows.
- Managed DBs: many cloud providers offer automated replication with failover and cross-region replication.

Recommendations
- Start with primary-replica (single-master) unless you have a clear need for multi-primary.
- Use replicas for read scaling, reporting, and backups, and keep write paths simple.
- Invest in monitoring and automated failover tests, replication is only useful if you can trust it during incidents.
