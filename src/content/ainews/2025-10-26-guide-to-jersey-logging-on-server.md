---
title: "Guide to Jersey Logging on Server | Baeldung"
pubDate: 2025-10-26
description: "Learn how Jersey makes enabling and customizing server-side logging easy."
categories: ["AI News", "Logging", "Jersey"]
---

## Guide to Jersey Logging on Server | Baeldung

This article provides a comprehensive guide to enabling, configuring, and customizing logging in a **Jersey server application** using **SLF4J** as the logging backend. It covers both built-in logging features and advanced custom logging via JAX-RS filters, along with integration testing strategies to validate logging behavior.

---

## 1. Introduction

Jersey, a JAX-RS implementation, simplifies logging in RESTful web services by offering built-in features and extensibility through custom filters. This tutorial demonstrates:
- How to log HTTP requests/responses using `LoggingFeature`.
- How to implement custom logging filters with `ContainerRequestFilter` and `ContainerResponseFilter`.
- How to verify logging behavior via integration tests.

---

## 2. Scenario Setup

### 2.1. Minimal Jersey Server Configuration

A basic Jersey server requires:
- A REST endpoint (e.g., `LoggingResource`).
- A configuration class (`JerseyServerLoggingApp`) to register resources and filters.

Example endpoint:
```java
@Path("/logging")
public class LoggingResource {
    @GET
    public String get() {
        return "Hello";
    }
}
```

Registration in the application:
```java
public class JerseyServerLoggingApp extends ResourceConfig {
    public JerseyServerLoggingApp() {
        register(LoggingResource.class);
        // Additional filters/configurations
    }
}
```

---

## 3. Enabling Built-in Logging with `LoggingFeature`

Jersey provides a `LoggingFeature` for logging HTTP traffic. Key parameters:
- **Logger**: SLF4J logger instance.
- **Log Level**: e.g., `Level.INFO`.
- **Verbosity**: Controls what is logged (e.g., `PAYLOAD_ANY` logs headers, payload).
- **Max Entity Size**: Limits logged payload size to avoid excessive logs (e.g., 8192 bytes = 8 KiB).

Example configuration:
```java
register(new LoggingFeature(
    Logger.getLogger(LoggingFeature.DEFAULT_LOGGER_NAME),
    Level.INFO,
    LoggingFeature.Verbosity.PAYLOAD_ANY,
    8192
));
```

**Impact**: Logs all request/response payloads up to 8 KiB, ideal for debugging without overwhelming log files.

---

## 4. Implementing Custom Logging Filters

For fine-grained control, use **JAX-RS filters** (`ContainerRequestFilter` and `ContainerResponseFilter`).

### 4.1. Custom Filter Implementation

Example filter logging HTTP method, URI, and status code:
```java
@Provider
public class CustomServerLoggingFilter
    implements ContainerRequestFilter, ContainerResponseFilter {
    static final Logger LOG = LoggerFactory.getLogger(CustomServerLoggingFilter.class);

    @Override
    public void filter(ContainerRequestContext requestContext) {
        LOG.info("Incoming request: {} {}", 
            requestContext.getMethod(), 
            requestContext.getUriInfo().getRequestUri());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, 
                       ContainerResponseContext responseContext) {
        LOG.info("Outgoing response: {} {} - Status {}",
            requestContext.getMethod(),
            requestContext.getUriInfo().getRequestUri(),
            responseContext.getStatus());
    }
}
```

**Purpose**: Captures detailed logs for every request and response, useful for auditing or debugging.

### 4.2. Registering the Filter

Add the filter to the application configuration:
```java
register(CustomServerLoggingFilter.class);
```

---

## 5. Integration Testing for Logging

Use **Grizzly HTTP server** and **SLF4J's `ListAppender`** to verify logs programmatically.

### 5.1. Server Setup in Tests

```java
class JerseyLoggingIntegrationTest {
    private static HttpServer server;
    private static final URI BASE_URI = URI.create("http://localhost:8080/api");

    @BeforeAll
    static void setup() throws IOException {
        server = GrizzlyHttpServerFactory.createHttpServer(BASE_URI, new JerseyLoggingServerApp());
    }

    @AfterAll
    static void teardown() {
        server.shutdownNow();
    }
}
```

### 5.2. Logging Verification

Capture logs using `ListAppender` and assert expected messages:
```java
@Test
void whenRequestMadeWithLoggingFilter_thenCustomLogsAreWritten() {
    Logger logger = (Logger) LoggerFactory.getLogger(CustomServerLoggingFilter.class);
    ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
    listAppender.start();
    logger.addAppender(listAppender);
    listAppender.list.clear();

    Response response = ClientBuilder.newClient()
        .target(BASE_URI + "/logging")
        .request()
        .get();

    assertEquals(200, response.getStatus());

    boolean requestLogFound = listAppender.list.stream().anyMatch(
        event -> event.getFormattedMessage().contains(
            "Incoming request: GET http://localhost:8080/api/logging"));
    boolean responseLogFound = listAppender.list.stream().anyMatch(
        event -> event.getFormattedMessage().contains(
            "Outgoing response: GET http://localhost:8080/api/logging - Status 200"));

    assertEquals(true, requestLogFound);
    assertEquals(true, responseLogFound);
    logger.detachAppender(listAppender);
}
```

**Impact**: Ensures logging filters work as expected during runtime.

---

## 6. Recommendations

### For Built-in Logging
- Use `LoggingFeature.Verbosity.PAYLOAD_ANY` for full visibility but set a reasonable `maxEntitySize` (e.g., 8 KiB) to avoid bloated logs.
- Avoid logging sensitive data (e.g., passwords) in payloads.

### For Custom Filters
- **Use `@Provider`** to make filters discoverable by Jersey.
- **Log only necessary details** (e.g., method, URI, status) to keep logs readable.
- **Detach appenders** after tests to prevent memory leaks.

### Integration Testing
- Use `ListAppender` to capture logs programmatically.
- Always clear previous logs before tests to avoid false positives.

---

## Working Example (Custom Logging Filter)

```java
@Provider
public class CustomServerLoggingFilter implements ContainerRequestFilter, ContainerResponseFilter {
    static final Logger LOG = LoggerFactory.getLogger(CustomServerLoggingFilter.class);

    @Override
    public void filter(ContainerRequestContext requestContext) {
        LOG.info("Incoming request: {} {}", 
            requestContext.getMethod(), 
            requestContext.getUriInfo().getRequestUri());
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        LOG.info("Outgoing response: {} {} - Status {}",
            requestContext.getMethod(),
            requestContext.getUriInfo().getRequestUri(),
            responseContext.getStatus());
    }
}
```

**Usage**: Register in `ResourceConfig` and test with integration tests.

---

## Conclusion

Jersey simplifies server-side logging via built-in features and custom filters. While `LoggingFeature` is sufficient for most scenarios, custom filters offer full control for advanced use cases. Integration tests ensure logging behavior is validated rigorously.

For the complete source code, refer to [Baeldung's GitHub repository](https://www.baeldung.com/java-jersey-logging-server).

```text
Reference: https://www.baeldung.com/java-jersey-logging-server
```