---
title: "Configuring Testcontainers to Work with Podman"
pubDate: 2025-11-20
description: "Configure Testcontainers with Podman in Java projects by 2025, avoiding common pitfalls like socket and cleanup issues."
categories: ["AI News", "DevOps", "Testing"]
---

## Configuring Testcontainers to Work with Podman

Testcontainers can be configured to use Podman as a container runtime, but requires specific socket and environment setup. A 2025 article details the steps to enable this configuration on Linux and macOS.

### Why This Matters
Testcontainers relies on Docker API-compatible runtimes, but Podman’s daemonless architecture and rootless mode introduce friction. Without proper socket permissions and cleanup strategies, tests may fail or leave orphaned containers, increasing maintenance costs. The Testcontainers team does not actively test Podman, leading to unverified edge cases.

### Key Insights
- "Podman socket setup required for Testcontainers on Linux/macOS, 2025"
- "Ryuk cleanup disabled in Podman due to rootless mode limitations"
- "Temporal-style workflow tools used by companies like Red Hat for Podman integration"

### Working Example
```java
@Test
void whenSettingValue_thenCanGetItBack() {
    try (RedisContainer redis = new RedisContainer("redis:7-alpine").withExposedPorts(6379)) {
        redis.start();
        String host = redis.getHost();
        int port = redis.getFirstMappedPort();
        try (Jedis jedis = new Jedis(host, port)) {
            jedis.set("greeting", "hello");
            String value = jedis.get("greeting");
            Assertions.assertEquals("hello", value);
        }
    }
}
```

```java
@Test
void whenQueryingDatabase_thenReturnsOne() throws Exception {
    try (MySQLContainer mysql = new MySQLContainer("mysql:8.4")) {
        mysql.start();
        try (Connection conn = DriverManager
                .getConnection(mysql.getJdbcUrl(), mysql.getUsername(), mysql.getPassword());
             Statement st = conn.createStatement()) {
            st.execute("CREATE TABLE t(id INT PRIMARY KEY)");
            st.execute("INSERT INTO t VALUES (1)");
            ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM t");
            rs.next();
            Assertions.assertEquals(1, rs.getInt(1));
        }
    }
}
```

```java
@Test
void whenProducingMessage_thenConsumerReceivesIt() {
    DockerImageName image = DockerImageName.parse("confluentinc/cp-kafka:7.6.1");
    try (KafkaContainer kafka = new KafkaContainer(image)) {
        kafka.start();
        String bootstrap = kafka.getBootstrapServers();
        String topic = "hello";
        Properties prodProps = new Properties();
        prodProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap);
        prodProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        prodProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        try (KafkaProducer<String, String> producer = new KafkaProducer<>(prodProps)) {
            producer.send(new ProducerRecord<>(topic, "key", "hello")).get();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        Properties consProps = new Properties();
        consProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap);
        consProps.put(ConsumerConfig.GROUP_ID_CONFIG, "test-group");
        consProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        consProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(consProps)) {
            consumer.subscribe(Collections.singletonList(topic));
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(10));
            ConsumerRecord<String, String> first = records.iterator().next();
            Assertions.assertEquals("hello", first.value());
        }
    }
}
```

### Practical Applications
- **Use Case**: Java projects using Podman for CI/CD testing with Testcontainers
- **Pitfall**: Forgetting to disable Ryuk cleanup leads to orphaned containers and volume leaks

**References:**
- https://www.baeldung.com/java-podman-configure-testcontainers
---