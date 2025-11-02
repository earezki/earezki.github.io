---
title: Choosing a database, practicality over purity
pubDate: '2025-11-02 00:00:00 +0100'
description: "Practical guidance to choose the right database for your needs: relational, key-value, document, column-family, graph, and NewSQL trade-offs."
categories:
  - Software architecture
  - Databases
  - Architecture
---

Picking a database is one of the most consequential choices for the next few years of a product. Choose for current access patterns and operational maturity, not academic purity.

Quick taxonomy
- Relational (RDBMS): PostgreSQL, MySQL, strong consistency, rich queries, ACID guarantees.
- Key-value: Redis, DynamoDB, lightning-fast lookups for caching and sessions.
- Document stores: MongoDB, Couchbase, flexible schemas for evolving data.
- Column-family: Cassandra, Scylla, write-scalable stores for time-series and massive writes.
- Graph DBs: Neo4j, optimized for relationship traversals.
- NewSQL: CockroachDB, Yugabyte, aim for SQL semantics with horizontal scalability.

How to choose
1. Start with the shape of your data and query patterns: joins and transactions => RDBMS; large, simple writes => column-family; relationship queries => graph.
2. Consider consistency needs: strong consistency favors RDBMS or NewSQL; eventual consistency is acceptable for many distributed use cases.
3. Evaluate operational costs: backups, restores, replication, monitoring, and runbook maturity.
4. Think about growth: does the product need read replicas, sharding, or cross-region replication later?

Operational rules
- Start with PostgreSQL for most transactional workloads; it's mature, well-supported, and versatile.
- Use Redis for caches and ephemeral state, but never as the primary durable store without persistence strategies.
- Design for polyglot persistence as your app grows—pick the right tool for each job rather than forcing one DB to do everything.

Patterns & examples
- OLTP: Postgres with logical replication and read replicas.
- High-write ingestion: Cassandra/Scylla with careful compaction and TTLs.
- Event sourcing: append-only store (Kafka or a write-optimized DB) plus materialized views for reads.

Recommendations
- Prefer operational maturity and a clear scaling path over novelty.
- Make sure your choice has strong backup and restore capabilities and a documented recovery plan.
