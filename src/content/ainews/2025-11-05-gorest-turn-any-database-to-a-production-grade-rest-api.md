---
title: "GoREST v0.1.0: Automating REST API Generation from Relational Databases"
pubDate: 2025-11-05
description: "GoREST transforms relational databases into production-grade REST APIs with auto-discovery, DTOs, JWT auth, and hooks. Learn how it streamlines API development in Go."
categories: ["AI News", "Go", "REST", "Database", "Open Source"]
---

## GoREST v0.1.0: Automating REST API Generation from Relational Databases

GoREST is an open-source tool that automates the creation of production-grade REST APIs from relational databases using Go. It eliminates manual CRUD endpoint development, Swagger documentation, and repetitive authentication logic by leveraging auto-discovery of database schemas, type-safe operations, and built-in security features. The tool supports PostgreSQL, MySQL, and SQLite, and includes advanced querying, JSON-LD support, and hooks for custom business logic.

---

### Key Features and Benefits

- **Auto-Discovery and Schema Mapping**:
  - Automatically detects database tables, columns, relations, and types.
  - Generates Go structs, DTOs, REST endpoints, and OpenAPI specs in seconds.
  - Reduces manual schema mapping and repetitive code.

- **Production-Grade Functionality**:
  - **JWT Authentication**: Built-in middleware with context-aware token validation.
  - **DTOs with Field-Level Control**: Uses `dto` tags to restrict client input/output (e.g., `dto:"read"` for read-only fields).
  - **JSON-LD Support**: Semantic web compatibility with `@context`, `@type`, and IRI conversion (e.g., `/users/{uuid}`).
  - **Advanced Querying**: Filtering, sorting, and pagination via query parameters (e.g., `GET /todos?priority[gte]=5`).
  - **Health Checks**: `/health` endpoint for monitoring and Kubernetes integration.

- **Performance**:
  - Benchmarks show sub-millisecond median response times (p50: 228µs) and 99.6% success rates under 50 concurrent users.
  - Scalable with graceful shutdown and structured logging for production environments.

- **Hooks System**:
  - **StateProcessor**: Validate/transform data (e.g., auto-populate `user_id` from JWT).
  - **SQLQueryOverride**: Replace default queries with custom SQL.
  - **Serializer**: Modify response data before sending to clients.

---

### Real-World Example: Todo API in 60 Seconds

**Database Schema**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);
CREATE TABLE todo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  ...
);
```

**Steps to Generate API**:
1. Clone the repository and configure `.env`:
   ```bash
   git clone https://github.com/nicolasbonnici/gorest.git
   cd gorest
   cp .env.example .env
   ```
2. Generate models, DTOs, and routes:
   ```bash
   make generate
   make run
   ```
3. Access endpoints at `http://localhost:3000`:
   - **CRUD Endpoints**: `/todos`, `/todos/:id`, `/users`, etc.
   - **OpenAPI Docs**: `http://localhost:3000/openapi.json`
   - **Health Check**: `http://localhost:3000/health`

---

### Security: DTOs and Field Control

GoREST enforces security through auto-generated DTOs and field-level restrictions:
- **CreateDTO**: Excludes auto-generated fields (e.g., `id`, `created_at`).
- **ResponseDTO**: Includes only client-visible fields.
- **Example**:
  ```go
  type Todo struct {
    Id        string `json:"id" db:"id"`
    UserId    *string `json:"user_id" db:"user_id" dto:"read"` // Read-only!
    Title     string `json:"title" db:"title"`
    Content   string `json:"content" db:"content"`
    CreatedAt *time.Time `json:"created_at" db:"created_at"`
  }
  ```
  - **Result**: Clients cannot send `user_id` in requests; it is populated server-side from JWT tokens.

---

### Advanced Querying and Pagination

GoREST supports:
- **Filtering**: Equality, comparison, text search, and date ranges.
- **Sorting**: Multi-field ordering via `GET /todos?order[priority]=desc&order[created_at]=asc`.
- **Pagination**: Hydra-compliant collections with `page` and `limit` parameters.
  ```json
  {
    "@context": "http://www.w3.org/ns/hydra/context.jsonld",
    "hydra:totalItems": 42,
    "hydra:view": {
      "hydra:next": "/todos?page=3"
    }
  }
  ```

---

### Working Example: Hook for Auto-Populating User ID

```go
type TodoHooks struct {
    hooks.NoOpHooks[models.Todo]
}

func (h *TodoHooks) StateProcessor(ctx context.Context, operation hooks.Operation, id any, todo *models.Todo) error {
    if operation == hooks.OperationCreate {
        if userID := ctx.Value("user_id"); userID != nil {
            if uid, ok := userID.(string); ok {
                todo.UserId = &uid
            }
        }
    }
    return nil
}
```
- **Purpose**: Ensures `user_id` is populated from the JWT context, preventing client spoofing.

---

### Recommendations

- **Use DTO Tags**: Always apply `dto:"read"` or `dto:"write"` to restrict field access.
- **Leverage Hooks**: Use `StateProcessor` for business logic (e.g., validation, auto-population).
- **Test Performance**: Run `make benchmark` to evaluate under load (requires PostgreSQL).
- **Avoid Manual Schema Changes**: GoREST auto-discovers schemas; avoid altering them post-generation.

---

### Contribution and Community

GoREST is MIT-licensed and welcomes contributions:
- **Beginner Tasks**: Improve documentation, fix typos, or add examples.
- **Advanced Tasks**: Add database support (e.g., MariaDB), implement GraphQL, or enhance benchmarks.
- **Contribution Guidelines**: Follow conventional commits and include tests for new features.

---

### URL Reference
https://dev.to/nicolasbonnici/from-a-database-to-a-rest-api-3cgf