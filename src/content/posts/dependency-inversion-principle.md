---
title: D from SOLID
pubDate: '2024-07-25 00:00:46 +0100'
categories:
  - Software design
  - SOLID
---
# Dependency Inversion Principle (DIP) in Software Design

## Introduction

The Dependency Inversion Principle (DIP) is one of the five SOLID principles of object-oriented design. It is fundamental to creating flexible and maintainable software systems. DIP states that:

1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

In simpler terms, the principle encourages dependency on interfaces or abstract classes rather than concrete implementations. This decouples the high-level logic of the application from the low-level details, making the system more modular and easier to maintain.

## Why DIP Matters

- **Decoupling**: By relying on abstractions, different parts of a system can change independently, leading to a more flexible architecture.
- **Maintainability**: Changes in one part of the system are less likely to impact other parts, reducing the risk of bugs.
- **Testability**: Abstracting dependencies makes it easier to mock or stub components, facilitating unit testing.
- **Scalability**: As the application grows, maintaining a loosely coupled architecture becomes crucial for scalability.

## Applying DIP in Java

Let's explore how to apply the Dependency Inversion Principle in Java with practical examples.

### Example: Before Applying DIP

Consider a scenario where we have a `LightBulb` class and a `Switch` class. The `Switch` class controls the `LightBulb`.

```java
public class LightBulb {
    public void turnOn() {
        System.out.println("LightBulb turned on");
    }

    public void turnOff() {
        System.out.println("LightBulb turned off");
    }
}

public class Switch {
    private LightBulb lightBulb;

    public Switch() {
        this.lightBulb = new LightBulb();
    }

    public void operate(boolean on) {
        if (on) {
            lightBulb.turnOn();
        } else {
            lightBulb.turnOff();
        }
    }
}
```

In this example, `Switch` directly depends on the concrete class `LightBulb`. This violates DIP because changes in `LightBulb` might require changes in `Switch`.

### Example: After Applying DIP

To apply DIP, we need to introduce an abstraction for the `LightBulb`.

#### Step 1: Create an Abstraction

```java
public interface Switchable {
    void turnOn();
    void turnOff();
}
```

#### Step 2: Implement the Abstraction

```java
public class LightBulb implements Switchable {
    @Override
    public void turnOn() {
        System.out.println("LightBulb turned on");
    }

    @Override
    public void turnOff() {
        System.out.println("LightBulb turned off");
    }
}
```

#### Step 3: Depend on the Abstraction

```java
public class Switch {
    private Switchable switchableDevice;

    public Switch(Switchable switchableDevice) {
        this.switchableDevice = switchableDevice;
    }

    public void operate(boolean on) {
        if (on) {
            switchableDevice.turnOn();
        } else {
            switchableDevice.turnOff();
        }
    }
}
```

#### Step 4: Use Dependency Injection

```java
public class Main {
    public static void main(String[] args) {
        Switchable lightBulb = new LightBulb();
        Switch lightSwitch = new Switch(lightBulb);
        
        lightSwitch.operate(true);  // Output: LightBulb turned on
        lightSwitch.operate(false); // Output: LightBulb turned off
    }
}
```

In this refactored example, `Switch` depends on the `Switchable` interface rather than the concrete `LightBulb` class. This adheres to DIP and makes `Switch` more flexible and easier to maintain.

## Benefits of Applying DIP

### 1. **Decoupling and Flexibility**

By depending on abstractions, high-level modules are decoupled from low-level modules. This means you can change the implementation of `Switchable` without affecting the `Switch` class.

### 2. **Enhanced Testability**

Abstractions make it easier to substitute real implementations with mock objects during testing. This improves the ability to write unit tests.

```java
import static org.mockito.Mockito.*;

public class SwitchTest {
    @Test
    public void testSwitchOperate() {
        Switchable mockDevice = mock(Switchable.class);
        Switch lightSwitch = new Switch(mockDevice);

        lightSwitch.operate(true);
        verify(mockDevice).turnOn();

        lightSwitch.operate(false);
        verify(mockDevice).turnOff();
    }
}
```

### 3. **Improved Maintainability**

With DIP, changes in low-level modules (e.g., `LightBulb`) do not propagate to high-level modules (e.g., `Switch`). This separation makes maintenance and upgrades easier.

### 4. **Scalability**

As the system grows, adhering to DIP ensures that the codebase remains manageable. You can introduce new `Switchable` devices without modifying the `Switch` class.

## Real-World Examples of DIP

### 1. **Java Logging Framework (SLF4J)**

The Simple Logging Facade for Java (SLF4J) is a good example of DIP. It provides an abstraction for various logging frameworks like Log4j, Logback, and java.util.logging.

#### SLF4J Abstraction

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyClass {
    private static final Logger logger = LoggerFactory.getLogger(MyClass.class);

    public void doSomething() {
        logger.info("Doing something");
    }
}
```

In this example, `MyClass` depends on the `Logger` interface from SLF4J rather than a specific logging framework. This allows for flexibility in choosing or changing the logging implementation.

### 2. **Spring Framework**

The Spring Framework heavily relies on DIP through dependency injection. Beans in Spring are injected into each other based on their interfaces rather than their concrete classes.

#### Spring Example

```java
public interface GreetingService {
    String greet();
}

public class MorningGreetingService implements GreetingService {
    @Override
    public String greet() {
        return "Good Morning!";
    }
}

@Service
public class MyService {
    private final GreetingService greetingService;

    @Autowired
    public MyService(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    public void sayGreeting() {
        System.out.println(greetingService.greet());
    }
}
```

In this example, `MyService` depends on the `GreetingService` interface. The actual implementation is injected by the Spring container, adhering to DIP.

## Conclusion

The Dependency Inversion Principle is a cornerstone of good software design. By ensuring that high-level modules depend on abstractions rather than concrete implementations, DIP promotes decoupling, maintainability, testability, and scalability. Applying DIP in Java involves identifying and creating appropriate abstractions, then using dependency injection to manage dependencies.

By following DIP, developers can build more robust, flexible, and maintainable systems, capable of adapting to changing requirements and technologies with minimal friction.
