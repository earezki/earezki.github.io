---
title: D (Dependency Inversion) from SOLID
pubDate: '2024-06-22 00:00:46 +0100'
categories:
  - Software architecture
  - Software design
  - SOLID
---

# The Dependency Inversion Principle: Stop Depending on Details

## What Is Dependency Inversion, Really?

Let me ask you a question: when you plug your phone into a charger, does your phone know whether it's connected to a wall adapter, a laptop USB port, or a portable battery pack? Nope. Your phone just knows it's receiving power through a USB port. It doesn't care about the specifics of where that power comes from.

That's Dependency Inversion Principle (DIP) in a nutshell.

The formal definition is: **High-level modules should not depend on low-level modules. Both should depend on abstractions. Furthermore, abstractions should not depend on details. Details should depend on abstractions.**

In plain English: Your important business logic shouldn't be tightly coupled to nitty-gritty implementation details. Instead, both should communicate through interfaces or abstract contracts. This way, you can swap out the details without touching your core logic.

Here's the mind-bending part: it's called "inversion" because we're inverting the traditional dependency structure. Normally, high-level code depends directly on low-level code (business logic → database implementation). With DIP, we flip it: both depend on abstractions (business logic → interface ← database implementation).

## Why Should You Care About DIP?

Let me tell you a war story. I once worked on an e-commerce system where the business logic was directly using MySQL-specific queries. Everything worked great—until the client decided they wanted to switch to PostgreSQL for better performance.

We had to rewrite hundreds of classes. The business logic, the inventory management, the order processing—everything had MySQL queries embedded in it. It took three months and introduced dozens of bugs.

Know what the worst part was? The actual database switch took two hours. The other three months were spent untangling business logic from database details.

That's what happens when you violate DIP. Here's why it matters:

### 1. **Makes Code Testable**
You can test business logic without needing a real database, email server, or payment gateway.

### 2. **Enables Flexibility**
Swap implementations without touching core logic. Move from MySQL to MongoDB? Easy. Switch email providers? No problem.

### 3. **Reduces Coupling**
High-level code doesn't need to know about low-level implementation details.

### 4. **Improves Maintainability**
Changes to implementation details don't ripple through your entire codebase.

### 5. **Enables Parallel Development**
Teams can work on interfaces first, then implementations separately.

## A Simple Example: Email Notifications

### The Wrong Way: Direct Dependencies

Let's start with a common scenario—sending email notifications:

```java
public class OrderService {
    
    public void placeOrder(Order order) {
        // Validate order
        if (order.getTotal() <= 0) {
            throw new IllegalArgumentException("Invalid order total");
        }

        // Save to database - TIGHTLY COUPLED!
        MySQLDatabase database = new MySQLDatabase();
        database.connect("jdbc:mysql://localhost:3306/shop");
        database.execute("INSERT INTO orders VALUES (" + 
            order.getId() + ", '" + 
            order.getCustomerEmail() + "', " + 
            order.getTotal() + ")");
        database.disconnect();

        // Send email - TIGHTLY COUPLED!
        SmtpEmailSender emailSender = new SmtpEmailSender();
        emailSender.setHost("smtp.gmail.com");
        emailSender.setPort(587);
        emailSender.setUsername("noreply@myshop.com");
        emailSender.setPassword("supersecret");
        emailSender.connect();
        emailSender.send(
            order.getCustomerEmail(),
            "Order Confirmation",
            "Your order #" + order.getId() + " has been placed"
        );
        emailSender.disconnect();

        // Log the order - TIGHTLY COUPLED!
        FileLogger logger = new FileLogger();
        logger.setFilePath("/var/log/orders.log");
        logger.write("Order placed: " + order.getId());
        logger.close();
    }
}
```

Look at all those concrete dependencies! `OrderService` knows:
- The specific database (MySQL)
- How to connect to it
- The email protocol (SMTP)
- Email server configuration
- How logging works
- Where log files are stored

Want to test this? Good luck! You need a real MySQL database, an SMTP server, and file system access. Want to switch to PostgreSQL? You're rewriting `OrderService`. Want to use SendGrid instead of SMTP? More rewrites.

This is a nightmare.

### The Right Way: Depend on Abstractions

Let's invert those dependencies:

```java
// Define abstractions (interfaces) for what we need
public interface OrderRepository {
    void save(Order order);
    Order findById(Long id);
}

public interface NotificationService {
    void sendOrderConfirmation(Order order);
}

public interface Logger {
    void log(String message);
}

// Now our OrderService depends on abstractions
public class OrderService {
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final Logger logger;

    // Dependencies injected through constructor
    public OrderService(
        OrderRepository orderRepository,
        NotificationService notificationService,
        Logger logger
    ) {
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
        this.logger = logger;
    }

    public void placeOrder(Order order) {
        // Validate order
        if (order.getTotal() <= 0) {
            throw new IllegalArgumentException("Invalid order total");
        }

        // Save to database - using abstraction!
        orderRepository.save(order);

        // Send notification - using abstraction!
        notificationService.sendOrderConfirmation(order);

        // Log the order - using abstraction!
        logger.log("Order placed: " + order.getId());
    }
}
```

Now `OrderService` doesn't know or care about:
- Which database is used
- How emails are sent
- Where logs are written

It just depends on interfaces. Clean, simple, flexible.

Now let's implement those interfaces:

```java
// MySQL implementation
public class MySQLOrderRepository implements OrderRepository {
    private final DataSource dataSource;

    public MySQLOrderRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(Order order) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "INSERT INTO orders (id, customer_email, total) VALUES (?, ?, ?)"
             )) {
            
            stmt.setLong(1, order.getId());
            stmt.setString(2, order.getCustomerEmail());
            stmt.setDouble(3, order.getTotal());
            stmt.executeUpdate();
            
        } catch (SQLException e) {
            throw new DataAccessException("Failed to save order", e);
        }
    }

    @Override
    public Order findById(Long id) {
        // Implementation...
        return null;
    }
}

// Email notification implementation
public class EmailNotificationService implements NotificationService {
    private final EmailSender emailSender;

    public EmailNotificationService(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendOrderConfirmation(Order order) {
        String subject = "Order Confirmation #" + order.getId();
        String body = buildEmailBody(order);
        
        emailSender.send(
            order.getCustomerEmail(),
            subject,
            body
        );
    }

    private String buildEmailBody(Order order) {
        return "Thank you for your order!\n\n" +
               "Order ID: " + order.getId() + "\n" +
               "Total: $" + order.getTotal();
    }
}

// File-based logger implementation
public class FileLogger implements Logger {
    private final String logFilePath;

    public FileLogger(String logFilePath) {
        this.logFilePath = logFilePath;
    }

    @Override
    public void log(String message) {
        try (FileWriter writer = new FileWriter(logFilePath, true)) {
            String timestamp = LocalDateTime.now().toString();
            writer.write("[" + timestamp + "] " + message + "\n");
        } catch (IOException e) {
            // Handle error
            System.err.println("Failed to write log: " + e.getMessage());
        }
    }
}
```

Now look what we can do:

```java
// Production configuration
public class ProductionConfig {
    public OrderService createOrderService() {
        DataSource dataSource = createProductionDataSource();
        OrderRepository orderRepository = new MySQLOrderRepository(dataSource);
        
        EmailSender emailSender = new SmtpEmailSender(/* config */);
        NotificationService notificationService = new EmailNotificationService(emailSender);
        
        Logger logger = new FileLogger("/var/log/orders.log");
        
        return new OrderService(orderRepository, notificationService, logger);
    }
}

// Test configuration
public class TestConfig {
    public OrderService createOrderService() {
        OrderRepository orderRepository = new InMemoryOrderRepository();
        NotificationService notificationService = new MockNotificationService();
        Logger logger = new ConsoleLogger();
        
        return new OrderService(orderRepository, notificationService, logger);
    }
}

// Want to switch to PostgreSQL? Just change one line:
OrderRepository orderRepository = new PostgreSQLOrderRepository(dataSource);

// Want to use SendGrid for emails? Easy:
EmailSender emailSender = new SendGridEmailSender(apiKey);
NotificationService notificationService = new EmailNotificationService(emailSender);

// Want to log to a centralized logging service? Simple:
Logger logger = new CloudLogger(loggingServiceUrl);
```

See the power? We can swap any implementation without touching `OrderService`.

## A Real-World Example: Notification System

Let me show you a more complex example—a notification system that can send messages via email, SMS, push notifications, or Slack.

### The Wrong Way: Hardcoded Dependencies

```java
public class UserNotifier {
    
    public void notifyUser(User user, String message, String type) {
        if (type.equals("email")) {
            // Email logic embedded here
            SmtpClient smtp = new SmtpClient();
            smtp.connect("smtp.gmail.com", 587);
            smtp.authenticate("user@example.com", "password");
            smtp.send(user.getEmail(), "Notification", message);
            smtp.disconnect();
            
        } else if (type.equals("sms")) {
            // SMS logic embedded here
            TwilioClient twilio = new TwilioClient("account_sid", "auth_token");
            twilio.sendSms(user.getPhoneNumber(), message);
            
        } else if (type.equals("push")) {
            // Push notification logic embedded here
            FirebaseClient firebase = new FirebaseClient("api_key");
            firebase.sendPushNotification(user.getDeviceToken(), message);
            
        } else if (type.equals("slack")) {
            // Slack logic embedded here
            SlackClient slack = new SlackClient("webhook_url");
            slack.postMessage(user.getSlackUsername(), message);
        }
    }
}
```

This is terrible:
- Adding a new notification type requires changing `UserNotifier`
- Testing requires all external services
- Configuration is hardcoded
- It violates Open/Closed Principle too!

### The Right Way: Abstraction and Strategy Pattern

```java
// Define the abstraction
public interface NotificationChannel {
    void send(User user, String message);
    String getChannelName();
    boolean supports(User user);
}

// Email implementation
public class EmailNotificationChannel implements NotificationChannel {
    private final EmailService emailService;

    public EmailNotificationChannel(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void send(User user, String message) {
        if (!supports(user)) {
            throw new IllegalArgumentException("User has no email address");
        }

        String subject = "Notification from " + System.getProperty("app.name");
        emailService.send(user.getEmail(), subject, message);
    }

    @Override
    public String getChannelName() {
        return "EMAIL";
    }

    @Override
    public boolean supports(User user) {
        return user.getEmail() != null && !user.getEmail().isEmpty();
    }
}

// SMS implementation
public class SmsNotificationChannel implements NotificationChannel {
    private final SmsService smsService;

    public SmsNotificationChannel(SmsService smsService) {
        this.smsService = smsService;
    }

    @Override
    public void send(User user, String message) {
        if (!supports(user)) {
            throw new IllegalArgumentException("User has no phone number");
        }

        smsService.sendSms(user.getPhoneNumber(), message);
    }

    @Override
    public String getChannelName() {
        return "SMS";
    }

    @Override
    public boolean supports(User user) {
        return user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty();
    }
}

// Push notification implementation
public class PushNotificationChannel implements NotificationChannel {
    private final PushNotificationService pushService;

    public PushNotificationChannel(PushNotificationService pushService) {
        this.pushService = pushService;
    }

    @Override
    public void send(User user, String message) {
        if (!supports(user)) {
            throw new IllegalArgumentException("User has no device token");
        }

        pushService.sendPush(user.getDeviceToken(), "Notification", message);
    }

    @Override
    public String getChannelName() {
        return "PUSH";
    }

    @Override
    public boolean supports(User user) {
        return user.getDeviceToken() != null && !user.getDeviceToken().isEmpty();
    }
}

// Slack implementation
public class SlackNotificationChannel implements NotificationChannel {
    private final SlackService slackService;

    public SlackNotificationChannel(SlackService slackService) {
        this.slackService = slackService;
    }

    @Override
    public void send(User user, String message) {
        if (!supports(user)) {
            throw new IllegalArgumentException("User has no Slack username");
        }

        slackService.postMessage(user.getSlackUsername(), message);
    }

    @Override
    public String getChannelName() {
        return "SLACK";
    }

    @Override
    public boolean supports(User user) {
        return user.getSlackUsername() != null && !user.getSlackUsername().isEmpty();
    }
}

// High-level notification service
public class UserNotificationService {
    private final List<NotificationChannel> channels;
    private final NotificationPreferenceRepository preferenceRepository;

    public UserNotificationService(
        List<NotificationChannel> channels,
        NotificationPreferenceRepository preferenceRepository
    ) {
        this.channels = channels;
        this.preferenceRepository = preferenceRepository;
    }

    public void notifyUser(User user, String message) {
        NotificationPreference preference = preferenceRepository.findByUser(user);
        
        for (String preferredChannel : preference.getPreferredChannels()) {
            channels.stream()
                .filter(channel -> channel.getChannelName().equals(preferredChannel))
                .filter(channel -> channel.supports(user))
                .findFirst()
                .ifPresent(channel -> {
                    try {
                        channel.send(user, message);
                    } catch (Exception e) {
                        // Log error and try next channel
                        System.err.println("Failed to send via " + channel.getChannelName());
                    }
                });
        }
    }

    public void notifyUserViaChannel(User user, String message, String channelName) {
        channels.stream()
            .filter(channel -> channel.getChannelName().equals(channelName))
            .filter(channel -> channel.supports(user))
            .findFirst()
            .ifPresent(channel -> channel.send(user, message));
    }

    public List<String> getAvailableChannels(User user) {
        return channels.stream()
            .filter(channel -> channel.supports(user))
            .map(NotificationChannel::getChannelName)
            .collect(Collectors.toList());
    }
}
```

Now look at the flexibility:

```java
// Production setup
public class NotificationConfig {
    
    public UserNotificationService createNotificationService() {
        List<NotificationChannel> channels = new ArrayList<>();
        
        // Email channel
        EmailService emailService = new SmtpEmailService(/* config */);
        channels.add(new EmailNotificationChannel(emailService));
        
        // SMS channel
        SmsService smsService = new TwilioSmsService(/* config */);
        channels.add(new SmsNotificationChannel(smsService));
        
        // Push notification channel
        PushNotificationService pushService = new FirebasePushService(/* config */);
        channels.add(new PushNotificationChannel(pushService));
        
        // Slack channel
        SlackService slackService = new SlackWebhookService(/* config */);
        channels.add(new SlackNotificationChannel(slackService));
        
        NotificationPreferenceRepository preferenceRepository = 
            new DatabaseNotificationPreferenceRepository();
        
        return new UserNotificationService(channels, preferenceRepository);
    }
}

// Test setup - no external services needed!
public class TestNotificationConfig {
    
    public UserNotificationService createNotificationService() {
        List<NotificationChannel> channels = new ArrayList<>();
        
        // Mock implementations
        channels.add(new EmailNotificationChannel(new MockEmailService()));
        channels.add(new SmsNotificationChannel(new MockSmsService()));
        
        NotificationPreferenceRepository preferenceRepository = 
            new InMemoryNotificationPreferenceRepository();
        
        return new UserNotificationService(channels, preferenceRepository);
    }
}

// Want to add a new channel? Just implement the interface!
public class WhatsAppNotificationChannel implements NotificationChannel {
    private final WhatsAppService whatsAppService;

    public WhatsAppNotificationChannel(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    @Override
    public void send(User user, String message) {
        whatsAppService.sendMessage(user.getWhatsAppNumber(), message);
    }

    @Override
    public String getChannelName() {
        return "WHATSAPP";
    }

    @Override
    public boolean supports(User user) {
        return user.getWhatsAppNumber() != null;
    }
}

// Add to configuration:
channels.add(new WhatsAppNotificationChannel(new WhatsAppApiService(config)));
```

`UserNotificationService` never changes! We just add implementations.

## DIP and Dependency Injection Frameworks

DIP works beautifully with dependency injection frameworks like Spring:

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final PaymentGateway paymentGateway;

    // Spring automatically injects dependencies
    @Autowired
    public OrderService(
        OrderRepository orderRepository,
        NotificationService notificationService,
        PaymentGateway paymentGateway
    ) {
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
        this.paymentGateway = paymentGateway;
    }

    public void placeOrder(Order order) {
        // High-level business logic
        paymentGateway.charge(order.getPaymentDetails(), order.getTotal());
        orderRepository.save(order);
        notificationService.sendOrderConfirmation(order);
    }
}

// Configuration
@Configuration
public class AppConfig {
    
    @Bean
    public OrderRepository orderRepository(DataSource dataSource) {
        return new JpaOrderRepository(dataSource);
    }

    @Bean
    public NotificationService notificationService() {
        return new EmailNotificationService(emailSender());
    }

    @Bean
    public PaymentGateway paymentGateway() {
        return new StripePaymentGateway(stripeApiKey);
    }
}

// Test configuration
@TestConfiguration
public class TestConfig {
    
    @Bean
    @Primary  // Override production beans in tests
    public OrderRepository orderRepository() {
        return new InMemoryOrderRepository();
    }

    @Bean
    @Primary
    public NotificationService notificationService() {
        return new MockNotificationService();
    }

    @Bean
    @Primary
    public PaymentGateway paymentGateway() {
        return new MockPaymentGateway();
    }
}
```

Testing becomes trivial:

```java
@SpringBootTest
public class OrderServiceTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private MockNotificationService notificationService;
    
    @Test
    public void testPlaceOrder() {
        Order order = new Order(/* ... */);
        
        orderService.placeOrder(order);
        
        // Verify notification was sent
        assertTrue(notificationService.wasNotificationSent(order));
    }
}
```

## The Dependency Inversion vs Dependency Injection

People often confuse these:

- **Dependency Inversion Principle (DIP)**: A design principle about depending on abstractions, not concrete implementations
- **Dependency Injection (DI)**: A technique for providing dependencies from the outside

DI is one way to achieve DIP, but not the only way:

```java
// Dependency Injection (constructor injection)
public class OrderService {
    private final OrderRepository repository;
    
    public OrderService(OrderRepository repository) {
        this.repository = repository;  // Injected from outside
    }
}

// Service Locator (another way to achieve DIP)
public class OrderService {
    private final OrderRepository repository;
    
    public OrderService() {
        this.repository = ServiceLocator.get(OrderRepository.class);
    }
}

// Factory (yet another way)
public class OrderService {
    private final OrderRepository repository;
    
    public OrderService() {
        this.repository = RepositoryFactory.createOrderRepository();
    }
}
```

Constructor injection (DI) is usually the best approach—it's explicit, testable, and makes dependencies obvious.

## Common DIP Violations and Fixes

### Violation 1: New Keyword Everywhere

```java
// WRONG - Creating concrete dependencies
public class ReportGenerator {
    public void generateReport() {
        DatabaseConnection db = new MySQLConnection();  // Concrete!
        PdfGenerator pdf = new ApachePdfGenerator();    // Concrete!
        EmailSender email = new SmtpEmailSender();       // Concrete!
        
        // Use them...
    }
}

// RIGHT - Depend on abstractions
public class ReportGenerator {
    private final DatabaseConnection db;
    private final PdfGenerator pdf;
    private final EmailSender email;
    
    public ReportGenerator(DatabaseConnection db, PdfGenerator pdf, EmailSender email) {
        this.db = db;
        this.pdf = pdf;
        this.email = email;
    }
}
```

### Violation 2: Static Method Dependencies

```java
// WRONG - Static coupling
public class OrderProcessor {
    public void process(Order order) {
        MySQLDatabase.save(order);  // Static coupling!
        SmtpEmail.send(order.getCustomerEmail(), "Order confirmed");  // Static!
    }
}

// RIGHT - Injectable dependencies
public class OrderProcessor {
    private final OrderRepository repository;
    private final EmailService emailService;
    
    public OrderProcessor(OrderRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
    
    public void process(Order order) {
        repository.save(order);
        emailService.send(order.getCustomerEmail(), "Order confirmed");
    }
}
```

### Violation 3: Leaky Abstractions

```java
// WRONG - Abstraction exposes implementation details
public interface UserRepository {
    void saveToMongoDB(User user);  // MongoDB leaks through!
    User findByMongoId(String id);   // MongoDB leaks through!
}

// RIGHT - Pure abstraction
public interface UserRepository {
    void save(User user);
    Optional<User> findById(String id);
}
```

## Practical Tips for Applying DIP

### 1. **Extract Interfaces from Concrete Classes**

Start with what you have and extract interfaces:

```java
// Before
public class FileStorage {
    public void save(String filename, byte[] data) { /* ... */ }
}

// After - extract interface
public interface Storage {
    void save(String filename, byte[] data);
}

public class FileStorage implements Storage {
    public void save(String filename, byte[] data) { /* ... */ }
}

// Now you can add implementations
public class CloudStorage implements Storage { /* ... */ }
public class DatabaseStorage implements Storage { /* ... */ }
```

### 2. **Use Constructor Injection**

Make dependencies explicit:

```java
// Good
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;
    
    public UserService(UserRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
}
```

### 3. **Program to Interfaces, Not Implementations**

```java
// Bad
MySQLUserRepository repository = new MySQLUserRepository();

// Good
UserRepository repository = new MySQLUserRepository();
```

### 4. **Keep Abstractions Focused**

Don't let implementation details leak into interfaces:

```java
// Bad - leaky abstraction
public interface DataStore {
    ResultSet executeQuery(String sql);  // SQL leaks through!
}

// Good - clean abstraction
public interface DataStore {
    List<User> findUsers(UserCriteria criteria);
}
```

### 5. **Test Through Abstractions**

```java
@Test
public void testOrderService() {
    // Use test doubles (mocks/stubs)
    OrderRepository mockRepository = mock(OrderRepository.class);
    NotificationService mockNotification = mock(NotificationService.class);
    
    OrderService service = new OrderService(mockRepository, mockNotification);
    
    // Test without real dependencies
    service.placeOrder(testOrder);
    
    verify(mockRepository).save(testOrder);
    verify(mockNotification).sendOrderConfirmation(testOrder);
}
```

## When to Violate DIP

### Case 1: Stable Dependencies

It's OK to depend directly on very stable libraries:

```java
// OK - String is stable
public class UserService {
    public String formatUserName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }
}

// OK - Java collections are stable
public class OrderService {
    public List<Order> getOrders() {
        return new ArrayList<>();
    }
}
```

### Case 2: Simple Utility Classes

```java
// OK for simple utilities
public class PriceCalculator {
    public double calculate(double price) {
        return price * Math.pow(1.1, 2);  // Math is fine
    }
}
```

### Case 3: Value Objects

```java
// OK - value objects don't need abstraction
public class OrderService {
    public Order createOrder(Money price, Customer customer) {
        return new Order(price, customer);
    }
}
```

## DIP and Other SOLID Principles

DIP works with the other principles:

- **Single Responsibility**: Each abstraction has one reason to change
- **Open/Closed**: Add new implementations without changing high-level code
- **Liskov Substitution**: Implementations must be proper substitutes
- **Interface Segregation**: Keep abstractions focused

Together, they create maintainable systems.

## Conclusion

The Dependency Inversion Principle is about controlling which direction dependencies flow. Instead of high-level business logic depending on low-level implementation details, both depend on abstractions.

Think of abstractions as contracts. Your business logic says "I need something that can store orders" (the contract). You can then plug in any implementation that fulfills that contract—MySQL, PostgreSQL, MongoDB, an in-memory store for testing, whatever.

When you follow DIP:
- Your code becomes testable without external dependencies
- You can swap implementations easily
- Changes to details don't affect business logic
- Your architecture becomes flexible and maintainable

When you violate DIP:
- Your business logic is tightly coupled to implementation details
- Testing requires full infrastructure
- Changing implementations requires rewriting business logic
- Your architecture becomes rigid and fragile

Remember: **Depend on abstractions, not concretions.** Your business logic is precious—don't pollute it with implementation details. Let the details depend on the abstractions, not the other way around.

The key insight: It's not just about creating interfaces—it's about inverting the traditional dependency flow so that details (low-level modules) depend on business rules (high-level modules) through shared abstractions. That's the "inversion" in Dependency Inversion Principle.
