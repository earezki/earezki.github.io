---
title: "Why We're Migrating from Redis to Valkey (and You Probably Should Too)"
pubDate: 2025-11-21
description: "Redis killed itself with a license change. Valkey is the open-source fork that's faster, cheaper, and backed by AWS and Google. Here's what actually changed under the hood and how to migrate without downtime."
categories: ["Infrastructure", "Databases", "DevOps", "Open Source"]
---

## TL;DR

In March 2024, Redis Ltd. changed their license from BSD to a proprietary dual-license (RSALv2/SSPLv1) to block cloud providers from selling managed Redis. AWS, Google, and Oracle immediately forked the last open-source version and created **Valkey**, now a Linux Foundation project. Valkey is not just a protest fork, it's 2-3x faster than Redis thanks to multi-threaded I/O, uses 20-30% less memory, and costs 20-33% less on major clouds. The client library ecosystem is fragmented, but migration paths exist. For 90% of use cases (caching, session stores, rate limiting), Valkey is the new default. Redis Ltd. is pivoting to AI/vector search for survival.

## What Actually Happened: The License Betrayal

For fifteen years, Redis was the default in-memory key-value store. You installed it with `apt-get install redis`, pointed your app at `localhost:6379`, and it just worked. Session caching, rate limiting, leaderboards, Redis handled it all with a permissive BSD license that let anyone do anything.

In March 2024, Redis Ltd. burned that trust to the ground.

Starting with Redis 7.4, the company switched to a dual-license model:
- **RSALv2 (Redis Source Available License)**: You can use it, but you cannot sell it as a managed service.
- **SSPLv1 (Server Side Public License)**: You can sell it as a service, but only if you open-source your entire cloud control plane, monitoring, backups, orchestration, everything.

Both options are poison pills for AWS, Google Cloud, and Azure. The first kills their ElastiCache/Memorystore revenue. The second forces them to give away the keys to their kingdoms.

### Why This Matters to You

If you run Redis on a Linux server, you now face a choice:
1. **Stay on Redis 7.2.4 forever** (the last BSD version) and never get security patches.
2. **Upgrade to Redis 7.4+** and hope your use case doesn't trigger the license restrictions.
3. **Migrate to Valkey** and sleep at night.

Fedora, Debian, and OpenSUSE already made the call. They classified the new Redis license as "non-free" and removed it from their default repositories. If you `dnf install redis` on Fedora 40+, you get Valkey.

## Enter Valkey: The Linux Foundation Fork

Within weeks of the Redis license change, the Linux Foundation announced **Project Valkey**, a fork of Redis 7.2.4 governed by a Technical Steering Committee with reps from AWS, Google, Oracle, Percona, and Ericsson. No single vendor controls the roadmap. The license is BSD 3-Clause, forever.

This isn't a scrappy community project. AWS and Google assigned full-time kernel engineers to Valkey. The commit velocity is higher than Redis itself. it's not just a drop-in replacement, it's objectively better.

## Technical Deep Dive: Why Valkey Is Faster

### 1. Multi-Threaded I/O (Finally)

Redis is famously single-threaded. Every `GET`, `SET`, and `INCR` command runs sequentially on a single CPU core. On a 64-core AWS instance, 63 cores sit idle while one core does all the work. Redis tried to fix this in version 6 with optional "I/O threads," but the implementation was half-baked and required manual tuning.

**Valkey 8.0 rearchitected the event loop.**

- **What changed:** The main thread still executes commands (preserving atomicity), but all network I/O, reading bytes from sockets, writing responses back, now happens on a pool of worker threads.
- **Why it matters:** In high-throughput workloads, the CPU spends more time shuffling bytes than processing data. Offloading I/O parallelizes the bottleneck.
- **Benchmark:** On AWS Graviton3, Valkey 8.0 hits **1.19 million RPS**, a **230% increase** over Redis 7.2 on the same hardware. P99 latency stays flat even at peak load because the main thread isn't blocked by network stalls.

### 2. Memory Optimization: Embedded Keys

In-memory databases live and die by RAM efficiency. Every wasted byte costs you money.

Redis's hash table uses a chain of pointers: bucket → dictionary entry → key object → value object. On a 64-bit system, each pointer is 8 bytes, plus malloc overhead for each allocation (typically 16-32 bytes).

**Valkey 8.0 introduced key embedding.**

- **What changed:** Instead of allocating the dictionary entry and the key separately, Valkey allocates them as a single contiguous block. The key is embedded directly into the entry structure.
- **Impact:** Eliminates one 8-byte pointer and one malloc overhead per key. For workloads with millions of small keys, this saves **20-30% of total memory**.
- **Real-world example:** AWS reported that upgrading a 1TB Redis cluster to Valkey reduced RAM usage to 800GB, a savings of $200/month per node on r6g.4xlarge instances.

### 3. Cluster Stability: Atomic Slot Migration

If you've ever resharded a Redis Cluster, you know the pain. Moving data between nodes is a multi-step process. If a node crashes mid-migration, the cluster can end up in a broken state where keys are lost or split between nodes.

**Valkey 9.0 introduced Atomic Slot Migration.**

- **What changed:** The source node snapshots the slot, streams it to the target, and tracks changes during the transfer. The ownership flip is atomic. If anything fails, the transaction rolls back cleanly.
- **Impact:** Scaling operations (adding/removing nodes) are now safe enough to automate. No more waking up at 3 a.m. because an auto-scaler broke your cluster.

## Cloud Provider Response: The Price War

### AWS: ElastiCache for Valkey
- **Pricing:** 20% cheaper than Redis OSS for node-based clusters, 33% cheaper for serverless.
- **Migration:** Blue/green upgrades with zero downtime. Attach a Valkey replica to your Redis primary, sync, promote.

### Google Cloud: Memorystore for Valkey
- **Integration:** First-class support in GKE and Vertex AI.
- **Marketing:** Positioned as the "pure open-source" choice vs. "proprietary Redis."

### Microsoft Azure: The Outlier
Azure is the only major cloud still partnered with Redis Ltd. They offer **Azure Managed Redis**, which is white-labeled Redis Enterprise with Active-Active geo-replication and the full Redis module suite. You pay a premium, but you get features Valkey can't match (yet).

## The Client Library Nightmare

The most painful second-order effect of the fork is **client library fragmentation**. For a decade, you just installed `redis-py` or `jedis` and moved on. That simplicity is dead.

### The Problem
Redis Ltd. maintains control over the "official" clients (node-redis, redis-py, jedis). Pull requests to add Valkey support are rejected. If you connect to Valkey with `redis-py` 5.0+, your logs fill with warnings about "unsupported server versions."

### The Solution: GLIDE
Valkey introduced **GLIDE** (General Language Independent Driver for the Enterprise):
- **Architecture:** Core written in Rust for connection management and protocol parsing. Language-specific bindings (Python, Java, Node, Go) wrap the Rust core.
- **Benefit:** Bug fixes in Rust apply to all languages simultaneously. Consistent behavior everywhere.
- **Tradeoff:** You now have a native binary dependency. If you run Alpine Linux or an exotic ARM variant, you might need to build from source.

### Migration Checklist
1. **Switch to GLIDE** (`pip install valkey-glide`) or language-specific forks (`valkey-py`, `valkey-go`).
2. **Test connection pooling.** Valkey's faster throughput can expose bugs in your timeout configs.
3. **Check module usage.** If you rely on RedisJSON or RedisSearch, verify parity with Valkey JSON/Valkey Search.

## How to Migrate Without Downtime

The standard pattern is **replica attachment**:

1. Attach a Valkey node as a replica to your Redis primary.
2. Wait for full sync (Valkey can read Redis's RDB snapshot and replication stream).
3. Promote the Valkey node to primary.
4. Update application DNS/config to point to Valkey.

**Gotchas:**
- **Client warnings:** Upgrade clients first to avoid log spam.
- **Module compatibility:** If you use Redis modules, test Valkey equivalents in staging.
- **Timing bugs:** Faster command processing can change race conditions. One company found that Valkey exposed latent bugs in their session lock logic.

## What Happens to Redis Ltd.?

Redis Ltd. can't compete on basic caching anymore. Valkey is faster, cheaper, and backed by the entire cloud industry. So they're pivoting hard to **AI and vector search**.

### Redis 8.0: The AGPLv3 Surprise
In May 2025, Redis announced that Redis 8.0 would offer **AGPLv3** as a license option alongside SSPL/RSAL. This is technically "open source" again (AGPL is OSI-approved), but it's still poisonous to cloud providers due to the network interaction clause.

The strategy is clear: regain "open source" credibility while keeping AWS/Google locked out.

### The AI Pivot
Redis Ltd. is now marketing themselves as a **multi-model database for Generative AI**:
- **Unified query engine:** SQL-like queries across JSON, Hash, and Vector data.
- **Vector search:** Store embeddings, cache LLM responses, and search context in the same low-latency tier (RAG pipelines).
- **Redis Copilot:** An AI assistant that writes queries for you.

If they can position Redis 8.0 as the "context memory" for LLMs, they might survive. But it's a narrow path.

## Lessons from the Elasticsearch Split

This exact scenario played out in 2021 when Elasticsearch changed to SSPL and AWS forked it into **OpenSearch**.

The license change didn't kill Elasticsearch, but it forced them up-market. They survive by building proprietary features OpenSearch can't copy.

Redis Ltd. is following the same playbook. Expect them to succeed in the vector/AI niche while losing the caching commodity layer entirely.

## What You Should Do

### Default to Valkey for Caching
If your use case is session stores, rate limiting, simple pub/sub, or leaderboards, **migrate to Valkey now**. It's faster, cheaper, and legally safer. The cloud pricing incentives alone justify the migration cost.

### Evaluate Redis Enterprise for Vector Workloads
If you're building RAG applications or need real-time vector search, Redis Enterprise offers a cohesive platform that Valkey doesn't match yet. Just understand you're paying a premium for vendor lock-in.

### Standardize Your Client Libraries
Don't mix `redis-py` and `valkey-glide` across services. Pick one strategy (preferably GLIDE) and migrate everything. Future protocol divergence will only make this worse.

## Final Thoughts

I've been writing production code against Redis since 2018. I built entire architectures around its simplicity. The license change felt like a betrayal, not because I hate capitalism, but because Redis Ltd. broke the unspoken contract: "You build on us, we stay boring and free."

They chose profit over ecosystem. Fine. The ecosystem responded by building something better.

Valkey isn't just a fork, it's a statement. When a company tries to recapture value by locking down open source, the community will route around the damage. Faster than you think.

I'll never use Redis for personal projects again. Valkey is the new default. Get used to typing `valkey-cli` instead of `redis-cli`.

Choose wisely. Your infrastructure will live with this decision for the next decade.
