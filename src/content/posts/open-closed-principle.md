---
title: O from SOLID
pubDate: '2024-06-10 00:00:46 +0100'
categories:
  - Software design
  - SOLID
---

# Open/Closed Principle (OCP) in Software Design

## Introduction
The Open/Closed Principle (OCP) is the second SOLID principle. It states that "software entities (classes, modules, functions, etc.) should be open for extension but closed for modification." This means that the behavior of a module can be extended without modifying its source code. 

Adhering to the OCP helps create systems that are easier to maintain and extend over time. It allows developers to add new functionality with minimal risk of introducing bugs into existing code. This principle is crucial for achieving a flexible and robust design, making it easier to accommodate new requirements without altering the existing system's functionality.

## Why OCP Matters
- **Maintainability**: Changes to existing code are minimized, reducing the risk of introducing new bugs.
- **Extensibility**: New features can be added without altering existing code, making it easier to expand functionality.
- **Scalability**: Systems designed with OCP are easier to scale because new behaviors can be introduced seamlessly.
- **Testability**: Code that adheres to OCP is easier to test because existing tests remain valid even when new features are added.

## Applying OCP in Java

To illustrate the Open/Closed Principle, let's consider an example in Java. We'll start with a scenario that violates OCP and then refactor it to adhere to OCP.

### Example: Before Applying OCP

Consider a basic `Shape` interface and a `Drawing` class that draws various shapes. Initially, the `Drawing` class handles drawing circles and rectangles.

```java
class Drawing {
    public void drawCircle() {
        System.out.println("Drawing a Circle");
    }

    public void drawRectangle() {
        System.out.println("Drawing a Rectangle");
    }
}
```

In this example, if we want to add a new shape, say `Triangle`, we would need to modify the `Drawing` class to handle the new shape.

### Example: After Applying OCP

To adhere to the Open/Closed Principle, we refactor the code so that new shapes can be added without modifying the existing `Drawing` class. We achieve this by using polymorphism.

#### Shape Interface
```java
interface Shape {
    void draw();
}
```

#### Circle Class
```java
class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a Circle");
    }
}
```

#### Rectangle Class
```java
class Rectangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a Rectangle");
    }
}
```

#### Triangle Class
```java
class Triangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a Triangle");
    }
}
```

#### Drawing Class
```java
class Drawing {
    public void drawShape(Shape shape) {
        shape.draw();
    }
}
```

Now, to add a new shape, we simply create a new class that implements the `Shape` interface. The `Drawing` class does not need to be modified.

### Benefits of Refactoring

1. **Single Responsibility**: Each shape class is responsible for its own drawing logic.
2. **Extensibility**: New shapes can be added without modifying existing classes.
3. **Maintainability**: Existing code remains unchanged, reducing the risk of introducing bugs.
4. **Testability**: Individual shape classes can be tested in isolation.

## Real-World Examples from Java Libraries

### 1. **Java Collections Framework**
The Java Collections Framework is a textbook example of OCP. The `List` interface, for example, is open for extension by creating new implementations like `ArrayList` and `LinkedList` without modifying the `List` interface itself.

#### List Interface
```java
public interface List<E> extends Collection<E> {
    // List-specific methods
}
```

#### ArrayList Class
```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
    // Implementation details
}
```

#### LinkedList Class
```java
public class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E>, Cloneable, java.io.Serializable {
    // Implementation details
}
```

### 2. **Java Streams API**
The Java Streams API also adheres to OCP. New operations can be added by creating new classes that implement the `Stream` interface.

#### Stream Interface
```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {
    // Stream-specific methods
}
```

#### Collectors Class
The `Collectors` utility class provides various implementations for common operations like collecting elements into a list, set, or map.

```java
public final class Collectors {
    // Various collector implementations
}
```

## Conclusion

The Open/Closed Principle is a fundamental concept in object-oriented design that promotes the extension of software functionality without modifying existing code. By adhering to OCP, developers can create systems that are more maintainable, extensible, scalable, and testable. 
