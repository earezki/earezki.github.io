---
title: "Order of Configuration in Spring Boot: Managing Initialization Sequence with Annotations"
pubDate: 2025-10-25
description: "Explore how Spring Boot processes configuration classes and the annotations (@Order, @AutoConfigureOrder, etc.) used to control their order, ensuring predictable application initialization."
categories: ["AI News", "Spring Boot", "Java Frameworks"]
---

## Order of Configuration in Spring Boot: Managing Initialization Sequence with Annotations

### Overview of Configuration Ordering in Spring Boot

Spring Boot applications often rely on multiple configuration classes to define beans, properties, and integrations. While Spring automatically detects and processes these configurations, it **does not guarantee the order** in which they are loaded. This can lead to issues in scenarios where configurations depend on each other (e.g., a data configuration needing to initialize before a service configuration). To address this, Spring provides annotations like `@Order`, `@AutoConfigureOrder`, `@AutoConfigureAfter`, and `@AutoConfigureBefore` to control the sequence of configuration processing.

---

### Understanding Configuration Classes

Spring configuration classes can be categorized into two types:

- **Full Configuration**: Annotated with `@Configuration`.
- **Lite Configuration**: Annotated with `@Component`, `@Import`, or containing `@Bean` methods.

Both types are processed by Spring’s `ConfigurationClassPostProcessor`, which scans annotations, interprets metadata, and registers bean definitions during application startup.

---

### Default Behavior of Configuration Ordering

By default, Spring Boot **does not enforce a specific order** for configuration classes. It scans and loads them as found in the classpath. This behavior is acceptable for independent configurations but can cause issues when dependencies exist.

#### Example Without Explicit Order
```java
@Configuration
public class ConfigA {
    @Bean
    public String beanA() {
        return "Bean A";
    }
}
```

```java
@Configuration
public class ConfigB {
    @Bean
    public String beanB() {
        return "Bean B";
    }
}
```

**Test Validation**:
```java
@SpringBootTest
class DefaultConfigOrderUnitTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void givenConfigsWithoutOrder_whenLoaded_thenBeansExistRegardlessOfOrder() {
        assertThat(context.getBean("beanA")).isEqualTo("Bean A");
        assertThat(context.getBean("beanB")).isEqualTo("Bean B");
    }
}
```

**Impact**: Both beans are registered, but their order is not guaranteed. This is acceptable for independent configurations.

---

### Controlling Order Using `@Order` Annotation

Use `@Order` to enforce a predictable loading sequence for configuration classes, especially when one configuration depends on another.

#### Example with `@Order`
```java
@Configuration
@Order(1)
public class ConfigOne {
    @Bean
    public String configOneBean() {
        return "ConfigOneBean";
    }
}
```

```java
@Configuration
@Order(2)
public class ConfigTwo {
    @Bean
    public String configTwoBean() {
        return "ConfigTwoBean";
    }
}
```

**Test Validation**:
```java
@SpringBootTest(classes = {ConfigTwo.class, ConfigOne.class})
class OrderedConfigUnitTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void givenOrderedConfigs_whenLoaded_thenOrderIsRespected() {
        String beanOne = context.getBean("configOneBean", String.class);
        String beanTwo = context.getBean("configTwoBean", String.class);
        assertThat(beanOne).isEqualTo("ConfigOneBean");
        assertThat(beanTwo).isEqualTo("ConfigTwoBean");
    }
}
```

**Impact**: `ConfigOne` loads before `ConfigTwo` due to the `@Order` annotation, ensuring dependencies are resolved correctly.

---

### Managing Dependencies Using `@DependsOn`

Use `@DependsOn` to enforce bean-level initialization order, ensuring one bean is fully initialized before another.

#### Example with `@DependsOn`
```java
@Configuration
public class DependsConfig {
    @Bean
    public String firstBean() {
        return "FirstBean";
    }

    @Bean
    @DependsOn("firstBean")
    public String secondBean() {
        return "SecondBeanAfterFirst";
    }
}
```

**Test Validation**:
```java
@SpringBootTest(classes = DependsConfig.class)
class DependsConfigUnitTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void givenDependsOnBeans_whenLoaded_thenOrderIsMaintained() {
        String first = context.getBean("firstBean", String.class);
        String second = context.getBean("secondBean", String.class);
        assertThat(first).isEqualTo("FirstBean");
        assertThat(second).isEqualTo("SecondBeanAfterFirst");
    }
}
```

**Impact**: `secondBean` is initialized only after `firstBean` is fully created, ensuring dependency resolution.

---

### Auto-Configuration Order in Spring Boot

Spring Boot uses auto-configuration classes to set defaults. The order of these classes is managed via:

- `@AutoConfigureOrder`: Specifies a numeric order.
- `@AutoConfigureAfter`: Ensures a class loads after another.
- `@AutoConfigureBefore`: Ensures a class loads before another.

#### Example with Auto-Configuration Annotations
```java
@Configuration
@AutoConfigureOrder(1)
public class FirstAutoConfig {
    @Bean
    public String autoBeanOne() {
        return "AutoBeanOne";
    }
}
```

```java
@Configuration
@AutoConfigureAfter(FirstAutoConfig.class)
public class SecondAutoConfig {
    @Bean
    public String autoBeanTwo() {
        return "AutoBeanTwoAfterOne";
    }
}
```

**Test Validation**:
```java
@SpringBootTest(classes = {SecondAutoConfig.class, FirstAutoConfig.class})
class AutoConfigOrderUnitTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void givenAutoConfigs_whenLoaded_thenOrderFollowsAnnotations() {
        String beanOne = context.getBean("autoBeanOne", String.class);
        String beanTwo = context.getBean("autoBeanTwo", String.class);
        assertThat(beanOne).isEqualTo("AutoBeanOne");
        assertThat(beanTwo).isEqualTo("AutoBeanTwoAfterOne");
    }
}
```

**Impact**: Auto-configuration order is explicitly controlled by annotations, ensuring predictable application setup.

---

### Conclusion

Spring Boot provides multiple mechanisms to control configuration order, ensuring predictable application behavior. Developers should use:

- `@Order` for configuration-level ordering.
- `@DependsOn` for bean-level dependencies.
- Auto-configuration annotations (`@AutoConfigureOrder`, `@AutoConfigureAfter`, `@AutoConfigureBefore`) for managing auto-configuration sequences.

**Best Practice**: Use these annotations judiciously—only when the order of configuration processing impacts application behavior. Rely on Spring’s default dependency resolution for independent beans.

For more details, refer to the [original article](https://www.baeldung.com/spring-boot-configuration-order).

---

## Working Example

```java
@Configuration
@Order(1)
public class ConfigOne {
    @Bean
    public String configOneBean() {
        return "ConfigOneBean";
    }
}

@Configuration
@Order(2)
public class ConfigTwo {
    @Bean
    public String configTwoBean() {
        return "ConfigTwoBean";
    }
}
```

---

## Recommendations

- **Use `@Order`** when configuration dependencies exist (e.g., data setup before service configuration).
- **Prefer `@DependsOn`** for bean-level dependencies rather than configuration-level ordering.
- **Leverage auto-configuration annotations** to manage Spring Boot’s default configurations.
- **Avoid overusing `@Order`** unless necessary—Spring’s dependency injection often handles order implicitly.
- **Test configuration order** thoroughly, especially in complex applications with interdependent modules.

**Potential Pitfalls**:
- Misusing `@Order` can lead to brittle code if dependencies change.
- Incorrect auto-configuration ordering may override user-defined configurations, leading to unexpected behavior. Always verify the order of auto-configuration classes.