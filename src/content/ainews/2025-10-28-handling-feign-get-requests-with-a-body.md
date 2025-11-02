---
title: "Handling Feign GET Requests With a Body: A Comprehensive Guide"
pubDate: 2025-10-28
description: "Learn how to send Feign GET requests with a body in an HTTP-compliant way using Spring Cloud OpenFeign and @SpringQueryMap."
categories: ["AI News", "HTTP Client-Side", "Spring Cloud"]
---

## Handling Feign GET Requests With a Body: A Comprehensive Guide

This article explains how to handle the challenge of sending GET requests with a body using Spring Cloud OpenFeign, which strictly adheres to HTTP/1.1 standards. While GET requests are typically expected to lack a body, some APIs or legacy systems may still require this. The solution involves using `@SpringQueryMap` to serialize request parameters into URL query strings instead of a body.

---

### Key Concepts and Implementation Details

#### 1. **Understanding the HTTP Standard and Feign's Default Behavior**
- **HTTP/1.1 Specification**: GET requests are designed to retrieve data and must not include a body.
- **Common Issues**:
  - Servers and proxies may reject or ignore GET bodies, leading to errors like `405 Method Not Allowed` or `400 Bad Request`.
  - Caching layers (e.g., CDNs, browsers) may misbehave when GET requests contain unexpected bodies.
- **Feign's Default Behavior**: Spring Cloud OpenFeign does not serialize a body for GET requests by default, aligning with HTTP standards.

#### 2. **Project Setup and Dependencies**
- **Maven Dependency**:
  ```xml
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
  </dependency>
  ```
- **Enable Feign Clients**:
  ```java
  @SpringBootApplication
  @EnableFeignClients
  public class FeignDemoApplication {
    public static void main(String[] args) {
      SpringApplication.run(FeignDemoApplication.class, args);
    }
  }
  ```

#### 3. **Attempting a GET Request With a Body (and the Problem)**
- **Naive Implementation**:
  ```java
  @FeignClient(name = "sampleClient", url = "http://localhost:8080")
  public interface GetBodyFeignClient {
    @GetMapping("/api/search")
    String search(@RequestBody SearchRequest searchRequest);
  }
  ```
- **Error Outcome**:
  - Feign throws `FeignException.MethodNotAllowed` with a `405` status code.
  - Servers reject the request because GET bodies are non-compliant.

#### 4. **Solution: Using `@SpringQueryMap`**
- **Purpose**: Serialize request body fields into URL query parameters, ensuring HTTP compliance.
- **Implementation**:
  ```java
  @FeignClient(name = "sampleClient", url = "http://localhost:8080")
  public interface GetBodyFeignClient {
    @GetMapping("/api/search")
    String searchWithSpringQueryMap(@SpringQueryMap SearchRequest searchRequest);
  }
  ```
- **Generated Request**:
  ```
  GET http://localhost:8080/api/search?keyword=spring&category=tutorial
  ```
- **Impact**:
  - Avoids `405` or `400` errors.
  - Ensures compatibility with caching, proxies, and server expectations.

#### 5. **Best Practices and Recommendations**
- **When to Use `@SpringQueryMap`**:
  - For GET requests requiring complex search criteria or multiple parameters.
  - When working with legacy APIs that expect GET bodies.
- **Avoid `@RequestBody` for GETs**: Always use `@SpringQueryMap` for query parameter serialization.
- **Handling Edge Cases**:
  - Ensure `SearchRequest` fields are serializable to query parameters (e.g., `String`, `Integer`).
  - For nested objects, use `@RequestParam` explicitly or flatten the structure.

---

## Working Example

```java
// Feign Client Interface
@FeignClient(name = "sampleClient", url = "http://localhost:8080")
public interface GetBodyFeignClient {
    @GetMapping("/api/search")
    String searchWithSpringQueryMap(@SpringQueryMap SearchRequest searchRequest);
}

// Request Model
public class SearchRequest {
    private String keyword;
    private String category;
    // getters and setters
}

// Usage
SearchRequest request = new SearchRequest();
request.setKeyword("spring");
request.setCategory("tutorial");
String result = getBodyFeignClient.searchWithSpringQueryMap(request);
```

---

## Recommendations

- **Use `@SpringQueryMap` for GET Parameters**: Always prefer this over `@RequestBody` for GET requests to avoid HTTP compliance issues.
- **Test with Real APIs**: Verify that the target API accepts query parameters and does not reject GET requests with bodies.
- **Avoid Complex Data Types**: Ensure `SearchRequest` fields are simple (e.g., `String`, `Integer`) for seamless query serialization.
- **Document API Requirements**: Clearly state if an API expects GET bodies, even if non-compliant, to avoid confusion.

---

**Reference**: [Handling Feign GET Requests With a Body | Baeldung](https://www.baeldung.com/feign-http-get-request-body)