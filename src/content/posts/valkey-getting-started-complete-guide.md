---
title: "Valkey Complete Getting Started Guide: Production-Ready in 30 Minutes"
pubDate: 2025-11-24
description: "Hands-on guide to installing, configuring, and deploying Valkey in production. Covers Docker setup, Python clients, clustering, monitoring, and the pitfalls that cause 3 a.m. pages."
categories: ["Infrastructure", "Databases", "DevOps", "Tutorial", "Python"]
---

## TL;DR

Valkey is the open-source fork of Redis that's actually faster and uses less memory. This guide takes you from zero to production, Docker and native installation, Python client setup with real code examples, clustering for high availability, persistence configuration, monitoring dashboards, and the operational mistakes that will ruin your weekend. If you've read our [Redis to Valkey migration analysis](/from-redis-to-valkey/), you know why Valkey exists. This guide shows you how to use it.

## Before You Start: Why Valkey?

I'll keep this short because we covered the politics in the [migration article](/from-redis-to-valkey/). The facts that matter for this tutorial:

- **License:** BSD 3-Clause, actually open source, no vendor lock-in
- **Performance:** 2-3x throughput vs Redis 7.2 thanks to multi-threaded I/O
- **Memory:** 20-30% less RAM usage from embedded key optimization
- **Compatibility:** 100% Redis protocol compatible, existing apps work
- **Stability:** Atomic cluster migrations, no more broken resharding

If you're starting fresh, use Valkey. If you're migrating from Redis, [read this first](/from-redis-to-valkey/#how-to-migrate-without-downtime).

## Installation: Pick Your Poison

### Docker: The Fast Path

Docker Compose is the cleanest way to run Valkey with persistence. Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  valkey:
    image: valkey/valkey:9.0
    container_name: valkey
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - valkey-data:/data
      - ./valkey.conf:/etc/valkey/valkey.conf
    command: valkey-server /etc/valkey/valkey.conf
    mem_limit: 2.5g
    healthcheck:
      test: ["CMD", "valkey-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  valkey-data:
    driver: local
```

Create the config file `valkey.conf`:

```text
# Network
bind 0.0.0.0
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Performance (Valkey 9.0 multi-threaded I/O)
io-threads 4
io-threads-do-reads yes

# Logging
loglevel notice
logfile ""

# Slow log
slowlog-log-slower-than 10000
slowlog-max-len 128
```

Start it:

```bash
# Start in background
docker-compose up -d

# Verify it's running
docker-compose exec valkey valkey-cli ping
# Should return: PONG

# View logs
docker-compose logs -f valkey

# Stop
docker-compose down
```

**Key config choices explained:**

- `io-threads 4`: Enables multi-threaded I/O, the killer feature in Valkey 9.0. Set this to the number of CPU cores you want to dedicate (typically 2-4).
- `maxmemory 2gb`: Hard limit. Valkey will evict keys or reject writes when this is hit. Always set this.
- `maxmemory-policy allkeys-lru`: When memory is full, evict the least recently used keys. Use `volatile-lru` if you only want to evict keys with TTL, or `noeviction` if you want writes to fail instead.
- `appendfsync everysec`: Write to disk every second. Balances durability and performance. Use `always` for maximum safety (slow) or `no` for maximum speed (data loss risk).
- Named volume `valkey-data`: Your data survives container restarts and rebuilds

### Cloud Managed Services: The Easy Button

If you're on AWS or Google Cloud, let them handle the operational toil.

**AWS ElastiCache for Valkey:**

```bash
# Create a Valkey cluster (replace subnet group with yours)
aws elasticache create-cache-cluster \
  --cache-cluster-id valkey-prod \
  --engine valkey \
  --engine-version 8.0 \
  --cache-node-type cache.r7g.large \
  --num-cache-nodes 1 \
  --cache-subnet-group-name your-subnet-group \
  --preferred-availability-zone us-east-1a

# For production with Multi-AZ replication
aws elasticache create-replication-group \
  --replication-group-id valkey-prod-cluster \
  --replication-group-description "Production Valkey cluster" \
  --engine valkey \
  --cache-node-type cache.r7g.large \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --multi-az-enabled \
  --cache-subnet-group-name your-subnet-group

# Get connection endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id valkey-prod \
  --show-cache-node-info
```

You get automatic failover, patching, monitoring, and it's 20% cheaper than Redis OSS tier.

**Google Cloud Memorystore for Valkey:**

```bash
gcloud redis instances create valkey-prod \
  --size=5 \
  --region=us-central1 \
  --redis-version=valkey_9_0 \
  --tier=standard_ha

# Get connection info
gcloud redis instances describe valkey-prod \
  --region=us-central1
```

Both services give you a connection string. Point your app at it and you're done.

## Python Client Setup: The Right Way

The official Python client is `valkey-py`. Do **not** use `redis-py` for new projects (it's controlled by Redis Ltd. and will nag you with warnings).

### Installation

```bash
pip install valkey
```

For async support (if you're using FastAPI, aiohttp, etc.):

```bash
pip install 'valkey[async]'
```

### Basic Connection

```python
from valkey import Valkey

# Simple connection
client = Valkey(
    host='localhost',
    port=6379,
    decode_responses=True  # Return strings instead of bytes
)

# Test it
client.set('hello', 'world')
print(client.get('hello'))  # "world"
```

### Production Connection Pool

Never create a new connection per request. Use connection pooling:

```python
from valkey import ConnectionPool, Valkey

# Create pool once at app startup
pool = ConnectionPool(
    host='localhost',
    port=6379,
    max_connections=50,  # Tune based on your concurrency
    socket_keepalive=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
    health_check_interval=30,
    decode_responses=True
)

# Reuse the pool
client = Valkey(connection_pool=pool)
```

**Why pooling matters:** Establishing a TCP connection is expensive (DNS lookup, TCP handshake, TLS negotiation if enabled). A pool reuses connections, reducing latency from ~10ms to ~0.1ms.

### Authentication and Security

If you set `requirepass` in `valkey.conf`:

```python
client = Valkey(
    host='localhost',
    port=6379,
    password='YourSecretPassword',
    decode_responses=True
)
```

For TLS (production over the internet):

```python
client = Valkey(
    host='valkey.example.com',
    port=6380,
    password='YourSecretPassword',
    ssl=True,
    ssl_cert_reqs='required',
    ssl_ca_certs='/path/to/ca.crt',
    decode_responses=True
)
```

## Core Operations: The Five Data Structures You Actually Use

Valkey supports five core data types. Here's how to use them in Python.

### 1. Strings (Key-Value)

Simplest data type. Good for caching, feature flags, counters.

```python
# Set a value
client.set('user:1000:name', 'Alice')

# Get a value
name = client.get('user:1000:name')  # "Alice"

# Set with expiration (TTL in seconds)
client.setex('session:abc123', 3600, 'user_data_here')

# Atomic increment (counters, rate limiting)
page_views = client.incr('page:home:views')
print(f"Page views: {page_views}")

# Increment by amount
client.incrby('downloads:total', 5)

# Check if key exists
if client.exists('config:maintenance_mode'):
    print("Site is in maintenance mode")

# Delete a key
client.delete('temp:processing:job123')

# Get multiple keys at once (batching)
values = client.mget(['user:1:name', 'user:2:name', 'user:3:name'])
```

**Cache-aside pattern**

```python
import json

def get_user(user_id):
    cache_key = f'user:{user_id}'
    
    # Try cache first
    cached = client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Cache miss, fetch from database
    user = database.query('SELECT * FROM users WHERE id = ?', user_id)
    
    # Store in cache (1 hour TTL)
    client.setex(cache_key, 3600, json.dumps(user))
    
    return user
```

### 2. Hashes (Objects)

Store objects with multiple fields. More memory-efficient than separate keys.

```python
# INEFFICIENT: Separate keys (don't do this)
# Each key has overhead: 8-byte pointer + malloc header (~16-32 bytes)
# client.set('user:1000:name', 'Alice')        # ~50 bytes overhead
# client.set('user:1000:email', 'alice@example.com')  # ~50 bytes overhead
# client.set('user:1000:age', 30)              # ~50 bytes overhead
# Total overhead: ~150 bytes just for metadata

# EFFICIENT: Hash (do this instead)
# Single hash with embedded fields saves ~40% memory
# All fields stored together with minimal overhead
client.hset('user:1000', mapping={
    'name': 'Alice',
    'email': 'alice@example.com',
    'age': 30,
    'verified': 'true'
})

# Get entire object
user = client.hgetall('user:1000')
# {'name': 'Alice', 'email': 'alice@example.com', 'age': '30', 'verified': 'true'}

# Get a single field
email = client.hget('user:1000', 'email')

# Get multiple fields
name, age = client.hmget('user:1000', ['name', 'age'])

# Increment a numeric field
client.hincrby('user:1000', 'login_count', 1)

# Check if field exists
if client.hexists('user:1000', 'premium'):
    print("User is premium")

# Delete a field
client.hdel('user:1000', 'temp_token')
```

### 3. Lists (Queues, Stacks)

Ordered collections. Perfect for job queues, activity feeds, recent items.

```python
# Add to the right (tail)
client.rpush('tasks', 'send_email', 'process_upload', 'resize_image')

# Add to the left (head)
client.lpush('notifications', 'new_message')

# Pop from the left (FIFO queue)
task = client.lpop('tasks')  # "send_email"

# Pop from the right (LIFO stack)
task = client.rpop('tasks')  # "resize_image"

# Blocking pop (wait for items, perfect for worker queues)
task = client.blpop('tasks', timeout=5)  # Blocks up to 5 seconds
if task:
    queue_name, task_data = task
    process_task(task_data)

# Get a range (pagination)
recent_posts = client.lrange('user:1000:feed', 0, 9)  # First 10 items

# Get list length
count = client.llen('tasks')

# Trim to keep only recent items (cap at 100)
client.ltrim('user:1000:activity', 0, 99)
```

**Job queue**

```python
# Producer
def enqueue_job(job_type, job_data):
    job = json.dumps({'type': job_type, 'data': job_data, 'ts': time.time()})
    client.rpush('jobs', job)

# Consumer (worker process)
def process_jobs():
    while True:
        job = client.blpop('jobs', timeout=5)
        if job:
            _, job_json = job
            job_data = json.loads(job_json)
            handle_job(job_data)
```

### 4. Sets (Unique Collections)

Unordered collections of unique items. Good for tags, permissions, tracking unique visitors.

```python
# Add members
client.sadd('tags:post:42', 'python', 'databases', 'tutorial')

# Check membership
if client.sismember('tags:post:42', 'python'):
    print("Post is tagged with Python")

# Get all members
tags = client.smembers('tags:post:42')
# {'python', 'databases', 'tutorial'}

# Remove a member
client.srem('tags:post:42', 'tutorial')

# Count members
count = client.scard('tags:post:42')

# Set operations
client.sadd('users:online:server1', 'user1', 'user2', 'user3')
client.sadd('users:online:server2', 'user2', 'user3', 'user4')

# Union (all unique users)
all_users = client.sunion('users:online:server1', 'users:online:server2')
# {'user1', 'user2', 'user3', 'user4'}

# Intersection (users on both servers)
both = client.sinter('users:online:server1', 'users:online:server2')
# {'user2', 'user3'}

# Difference (only on server1)
only_server1 = client.sdiff('users:online:server1', 'users:online:server2')
# {'user1'}
```

**Unique visitor tracking**

```python
# Track daily unique visitors
def record_visitor(user_id):
    date_key = f"visitors:{datetime.now().strftime('%Y-%m-%d')}"
    client.sadd(date_key, user_id)
    client.expire(date_key, 86400 * 7)  # Keep for 7 days

# Get count
def get_daily_visitors():
    date_key = f"visitors:{datetime.now().strftime('%Y-%m-%d')}"
    return client.scard(date_key)
```

### 5. Sorted Sets (Leaderboards, Rankings)

Sets where each member has a score. Members are sorted by score. Perfect for leaderboards, priority queues, time-series data.

```python
# Add members with scores
client.zadd('leaderboard', {
    'player1': 1500,
    'player2': 2000,
    'player3': 1750
})

# Get rank (0-based, ascending order)
rank = client.zrank('leaderboard', 'player2')  # 2 (highest)

# Get reverse rank (descending)
rank = client.zrevrank('leaderboard', 'player2')  # 0 (1st place)

# Get top 10 (with scores)
top_players = client.zrevrange('leaderboard', 0, 9, withscores=True)
# [('player2', 2000.0), ('player3', 1750.0), ('player1', 1500.0)]

# Increment score
client.zincrby('leaderboard', 50, 'player1')  # Add 50 points

# Get score
score = client.zscore('leaderboard', 'player1')

# Get count
total_players = client.zcard('leaderboard')

# Get by score range
mid_tier = client.zrangebyscore('leaderboard', 1500, 1800, withscores=True)

# Remove low scorers
client.zremrangebyscore('leaderboard', 0, 1000)
```

**Time-series events**

```python
# Store events with timestamps as scores
def log_event(user_id, event_type):
    key = f'events:{user_id}'
    timestamp = time.time()
    event_data = json.dumps({'type': event_type, 'ts': timestamp})
    client.zadd(key, {event_data: timestamp})
    
    # Keep only last 1000 events
    client.zremrangebyrank(key, 0, -1001)

# Get recent events
def get_recent_events(user_id, limit=10):
    key = f'events:{user_id}'
    events = client.zrevrange(key, 0, limit - 1)
    return [json.loads(e) for e in events]
```

## Advanced Patterns

### Rate Limiting (Sliding Window)

Better than the simple counter approach:

```python
def is_rate_limited(user_id, max_requests=100, window_seconds=60):
    key = f'rate:{user_id}'
    now = time.time()
    
    # Remove requests older than the window
    client.zremrangebyscore(key, 0, now - window_seconds)
    
    # Count requests in current window
    count = client.zcard(key)
    
    if count >= max_requests:
        return True
    
    # Add current request
    client.zadd(key, {str(now): now})
    client.expire(key, window_seconds)
    
    return False
```

### Distributed Locks

For coordinating work across multiple servers:

```python
import uuid

def acquire_lock(lock_name, timeout=10):
    identifier = str(uuid.uuid4())
    lock_key = f'lock:{lock_name}'
    
    # Try to set the lock with NX (only if not exists)
    acquired = client.set(lock_key, identifier, nx=True, ex=timeout)
    
    if acquired:
        return identifier
    return None

def release_lock(lock_name, identifier):
    lock_key = f'lock:{lock_name}'
    
    # Only delete if we own the lock (prevent releasing someone else's lock)
    pipe = client.pipeline(True)
    while True:
        try:
            pipe.watch(lock_key)
            if pipe.get(lock_key) == identifier:
                pipe.multi()
                pipe.delete(lock_key)
                pipe.execute()
                return True
            pipe.unwatch()
            break
        except Exception:
            pass
    return False

# Usage
lock_id = acquire_lock('process_payments')
if lock_id:
    try:
        process_payments()
    finally:
        release_lock('process_payments', lock_id)
```

### Pipelining (Batching Commands)

Reduce network round trips by batching commands:

```python
# Without pipelining (4 round trips)
client.set('key1', 'value1')
client.set('key2', 'value2')
client.set('key3', 'value3')
client.set('key4', 'value4')

# With pipelining (1 round trip)
pipe = client.pipeline()
pipe.set('key1', 'value1')
pipe.set('key2', 'value2')
pipe.set('key3', 'value3')
pipe.set('key4', 'value4')
results = pipe.execute()

# Batch cache warming
def warm_cache(user_ids):
    pipe = client.pipeline()
    for user_id in user_ids:
        pipe.get(f'user:{user_id}')
    results = pipe.execute()
    return results
```

## Monitoring: Know Before You're Paged

### Key Metrics to Watch

```python
import time

def get_metrics():
    info = client.info()
    
    metrics = {
        'memory_used_mb': info['used_memory'] / 1024 / 1024,
        'memory_peak_mb': info['used_memory_peak'] / 1024 / 1024,
        'connected_clients': info['connected_clients'],
        'ops_per_sec': info['instantaneous_ops_per_sec'],
        'keyspace_hits': info['keyspace_hits'],
        'keyspace_misses': info['keyspace_misses'],
        'evicted_keys': info['evicted_keys'],
        'expired_keys': info['expired_keys'],
    }
    
    # Calculate hit rate
    total = metrics['keyspace_hits'] + metrics['keyspace_misses']
    if total > 0:
        metrics['hit_rate'] = metrics['keyspace_hits'] / total * 100
    else:
        metrics['hit_rate'] = 0
    
    return metrics

# Check slow queries
def get_slow_queries():
    slow_log = client.slowlog_get(10)
    for entry in slow_log:
        print(f"Duration: {entry['duration']}μs, Command: {' '.join(entry['command'])}")
```

### Alerts to Set Up

1. **Memory > 80%**: You're about to start evicting keys
2. **Hit rate < 80%**: Cache isn't effective, investigate
3. **Connected clients spiking**: Possible connection leak
4. **Evicted keys > 0** (if using `noeviction`): You're out of memory
5. **Slow queries > 100ms**: Something's wrong

## Common Mistakes That Will Ruin Your Day

### 1. Not Setting maxmemory

**The problem:** Valkey will consume all available RAM and crash your server.

**The fix:**
```text
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### 2. Using Valkey as a Primary Database

**Don't do this.** Valkey is in-memory. Even with persistence, you can lose data. Use a durable database for storage, Valkey for caching.

### 3. Storing Large Objects

**The problem:** Storing 100MB blobs kills performance. Valkey is optimized for < 1MB values.

**The fix:** Store large objects in S3/GCS, store the reference in Valkey:

```python
# Instead of
client.set('video:123', large_video_bytes)

# Use
s3_url = upload_to_s3(large_video_bytes)
client.set('video:123:url', s3_url)
```

### 4. Not Using Connection Pooling

**The problem:** Creating connections is expensive. You'll hit latency spikes.

**The fix:** Use `ConnectionPool` (shown earlier).

### 5. Ignoring Persistence Trade-offs

- **No persistence:** Fastest, but lose all data on crash
- **RDB only:** Snapshots, can lose minutes of data
- **AOF everysec:** Lose max 1 second, good balance
- **AOF always:** Safest, but slow

Choose based on your tolerance for data loss.

## Final Thoughts

If you're starting a new project, concider Valkey. If you're on Redis, [read the migration article](/from-redis-to-valkey/) and plan your move. The ecosystem is moving on. The clouds are moving on. You should too.

Welcome to the post-Redis world. Caching is faster here.

Check the [official Valkey docs](https://valkey.io/docs/) for deep dives.