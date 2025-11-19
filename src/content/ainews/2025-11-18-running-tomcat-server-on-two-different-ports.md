---
title: "Running Tomcat Server on Two Different Ports"
pubDate: 2025-11-18
description: "Explore methods to run a Tomcat server on multiple ports, enabling Blue-Green deployments and improved control."
categories: ["AI News", "DevOps", "Web Services"]
---

## Running Tomcat Server on Two Different Ports

Apache Tomcat, a widely used web server and servlet container, defaults to listening on a single HTTP port like 8080. However, running a Tomcat instance on multiple ports can unlock powerful deployment strategies.

This capability facilitates Blue-Green or Canary deployments, streamlines port migrations, and allows for dedicated admin or monitoring endpoints, improving overall system management.

### Why This Matters
Ideal deployment models prioritize flexibility and minimal downtime. Running Tomcat on multiple ports addresses these needs, offering alternatives to complex load balancer configurations. Without this, port migrations can require significant downtime, and isolating admin interfaces becomes difficult, potentially exposing sensitive management functions.

### Key Insights
- **Tomcat's *server.xml* configuration**: Defines connectors and ports for incoming requests.
- **Connector objects**: Allow specifying port and protocol within Tomcat code.
- **iptables port forwarding**: Enables routing traffic from one port to another at the kernel level, bypassing Tomcat configuration.

### Working Example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8005" shutdown="SHUTDOWN">
<Service name="Catalina">
<Connector port="8081" protocol="HTTP/1.1" />
<Connector port="7081" protocol="HTTP/1.1" />
<Engine name="Catalina" defaultHost="localhost">
<Host name="localhost" appBase="/tmp/tomcat-dummy" unpackWARs="false" autoDeploy="false">
<Context path="" docBase="STATIC_DIR_PLACEHOLDER" reloadable="false" />
</Host>
</Engine>
</Service>
</Server>
```

```java
public static void main(String[] args) throws Exception {
Tomcat tomcat = new Tomcat();
tomcat.setBaseDir(new File("tomcat-temp").getAbsolutePath());
tomcat.setPort(7080);
tomcat.getConnector();
Connector secondConnector = new Connector();
secondConnector.setPort(8080);
tomcat.getService().addConnector(secondConnector);
Context ctx = tomcat.addContext("", new File(".").getAbsolutePath());
Tomcat.addServlet(ctx, "portServlet", new HttpServlet() {
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
int port = req.getLocalPort();
resp.setContentType("text/plain");
resp.getWriter().write("Port: " + port + "\n");
}
});
ctx.addServletMappingDecoded("/", "portServlet");
tomcat.start();
System.out.println("Tomcat running on ports 8080 and 7080");
tomcat.getServer().await();
}
```

### Practical Applications
- **Blue-Green Deployments**: Route traffic to different Tomcat instances on separate ports for zero-downtime updates.
- **Security Risk**: Exposing admin interfaces on a non-standard port without proper security measures can increase vulnerability.

**References:**
- https://www.baeldung.com/java-tomcat-server-different-ports