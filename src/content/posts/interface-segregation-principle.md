---
title: I from SOLID
pubDate: '2024-07-11 00:00:46 +0100'
categories:
  - Software design
  - SOLID
---

# Interface Segregation Principle (ISP) in Java

## Introduction
The Interface Segregation Principle (ISP) is one of the five SOLID principles of object-oriented design, it states that no client should be forced to depend on methods it does not use. Instead of having one large, fat interface, multiple small, specific interfaces are preferred, tailored to specific client needs. This principle promotes the creation of more modular, maintainable, and scalable systems.

## Why ISP Matters
- **Decoupling**: Reduces the dependencies of a class on parts of a system it doesn't use.
- **Cohesion**: Increases the cohesion of interfaces, making them more specific and aligned with the client needs.
- **Maintainability**: Makes the system easier to maintain and modify, as changes in one part of the system are less likely to affect unrelated parts.
- **Flexibility**: Enhances flexibility and scalability of the system, allowing for more granular changes and extensions.

## Applying ISP in Java
Let's explore how to apply ISP with a detailed example. Consider a scenario involving a document management system.

### Example: Before Applying ISP

Here's an initial design where we have a single `DocumentHandler` interface with multiple responsibilities:

```java
public interface DocumentHandler {
    void openDocument(String path);
    void saveDocument(String path);
    void printDocument();
    void faxDocument(String faxNumber);
}
```

This interface is used by different classes that handle various document-related operations.

```java
public class DocumentManager implements DocumentHandler {
    @Override
    public void openDocument(String path) {
        System.out.println("Document opened: " + path);
    }

    @Override
    public void saveDocument(String path) {
        System.out.println("Document saved: " + path);
    }

    @Override
    public void printDocument() {
        System.out.println("Document printed.");
    }

    @Override
    public void faxDocument(String faxNumber) {
        System.out.println("Document faxed to: " + faxNumber);
    }
}
```

Here, the `DocumentManager` class implements all methods of the `DocumentHandler` interface, even if it might not use all of them.

### Example: After Applying ISP

By applying ISP, we can split the `DocumentHandler` interface into multiple specific interfaces.

#### Separate Interfaces

```java
public interface Openable {
    void openDocument(String path);
}

public interface Saveable {
    void saveDocument(String path);
}

public interface Printable {
    void printDocument();
}

public interface Faxable {
    void faxDocument(String faxNumber);
}
```

#### Refactored DocumentManager Class

Now, we can refactor the `DocumentManager` class to implement only the interfaces it needs.

```java
public class DocumentManager implements Openable, Saveable {
    @Override
    public void openDocument(String path) {
        System.out.println("Document opened: " + path);
    }

    @Override
    public void saveDocument(String path) {
        System.out.println("Document saved: " + path);
    }
}
```

#### PrintManager Class

A separate class can handle printing responsibilities:

```java
public class PrintManager implements Printable {
    @Override
    public void printDocument() {
        System.out.println("Document printed.");
    }
}
```

#### FaxManager Class

And another class can handle faxing:

```java
public class FaxManager implements Faxable {
    @Override
    public void faxDocument(String faxNumber) {
        System.out.println("Document faxed to: " + faxNumber);
    }
}
```

### Benefits of Refactoring

1. **Single Responsibility**: Each class now adheres to the Single Responsibility Principle, handling only one aspect of document management.
2. **Decoupling**: Classes are decoupled from methods they do not use, reducing unnecessary dependencies.
3. **Maintainability**: Changes to one part of the system are less likely to impact unrelated parts, making the system easier to maintain.
4. **Flexibility**: The system is more flexible, allowing for easy addition of new functionalities without modifying existing classes.

## Real-World Examples in Java Library

### 1. **Java Collections Framework**
The Java Collections Framework demonstrates ISP through its design of multiple specific interfaces such as `List`, `Set`, and `Queue`, rather than a single, monolithic interface for all collections.

#### Example: List and Set Interfaces

- **List**: The `List` interface provides methods specific to ordered collections.
- **Set**: The `Set` interface provides methods specific to collections that do not allow duplicate elements.

```java
List<String> arrayList = new ArrayList<>();
Set<String> hashSet = new HashSet<>();
```

### 2. **Java IO Library**
The Java IO library also follows ISP by providing multiple specific interfaces for different types of input and output operations.

#### Example: InputStream and OutputStream

- **InputStream**: The `InputStream` interface provides methods for reading data.
- **OutputStream**: The `OutputStream` interface provides methods for writing data.

```java
InputStream inputStream = new FileInputStream("file.txt");
OutputStream outputStream = new FileOutputStream("file.txt");
```

### 3. **Java Util Logging**
The `java.util.logging` package uses ISP to provide different handlers for different logging destinations.

#### Example: Logger and Handler

- **Logger**: The `Logger` class is responsible for capturing log messages.
- **Handler**: Different `Handler` subclasses (e.g., `ConsoleHandler`, `FileHandler`) handle the output destination of log messages.

```java
Logger logger = Logger.getLogger("MyLogger");
Handler consoleHandler = new ConsoleHandler();
logger.addHandler(consoleHandler);
logger.info("This is a log message");
```

### Conclusion
The Interface Segregation Principle is fundamental for creating clean, maintainable, and scalable software systems. By ensuring that interfaces are specific to client needs, we reduce unnecessary dependencies, enhance maintainability, and improve system flexibility. Applying ISP in Java involves identifying distinct responsibilities and defining specific interfaces for each responsibility, leading to a more modular and robust codebase.
