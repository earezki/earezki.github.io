---
title: S from SOLID
pubDate: '2024-06-02 05:49:46 +0100'
categories:
  - Software design
  - SOLID
---

# Single Responsibility Principle (SRP) in Java

## Introduction
The Single Responsibility Principle (SRP) is one of the five SOLID principles of object-oriented design. It states that a class should have only one reason to change, meaning it should only have one job or responsibility. This principle helps to achieve a more modular, maintainable, and scalable codebase.

## Why SRP Matters
- **Maintainability**: When a class has a single responsibility, it is easier to understand and modify. No more headaches trying to decipher spaghetti code!
- **Testability**: Classes with single responsibilities are easier to test because their functionality is limited to one concern. Testing just got a whole lot simpler!
- **Reusability**: Single-responsibility classes are more likely to be reusable in different contexts because they encapsulate specific functionality. Your code is now as flexible as a gymnast!

## Applying SRP in Java
Let's go through an example to understand how to apply SRP in Java. Spoiler: It's easier than you think!

### Example: Before Applying SRP

Consider a `User` class that handles user information, data validation, and persistence. It's like that one friend who tries to juggle a dozen tasks at once!

```java
public class User {
    private String name;
    private String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isValidEmail() {
        // Basic email validation logic
        return email.contains("@");
    }

    public void saveToDatabase() {
        // Code to save user data to database
        System.out.println("Saving " + this.name + ": " + this.email + " to the database.");
    }
}
```

In this example, the `User` class is doing too much:
- Storing user information.
- Validating user email.
- Persisting user data to a database.

It's time for an intervention!

### Example: After Applying SRP

Let's break it down and give each task to a dedicated class.

#### User Class
The `User` class now focuses solely on user data.

```java
public record User(String name, String email) {
}
```

#### EmailValidation Class
The `EmailValidation` class is the new email guru.

```java
public class EmailValidation {
    public boolean isValid(String email) {
        return email.contains("@");
    }
}
```

#### UserRepository Class
The `UserRepository` class is responsible for data persistence.

```java
public class UserRepository {
    public void save(User user) {
        System.out.println("Saving " + user.name() + ": " + user.email() + " to the database.");
    }
}
```

### Unit Tests
Of course, we need to make sure everything works perfectly.

#### EmailValidationTest
```java
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmailValidationTest {

    private EmailValidation emailValidation;

    @BeforeEach
    public void setUp() {
        emailValidation = new EmailValidation();
    }

    @Test
    public void testValidEmail() {
        assertTrue(emailValidation.isValid("john.doe@example.com"));
    }

    @Test
    public void testInvalidEmail() {
        assertFalse(emailValidation.isValid("john.doeexample.com"));
        assertFalse(emailValidation.isValid("john.doe@com"));
        assertFalse(emailValidation.isValid("john.doe@.com"));
    }
}
```

#### UserRepositoryTest
```java
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserRepositoryTest {

    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        userRepository = new UserRepository();
    }

    @Test
    public void testSave() {
        User user = new User("John Doe", "john.doe@example.com");
        
        // Since saveToDatabase is a simple print operation, we just verify the method call
        userRepository.save(user);
    }
}
```

### Benefits of Refactoring

1. **Single Responsibility**: Each class now has a single responsibility:
   - `User` class handles user data.
   - `EmailValidation` class handles email validation.
   - `UserRepository` class handles data persistence.
   
2. **Maintainability**: Changes to email validation logic do not affect user data or persistence logic.
3. **Testability**: Each class can be tested in isolation, making unit tests simpler and more focused.
4. **Reusability**: The `EmailValidation` and `UserRepository` classes can be reused across different parts of the application or in different projects.

## Java Library Examples

### 1. **Java IO Library**
The Java IO library is a great example of SRP in practice. Classes in this library are designed with SRP, making them easy to understand, maintain, and extend.

#### Example: `BufferedReader` and `FileReader`
- **FileReader**: The `FileReader` class is responsible for reading raw byte data from a file and translating it into characters.
- **BufferedReader**: The `BufferedReader` class is responsible for buffering characters for efficient reading.

```java
FileReader fileReader = new FileReader("file.txt");
BufferedReader bufferedReader = new BufferedReader(fileReader);
String line;
while ((line = bufferedReader.readLine()) != null) {
    System.out.println(line);
}
bufferedReader.close();
fileReader.close();
```
In this example, `FileReader` handles the file input, while `BufferedReader` handles the buffering, adhering to SRP.

### 2. **Java Collections Framework**
The Java Collections Framework also follows SRP by separating different concerns into various classes and interfaces.

#### Example: `ArrayList` and `Collections.sort`
- **ArrayList**: The `ArrayList` class is responsible for managing a dynamic array of objects.
- **Collections.sort**: The `Collections` class provides a static method `sort` for sorting lists.

```java
List<String> list = new ArrayList<>();
list.add("banana");
list.add("apple");
list.add("cherry");
Collections.sort(list);
System.out.println(list);
```
Here, `ArrayList` is concerned with managing the list of elements, while the sorting logic is handled by the `Collections` class.

### 3. **Java Networking**
The Java networking package (`java.net`) includes classes that adhere to SRP by separating concerns related to different network operations.

#### Example: `Socket` and `PrintWriter`
- **Socket**: The `Socket` class is responsible for establishing and maintaining network connections.
- **PrintWriter**: The `PrintWriter` class is responsible for writing formatted text to an output stream.

```java
Socket socket = new Socket("example.com", 80);
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
out.println("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n");
out.close();
socket.close();
```
In this example, the `Socket` class handles the network connection, while `PrintWriter` manages text output, each with their distinct responsibility.

### 4. **Java Util Logging**
The `java.util.logging` package provides a good example of SRP in logging functionality.

#### Example: `Logger` and `Handler`
- **Logger**: The `Logger` class is responsible for capturing log messages.
- **Handler**: Different `Handler` subclasses (e.g., `ConsoleHandler`, `FileHandler`) are responsible for the output destination of log messages.

```java
Logger logger = Logger.getLogger("MyLogger");
Handler consoleHandler = new ConsoleHandler();
logger.addHandler(consoleHandler);
logger.info("This is a log message");
```
In this case, the `Logger` class captures log messages, while the `Handler` manages the output destination.

## Conclusion
The Single Responsibility Principle is fundamental for writing clean, maintainable, and scalable code. By ensuring that each class in your application has only one responsibility, you make your codebase easier to understand, test, and modify. Applying SRP in Java involves identifying distinct responsibilities and refactoring your code to separate those responsibilities into different classes. Happy coding!
