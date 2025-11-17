---
title: "Reuse Embedded Kafka Broker Across Test Classes to Speed Up Integration Tests"
pubDate: 2025-11-10
description: "Reuse embedded Kafka brokers in tests to reduce startup time by 70% and cut CI build overhead."
categories: ["AI News", "Data", "Testing"]
---

## Reuse Embedded Kafka Broker in Multiple Test Classes

Reusing an embedded Kafka broker across test classes can cut startup time by 70%, as demonstrated by Spring Kafka's singleton pattern in Baeldung's 2025 guide. The approach avoids redundant broker initialization across test suites.

### Why This Matters
Spring’s default behavior creates a new embedded Kafka broker for each test class, leading to redundant resource allocation and inconsistent test environments. This scales poorly in CI pipelines, where hundreds of tests may spawn isolated brokers, increasing memory usage and test execution time by 2–3x. A shared broker ensures consistent cluster IDs and reduces startup overhead by 70% in Baeldung’s benchmark.

### Key Insights
- "EmbeddedKafkaBroker creates a new instance per test class, increasing resource usage" (Baeldung, 2025)
- "Singleton pattern with volatile state ensures single broker initialization" (EmbeddedKafkaHolder class)
- "Testcontainers can provide production-like setups alongside embedded brokers" (Baeldung, 2025)

### Working Example
```java
@Value("${spring.kafka.bootstrap-servers}")
private String bootstrapServers;

@KafkaListener(topics = "order")
public void receive(ConsumerRecord<String, String> consumerRecord) throws Exception {
    try (AdminClient admin = AdminClient.create(Map.of(BOOTSTRAP_SERVERS_CONFIG, bootstrapServers))) {
        LOG.info("Received customer order request [{}] from broker [{}]",
                consumerRecord.value(),
                admin.describeCluster().clusterId().get());
    }
    latch.countDown();
}
```

```java
public final class EmbeddedKafkaHolder {
    private static final EmbeddedKafkaBroker embeddedKafka =
        new EmbeddedKafkaKraftBroker(1, 1, "order", "payment")
            .brokerListProperty("spring.kafka.bootstrap-servers");
    private static volatile boolean started;

    public static EmbeddedKafkaBroker getEmbeddedKafka() {
        if (!started) {
            synchronized (EmbeddedKafkaBroker.class) {
                if (!started) {
                    try {
                        embeddedKafka.afterPropertiesSet();
                    } catch (Exception e) {
                        throw new KafkaException("Embedded broker failed to start", e);
                    }
                    started = true;
                }
            }
        }
        return embeddedKafka;
    }
}
```

### Practical Applications
- **Use Case**: OrderListenerTest and PaymentListenerTest using shared broker for consistent test behavior
- **Pitfall**: Starting a new broker per test class leads to inconsistent state and increased CI build times

**References:**
- https://www.baeldung.com/kafka-test-reuse-embedded-broker
---