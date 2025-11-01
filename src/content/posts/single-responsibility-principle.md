---
title: S (Single Responsibility) from SOLID
pubDate: '2024-06-02 05:49:46 +0100'
categories:
  - Software architecture
  - Software design
  - SOLID
---

# Understanding the Single Responsibility Principle: Write Better Code by Doing Less

## What Is the Single Responsibility Principle, Really?

Imagine you're running a busy coffee shop. You wouldn't want your barista to also handle accounting, manage inventory, and clean the bathrooms all at the same time, right? That's essentially what the Single Responsibility Principle (SRP) is about—but for your code.

The Single Responsibility Principle is the "S" in SOLID, and it's probably the most intuitive of the five principles. Robert C. Martin (Uncle Bob) summed it up perfectly: **"A class should have only one reason to change."**

Think about that for a moment. If your class needs to be modified for multiple different reasons—maybe because the database structure changed, or because the business rules changed, or because the UI needs an update—then it's doing too much. It has too many responsibilities.

Here's the thing: when a class tries to juggle multiple responsibilities, it becomes fragile. Change one thing, and you might accidentally break something completely unrelated. It's like pulling a thread on a sweater and watching the whole thing unravel.

## Why Should You Care About SRP?

Let me share a real story. I once inherited a project where there was a class called `UserManager`. Sounds innocent enough, right? Well, this class was responsible for:

- Creating and updating user accounts
- Sending welcome emails
- Logging user activities
- Validating user input
- Generating user reports
- Managing user sessions

Every time we needed to change the email template, we had to touch this massive class. When we needed to add a new validation rule, same thing. Want to change how logging works? Yep, back to `UserManager`. It became a bottleneck where bugs loved to hide.

Here's why SRP matters in the real world:

### 1. **Easier to Understand**
When a class does one thing, you can understand it in minutes. No more spending hours trying to figure out what a 2,000-line "God class" actually does.

### 2. **Safer to Change**
Need to modify how emails are sent? With SRP, you know exactly which class to change, and you're confident you won't accidentally break the login system.

### 3. **Simpler Testing**
Testing a class that does one thing is straightforward. You write a few tests, cover all the scenarios, and you're done. Testing a class that does ten things? Good luck with that.

### 4. **Better Reusability**
A class that validates email addresses can be used anywhere in your application. A class that validates emails AND manages database connections AND sends notifications? Not so much.

### 5. **Team Collaboration**
When multiple developers work on the same codebase, SRP prevents stepping on each other's toes. Different people can work on different responsibilities without conflicts.

## A Real-World Example: The Invoice Problem

Let me show you a practical example that you might encounter in any business application.

### The Wrong Way: Before Applying SRP

Imagine we're building an invoicing system. Here's what many developers might write:

```java
public class Invoice {
    private String invoiceNumber;
    private Customer customer;
    private List<LineItem> items;
    private double totalAmount;

    public Invoice(String invoiceNumber, Customer customer, List<LineItem> items) {
        this.invoiceNumber = invoiceNumber;
        this.customer = customer;
        this.items = items;
        this.totalAmount = calculateTotal();
    }

    // Calculate invoice total
    private double calculateTotal() {
        double total = 0;
        for (LineItem item : items) {
            total += item.getPrice() * item.getQuantity();
        }
        // Apply 10% discount for orders over $1000
        if (total > 1000) {
            total *= 0.9;
        }
        // Add 8% tax
        total *= 1.08;
        return total;
    }

    // Validate invoice data
    public boolean isValid() {
        if (invoiceNumber == null || invoiceNumber.isEmpty()) {
            return false;
        }
        if (customer == null || customer.getEmail() == null) {
            return false;
        }
        if (items == null || items.isEmpty()) {
            return false;
        }
        return customer.getEmail().contains("@");
    }

    // Save invoice to database
    public void save() {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/invoices");
            String sql = "INSERT INTO invoices (invoice_number, customer_id, total) VALUES (?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, invoiceNumber);
            stmt.setInt(2, customer.getId());
            stmt.setDouble(3, totalAmount);
            stmt.executeUpdate();
            stmt.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Generate PDF report
    public byte[] generatePDF() {
        // PDF generation logic here
        return new byte[0]; // Simplified
    }

    // Send invoice via email
    public void sendByEmail() {
        // Email sending logic here
    }

    // Getters
    public String getInvoiceNumber() { return invoiceNumber; }
    public double getTotalAmount() { return totalAmount; }
}
```

Look at this monster! This single class is trying to do everything:
- Hold invoice data
- Calculate totals with business rules
- Validate data
- Save to database
- Generate PDFs
- Send emails

What happens when:
- The tax rate changes? (You modify `Invoice`)
- The database schema changes? (You modify `Invoice`)
- The email template changes? (You modify `Invoice`)
- The PDF layout changes? (You modify `Invoice`)
- The validation rules change? (You modify `Invoice`)

See the problem? This class has **at least five different reasons to change**. That's five times more likely to introduce bugs.

### The Right Way: After Applying SRP

Now, let's refactor this into separate, focused classes. Each class will have exactly one reason to change:

#### 1. The Invoice Data Class

This class is now a simple data container. Its only responsibility is to hold invoice information:

```java
public class Invoice {
    private final String invoiceNumber;
    private final Customer customer;
    private final List<LineItem> items;
    private final LocalDate invoiceDate;

    public Invoice(String invoiceNumber, Customer customer, List<LineItem> items, LocalDate invoiceDate) {
        this.invoiceNumber = invoiceNumber;
        this.customer = customer;
        this.items = new ArrayList<>(items); // Defensive copy
        this.invoiceDate = invoiceDate;
    }

    public String getInvoiceNumber() { return invoiceNumber; }
    public Customer getCustomer() { return customer; }
    public List<LineItem> getItems() { return new ArrayList<>(items); } // Defensive copy
    public LocalDate getInvoiceDate() { return invoiceDate; }
}
```

#### 2. The Invoice Calculator

This class handles all the math and business rules:

```java
public class InvoiceCalculator {
    private static final double TAX_RATE = 0.08;
    private static final double DISCOUNT_THRESHOLD = 1000.0;
    private static final double DISCOUNT_RATE = 0.10;

    public double calculateTotal(Invoice invoice) {
        double subtotal = calculateSubtotal(invoice);
        double afterDiscount = applyDiscount(subtotal);
        return applyTax(afterDiscount);
    }

    private double calculateSubtotal(Invoice invoice) {
        return invoice.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    private double applyDiscount(double amount) {
        if (amount > DISCOUNT_THRESHOLD) {
            return amount * (1 - DISCOUNT_RATE);
        }
        return amount;
    }

    private double applyTax(double amount) {
        return amount * (1 + TAX_RATE);
    }

    public double calculateSubtotal(Invoice invoice) {
        return calculateSubtotal(invoice);
    }
}
```

#### 3. The Invoice Validator

This class focuses solely on validation logic:

```java
public class InvoiceValidator {
    
    public ValidationResult validate(Invoice invoice) {
        List<String> errors = new ArrayList<>();

        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().trim().isEmpty()) {
            errors.add("Invoice number is required");
        }

        if (invoice.getCustomer() == null) {
            errors.add("Customer information is required");
        } else {
            validateCustomer(invoice.getCustomer(), errors);
        }

        if (invoice.getItems() == null || invoice.getItems().isEmpty()) {
            errors.add("Invoice must have at least one item");
        }

        if (invoice.getInvoiceDate() == null) {
            errors.add("Invoice date is required");
        }

        return new ValidationResult(errors.isEmpty(), errors);
    }

    private void validateCustomer(Customer customer, List<String> errors) {
        if (customer.getEmail() == null || !customer.getEmail().contains("@")) {
            errors.add("Valid customer email is required");
        }

        if (customer.getName() == null || customer.getName().trim().isEmpty()) {
            errors.add("Customer name is required");
        }
    }
}

// Simple value object for validation results
public class ValidationResult {
    private final boolean valid;
    private final List<String> errors;

    public ValidationResult(boolean valid, List<String> errors) {
        this.valid = valid;
        this.errors = new ArrayList<>(errors);
    }

    public boolean isValid() { return valid; }
    public List<String> getErrors() { return new ArrayList<>(errors); }
}
```

#### 4. The Invoice Repository

This class handles all database operations:

```java
public class InvoiceRepository {
    private final DataSource dataSource;

    public InvoiceRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void save(Invoice invoice, double totalAmount) {
        String sql = "INSERT INTO invoices (invoice_number, customer_id, invoice_date, total_amount) " +
                     "VALUES (?, ?, ?, ?)";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, invoice.getInvoiceNumber());
            stmt.setInt(2, invoice.getCustomer().getId());
            stmt.setDate(3, Date.valueOf(invoice.getInvoiceDate()));
            stmt.setDouble(4, totalAmount);
            stmt.executeUpdate();
            
            // Save line items
            saveLineItems(conn, invoice);
            
        } catch (SQLException e) {
            throw new InvoiceStorageException("Failed to save invoice: " + invoice.getInvoiceNumber(), e);
        }
    }

    private void saveLineItems(Connection conn, Invoice invoice) throws SQLException {
        String sql = "INSERT INTO invoice_items (invoice_number, description, quantity, price) VALUES (?, ?, ?, ?)";
        
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (LineItem item : invoice.getItems()) {
                stmt.setString(1, invoice.getInvoiceNumber());
                stmt.setString(2, item.getDescription());
                stmt.setInt(3, item.getQuantity());
                stmt.setDouble(4, item.getPrice());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    public Invoice findByNumber(String invoiceNumber) {
        String sql = "SELECT * FROM invoices WHERE invoice_number = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, invoiceNumber);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapToInvoice(rs);
                }
            }
        } catch (SQLException e) {
            throw new InvoiceStorageException("Failed to retrieve invoice: " + invoiceNumber, e);
        }
        
        return null;
    }

    private Invoice mapToInvoice(ResultSet rs) throws SQLException {
        // Mapping logic here
        return null; // Simplified for brevity
    }
}
```

#### 5. The PDF Generator

This class is responsible for generating PDF reports:

```java
public class InvoicePdfGenerator {
    
    public byte[] generate(Invoice invoice, double totalAmount) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            
            document.open();
            addHeader(document, invoice);
            addCustomerInfo(document, invoice);
            addLineItems(document, invoice);
            addTotal(document, totalAmount);
            document.close();
            
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new PdfGenerationException("Failed to generate PDF for invoice: " + 
                                            invoice.getInvoiceNumber(), e);
        }
    }

    private void addHeader(Document document, Invoice invoice) throws DocumentException {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph header = new Paragraph("INVOICE", headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        
        document.add(new Paragraph("Invoice #: " + invoice.getInvoiceNumber()));
        document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));
        document.add(Chunk.NEWLINE);
    }

    private void addCustomerInfo(Document document, Invoice invoice) throws DocumentException {
        document.add(new Paragraph("Bill To:"));
        document.add(new Paragraph(invoice.getCustomer().getName()));
        document.add(new Paragraph(invoice.getCustomer().getEmail()));
        document.add(Chunk.NEWLINE);
    }

    private void addLineItems(Document document, Invoice invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{3, 1, 2, 2});

        // Header
        addTableHeader(table);

        // Items
        for (LineItem item : invoice.getItems()) {
            table.addCell(item.getDescription());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.format("$%.2f", item.getPrice()));
            table.addCell(String.format("$%.2f", item.getPrice() * item.getQuantity()));
        }

        document.add(table);
    }

    private void addTableHeader(PdfPTable table) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        PdfPCell cell;
        
        String[] headers = {"Description", "Qty", "Price", "Total"};
        for (String header : headers) {
            cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }
    }

    private void addTotal(Document document, double totalAmount) throws DocumentException {
        document.add(Chunk.NEWLINE);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph total = new Paragraph(String.format("Total: $%.2f", totalAmount), boldFont);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);
    }
}
```

#### 6. The Email Service

This class handles sending invoices via email:

```java
public class InvoiceEmailService {
    private final EmailConfiguration config;

    public InvoiceEmailService(EmailConfiguration config) {
        this.config = config;
    }

    public void sendInvoice(Invoice invoice, byte[] pdfAttachment) {
        try {
            MimeMessage message = createMessage();
            message.setFrom(new InternetAddress(config.getFromAddress()));
            message.setRecipients(Message.RecipientType.TO, 
                                InternetAddress.parse(invoice.getCustomer().getEmail()));
            message.setSubject("Your Invoice #" + invoice.getInvoiceNumber());

            Multipart multipart = new MimeMultipart();
            
            // Add email body
            multipart.addBodyPart(createTextPart(invoice));
            
            // Add PDF attachment
            multipart.addBodyPart(createAttachmentPart(pdfAttachment, invoice.getInvoiceNumber()));

            message.setContent(multipart);
            Transport.send(message);
            
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send invoice email: " + 
                                        invoice.getInvoiceNumber(), e);
        }
    }

    private MimeMessage createMessage() throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.host", config.getSmtpHost());
        props.put("mail.smtp.port", config.getSmtpPort());
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(config.getUsername(), config.getPassword());
            }
        });

        return new MimeMessage(session);
    }

    private MimeBodyPart createTextPart(Invoice invoice) throws MessagingException {
        MimeBodyPart textPart = new MimeBodyPart();
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Please find attached your invoice #%s.\n\n" +
            "Thank you for your business!\n\n" +
            "Best regards,\n" +
            "The Billing Team",
            invoice.getCustomer().getName(),
            invoice.getInvoiceNumber()
        );
        textPart.setText(emailBody);
        return textPart;
    }

    private MimeBodyPart createAttachmentPart(byte[] pdfData, String invoiceNumber) 
            throws MessagingException {
        MimeBodyPart attachmentPart = new MimeBodyPart();
        DataSource source = new ByteArrayDataSource(pdfData, "application/pdf");
        attachmentPart.setDataHandler(new DataHandler(source));
        attachmentPart.setFileName("Invoice_" + invoiceNumber + ".pdf");
        return attachmentPart;
    }
}
```

### Putting It All Together

Now, here's how you'd use these classes in your application:

```java
public class InvoiceService {
    private final InvoiceValidator validator;
    private final InvoiceCalculator calculator;
    private final InvoiceRepository repository;
    private final InvoicePdfGenerator pdfGenerator;
    private final InvoiceEmailService emailService;

    public InvoiceService(InvoiceValidator validator, 
                         InvoiceCalculator calculator,
                         InvoiceRepository repository,
                         InvoicePdfGenerator pdfGenerator,
                         InvoiceEmailService emailService) {
        this.validator = validator;
        this.calculator = calculator;
        this.repository = repository;
        this.pdfGenerator = pdfGenerator;
        this.emailService = emailService;
    }

    public InvoiceResult processInvoice(Invoice invoice) {
        // Validate
        ValidationResult validationResult = validator.validate(invoice);
        if (!validationResult.isValid()) {
            return InvoiceResult.failure(validationResult.getErrors());
        }

        // Calculate
        double totalAmount = calculator.calculateTotal(invoice);

        // Save
        repository.save(invoice, totalAmount);

        // Generate PDF
        byte[] pdfData = pdfGenerator.generate(invoice, totalAmount);

        // Send email
        emailService.sendInvoice(invoice, pdfData);

        return InvoiceResult.success(invoice.getInvoiceNumber(), totalAmount);
    }
}
```

## The Benefits Are Clear

Look at what we've achieved:

1. **Single Responsibility**: Each class has exactly one reason to change:
   - `Invoice` changes only when the data structure changes
   - `InvoiceCalculator` changes only when business rules change
   - `InvoiceValidator` changes only when validation rules change
   - `InvoiceRepository` changes only when database logic changes
   - `InvoicePdfGenerator` changes only when PDF formatting changes
   - `InvoiceEmailService` changes only when email logic changes

2. **Easier Testing**: Each class can be tested in isolation:

```java
@Test
public void testInvoiceCalculator_AppliesDiscountCorrectly() {
    InvoiceCalculator calculator = new InvoiceCalculator();
    
    List<LineItem> items = Arrays.asList(
        new LineItem("Item 1", 2, 600.00) // Total: $1200
    );
    Invoice invoice = new Invoice("INV-001", customer, items, LocalDate.now());
    
    double total = calculator.calculateTotal(invoice);
    
    // $1200 * 0.9 (discount) * 1.08 (tax) = $1166.40
    assertEquals(1166.40, total, 0.01);
}

@Test
public void testInvoiceValidator_RejectsInvalidEmail() {
    InvoiceValidator validator = new InvoiceValidator();
    Customer customer = new Customer(1, "John Doe", "invalid-email");
    Invoice invoice = new Invoice("INV-001", customer, items, LocalDate.now());
    
    ValidationResult result = validator.validate(invoice);
    
    assertFalse(result.isValid());
    assertTrue(result.getErrors().stream()
        .anyMatch(error -> error.contains("email")));
}
```

3. **Better Maintainability**: Need to change the tax rate? Just modify `InvoiceCalculator`. Need to change the email template? Just modify `InvoiceEmailService`. No need to wade through unrelated code.

4. **Improved Reusability**: The `InvoiceValidator` can be used anywhere you need to validate invoices. The `InvoicePdfGenerator` can be used in different contexts like generating reports.

5. **Easier Collaboration**: Different team members can work on different aspects:
   - Frontend developer can work with the `Invoice` data class
   - Business analyst can focus on `InvoiceCalculator`
   - DevOps can optimize `InvoiceRepository`
   - Designer can improve `InvoicePdfGenerator`

## Real-World Examples from Java Libraries

Let's look at how professional libraries implement SRP:

### 1. Java Collections Framework

The Java Collections Framework is a masterclass in SRP:

```java
// ArrayList: Responsible for managing a resizable array
List<String> list = new ArrayList<>();
list.add("item");

// Collections.sort: Responsible ONLY for sorting
Collections.sort(list);

// Collections.reverse: Responsible ONLY for reversing
Collections.reverse(list);
```

Notice how each class/method has a single, clear responsibility. `ArrayList` doesn't try to sort itself—that's delegated to `Collections.sort()`.

### 2. Java I/O Streams

The Java I/O library uses a decorator pattern that perfectly demonstrates SRP:

```java
// FileInputStream: Responsible for reading bytes from a file
FileInputStream fileInput = new FileInputStream("data.txt");

// BufferedInputStream: Responsible for buffering
BufferedInputStream bufferedInput = new BufferedInputStream(fileInput);

// DataInputStream: Responsible for reading primitive types
DataInputStream dataInput = new DataInputStream(bufferedInput);

int number = dataInput.readInt();
```

Each class has a single job:
- `FileInputStream` reads raw bytes
- `BufferedInputStream` provides buffering
- `DataInputStream` interprets bytes as data types

### 3. Spring Framework

Spring's dependency injection is built on SRP:

```java
@Service
public class UserService {
    private final UserRepository repository;  // Only handles data access
    private final EmailService emailService;   // Only handles emails
    private final ValidationService validator; // Only handles validation

    public UserService(UserRepository repository, 
                      EmailService emailService,
                      ValidationService validator) {
        this.repository = repository;
        this.emailService = emailService;
        this.validator = validator;
    }

    public void registerUser(User user) {
        validator.validate(user);
        repository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

## Common Mistakes to Avoid

### Mistake #1: Being Too Granular

Don't go overboard. A class with one method that's three lines long is probably too granular. Use common sense:

```java
// Too granular - probably overkill
public class EmailAddressExtractor {
    public String extract(String email) {
        return email;
    }
}

// Better - reasonable granularity
public class EmailValidator {
    public boolean isValid(String email) {
        return email != null && 
               email.contains("@") && 
               email.contains(".");
    }
}
```

### Mistake #2: Confusing "Reason to Change" with "What Changes"

A class that has multiple methods isn't necessarily violating SRP. It's about cohesion:

```java
// This is FINE - all methods relate to the same responsibility
public class InvoiceCalculator {
    public double calculateTotal(Invoice invoice) { /*...*/ }
    public double calculateSubtotal(Invoice invoice) { /*...*/ }
    public double calculateTax(double amount) { /*...*/ }
    public double calculateDiscount(double amount) { /*...*/ }
}
```

All these methods are part of the same responsibility: calculating invoice amounts.

### Mistake #3: Not Recognizing Hidden Responsibilities

Sometimes responsibilities hide in plain sight:

```java
// VIOLATES SRP - mixing business logic with presentation
public class User {
    private String name;
    private String email;

    public String getDisplayName() {
        // This is a presentation concern, not a data concern!
        return name.toUpperCase() + " (" + email + ")";
    }
}

// BETTER - separate concerns
public class User {
    private String name;
    private String email;
    // Just getters/setters
}

public class UserDisplayFormatter {
    public String formatForDisplay(User user) {
        return user.getName().toUpperCase() + " (" + user.getEmail() + ")";
    }
}
```

## When to Apply SRP

You should refactor when you notice:

1. **Your class has "and" in its description**: "This class handles user data AND sends emails AND logs activities"
2. **Changes ripple through**: Modifying one feature requires touching multiple unrelated methods
3. **Testing is painful**: You need complex setup just to test one simple feature
4. **Merge conflicts are common**: Multiple developers constantly edit the same file
5. **The class is hard to name**: If you can't give your class a clear, specific name, it probably does too much

## Practical Tips for Applying SRP

1. **Start with clear naming**: If you can't describe what your class does in a short sentence without using "and," it's doing too much.

2. **Look for clusters of methods**: Methods that work with the same subset of fields probably belong together—maybe in their own class.

3. **Think about change**: Ask yourself: "If requirement X changes, will I need to modify this class?" If you answer "yes" for multiple unrelated requirements, refactor.

4. **Use interfaces to clarify responsibilities**: Defining an interface forces you to think about the contract and responsibility.

5. **Refactor incrementally**: You don't need to refactor everything at once. Start with the most problematic classes.

## Conclusion

The Single Responsibility Principle isn't about having classes with only one method. It's about designing classes that have one clear purpose, one reason to exist, and one reason to change.

Think of it this way: if your class were a person with a job, would that job description fit in one sentence? "Manages invoice calculations" is clear. "Manages invoices, sends emails, generates PDFs, validates data, and saves to database" is five different jobs.

When you apply SRP consistently, your code becomes easier to understand, safer to change, simpler to test, and more reusable. Your teammates will thank you, your future self will thank you, and honestly, your debugger will get a lot less of a workout.

Remember: do one thing, and do it well. Your code will be better for it.
