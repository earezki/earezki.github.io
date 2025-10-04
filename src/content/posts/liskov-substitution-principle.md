---
title: L from SOLID
pubDate: '2024-06-20 00:00:46 +0100'
categories:
  - Software design
  - SOLID
---

# The Liskov Substitution Principle (LSP) in Object-Oriented Design

## Introduction

The Liskov Substitution Principle (LSP) is one of the five SOLID principles of object-oriented design, it states that objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program. This principle ensures that a subclass can stand in for its superclass, promoting more robust and maintainable code.

## Why LSP Matters

### 1. **Maintainability**
Adhering to LSP makes the codebase easier to maintain. When subclasses can replace their parent classes without introducing errors, developers can extend and refactor the system without fear of breaking existing functionality.

### 2. **Reusability**
LSP enhances code reusability. By ensuring subclasses maintain the behavior expected by the superclass, these subclasses can be used interchangeably in different parts of the application, increasing the versatility of the code.

### 3. **Polymorphism**
LSP is foundational to achieving true polymorphism in object-oriented systems. It allows objects to be treated as instances of their parent class, enabling dynamic method dispatch and more flexible system design.

### 4. **Testability**
Following LSP improves testability. When subclasses adhere to the contracts defined by their superclasses, unit tests for the superclass are also valid for the subclass. This reduces redundancy in testing and ensures consistent behavior across the hierarchy.


### Example: Before Applying LSP

Consider a scenario with a base class `Bird` and a derived class `Penguin`.

```java
public class Bird {
    public void fly() {
        System.out.println("I am flying");
    }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins cannot fly");
    }
}
```

In this example, `Penguin` violates LSP because it cannot be substituted for `Bird`. A `Penguin` object will cause unexpected behavior when the `fly` method is called, which contradicts the expectations set by the `Bird` class.

### Example: After Applying LSP

To adhere to LSP, we need to rethink our class hierarchy. One approach is to introduce a more specific class structure that accommodates different types of birds appropriately.

```java
public abstract class Bird {
    public abstract void move();
}

public class FlyingBird extends Bird {
    @Override
    public void move() {
        fly();
    }

    public void fly() {
        System.out.println("I am flying");
    }
}

public class Penguin extends Bird {
    @Override
    public void move() {
        walk();
    }

    public void walk() {
        System.out.println("I am walking");
    }
}
```

In this revised structure:
- The `Bird` class is abstract and defines a general movement behavior.
- `FlyingBird` and `Penguin` are concrete classes that implement the `move` method according to their capabilities.

Now, substituting a `Penguin` for a `Bird` does not violate any expectations, as both can still perform the `move` action correctly.

## Examples from java

### 1. **Java Collections Framework**
The Java Collections Framework is a good example of LSP in action. Consider the `List` interface and its implementations, `ArrayList` and `LinkedList`.

```java
List<String> arrayList = new ArrayList<>();
List<String> linkedList = new LinkedList<>();
```

Both `ArrayList` and `LinkedList` can be used interchangeably as `List` objects without affecting the correctness of the code. Methods defined in the `List` interface work seamlessly with both `ArrayList` and `LinkedList`, adhering to LSP.

but the immutable list doesn't support the remove method, so it doesn't respect LSP.

### 2. **Java Input/Output (I/O) Streams**
The Java I/O Streams follow LSP by allowing different stream types to be used interchangeably. For example, `FileInputStream`, `BufferedInputStream`, and `DataInputStream` can all be used as `InputStream` objects.

```java
InputStream fileStream = new FileInputStream("data.txt");
InputStream bufferedStream = new BufferedInputStream(fileStream);
InputStream dataStream = new DataInputStream(bufferedStream);
```

Each stream type can be substituted for `InputStream` without altering the behavior expected from an input stream.

## Common Pitfalls

### 1. **Improper Use of Inheritance**
A common mistake is using inheritance for code reuse without considering LSP. This can lead to subclasses that do not fulfill the contract of the superclass. To avoid this, always ensure that a subclass can stand in for its superclass without altering the expected behavior.

### 2. **Ignoring Pre- and Post-conditions**
Subclasses should not weaken preconditions or strengthen postconditions of methods they override. This means that the conditions required before and after method execution in a subclass should be consistent with those in the superclass.

### 3. **Overriding Methods Incorrectly**
Subclasses should override methods to provide specific behavior while still honoring the contract of the superclass. For instance, if a superclass method returns a specific type, the subclass should return a compatible type.

## Conclusion

The Liskov Substitution Principle is crucial for creating flexible, maintainable, and scalable object-oriented systems. By ensuring that subclasses can substitute their superclasses without altering expected behavior, developers can build more robust and reusable code. Adhering to LSP involves careful design of class hierarchies, mindful implementation of inheritance, and rigorous testing to confirm consistent behavior across the hierarchy. By mastering LSP, you will significantly improve the quality and reliability of your software.
