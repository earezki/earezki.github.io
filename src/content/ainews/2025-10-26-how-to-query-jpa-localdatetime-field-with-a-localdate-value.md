---
title: "Querying JPA LocalDateTime Fields with LocalDate Values"
pubDate: 2025-10-26
description: "Learn how to query LocalDateTime fields using LocalDate values in JPA via range queries, JPQL functions, and the Criteria API. Includes code examples and best practices."
categories: ["AI News", "Java Dates", "JPA"]
---

## Main Heading

This article addresses the challenge of querying a `LocalDateTime` field in JPA using a `LocalDate` value. When comparing a `LocalDateTime` (e.g., `2025-10-12T14:30:45`) with a `LocalDate` (e.g., `2025-10-12`), direct equality fails due to the time component. The article outlines multiple approaches to resolve this, including range queries, JPQL functions, and dynamic criteria-based queries.

---

### Core Problem: Type Mismatch Between LocalDateTime and LocalDate

- **Issue**: Direct comparison between `LocalDateTime` and `LocalDate` fails because `LocalDateTime` includes time, while `LocalDate` does not.
- **Example**: A repository method like `deleteByCreatedAt(LocalDate createdAt)` throws an error:
  ```
  Parameter value [2024-01-15] did not match expected type [java.time.LocalDateTime]
  ```
- **Cause**: JPA does not implicitly convert `LocalDate` to `LocalDateTime` for equality checks.

---

### Solution 1: Range Queries (Recommended)

- **Approach**: Convert `LocalDate` to a `LocalDateTime` range (start of day to midnight of the next day).
- **Implementation**:
  - Define a repository method:
    ```java
    List<Event> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    ```
  - Convert `LocalDate` to `LocalDateTime` boundaries:
    ```java
    LocalDate date = LocalDate.of(2025, 10, 12);
    LocalDateTime startOfDay = date.atStartOfDay();
    LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
    List<Event> results = eventRepository.findByCreatedAtBetween(startOfDay, endOfDay);
    ```
- **Generated SQL**:
  ```sql
  SELECT * FROM events
  WHERE created_at >= '2025-10-12T00:00:00'
  AND created_at < '2025-10-13T00:00:00';
  ```
- **Advantages**:
  - Database-agnostic.
  - Efficient and leverages indexes on `created_at`.

---

### Solution 2: JPQL with Database Functions

- **Approach**: Use database-specific `DATE()` function to extract the date from `LocalDateTime`.
- **Implementation**:
  ```java
  @Query("SELECT e FROM Event e WHERE FUNCTION('DATE', e.createdAt) = :date")
  List<Event> findByDate(@Param("date") LocalDate date);
  ```
- **Generated SQL**:
  ```sql
  SELECT * FROM events
  WHERE DATE(created_at) = '2025-10-12';
  ```
- **Limitations**:
  - Database-specific (e.g., Oracle uses `TRUNC()`).
  - May prevent index usage on `created_at`.

---

### Solution 3: Criteria API for Dynamic Queries

- **Approach**: Build queries programmatically using the Criteria API.
- **Implementation**:
  ```java
  public List<Event> findByCreatedDate(LocalDate date) {
      LocalDateTime startOfDay = date.atStartOfDay();
      LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
      CriteriaBuilder cb = entityManager.getCriteriaBuilder();
      CriteriaQuery<Event> cq = cb.createQuery(Event.class);
      Root<Event> root = cq.from(Event.class);
      cq.select(root).where(cb.between(root.get("createdAt"), startOfDay, endOfDay));
      return entityManager.createQuery(cq).getResultList();
  }
  ```
- **Use Case**: Ideal for dynamic filtering (e.g., UI-driven date selection).

---

### Solution 4: Native SQL Queries

- **Approach**: Use raw SQL for database-specific optimizations.
- **Implementation**:
  ```java
  @Query(
      value = "SELECT * FROM events WHERE created_at >= :startOfDay AND created_at < :endOfDay",
      nativeQuery = true
  )
  List<Event> findByDateRangeNative(
      @Param("startOfDay") LocalDateTime startOfDay,
      @Param("endOfDay") LocalDateTime endOfDay
  );
  ```
- **Use Case**: When native SQL is required (e.g., complex queries or legacy databases).

---

## Working Example

```java
// Convert LocalDate to LocalDateTime range
LocalDate date = LocalDate.of(2025, 10, 12);
LocalDateTime start = date.atStartOfDay();
LocalDateTime end = date.plusDays(1).atStartOfDay();

// Query using repository
List<Event> results = eventRepository.findByCreatedAtBetween(start, end);
assertEquals(3, results.size()); // Matches 3 events from 2025-10-12
```

---

## Recommendations

- **Preferred Method**: Use range queries (`between`) for performance and portability.
- **Avoid Functions on Columns**: Database functions like `DATE()` can prevent index usage.
- **Dynamic Queries**: Use the Criteria API for flexible, type-safe queries.
- **Time Zones**: Ensure `LocalDateTime` values are in the correct time zone (e.g., use `ZoneId.systemDefault()` if needed).
- **Testing**: Validate queries with sample data (e.g., H2 database with `data.sql`).

---

## Potential Pitfalls

- **Incorrect Time Ranges**: Forgetting to include the end-of-day boundary (e.g., `endOfDay` should be exclusive).
- **Database Incompatibility**: Using `FUNCTION('DATE', ...)` may fail on databases without `DATE()` support.
- **Index Ignorance**: Queries using functions may not leverage indexes, leading to slower performance on large tables.

---

**Reference**: [https://www.baeldung.com/java-jpa-query-localdatetime-with-localdate](https://www.baeldung.com/java-jpa-query-localdatetime-with-localdate)