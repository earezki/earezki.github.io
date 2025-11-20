---
title: "Python and SQLite in the Real World"
pubDate: 2025-11-22
description: "Production-grade guide to SQLite with Python: when to use it, how to configure it correctly, and the footguns that will destroy your weekend."
categories: ["Python", "Databases", "Backend", "Performance"]
---

## TL;DR – When to Use SQLite and When to Run Away

SQLite is the most deployed database engine in the world, with billions of instances embedded in mobile devices, browsers, applications, and embedded systems, far outpacing traditional client-server databases like PostgreSQL or MySQL in sheer volume of deployments. This ubiquity stems from its lightweight, serverless design, making it a default choice for scenarios where a full RDBMS would be overkill.

**Use SQLite when:**
- **Single-writer workloads** (analytics pipelines, log processing, CLI tools)
- **Read-heavy apps** with < 100 concurrent readers (documentation sites, local-first apps)
- **Embedded systems** where installing PostgreSQL is insane
- **Testing** (it's 10x faster than spinning up containers)
- **Edge deployments** (Cloudflare Workers, Lambda@Edge)
- **You need ACID without a server** (mobile apps, desktop software)

**Run away when:**
- **High write concurrency** (> 1 writer or > 100 writes/sec sustained)
- **Network file systems** (NFS, SMB, EFS). This will corrupt your database. Not "might", will.
- **You need replication** (SQLite has no built-in replication)

Real-world examples I've shipped:

**Desktop and mobile standalone apps (perfect fit):**
- Flutter app with SQLite for local state storage
- Zero server infrastructure, data lives on the user's device

**A documentation site serving 5k requests/day (perfect fit):**
- Static site with search index in SQLite (~500k indexed documents)
- Deployed to a basic VPS
- p99 latency < 5ms, handles traffic spikes without breaking a sweat

**Internet-facing web APIs (works with caveats):**
- Internal tools API with ~20 requests/sec average, 90% reads
- Required careful tuning (WAL mode, write batching, connection pooling)
- Worked fine until I needed horizontal scaling, then migrated to PostgreSQL

The pattern: SQLite excels when you control the hardware and have predictable, modest write rates. If you have burst writes, you're fighting the single-writer lock. If you have sustained high-throughput reads, WAL mode makes it competitive with PostgreSQL for that specific workload.

## Storage Model Deep Dive

SQLite's performance characteristics are entirely dictated by its storage model. Understanding this is not optional.

### Journal Modes

SQLite has three journal modes, and picking the wrong one will cost you 10x performance:

**DELETE mode (default, do not use):**
```python
import sqlite3

conn = sqlite3.connect("app.db")
conn.execute("PRAGMA journal_mode")  # Returns: delete
```

Every transaction creates a journal file on disk, writes changes, commits, then deletes the journal. This is slow and causes write amplification. The only reason this is the default is backward compatibility with systems from 2004.

**TRUNCATE mode (slightly better, still don't use):**
```python
conn.execute("PRAGMA journal_mode = TRUNCATE")
```

Same as DELETE but truncates the journal file instead of deleting it. Saves some syscalls.

**WAL mode (use this):**
```python
conn = sqlite3.connect("app.db")
conn.execute("PRAGMA journal_mode = WAL")
conn.execute("PRAGMA synchronous = NORMAL")
```

Write-Ahead Logging. Writes go to a separate WAL file (`app.db-wal`), readers see a consistent snapshot. This is the only mode that allows concurrent reads during writes. **If you take one thing from this article, use WAL mode.**

Performance difference (10k inserts):

**AWS EC2 t3.medium (2 vCPU, gp3 EBS 3000 IOPS):**
- DELETE mode: 8.1 seconds
- WAL mode: 1.4 seconds

**GCP e2-medium (2 vCPU, standard persistent disk):**
- DELETE mode: 12.3 seconds
- WAL mode: 2.1 seconds

The pattern holds across environments: WAL mode is 5-6x faster than DELETE mode. Cloud instances with slower disk I/O show the benefit even more dramatically.

WAL has one critical limitation: **only one writer at a time**. If you need multiple concurrent writers, you need something else like PostgreSQL.

### Page Size Tuning

SQLite stores data in fixed-size blocks called **pages**. A page is the smallest unit SQLite reads from or writes to disk. Think of it like the block size in a filesystem, every read operation pulls at least one full page into memory, even if you only need a few bytes.

The default page size is 4096 bytes (4KB), which was reasonable in 2004 when most systems had 4KB OS page sizes and limited RAM. In recent years, this became suboptimal for several reasons:

1. **Modern SSDs** have larger internal block sizes (often 8KB or 16KB). Reading a 4KB SQLite page might require reading a full 16KB SSD block, wasting 12KB.
2. **Modern OS page caches** work better with larger pages (8KB-16KB), reducing the number of page faults.
3. **Analytics workloads** benefit from larger pages because sequential scans read fewer total pages.

Setting the page size correctly can improve throughput by 20-40% for read-heavy workloads.

```python
# Check current page size
conn.execute("PRAGMA page_size").fetchone()  # (4096,)

# Set page size (must be done BEFORE creating tables)
conn.execute("PRAGMA page_size = 8192")
conn.execute("VACUUM")  # Rebuild database with new page size
```

**Guidelines:**
- **8KB or 16KB for modern SSDs** (matches OS page cache better)
- **4KB for mobile/embedded** (smaller memory footprint)
- **32KB for analytics** (fewer page reads for large scans)

Changing page size after you have data requires `VACUUM`, which rewrites the entire database. Do this during schema creation.

### Critical PRAGMAs for Production

```python
def configure_connection(conn: sqlite3.Connection) -> None:
    """Apply production-grade settings to every connection."""
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")  # fsync only on checkpoints
    conn.execute("PRAGMA cache_size = -64000")   # 64MB cache (negative = KB)
    conn.execute("PRAGMA temp_store = MEMORY")   # Temp tables in RAM
    conn.execute("PRAGMA mmap_size = 268435456") # 256MB memory-mapped I/O
    conn.execute("PRAGMA page_size = 8192")      # Must be set before data
    conn.execute("PRAGMA busy_timeout = 5000")   # Wait 5s on lock, not fail instantly
```

**What these do:**
- `synchronous = NORMAL`: Trade durability for speed. If you lose power mid-transaction, you might lose the last transaction but won't corrupt the DB. Acceptable for most apps.
- `cache_size`: How many pages to cache in RAM. Default is 2MB, which is insane in 2025.
- `temp_store = MEMORY`: Don't write temp tables to disk. Huge win for JOINs.
- `mmap_size`: Memory-map the database file for faster reads. Set to 50% of your DB size or 256MB, whichever is smaller.
- `busy_timeout`: Don't fail immediately when another connection holds a lock. Wait a bit.

## Schema Design and Migrations That Don't Suck

SQLite has weaker schema enforcement than PostgreSQL, which means you'll shoot yourself if you're not careful.

### Type Affinity (Not Types)

SQLite has "type affinity", not strict types. This is a footgun:

```python
# This works. It shouldn't, but it does.
conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
conn.execute("INSERT INTO users (id, name) VALUES (1, 'Alice')")
conn.execute("INSERT INTO users (id, name) VALUES (2, 12345)")  # Storing int in TEXT column
conn.execute("SELECT * FROM users WHERE name = 12345").fetchone()  # Returns (2, '12345')
```

Use `STRICT` tables (SQLite 3.37+):

```python
conn.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    ) STRICT
""")
conn.execute("INSERT INTO users (id, name) VALUES (1, 12345)")  
# Raises: sqlite3.IntegrityError: cannot store INTEGER value in TEXT column
```

**Always use STRICT tables** unless you have a good reason not to.

### Migrations Without a Framework

Here's a migration system I've used before:

```python
import sqlite3
from pathlib import Path

def get_schema_version(conn: sqlite3.Connection) -> int:
    """Get current schema version, or 0 if uninitialized."""
    try:
        return conn.execute("PRAGMA user_version").fetchone()[0]
    except sqlite3.OperationalError:
        return 0

def apply_migrations(conn: sqlite3.Connection, migrations_dir: Path) -> None:
    """Apply migrations in order from migrations_dir."""
    current = get_schema_version(conn)
    migration_files = sorted(migrations_dir.glob("*.sql"))
    
    for migration_file in migration_files:
        version = int(migration_file.stem)  # e.g., "001.sql" -> 1
        if version <= current:
            continue
        
        print(f"Applying migration {version}: {migration_file.name}")
        sql = migration_file.read_text()
        
        with conn:  # Transaction
            conn.executescript(sql)
            conn.execute(f"PRAGMA user_version = {version}")
    
    print(f"Schema version: {get_schema_version(conn)}")

# Usage
conn = sqlite3.connect("app.db")
configure_connection(conn)
apply_migrations(conn, Path("migrations"))
```

Migration file `migrations/001.sql`:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL  -- Unix timestamp
) STRICT;

CREATE INDEX idx_users_email ON users(email);
```

Migration file `migrations/002.sql`:
```sql
ALTER TABLE users ADD COLUMN display_name TEXT;
```

**Why this works:**
- `PRAGMA user_version` is built into SQLite for exactly this purpose
- Migration files are numbered, applied in order
- Migrations are transactional (except `CREATE INDEX`, which is autocommit)
- No dependencies, just stdlib

## Creating Tables, Indexes, and Generated Columns

### Generated Columns (SQLite 3.31+)

Generated columns are massively underused. They're free computed indexes:

```python
conn.execute("""
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        title_lower TEXT GENERATED ALWAYS AS (lower(title)) VIRTUAL,
        word_count INTEGER GENERATED ALWAYS AS (
            length(body) - length(replace(body, ' ', '')) + 1
        ) STORED
    ) STRICT
""")

# Fast case-insensitive search
conn.execute("CREATE INDEX idx_posts_title_lower ON posts(title_lower)")
conn.execute("SELECT * FROM posts WHERE title_lower = 'hello world'")
```

**VIRTUAL vs STORED:**
- `VIRTUAL`: Computed on read, not stored on disk. Use for cheap computations.
- `STORED`: Computed on write, stored on disk. Use for expensive computations you'll query often.

Real-world example: full-text search keys:

```python
conn.execute("""
    CREATE TABLE articles (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        search_text TEXT GENERATED ALWAYS AS (
            lower(title || ' ' || content)
        ) VIRTUAL
    ) STRICT
""")

conn.execute("CREATE VIRTUAL TABLE articles_fts USING fts5(search_text, content=articles)")

# Full-text search without duplicating data
conn.execute("SELECT * FROM articles WHERE id IN (SELECT rowid FROM articles_fts WHERE search_text MATCH 'python')")
```

### Index Design

SQLite uses a B-tree for indexes. Every index is a separate file structure. Too many indexes = slow writes.

**Rules:**
1. **Primary key is always indexed** (automatically)
2. **Index foreign keys** if you're doing JOINs
3. **Index WHERE clause columns** in your hot queries
4. **Don't index low-cardinality columns** (e.g., boolean flags)

```python
# Good: Composite index for a query pattern
conn.execute("""
    CREATE TABLE events (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        timestamp INTEGER NOT NULL
    ) STRICT
""")

# If you query by user_id + timestamp, create a composite index
conn.execute("CREATE INDEX idx_events_user_time ON events(user_id, timestamp)")

# Query optimizer will use this index
conn.execute("SELECT * FROM events WHERE user_id = ? AND timestamp > ?", (123, 1700000000))
```

**Use `EXPLAIN QUERY PLAN` to verify:**

```python
for row in conn.execute("EXPLAIN QUERY PLAN SELECT * FROM events WHERE user_id = 123"):
    print(row)
# Output: SEARCH events USING INDEX idx_events_user_time (user_id=?)
```

If you see `SCAN TABLE`, you're missing an index.

## Connection Management and Threading Model

This is where most production bugs come from. SQLite has a single file lock. Your Python code has threads. These don't mix well by default.

### The Default Pattern

```python
import sqlite3
from threading import Thread

conn = sqlite3.connect("app.db")  # Global connection

def worker():
    conn.execute("INSERT INTO logs (message) VALUES (?)", ("test",))

threads = [Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

# Result: sqlite3.ProgrammingError: SQLite objects created in a thread 
# can only be used in that same thread.
```

SQLite connections are **not thread-safe** by default. The `check_same_thread` check exists to save you from yourself.

### Pattern 1: One Connection Per Thread

```python
import sqlite3
from threading import local

thread_local = local()

def get_connection() -> sqlite3.Connection:
    """Get a connection for the current thread."""
    if not hasattr(thread_local, "connection"):
        thread_local.connection = sqlite3.connect("app.db")
        configure_connection(thread_local.connection)
    return thread_local.connection

def worker():
    conn = get_connection()
    with conn:
        conn.execute("INSERT INTO logs (message) VALUES (?)", ("test",))

# Now this works
threads = [Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

This works but doesn't scale. Each thread holds a connection, and WAL mode still only allows **one writer at a time**. If you have 100 threads, 99 are blocked waiting for the lock.

### Pattern 2: Connection Pool with Queue

```python
import sqlite3
from queue import Queue
from contextlib import contextmanager
from typing import Iterator

class ConnectionPool:
    def __init__(self, database: str, pool_size: int = 5):
        self.database = database
        self.pool = Queue(maxsize=pool_size)
        for _ in range(pool_size):
            conn = sqlite3.connect(database, check_same_thread=False)
            configure_connection(conn)
            self.pool.put(conn)
    
    @contextmanager
    def get_connection(self) -> Iterator[sqlite3.Connection]:
        conn = self.pool.get()
        try:
            yield conn
        finally:
            self.pool.put(conn)

# Usage
pool = ConnectionPool("app.db", pool_size=5)

def worker():
    with pool.get_connection() as conn:
        with conn:
            conn.execute("INSERT INTO logs (message) VALUES (?)", ("test",))
```

**Why this works:**
- Limits concurrent connections to `pool_size`
- `check_same_thread=False` disables SQLite's built-in safety check that prevents using a connection object in a different thread than where it was created. By default, if you create a connection in thread A and try to execute a query from thread B, SQLite raises an error. Setting this to `False` removes that restriction, allowing you to pass connection objects between threads. However, you still need external synchronization (like our Queue) to prevent concurrent access to the same connection object from multiple threads simultaneously.
- Context manager ensures connections are returned to pool
- Write serialization is handled by SQLite's file lock

## Pooling Strategies

### ThreadPoolExecutor + contextmanager

For CPU-bound tasks with occasional DB writes:

```python
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager

@contextmanager
def get_db():
    conn = sqlite3.connect("app.db", check_same_thread=False)
    configure_connection(conn)
    try:
        yield conn
    finally:
        conn.close()

def process_item(item_id: int) -> None:
    # Heavy CPU work
    result = expensive_computation(item_id)
    
    # Quick DB write
    with get_db() as conn:
        with conn:
            conn.execute("INSERT INTO results (item_id, value) VALUES (?, ?)", (item_id, result))

# Process 100 items with 10 workers
with ThreadPoolExecutor(max_workers=10) as executor:
    executor.map(process_item, range(100))
```

This pattern works because each task gets its own short-lived connection. No connection pool needed.

### sqlite3.connect(..., check_same_thread=False) Pitfalls

Disabling the thread check is safe **if**:
1. You never share connections between threads **without proper locking**
2. You understand that writes are still serialized by SQLite's lock
3. You're not trying to work around the single-writer limitation

**The footgun:**

```python
# This compiles. This runs. This corrupts your data.
conn = sqlite3.connect("app.db", check_same_thread=False)

def writer_thread():
    for i in range(1000):
        conn.execute("INSERT INTO data (value) VALUES (?)", (i,))
        conn.commit()  # Explicit commit

threads = [Thread(target=writer_thread) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

# Result: Missing rows, database corruption, or "database is locked" errors
```

**Why it breaks:** You're calling `commit()` from multiple threads on the same connection object. Python's sqlite3 module is not thread-safe at the connection level even with `check_same_thread=False`.

### Third-Party Pools

**SQLAlchemy (overkill but battle-tested):**

```python
from sqlalchemy import create_engine, text

engine = create_engine(
    "sqlite:///app.db",
    connect_args={"check_same_thread": False},
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10
)

def worker():
    with engine.connect() as conn:
        conn.execute(text("INSERT INTO logs (message) VALUES (:msg)"), {"msg": "test"})
        conn.commit()
```

**aiosqlite (for async):**

```python
import aiosqlite
import asyncio

async def write_log(message: str):
    async with aiosqlite.connect("app.db") as conn:
        await conn.execute("PRAGMA journal_mode = WAL")
        await conn.execute("INSERT INTO logs (message) VALUES (?)", (message,))
        await conn.commit()

asyncio.run(write_log("test"))
```

### FastAPI + Synchronous Routes

This is the "it works on my machine" trap. FastAPI runs routes in a thread pool by default:

```python
from fastapi import FastAPI
import sqlite3

app = FastAPI()

# WRONG: Global connection
conn = sqlite3.connect("app.db")

@app.get("/users/{user_id}")
def get_user(user_id: int):
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return {"user": row}

# This will crash with "SQLite objects created in a thread can only be used in that same thread"
```

**Fix: Thread-local connections**

```python
from threading import local

thread_local = local()

def get_db() -> sqlite3.Connection:
    if not hasattr(thread_local, "conn"):
        thread_local.conn = sqlite3.connect("app.db", check_same_thread=False)
        configure_connection(thread_local.conn)
    return thread_local.conn

@app.get("/users/{user_id}")
def get_user(user_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return {"user": row}
```

**Better: Dependency injection**

```python
from fastapi import Depends

def get_db_connection():
    conn = sqlite3.connect("app.db", check_same_thread=False)
    configure_connection(conn)
    try:
        yield conn
    finally:
        conn.close()

@app.get("/users/{user_id}")
def get_user(user_id: int, conn = Depends(get_db_connection)):
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return {"user": row}
```

### FastAPI + Async with aiosqlite

```python
import aiosqlite
from fastapi import FastAPI

app = FastAPI()

async def get_db():
    async with aiosqlite.connect("app.db") as conn:
        await conn.execute("PRAGMA journal_mode = WAL")
        yield conn

@app.get("/users/{user_id}")
async def get_user(user_id: int, conn = Depends(get_db)):
    async with conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)) as cursor:
        row = await cursor.fetchone()
    return {"user": row}
```

**Async doesn't magically fix SQLite's single-writer limitation.** It just lets you do other work while waiting for locks.

## Backup and Restore Options

Backups are non-negotiable. Here's what actually works in production.

### Online Backup API (Best for Hot Backups)

```python
import sqlite3
from pathlib import Path

def backup_database(source: str, destination: str) -> None:
    """Backup database while it's being used."""
    src = sqlite3.connect(source)
    dst = sqlite3.connect(destination)
    
    with dst:
        src.backup(dst, pages=100, progress=lambda status, remaining, total: 
            print(f"Backup: {(total - remaining) / total * 100:.1f}%"))
    
    src.close()
    dst.close()

# Run this in a background thread/cron
backup_database("app.db", f"backups/app-{datetime.now().isoformat()}.db")
```

**Why this is good:**
- Works while the database is in use
- Doesn't block writers for long (copies 100 pages at a time)
- Produces a consistent snapshot

### VACUUM INTO (SQLite 3.27+)

```python
# Backup + compress in one step
conn.execute(f"VACUUM INTO 'backups/app-{datetime.now().isoformat()}.db'")
```

This is faster than the backup API and produces a smaller file (removes deleted data), but blocks all writes for the duration.

### .backup Command (CLI)

```bash
sqlite3 app.db ".backup 'app-backup.db'"
```

Same as the Python API but from the shell. Useful for cron jobs.

### Litestream (Continuous Replication)

If you need point-in-time recovery:

```bash
# Install litestream
brew install litestream  # or download binary

# litestream.yml
dbs:
  - path: /path/to/app.db
    replicas:
      - url: s3://my-bucket/app.db
```

```bash
# Run alongside your app
litestream replicate
```

Litestream streams WAL changes to S3/Azure/GCS in real-time. If your disk dies, restore from the last second:

```bash
litestream restore -o app.db s3://my-bucket/app.db
```

**This is the closest SQLite gets to PostgreSQL WAL streaming replication.**

### sqlite-backup (Python Package)

```bash
pip install sqlite-backup
```

```python
from sqlite_backup import backup

backup(
    source="app.db",
    dest="s3://my-bucket/backups/app.db",
    compression="gzip",
    encryption_key="your-key"
)
```

Handles S3/GCS uploads, compression, encryption. Good for scheduled backups.

## Performance Expectations and Hard Limitations

Let's talk numbers. These are from a 2023 M1 MacBook Pro with an NVMe SSD, WAL mode enabled.

### Read Performance

**Single-threaded sequential reads:**
```python
# Test: SELECT on 1M rows with indexed column
start = time.time()
for i in range(10000):
    conn.execute("SELECT * FROM users WHERE id = ?", (random.randint(1, 1000000),))
elapsed = time.time() - start
print(f"QPS: {10000 / elapsed:.0f}")  # ~25,000 QPS
```

**Multi-threaded reads (8 threads):**
```python
# Same query, 8 threads
# QPS: ~120,000 (scales linearly with cores)
```

WAL mode allows unlimited concurrent readers. This is why SQLite crushes PostgreSQL for read-heavy workloads on a single machine.

### Write Performance

**Single-threaded inserts (no transaction):**
```python
for i in range(1000):
    conn.execute("INSERT INTO users (name) VALUES (?)", (f"user{i}",))
    conn.commit()
# Time: 4.5 seconds (~222 inserts/sec)
```

**Single-threaded inserts (batched transaction):**
```python
with conn:
    for i in range(1000):
        conn.execute("INSERT INTO users (name) VALUES (?)", (f"user{i}",))
# Time: 0.05 seconds (~20,000 inserts/sec)
```

**The lesson:** Batch your writes. Every commit is a disk fsync.

**Multi-threaded writes (8 threads, batched):**
```python
# 8 threads, each inserting 1000 rows in a transaction
# Time: 0.8 seconds (~10,000 inserts/sec total)
```

**Why slower?** The single-writer lock. Only one thread can hold the write lock at a time. The other 7 are blocked.

## Use Cases Where SQLite Wins Hard

**1. Analytics Pipelines**
- Ingest millions of rows/day from Kafka
- Process in batches of 10k rows
- Single writer, no concurrency needed
- 10x faster than pushing to PostgreSQL over the network

```python
with conn:
    conn.executemany("INSERT INTO events VALUES (?, ?, ?)", batch)
# Handles 100k inserts/sec sustained
```

**2. Static Site Generators**
- Build-time database for content
- Ship the .db file to production
- Serve reads from edge workers (Cloudflare Workers Durable Objects)
- Zero operational overhead

**3. CLI Tools**
- Store configuration, cache, state
- No daemon to start, no port to conflict
- Works offline

```python
# Example: CLI tool tracking command history
def log_command(cmd: str):
    conn = sqlite3.connect(Path.home() / ".my-tool" / "history.db")
    conn.execute("INSERT INTO commands (cmd, timestamp) VALUES (?, ?)", 
                 (cmd, int(time.time())))
    conn.commit()
```

**4. Testing**
- Spin up a database in 1ms
- No Docker, no external process
- Parallel test runs with isolated DBs

```python
@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")  # In-memory DB
    setup_schema(conn)
    yield conn
    conn.close()
```

**5. Embedded Apps**
- Mobile apps (iOS, Android)
- Desktop software (VS Code uses SQLite for extension storage)

## Use Cases That Will Not Work with SQLite

**1. High-Concurrency Web APIs**

```python
@app.post("/subscriptions")
async def subscribe(subscription: Subscription):
    # 100 requests/sec hit this endpoint
    async with aiosqlite.connect("app.db") as conn:
        await conn.execute("INSERT INTO subscriptions (...) VALUES (...)")
        await conn.commit()
```

**Why it fails:** 
- The single-writer lock serializes all writes. At 100 writes/sec, you're at the edge of SQLite's comfort zone. Any spike and latency explodes.
- **No sharding support**: You can't distribute writes across multiple SQLite instances like you can with PostgreSQL/MySQL partitioning.
- **No built-in replication**: When your single server dies, your database dies with it.
- **No horizontal scaling**: Can't add more database servers to handle more load. You're stuck on one machine.

**Fix:** Use PostgreSQL with connection pooling and read replicas, or architect your way out (event queue + background worker that batches writes).

**2. Network File Systems**

```python
# NFS-mounted /mnt/shared/app.db
conn = sqlite3.connect("/mnt/shared/app.db")
```

**This will corrupt your database.** NFS file locking is broken. Even if it works 99% of the time, the 1% will destroy your data.

**Fix:** Don't. SQLite requires local disk.

**3. Replication**

SQLite has no built-in replication. Litestream is the closest thing, and it's one-way.

**Fix:** If you need multi-master replication, use PostgreSQL or CockroachDB.

## Monitoring, Observability, and Debugging Checklist

**Things to log/monitor:**

```python
import sqlite3

def get_db_stats(conn: sqlite3.Connection) -> dict:
    """Collect key metrics."""
    stats = {}
    
    # File size
    stats["size_mb"] = Path(conn.execute("PRAGMA database_list").fetchone()[2]).stat().st_size / 1024 / 1024
    
    # Page count
    stats["page_count"] = conn.execute("PRAGMA page_count").fetchone()[0]
    
    # Freelist (deleted pages not yet reclaimed)
    stats["freelist_count"] = conn.execute("PRAGMA freelist_count").fetchone()[0]
    
    # WAL file size
    wal_path = Path(conn.execute("PRAGMA database_list").fetchone()[2]).with_suffix(".db-wal")
    stats["wal_size_mb"] = wal_path.stat().st_size / 1024 / 1024 if wal_path.exists() else 0
    
    # Cache hit rate (needs PRAGMA compile_options to enable)
    # stats["cache_hit_rate"] = ...
    
    return stats
```

**Red flags:**
- WAL file growing unbounded (checkpoint not running)
- Freelist > 20% of page count (need VACUUM)
- Database size growing but row count stable (fragmentation)

**Enable query logging:**

```python
def trace_queries(conn: sqlite3.Connection):
    """Log all queries with execution time."""
    def tracer(sql):
        start = time.time()
        result = conn.execute(sql)
        elapsed = time.time() - start
        if elapsed > 0.1:  # Log slow queries
            print(f"SLOW QUERY ({elapsed:.2f}s): {sql}")
        return result
    
    conn.set_trace_callback(lambda sql: print(f"SQL: {sql}"))
```

**Check for missing indexes:**

```python
# Run EXPLAIN QUERY PLAN on your hot queries
for row in conn.execute("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?", ("test@example.com",)):
    print(row)
# If you see "SCAN TABLE", add an index
```

**Checkpoint manually if needed:**

```python
# Force WAL checkpoint (flushes WAL to main DB)
conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
```

## Production Recommendations

### Checklist

- [ ] **Use WAL mode** (`PRAGMA journal_mode = WAL`)
- [ ] **Use STRICT tables** (SQLite 3.37+)
- [ ] **Set page_size to 8192 or 16384** before creating tables
- [ ] **Configure cache_size** to at least 64MB
- [ ] **Set busy_timeout** to 5000ms minimum
- [ ] **Enable synchronous = NORMAL** (not FULL, unless you need it)
- [ ] **Use AUTOINCREMENT** for primary keys (prevents reuse)
- [ ] **Add indexes** for all foreign keys and WHERE clause columns
- [ ] **Batch writes** in transactions (1000+ rows per transaction)
- [ ] **Monitor WAL size** and checkpoint regularly
- [ ] **Test with PRAGMA integrity_check** after migrations
- [ ] **Set up automated backups** (litestream or cron + backup API)
- [ ] **Use connection pooling** if you have > 10 threads
- [ ] **Never use SQLite on NFS/EFS/SMB**
- [ ] **Test failover** (what happens if the disk fills up?)

### Hard No-Gos

**Don't:**
- Use DELETE journal mode in production
- Put SQLite on a network file system
- Share connections between threads without pooling
- Run without backups
- Use it for high-concurrency writes (> 100/sec sustained)
- Store BLOBs > 10MB (use filesystem + store path)
- Rely on it for multi-tenant isolation
- Use autocommit for bulk inserts

### "If You Do This, At Least..."

**If you must use SQLite for a web API:**
- Use WAL mode
- Use a connection pool (max 5-10 connections)
- Batch writes with a background queue
- Monitor write latency and fail fast if it spikes
- Have a migration path to PostgreSQL ready

**If you must store large files:**
- Store them on disk, put the path in SQLite
- Or use `BLOB` with streaming (`.read()` / `.write()`)
- Never load a 100MB BLOB into RAM

**If you have multiple writers:**
- You don't. You have a single-writer problem.
- Use a queue (Redis, RabbitMQ) to serialize writes
- Or switch to PostgreSQL/MySQL

**If you need replication:**
- Use litestream for one-way replication to S3
- Or accept that you need another solution

## Final Thoughts

SQLite is fast, reliable, and simple when you stay within its design constraints. The moment you fight those constraints (network storage, high write concurrency, multi-master replication), you're in pain.

Use it for embedded systems, analytics pipelines, CLI tools, testing, and read-heavy apps. Don't use it for multi-tenant SaaS, high-concurrency APIs, or anything that needs replication.

If you follow the PRAGMAs in this guide, use WAL mode, batch your writes, and respect the single-writer rule, SQLite will outlive your company.

When in doubt, start with SQLite. Migrate to PostgreSQL when you hit the wall. You'll know when you do.

## Complete Working Example

Here's a production-ready pattern with best configuration, table creation, indexes, and all CRUD operations:

```python
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator, Optional


def configure_connection(conn: sqlite3.Connection) -> None:
    """Apply production-grade settings."""
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA cache_size = -64000")   # 64MB
    conn.execute("PRAGMA temp_store = MEMORY")
    conn.execute("PRAGMA mmap_size = 268435456") # 256MB
    conn.execute("PRAGMA busy_timeout = 5000")
    # Note: page_size must be set before any tables exist
    conn.execute("PRAGMA page_size = 8192")


@contextmanager
def get_db(db_path: str = "production.db") -> Iterator[sqlite3.Connection]:
    """Context manager for database connections."""
    conn = sqlite3.connect(db_path)
    configure_connection(conn)
    conn.row_factory = sqlite3.Row  # Access columns by name
    try:
        yield conn
    finally:
        conn.close()


def init_database(db_path: str = "production.db") -> None:
    """Initialize database schema with indexes."""
    with get_db(db_path) as conn:
        # Drop existing table for clean demo
        conn.execute("DROP TABLE IF EXISTS users")
        
        # Create table with STRICT mode for type safety
        conn.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL,
                age INTEGER,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at INTEGER NOT NULL,
                last_login INTEGER
            ) STRICT
        """)
        
        # Create indexes for common query patterns
        conn.execute("CREATE INDEX idx_users_email ON users(email)")
        conn.execute("CREATE INDEX idx_users_active_created ON users(is_active, created_at)")
        conn.execute("CREATE INDEX idx_users_username ON users(username)")
        
        conn.commit()
        print("Database schema initialized")


def insert_users_batch(users: list[dict]) -> int:
    """Insert multiple users in a single transaction (fast)."""
    with get_db() as conn:
        with conn:  # Automatic transaction
            cursor = conn.executemany(
                """
                INSERT INTO users (email, username, age, is_active, created_at)
                VALUES (:email, :username, :age, :is_active, :created_at)
                """,
                users
            )
            return cursor.rowcount


def insert_user(email: str, username: str, age: Optional[int] = None) -> int:
    """Insert a single user, return the new user ID."""
    with get_db() as conn:
        with conn:
            cursor = conn.execute(
                """
                INSERT INTO users (email, username, age, is_active, created_at)
                VALUES (?, ?, ?, 1, ?)
                """,
                (email, username, age, int(time.time()))
            )
            return cursor.lastrowid


def get_user_by_email(email: str) -> Optional[dict]:
    """Retrieve user by email (uses index)."""
    with get_db() as conn:
        cursor = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None


def get_active_users(limit: int = 100) -> list[dict]:
    """Get active users sorted by creation date (uses index)."""
    with get_db() as conn:
        cursor = conn.execute(
            """
            SELECT id, email, username, age, created_at
            FROM users
            WHERE is_active = 1
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (limit,)
        )
        return [dict(row) for row in cursor.fetchall()]


def update_last_login(user_id: int) -> bool:
    """Update user's last login timestamp."""
    with get_db() as conn:
        with conn:
            cursor = conn.execute(
                "UPDATE users SET last_login = ? WHERE id = ?",
                (int(time.time()), user_id)
            )
            return cursor.rowcount > 0


def deactivate_user(email: str) -> bool:
    """Soft delete: mark user as inactive."""
    with get_db() as conn:
        with conn:
            cursor = conn.execute(
                "UPDATE users SET is_active = 0 WHERE email = ?",
                (email,)
            )
            return cursor.rowcount > 0


def search_users(query: str) -> list[dict]:
    """Search users by username (uses index)."""
    with get_db() as conn:
        cursor = conn.execute(
            """
            SELECT id, email, username, created_at
            FROM users
            WHERE username LIKE ? AND is_active = 1
            LIMIT 50
            """,
            (f"%{query}%",)
        )
        return [dict(row) for row in cursor.fetchall()]


def get_database_stats() -> dict:
    """Get database statistics for monitoring."""
    with get_db() as conn:
        stats = {}
        stats["page_size"] = conn.execute("PRAGMA page_size").fetchone()[0]
        stats["page_count"] = conn.execute("PRAGMA page_count").fetchone()[0]
        stats["freelist_count"] = conn.execute("PRAGMA freelist_count").fetchone()[0]
        stats["journal_mode"] = conn.execute("PRAGMA journal_mode").fetchone()[0]
        
        db_path = Path("production.db")
        stats["size_mb"] = db_path.stat().st_size / (1024 * 1024) if db_path.exists() else 0
        
        wal_path = db_path.with_suffix(".db-wal")
        stats["wal_size_mb"] = wal_path.stat().st_size / (1024 * 1024) if wal_path.exists() else 0
        
        # Count active users
        cursor = conn.execute("SELECT COUNT(*) FROM users WHERE is_active = 1")
        stats["active_users"] = cursor.fetchone()[0]
        
        return stats


if __name__ == "__main__":
    print("=" * 60)
    print("SQLite Production Example")
    print("=" * 60)
    
    # Initialize
    init_database()
    
    # Batch insert (fast)
    print("\n[1] Batch inserting 1000 users...")
    start = time.time()
    batch_users = [
        {
            "email": f"user{i}@example.com",
            "username": f"user_{i}",
            "age": 20 + (i % 50),
            "is_active": 1,
            "created_at": int(time.time()) - (i * 60)  # Stagger timestamps
        }
        for i in range(1000)
    ]
    inserted = insert_users_batch(batch_users)
    elapsed = time.time() - start
    print(f"Inserted {inserted} users in {elapsed:.3f}s ({inserted/elapsed:.0f} inserts/sec)")
    
    # Single insert
    print("\n[2] Inserting single user...")
    user_id = insert_user("alice@example.com", "alice", 28)
    print(f"Created user ID: {user_id}")
    
    # Read by email (indexed query)
    print("\n[3] Reading user by email...")
    user = get_user_by_email("alice@example.com")
    if user:
        print(f"Found: {user['username']} (ID: {user['id']})")
    
    # Update
    print("\n[4] Updating last login...")
    updated = update_last_login(user_id)
    print(f"Updated: {updated}")
    
    # Query active users
    print("\n[5] Querying active users (limit 5)...")
    active = get_active_users(limit=5)
    for u in active:
        print(f"  - {u['username']} ({u['email']})")
    
    # Search
    print("\n[6] Searching for users matching 'user_1'...")
    results = search_users("user_1")
    print(f"Found {len(results)} matches")
    
    # Soft delete
    print("\n[7] Deactivating user...")
    deactivated = deactivate_user("user50@example.com")
    print(f"Deactivated: {deactivated}")
    
    # Stats
    print("\n[8] Database statistics:")
    stats = get_database_stats()
    for key, value in stats.items():
        if "_mb" in key:
            print(f"  {key}: {value:.2f} MB")
        else:
            print(f"  {key}: {value}")
    
    # Verify index usage
    print("\n[9] Verifying index usage:")
    with get_db() as conn:
        plan = conn.execute(
            "EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?",
            ("alice@example.com",)
        ).fetchall()
        for row in plan:
            print(f"  {row}")
        if "idx_users_email" in str(plan):
            print("Index is being used!")
    
    print("\n" + "=" * 60)
    print("All operations completed successfully!")
    print("=" * 60)
```

**What this demonstrates:**

1. **Production configuration**: WAL mode, proper cache size, memory-mapped I/O
2. **STRICT tables**: Type safety to catch bugs early
3. **Strategic indexes**: On email, username, and composite (is_active, created_at)
4. **Batched inserts**: 1000 rows in a single transaction (fast)
5. **Context managers**: Automatic connection cleanup
6. **Row factory**: Access columns by name instead of index
7. **Monitoring**: Track database size, WAL size, and fragmentation
8. **Index verification**: Use EXPLAIN QUERY PLAN to confirm indexes are used

This is the pattern I use for every SQLite project. Copy it, adapt it, ship it.
