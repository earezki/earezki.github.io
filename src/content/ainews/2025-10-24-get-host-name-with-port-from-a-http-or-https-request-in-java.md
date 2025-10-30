---
title: "Extracting Hostname and Port from HTTP Requests in Java"
pubDate: 2025-10-24
description: "A comprehensive guide to retrieving the hostname and port from HTTP/HTTPS requests in Java, covering standard APIs, Spring utilities, and proxy handling."
categories: ["AI News", "Java Web", "Web Development"]
---

## Main Heading

This article explores multiple methods to extract the hostname and port from HTTP or HTTPS requests in Java, addressing use cases such as generating URLs, debugging, and handling reverse proxies. The solutions range from standard Java Servlet APIs to Spring-specific utilities and proxy header configurations.

---

### 1. **Standard `HttpServletRequest` Approach**

The `HttpServletRequest` interface provides direct access to the scheme (HTTP/HTTPS), server name, and port. This method is ideal for basic use cases where no proxy or advanced URL parsing is required.

- **Key Implementation**:
  ```java
  public static String getHostWithPort(HttpServletRequest request) {
      String scheme = request.getScheme();
      String serverName = request.getServerName();
      int serverPort = request.getServerPort();
      boolean isDefaultPort = ("http".equals(scheme) && serverPort == 80) || ("https".equals(scheme) && serverPort == 443);
      return isDefaultPort 
          ? String.format("%s://%s", scheme, serverName) 
          : String.format("%s://%s:%d", scheme, serverName, serverPort);
  }
  ```
- **Purpose**: Constructs a clean URL by omitting default ports (80 for HTTP, 443 for HTTPS).
- **Impact**: Ensures consistency in generated URLs, avoiding unnecessary port numbers.
- **Limitation**: Does not account for reverse proxies or forwarded headers.

---

### 2. **Using `getRequestURL()` for Full URL Extraction**

The `getRequestURL()` method retrieves the full request URL, including path and query parameters. This approach is useful when the full URL is needed, but it involves parsing the string into a `URL` object.

- **Key Implementation**:
  ```java
  public static String getHostWithPortFromRequestUrl(HttpServletRequest request) {
      try {
          URL url = new URL(request.getRequestURL().toString());
          return url.getPort() == -1
              ? String.format("%s://%s", url.getProtocol(), url.getHost())
              : String.format("%s://%s:%d", url.getProtocol(), url.getHost(), url.getPort());
      } catch (MalformedURLException e) {
          throw new RuntimeException("Invalid request URL", e);
      }
  }
  ```
- **Purpose**: Extracts the host and port from the full URL string.
- **Impact**: Slightly less efficient due to URL parsing but works for both HTTP and HTTPS.
- **Limitation**: May fail if the request URL is malformed or not properly formatted.

---

### 3. **Spring’s `ServletUriComponentsBuilder`**

For Spring Boot or Spring MVC applications, `ServletUriComponentsBuilder` provides a declarative way to build URLs from the current request, automatically handling ports and schemes.

- **Key Implementation**:
  ```java
  public static String getBaseUrl() {
      return ServletUriComponentsBuilder.fromCurrentRequestUri()
          .replacePath(null)
          .build()
          .toUriString();
  }
  ```
- **Purpose**: Constructs the base URL (scheme + host + port) without manual parsing.
- **Impact**: Clean and concise syntax, ideal for Spring-based applications.
- **Limitation**: Requires a Spring web context and does not handle proxy headers by default.

---

### 4. **Handling Reverse Proxies with `X-Forwarded-*` Headers**

In production environments, applications often sit behind reverse proxies (e.g., Nginx, Cloudflare). These proxies may alter the host and port, necessitating the use of forwarded headers.

- **Key Implementation**:
  ```java
  public static String getForwardedHost(HttpServletRequest request) {
      String forwardedHost = request.getHeader("X-Forwarded-Host");
      String forwardedProto = request.getHeader("X-Forwarded-Proto");
      String forwardedPort = request.getHeader("X-Forwarded-Port");
      String scheme = forwardedProto != null ? forwardedProto : request.getScheme();
      String host = forwardedHost != null ? forwardedHost : request.getServerName();
      String port = forwardedPort != null ? forwardedPort : String.valueOf(request.getServerPort());
      boolean isDefaultPort = ("http".equals(scheme) && "80".equals(port))
          || ("https".equals(scheme) && "443".equals(port));
      return isDefaultPort 
          ? String.format("%s://%s", scheme, host) 
          : String.format("%s://%s:%s", scheme, host, port);
  }
  ```
- **Purpose**: Retrieves the client-facing URL by inspecting proxy headers.
- **Impact**: Ensures accurate host/port information when behind load balancers or CDNs.
- **Best Practice**: Enable `ForwardedHeaderFilter` in Spring Boot to automatically handle these headers.

---

### 5. **Recommendations**

- **Use `HttpServletRequest`** for simple, standalone applications where proxy headers are not required.
- **Prefer `ServletUriComponentsBuilder`** in Spring-based projects for cleaner, declarative URL building.
- **Always handle proxy headers** in production to ensure correct client-facing URLs.
- **Validate proxy configurations** to avoid issues with missing or misconfigured `X-Forwarded-*` headers.
- **Avoid hardcoding ports** (e.g., 80/443) and use conditional checks to omit them when appropriate.

---

## Working Example

```java
import javax.servlet.http.HttpServletRequest;
import java.net.URL;

public class HostExtractor {
    public static void main(String[] args) {
        // Simulate a request with port 8080
        HttpServletRequest request = new MockHttpServletRequest("http", "localhost", 8080);
        String hostWithPort = getHostWithPort(request);
        System.out.println("Host with port: " + hostWithPort);
    }

    public static String getHostWithPort(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        boolean isDefaultPort = ("http".equals(scheme) && serverPort == 80) || ("https".equals(scheme) && serverPort == 443);
        return isDefaultPort 
            ? String.format("%s://%s", scheme, serverName) 
            : String.format("%s://%s:%d", scheme, serverName, serverPort);
    }
}
```

---

## Recommendations

- **When to Use This Approach**: 
  - Use `HttpServletRequest` for lightweight, non-Spring applications.
  - Use `ServletUriComponentsBuilder` in Spring Boot projects for cleaner URL handling.
  - Use proxy headers when deploying behind reverse proxies (e.g., Nginx, Cloudflare).

- **What to Watch Out For**:
  - Ensure proxy headers are correctly configured in production environments.
  - Avoid relying solely on `request.getServerPort()` without checking for default ports.
  - Handle `MalformedURLException` when parsing URLs from `getRequestURL()`.

---

### Reference
[https://www.baeldung.com/java-get-host-name-port-from-http-request](https://www.baeldung.com/java-get-host-name-port-from-http-request)