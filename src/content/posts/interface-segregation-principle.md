---
title: I (Interface Segregation) from SOLID
pubDate: '2024-06-21 00:00:46 +0100'
categories:
  - Software architecture
  - Software design
  - SOLID
---

# The Interface Segregation Principle: Why Your Interfaces Are Probably Too Fat

## What Is Interface Segregation, Really?

Let me start with a story that'll make this concept click instantly. Imagine you walk into a restaurant, sit down, and the waiter hands you a massive binder. "Here's our menu," they say. You flip through it: breakfast items, lunch specials, dinner entrées, desserts, drinks, catering options, franchise opportunities, employee benefits, HR policies, and a detailed guide on how to operate the industrial dishwasher.

"Um, I just want to order lunch," you say.

"Sorry," the waiter replies. "This is our Universal Restaurant Interface. You need to look at everything before you can order anything."

That's exactly what it feels like to implement a bloated interface in code.

The Interface Segregation Principle (ISP) states: **No client should be forced to depend on methods it doesn't use.** In other words, don't create fat interfaces that do everything—create smaller, focused interfaces that do one thing well.

Robert Martin (Uncle Bob) articulated this principle as part of SOLID, and it's all about avoiding the pain of interfaces that try to be everything to everyone. When you violate ISP, you end up with classes that implement methods they don't care about, throwing `UnsupportedOperationException`, or returning null, or doing other ugly workarounds.

## Why Should You Care About ISP?

Let me tell you about a nightmare I witnessed early in my career. We had a `Printer` interface with methods like `print()`, `scan()`, `fax()`, `staple()`, `photocopy()`, and `sendEmail()`. Seemed logical—it modeled a multifunction printer, right?

Then we tried to integrate a simple single-function printer. Suddenly we had to implement all those methods, most of which made no sense:

```java
public class SimplePrinter implements Printer {
    public void print(Document doc) {
        // Actually prints!
    }
    
    public void scan() {
        throw new UnsupportedOperationException("This printer can't scan!");
    }
    
    public void fax(Document doc, String number) {
        throw new UnsupportedOperationException("This printer can't fax!");
    }
    
    public void staple() {
        throw new UnsupportedOperationException("This printer can't staple!");
    }
    
    public void photocopy(Document doc, int copies) {
        throw new UnsupportedOperationException("This printer can't photocopy!");
    }
    
    public void sendEmail(Document doc, String email) {
        throw new UnsupportedOperationException("This printer can't email!");
    }
}
```

The code was littered with exceptions. Worse, any code that used the `Printer` interface had to handle these exceptions, even if it just wanted to print. It was a mess.

Here's why ISP matters:

### 1. **Reduces Coupling**
Clients only depend on what they actually need, not on a giant interface full of irrelevant methods.

### 2. **Increases Flexibility**
You can create lightweight implementations without dragging along unnecessary baggage.

### 3. **Improves Testability**
Mocking small, focused interfaces is way easier than mocking a monster interface.

### 4. **Prevents Breaking Changes**
Adding a method to a fat interface breaks every implementer. With focused interfaces, changes are localized.

### 5. **Makes Code More Understandable**
Small interfaces clearly communicate their purpose. Fat interfaces are confusing.

## A Classic Example: The Worker Problem

### The Wrong Way: One Interface to Rule Them All

Imagine you're building an employee management system:

```java
public interface Worker {
    void work();
    void eat();
    void sleep();
    void getSalary();
    void receiveBonus();
    void attendMeeting();
    void submitTimesheet();
}

public class HumanWorker implements Worker {
    public void work() {
        System.out.println("Human is working...");
    }
    
    public void eat() {
        System.out.println("Human is eating lunch...");
    }
    
    public void sleep() {
        System.out.println("Human is sleeping...");
    }
    
    public void getSalary() {
        System.out.println("Human receives salary");
    }
    
    public void receiveBonus() {
        System.out.println("Human receives bonus");
    }
    
    public void attendMeeting() {
        System.out.println("Human attends meeting");
    }
    
    public void submitTimesheet() {
        System.out.println("Human submits timesheet");
    }
}

// Now we want to add robots...
public class RobotWorker implements Worker {
    public void work() {
        System.out.println("Robot is working...");
    }
    
    public void eat() {
        // Robots don't eat!
        throw new UnsupportedOperationException("Robots don't eat");
    }
    
    public void sleep() {
        // Robots don't sleep!
        throw new UnsupportedOperationException("Robots don't sleep");
    }
    
    public void getSalary() {
        // Robots don't get salaries!
        throw new UnsupportedOperationException("Robots don't get paid");
    }
    
    public void receiveBonus() {
        // No bonuses either!
        throw new UnsupportedOperationException("Robots don't get bonuses");
    }
    
    public void attendMeeting() {
        // Robots don't attend meetings!
        throw new UnsupportedOperationException("Robots don't attend meetings");
    }
    
    public void submitTimesheet() {
        // No timesheets!
        throw new UnsupportedOperationException("Robots don't submit timesheets");
    }
}
```

This is a disaster. The `RobotWorker` is forced to implement a bunch of methods that make no sense for it.

### The Right Way: Segregated Interfaces

Let's split this into focused interfaces:

```java
// Core interface - what all workers do
public interface Workable {
    void work();
}

// Biological needs
public interface Biological {
    void eat();
    void sleep();
}

// Compensation-related
public interface Payable {
    void receiveSalary(double amount);
    void receiveBonus(double amount);
}

// Administrative tasks
public interface Administrative {
    void attendMeeting(String meetingId);
    void submitTimesheet(Timesheet timesheet);
}

// Maintenance operations
public interface Maintainable {
    void performMaintenance();
    void checkStatus();
}

// Now our implementations make sense
public class HumanEmployee implements Workable, Biological, Payable, Administrative {
    private String name;
    private double salary;

    public HumanEmployee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    @Override
    public void work() {
        System.out.println(name + " is working on tasks...");
    }

    @Override
    public void eat() {
        System.out.println(name + " is having lunch...");
    }

    @Override
    public void sleep() {
        System.out.println(name + " is resting...");
    }

    @Override
    public void receiveSalary(double amount) {
        System.out.println(name + " received salary: $" + amount);
    }

    @Override
    public void receiveBonus(double amount) {
        System.out.println(name + " received bonus: $" + amount);
    }

    @Override
    public void attendMeeting(String meetingId) {
        System.out.println(name + " attending meeting: " + meetingId);
    }

    @Override
    public void submitTimesheet(Timesheet timesheet) {
        System.out.println(name + " submitted timesheet");
    }
}

public class RobotWorker implements Workable, Maintainable {
    private String serialNumber;
    private int batteryLevel;

    public RobotWorker(String serialNumber) {
        this.serialNumber = serialNumber;
        this.batteryLevel = 100;
    }

    @Override
    public void work() {
        System.out.println("Robot " + serialNumber + " is executing tasks...");
        batteryLevel -= 10;
    }

    @Override
    public void performMaintenance() {
        System.out.println("Robot " + serialNumber + " undergoing maintenance");
        batteryLevel = 100;
    }

    @Override
    public void checkStatus() {
        System.out.println("Robot " + serialNumber + " status: Battery at " + batteryLevel + "%");
    }
}

public class Contractor implements Workable, Payable {
    private String name;
    private double hourlyRate;

    public Contractor(String name, double hourlyRate) {
        this.name = name;
        this.hourlyRate = hourlyRate;
    }

    @Override
    public void work() {
        System.out.println(name + " (contractor) is working...");
    }

    @Override
    public void receiveSalary(double amount) {
        System.out.println(name + " received payment: $" + amount);
    }

    @Override
    public void receiveBonus(double amount) {
        System.out.println(name + " received bonus: $" + amount);
    }

    // Note: Contractors don't implement Biological or Administrative
    // They work remotely and handle their own time tracking
}
```

Now our code that uses these workers is much cleaner:

```java
public class WorkManager {
    
    public void scheduleWork(List<Workable> workers) {
        for (Workable worker : workers) {
            worker.work();  // Works for humans, robots, contractors
        }
    }

    public void processPayroll(List<Payable> employees) {
        for (Payable employee : employees) {
            employee.receiveSalary(5000);  // Only those who get paid
        }
    }

    public void scheduleLunchBreak(List<Biological> humans) {
        for (Biological human : humans) {
            human.eat();  // Only biological entities
        }
    }

    public void scheduleMeeting(List<Administrative> staff) {
        for (Administrative person : staff) {
            person.attendMeeting("MEETING-001");  // Only admin staff
        }
    }

    public void performSystemMaintenance(List<Maintainable> machines) {
        for (Maintainable machine : machines) {
            machine.performMaintenance();  // Only maintainable entities
        }
    }
}
```

See the difference? Each method only works with exactly what it needs. No exceptions, no null checks, no confusion.

## A Real Business Example: Document Management

Let me show you a more practical example you might encounter in business applications.

### The Wrong Way: The Almighty Document Interface

```java
public interface Document {
    // Reading operations
    String getContent();
    byte[] getBytes();
    String getTitle();
    String getAuthor();
    Date getCreatedDate();
    Date getModifiedDate();
    
    // Writing operations
    void setContent(String content);
    void setTitle(String title);
    void save();
    void saveAs(String filename);
    
    // Collaboration operations
    void share(String email);
    void addComment(String comment, String author);
    List<Comment> getComments();
    void addCollaborator(String email, Permission permission);
    
    // Version control
    void createVersion();
    List<Version> getVersionHistory();
    void restoreVersion(int versionNumber);
    
    // Export operations
    void exportToPDF(String filename);
    void exportToWord(String filename);
    void print();
    
    // Security operations
    void encrypt(String password);
    void decrypt(String password);
    void setPermissions(Permissions permissions);
    
    // Cloud operations
    void uploadToCloud();
    void downloadFromCloud();
    void syncWithCloud();
}
```

This interface is a monster! Now imagine trying to implement it for different document types:

```java
public class LocalTextDocument implements Document {
    // Can implement reading and writing
    // But what about cloud operations for a local document?
    public void uploadToCloud() {
        throw new UnsupportedOperationException("Local document can't upload to cloud");
    }
    
    public void downloadFromCloud() {
        throw new UnsupportedOperationException("Local document not in cloud");
    }
    
    // And encryption?
    public void encrypt(String password) {
        throw new UnsupportedOperationException("Text documents don't support encryption");
    }
    
    // And versioning?
    public void createVersion() {
        throw new UnsupportedOperationException("No version control for local documents");
    }
    
    // You get the idea...
}
```

### The Right Way: Segregated Document Interfaces

Let's split this into logical, focused interfaces:

```java
// Core reading interface - all documents can be read
public interface Readable {
    String getContent();
    String getTitle();
    String getAuthor();
    Date getCreatedDate();
}

// Editing capabilities
public interface Editable {
    void setContent(String content);
    void setTitle(String title);
    void save();
}

// Export capabilities
public interface Exportable {
    byte[] exportToPDF();
    byte[] exportToWord();
    void print();
}

// Collaboration features
public interface Shareable {
    void share(String email);
    void addCollaborator(String email, Permission permission);
    List<String> getCollaborators();
}

// Commenting system
public interface Commentable {
    void addComment(String comment, String author);
    List<Comment> getComments();
    void deleteComment(String commentId);
}

// Version control
public interface Versionable {
    void createVersion(String description);
    List<Version> getVersionHistory();
    void restoreVersion(String versionId);
}

// Security features
public interface Securable {
    void encrypt(String password);
    void decrypt(String password);
    void setPermissions(Permissions permissions);
    Permissions getPermissions();
}

// Cloud integration
public interface CloudSyncable {
    void uploadToCloud();
    void downloadFromCloud();
    void syncWithCloud();
    boolean isCloudSynced();
}
```

Now let's implement different document types cleanly:

```java
// Simple local text document
public class TextDocument implements Readable, Editable, Exportable {
    private String content;
    private String title;
    private String author;
    private Date createdDate;

    public TextDocument(String title, String author) {
        this.title = title;
        this.author = author;
        this.createdDate = new Date();
        this.content = "";
    }

    @Override
    public String getContent() {
        return content;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getAuthor() {
        return author;
    }

    @Override
    public Date getCreatedDate() {
        return createdDate;
    }

    @Override
    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public void save() {
        // Save to local file system
        System.out.println("Saving document: " + title);
    }

    @Override
    public byte[] exportToPDF() {
        // Convert to PDF
        System.out.println("Exporting to PDF: " + title);
        return new byte[0];  // Simplified
    }

    @Override
    public byte[] exportToWord() {
        // Convert to Word
        System.out.println("Exporting to Word: " + title);
        return new byte[0];  // Simplified
    }

    @Override
    public void print() {
        System.out.println("Printing document: " + title);
    }
}

// Cloud-based collaborative document
public class CloudDocument implements Readable, Editable, Shareable, Commentable, 
                                      Versionable, CloudSyncable {
    private String documentId;
    private String content;
    private String title;
    private String author;
    private Date createdDate;
    private List<Comment> comments;
    private List<String> collaborators;
    private CloudStorage cloudStorage;

    public CloudDocument(String title, String author, CloudStorage cloudStorage) {
        this.documentId = UUID.randomUUID().toString();
        this.title = title;
        this.author = author;
        this.createdDate = new Date();
        this.content = "";
        this.comments = new ArrayList<>();
        this.collaborators = new ArrayList<>();
        this.cloudStorage = cloudStorage;
    }

    // Readable implementation
    @Override
    public String getContent() {
        return content;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getAuthor() {
        return author;
    }

    @Override
    public Date getCreatedDate() {
        return createdDate;
    }

    // Editable implementation
    @Override
    public void setContent(String content) {
        this.content = content;
        syncWithCloud();  // Auto-sync on change
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
        syncWithCloud();
    }

    @Override
    public void save() {
        uploadToCloud();
    }

    // Shareable implementation
    @Override
    public void share(String email) {
        System.out.println("Sharing document with: " + email);
        collaborators.add(email);
    }

    @Override
    public void addCollaborator(String email, Permission permission) {
        System.out.println("Adding collaborator: " + email + " with permission: " + permission);
        collaborators.add(email);
    }

    @Override
    public List<String> getCollaborators() {
        return new ArrayList<>(collaborators);
    }

    // Commentable implementation
    @Override
    public void addComment(String commentText, String commentAuthor) {
        Comment comment = new Comment(commentText, commentAuthor, new Date());
        comments.add(comment);
        System.out.println("Comment added by " + commentAuthor);
    }

    @Override
    public List<Comment> getComments() {
        return new ArrayList<>(comments);
    }

    @Override
    public void deleteComment(String commentId) {
        comments.removeIf(c -> c.getId().equals(commentId));
    }

    // Versionable implementation
    @Override
    public void createVersion(String description) {
        System.out.println("Creating version: " + description);
        cloudStorage.createVersion(documentId, content, description);
    }

    @Override
    public List<Version> getVersionHistory() {
        return cloudStorage.getVersionHistory(documentId);
    }

    @Override
    public void restoreVersion(String versionId) {
        System.out.println("Restoring version: " + versionId);
        this.content = cloudStorage.restoreVersion(documentId, versionId);
    }

    // CloudSyncable implementation
    @Override
    public void uploadToCloud() {
        System.out.println("Uploading to cloud: " + title);
        cloudStorage.upload(documentId, content);
    }

    @Override
    public void downloadFromCloud() {
        System.out.println("Downloading from cloud: " + title);
        this.content = cloudStorage.download(documentId);
    }

    @Override
    public void syncWithCloud() {
        System.out.println("Syncing with cloud: " + title);
        cloudStorage.sync(documentId, content);
    }

    @Override
    public boolean isCloudSynced() {
        return cloudStorage.isSynced(documentId);
    }
}

// Read-only archived document
public class ArchivedDocument implements Readable, Exportable, Securable {
    private String content;
    private String title;
    private String author;
    private Date createdDate;
    private boolean encrypted;
    private Permissions permissions;

    public ArchivedDocument(String title, String author, String content) {
        this.title = title;
        this.author = author;
        this.content = content;
        this.createdDate = new Date();
        this.encrypted = false;
        this.permissions = Permissions.READ_ONLY;
    }

    // Readable implementation
    @Override
    public String getContent() {
        if (encrypted) {
            throw new SecurityException("Document is encrypted");
        }
        return content;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getAuthor() {
        return author;
    }

    @Override
    public Date getCreatedDate() {
        return createdDate;
    }

    // Exportable implementation
    @Override
    public byte[] exportToPDF() {
        if (encrypted) {
            throw new SecurityException("Cannot export encrypted document");
        }
        System.out.println("Exporting archived document to PDF");
        return new byte[0];  // Simplified
    }

    @Override
    public byte[] exportToWord() {
        if (encrypted) {
            throw new SecurityException("Cannot export encrypted document");
        }
        System.out.println("Exporting archived document to Word");
        return new byte[0];  // Simplified
    }

    @Override
    public void print() {
        if (encrypted) {
            throw new SecurityException("Cannot print encrypted document");
        }
        System.out.println("Printing archived document");
    }

    // Securable implementation
    @Override
    public void encrypt(String password) {
        System.out.println("Encrypting archived document");
        this.encrypted = true;
        // Perform encryption
    }

    @Override
    public void decrypt(String password) {
        System.out.println("Decrypting archived document");
        this.encrypted = false;
        // Perform decryption
    }

    @Override
    public void setPermissions(Permissions permissions) {
        this.permissions = permissions;
    }

    @Override
    public Permissions getPermissions() {
        return permissions;
    }
}
```

Now look how clean our document services become:

```java
public class DocumentService {
    
    public void displayDocument(Readable document) {
        System.out.println("Title: " + document.getTitle());
        System.out.println("Author: " + document.getAuthor());
        System.out.println("Content: " + document.getContent());
    }

    public void editDocument(Editable document, String newContent) {
        document.setContent(newContent);
        document.save();
    }

    public void collaborateOnDocument(Shareable document, String email) {
        document.share(email);
        
        // Only add comments if the document supports it
        if (document instanceof Commentable) {
            ((Commentable) document).addComment("Shared with " + email, "System");
        }
    }

    public void backupDocument(Versionable document, String description) {
        document.createVersion(description);
    }

    public void exportDocument(Exportable document, String format) {
        switch (format.toLowerCase()) {
            case "pdf":
                document.exportToPDF();
                break;
            case "word":
                document.exportToWord();
                break;
            case "print":
                document.print();
                break;
        }
    }

    public void secureDocument(Securable document, String password) {
        document.encrypt(password);
        document.setPermissions(Permissions.RESTRICTED);
    }
}
```

Every method now works with exactly the interface it needs—no more, no less.

## ISP and Dependency Injection

ISP becomes even more powerful when combined with dependency injection:

```java
public class DocumentProcessor {
    private final Readable readable;
    private final Exportable exportable;

    // Constructor clearly shows dependencies
    public DocumentProcessor(Readable readable, Exportable exportable) {
        this.readable = readable;
        this.exportable = exportable;
    }

    public void processAndExport() {
        String content = readable.getContent();
        // Process content...
        exportable.exportToPDF();
    }
}

// Easy to test with mocks
@Test
public void testDocumentProcessing() {
    Readable mockReadable = mock(Readable.class);
    Exportable mockExportable = mock(Exportable.class);
    
    when(mockReadable.getContent()).thenReturn("Test content");
    
    DocumentProcessor processor = new DocumentProcessor(mockReadable, mockExportable);
    processor.processAndExport();
    
    verify(mockReadable).getContent();
    verify(mockExportable).exportToPDF();
}
```

## Common ISP Violations and Fixes

### Violation 1: The God Interface

```java
// WRONG - One interface with too many responsibilities
public interface UserService {
    User login(String username, String password);
    void logout(User user);
    User register(String username, String email, String password);
    void updateProfile(User user);
    void deleteAccount(User user);
    void sendPasswordReset(String email);
    List<User> searchUsers(String query);
    void banUser(Long userId);
    void unbanUser(Long userId);
    List<User> getAdminUsers();
    void auditUserActivity(Long userId);
}

// RIGHT - Split into focused interfaces
public interface AuthenticationService {
    User login(String username, String password);
    void logout(User user);
}

public interface RegistrationService {
    User register(String username, String email, String password);
    void sendPasswordReset(String email);
}

public interface ProfileService {
    void updateProfile(User user);
    void deleteAccount(User user);
}

public interface UserSearchService {
    List<User> searchUsers(String query);
}

public interface AdminService {
    void banUser(Long userId);
    void unbanUser(Long userId);
    List<User> getAdminUsers();
    void auditUserActivity(Long userId);
}
```

### Violation 2: The Partially Implemented Interface

```java
// WRONG - Implementing interface but not really
public interface PaymentMethod {
    void processPayment(double amount);
    void refund(double amount);
    void saveForLater();
}

public class CashPayment implements PaymentMethod {
    public void processPayment(double amount) {
        // Actually process cash
    }
    
    public void refund(double amount) {
        // Can refund cash
    }
    
    public void saveForLater() {
        throw new UnsupportedOperationException("Can't save cash for later");
    }
}

// RIGHT - Use appropriate interfaces
public interface PaymentProcessor {
    void processPayment(double amount);
}

public interface Refundable {
    void refund(double amount);
}

public interface Saveable {
    void saveForLater();
}

public class CashPayment implements PaymentProcessor, Refundable {
    // Only implements what makes sense
}

public class CreditCardPayment implements PaymentProcessor, Refundable, Saveable {
    // Implements all capabilities
}
```

### Violation 3: Header Interface Pattern (from Compiled Languages)

This one comes from C/C++ days but still shows up:

```java
// WRONG - Interface mirrors implementation
public interface DatabaseConnection {
    void connect();
    void disconnect();
    void executeQuery(String sql);
    void beginTransaction();
    void commitTransaction();
    void rollbackTransaction();
    void setAutoCommit(boolean autoCommit);
    void setTransactionIsolation(int level);
    Connection getNativeConnection();
    void clearWarnings();
    boolean isClosed();
}

// RIGHT - Split by client needs
public interface QueryExecutor {
    ResultSet executeQuery(String sql);
}

public interface TransactionManager {
    void beginTransaction();
    void commitTransaction();
    void rollbackTransaction();
}

public interface ConnectionLifecycle {
    void connect();
    void disconnect();
    boolean isConnected();
}
```

## How to Apply ISP in Practice

### Step 1: Identify Client Groups

Look at who uses your interface. Different clients need different methods.

```java
// Instead of one big repository interface
public interface Repository<T> {
    // Readers need these
    T findById(Long id);
    List<T> findAll();
    
    // Writers need these
    void save(T entity);
    void delete(T entity);
    
    // Admins need these
    void backup();
    void restore();
    void optimize();
}

// Split by client needs
public interface ReadRepository<T> {
    T findById(Long id);
    List<T> findAll();
}

public interface WriteRepository<T> {
    void save(T entity);
    void delete(T entity);
}

public interface RepositoryMaintenance {
    void backup();
    void restore();
    void optimize();
}
```

### Step 2: Create Role-Based Interfaces

Think about roles, not implementations:

```java
// Role-based segregation
public interface Viewer {
    void view(Document document);
}

public interface Editor extends Viewer {
    void edit(Document document);
}

public interface Approver extends Viewer {
    void approve(Document document);
    void reject(Document document);
}

public interface Owner extends Editor, Approver {
    void delete(Document document);
    void transfer(Document document, User newOwner);
}
```

### Step 3: Use Composition Over Large Interfaces

```java
// Instead of a massive interface
public interface SmartHome {
    void turnOnLights();
    void turnOffLights();
    void setTemperature(int temp);
    void lockDoors();
    void unlockDoors();
    void armSecurity();
    void disarmSecurity();
    void startCoffee();
    void playMusic(String song);
}

// Use composition
public interface LightController {
    void turnOn();
    void turnOff();
    void dim(int level);
}

public interface ThermostatController {
    void setTemperature(int temp);
    int getCurrentTemperature();
}

public interface SecurityController {
    void lock();
    void unlock();
    void arm();
    void disarm();
}

public class SmartHomeSystem {
    private final LightController lights;
    private final ThermostatController thermostat;
    private final SecurityController security;

    // Clients only get what they need
    public LightController getLights() { return lights; }
    public ThermostatController getThermostat() { return thermostat; }
    public SecurityController getSecurity() { return security; }
}
```

## ISP and Real-World Java APIs

Many Java libraries follow ISP well:

### java.util Collections
```java
// Good ISP - separate read and write
List<String> items = Collections.unmodifiableList(mutableList);
// Can read but not modify

// Bad would be:
// items.add("new");  // Throws exception - violates ISP
```

### java.io Streams
```java
// Separate interfaces for different operations
InputStream  // Just reading
OutputStream // Just writing
Reader       // Character reading
Writer       // Character writing
```

### Spring Framework
```java
// Spring uses ISP extensively
public interface ApplicationContextAware {
    void setApplicationContext(ApplicationContext applicationContext);
}

public interface InitializingBean {
    void afterPropertiesSet();
}

// Beans implement only what they need
public class MyBean implements ApplicationContextAware {
    // Only gets ApplicationContext, nothing else
}
```

## Testing With ISP

ISP makes testing much easier:

```java
@Test
public void testDocumentReader() {
    // Only need to mock what we use
    Readable mockDocument = mock(Readable.class);
    when(mockDocument.getContent()).thenReturn("Test content");
    
    DocumentReader reader = new DocumentReader(mockDocument);
    String content = reader.read();
    
    assertEquals("Test content", content);
    verify(mockDocument).getContent();
    
    // Don't need to set up expectations for save(), share(), etc.
}

@Test
public void testDocumentEditor() {
    Editable mockDocument = mock(Editable.class);
    
    DocumentEditor editor = new DocumentEditor(mockDocument);
    editor.edit("New content");
    
    verify(mockDocument).setContent("New content");
    verify(mockDocument).save();
    
    // Clean, focused test
}
```

## When to Violate ISP (Yes, Sometimes You Should)

### Case 1: Marker Interfaces
```java
public interface Serializable {
    // Empty - just marks a class
}
```

### Case 2: Convenience Interfaces in Internal APIs
```java
// If you control all implementations, sometimes a bigger interface is OK
internal interface FullDocumentAccess {
    // All operations for internal use
}
```

### Case 3: Legacy System Integration
Sometimes you're stuck with fat interfaces from legacy systems. Use adapters:

```java
public class LegacyPrinterAdapter implements SimplePrinter {
    private final ComplexLegacyPrinter legacy;
    
    public void print(Document doc) {
        // Adapt to legacy interface
        legacy.initialize();
        legacy.loadDocument(doc);
        legacy.configurePrintSettings(/* defaults */);
        legacy.executePrint();
        legacy.cleanup();
    }
}
```

## Conclusion

The Interface Segregation Principle is about respect—respecting your clients by not forcing them to depend on things they don't need. It's about creating focused, coherent interfaces that do one thing well instead of bloated interfaces that try to be everything to everyone.

When you violate ISP, you create tight coupling, make testing harder, and force implementers to deal with methods they don't care about. When you follow ISP, your code becomes more flexible, easier to test, and more maintainable.

Think of interfaces as contracts. Would you sign a 50-page contract just to borrow a cup of sugar from your neighbor? Of course not. Don't make your clients sign massive interface contracts when they only need a small part of it.

Key takeaways:
- **Split fat interfaces into focused ones** based on client needs
- **Clients should only depend on methods they use**
- **Use composition** when a class needs multiple capabilities
- **Think in terms of roles** (Viewer, Editor, Admin) not implementations
- **Keep interfaces cohesive**—methods should relate to each other

Remember: Many small interfaces are better than one giant interface. Your future self (and your teammates) will thank you.
