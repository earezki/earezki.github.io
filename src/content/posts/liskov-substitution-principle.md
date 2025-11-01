---
title: L (Liskov Substitution) from SOLID
pubDate: '2024-06-20 00:00:46 +0100'
categories:
  - Software architecture
  - Software design
  - SOLID
---

# The Liskov Substitution Principle: Why Your Inheritance Might Be Lying to You

## What Is Liskov Substitution, Really?

Let me start with a confession: when I first heard about the Liskov Substitution Principle (LSP), I had absolutely no idea what it meant. "Objects of a superclass should be replaceable with objects of a subclass"—what does that even mean in English?

Here's the simplest way I can explain it: **If you have code that works with a parent class, it should work exactly the same way with any of its child classes, without knowing or caring about the difference.**

Think of it like this: imagine you ask someone to grab you a "vehicle" from the garage. They might bring you a car, a motorcycle, or a bicycle. Regardless of which one they bring, you should be able to use it to get from point A to point B. If they bring you something that looks like a vehicle but can't actually move (like a decorative car sculpture), that violates LSP. It looks like a vehicle, claims to be a vehicle, but doesn't behave like one.

Barbara Liskov introduced this principle in 1987, and it's named after her (how cool is that?). The formal definition is intimidating, but the core idea is simple: **child classes must be true substitutes for their parent classes**.

## Why Should You Care About LSP?

Let me tell you a painful story. Early in my career, I was working on a document management system. We had a `Document` class with a `save()` method. Simple enough. Then someone created a `ReadOnlyDocument` subclass. Guess what the `save()` method did in that class?

It threw an exception.

You can imagine the chaos. Code that worked perfectly with regular documents would randomly crash when it encountered a read-only document. We spent weeks tracking down all the places where this happened and adding special checks. It was a nightmare.

The problem? `ReadOnlyDocument` violated LSP. It inherited from `Document` but couldn't fulfill the contract that `Document` established. It looked like a duck and quacked like a duck, but when you asked it to swim, it sank.

Here's why LSP matters in real-world development:

### 1. **Prevents Unexpected Crashes**
When child classes properly substitute for parents, you don't need defensive checks everywhere. Code just works.

### 2. **Makes Polymorphism Actually Useful**
The whole point of polymorphism is treating different objects uniformly. LSP is what makes that safe.

### 3. **Reduces Bug-Hunting Time**
Without LSP, bugs hide in unexpected places. With LSP, behavior is predictable.

### 4. **Enables Confident Refactoring**
You can change which subclass you use without worrying about breaking things.

### 5. **Improves Code Reusability**
When classes truly substitute for each other, you can use them interchangeably across your codebase.

## The Classic Example: The Square-Rectangle Problem

This is the famous example that everyone uses to teach LSP, and for good reason—it perfectly illustrates the problem.

### The Wrong Way: Violating LSP

In mathematics, a square IS-A rectangle (a rectangle with equal sides). So naturally, many developers try this:

```java
public class Rectangle {
    protected int width;
    protected int height;

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int getArea() {
        return width * height;
    }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width;  // Keep it square!
    }

    @Override
    public void setHeight(int height) {
        this.width = height;  // Keep it square!
        this.height = height;
    }
}
```

Looks reasonable, right? A square maintains equal sides. But watch what happens:

```java
public class ShapeTest {
    public static void testRectangle(Rectangle rectangle) {
        rectangle.setWidth(5);
        rectangle.setHeight(4);
        
        int area = rectangle.getArea();
        System.out.println("Expected area: 20, Actual area: " + area);
        
        assert area == 20 : "Area should be 20!";
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle();
        testRectangle(rect);  // Works fine: area = 20
        
        Rectangle square = new Square();
        testRectangle(square);  // FAILS: area = 16, not 20!
    }
}
```

The test works perfectly with `Rectangle` but fails with `Square`, even though `Square` is supposedly a valid `Rectangle`. This violates LSP.

Why? Because `Square` changes the behavior that `Rectangle` promised. When you call `setWidth()` on a `Rectangle`, you expect only the width to change. But `Square` also changes the height. That's a contract violation.

## A Real-World Example: The Bird Problem

Let me show you a more practical example that you might actually encounter.

### The Wrong Way: When Inheritance Goes Bad

```java
public class Bird {
    private String name;
    private int altitude;

    public Bird(String name) {
        this.name = name;
        this.altitude = 0;
    }

    public void fly(int targetAltitude) {
        System.out.println(name + " is flying to " + targetAltitude + " feet");
        this.altitude = targetAltitude;
    }

    public void land() {
        System.out.println(name + " is landing");
        this.altitude = 0;
    }

    public int getAltitude() {
        return altitude;
    }

    public String getName() {
        return name;
    }
}

// Looks innocent enough
public class Sparrow extends Bird {
    public Sparrow() {
        super("Sparrow");
    }
}

public class Eagle extends Bird {
    public Eagle() {
        super("Eagle");
    }
}

// Uh oh...
public class Penguin extends Bird {
    public Penguin() {
        super("Penguin");
    }

    @Override
    public void fly(int targetAltitude) {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

public class Ostrich extends Bird {
    public Ostrich() {
        super("Ostrich");
    }

    @Override
    public void fly(int targetAltitude) {
        throw new UnsupportedOperationException("Ostriches can't fly!");
    }
}
```

Now imagine this code:

```java
public class BirdSanctuary {
    public void relocateBirds(List<Bird> birds, int distance) {
        for (Bird bird : birds) {
            // Make each bird fly to the new location
            bird.fly(distance);
            // ... do the relocation ...
            bird.land();
        }
    }
}

// This works
List<Bird> flyingBirds = Arrays.asList(new Sparrow(), new Eagle());
sanctuary.relocateBirds(flyingBirds, 1000);  // Success!

// This crashes
List<Bird> allBirds = Arrays.asList(new Sparrow(), new Eagle(), new Penguin(), new Ostrich());
sanctuary.relocateBirds(allBirds, 1000);  // BOOM! UnsupportedOperationException
```

The `Penguin` and `Ostrich` classes violate LSP. They inherit from `Bird` but can't fulfill the flying contract that `Bird` establishes.

### The Right Way: Proper Abstraction

Let's fix this by creating better abstractions:

```java
public abstract class Bird {
    private final String name;
    private final String species;

    protected Bird(String name, String species) {
        this.name = name;
        this.species = species;
    }

    public abstract void move(int distance);
    
    public String getName() {
        return name;
    }

    public String getSpecies() {
        return species;
    }
}

public abstract class FlyingBird extends Bird {
    private int altitude;

    protected FlyingBird(String name, String species) {
        super(name, species);
        this.altitude = 0;
    }

    public void fly(int targetAltitude) {
        System.out.println(getName() + " is flying to " + targetAltitude + " feet");
        this.altitude = targetAltitude;
    }

    public void land() {
        System.out.println(getName() + " is landing");
        this.altitude = 0;
    }

    @Override
    public void move(int distance) {
        fly(distance);
        // Calculate flying distance
        System.out.println(getName() + " flew " + distance + " feet");
        land();
    }

    public int getAltitude() {
        return altitude;
    }
}

public abstract class FlightlessBird extends Bird {
    protected FlightlessBird(String name, String species) {
        super(name, species);
    }

    public void walk(int distance) {
        System.out.println(getName() + " is walking " + distance + " feet");
    }

    @Override
    public void move(int distance) {
        walk(distance);
    }
}

// Now our concrete classes
public class Sparrow extends FlyingBird {
    public Sparrow(String name) {
        super(name, "Sparrow");
    }
}

public class Eagle extends FlyingBird {
    public Eagle(String name) {
        super(name, "Eagle");
    }
}

public class Penguin extends FlightlessBird {
    public Penguin(String name) {
        super(name, "Penguin");
    }

    public void swim(int distance) {
        System.out.println(getName() + " is swimming " + distance + " feet");
    }

    @Override
    public void move(int distance) {
        // Penguins prefer swimming
        swim(distance);
    }
}

public class Ostrich extends FlightlessBird {
    public Ostrich(String name) {
        super(name, "Ostrich");
    }

    public void run(int distance) {
        System.out.println(getName() + " is running " + distance + " feet");
    }

    @Override
    public void move(int distance) {
        // Ostriches are fast runners
        run(distance);
    }
}
```

Now our sanctuary can work with any bird:

```java
public class BirdSanctuary {
    public void relocateBirds(List<Bird> birds, int distance) {
        for (Bird bird : birds) {
            // This works for ALL birds now
            bird.move(distance);
        }
    }

    public void relocateFlyingBirds(List<FlyingBird> birds, int altitude) {
        for (FlyingBird bird : birds) {
            // This is safe - we know these birds can fly
            bird.fly(altitude);
            bird.land();
        }
    }
}

// Now both work perfectly
List<Bird> allBirds = Arrays.asList(
    new Sparrow("Tweety"), 
    new Eagle("Sam"), 
    new Penguin("Skipper"), 
    new Ostrich("Big Bird")
);
sanctuary.relocateBirds(allBirds, 1000);  // Success! Each moves appropriately

List<FlyingBird> flyingOnly = Arrays.asList(
    new Sparrow("Chirpy"), 
    new Eagle("Freedom")
);
sanctuary.relocateFlyingBirds(flyingOnly, 5000);  // Success! All can fly
```

## A Business Example: Payment Processing

Let me show you an example from a typical e-commerce application.

### The Wrong Way: Violating LSP in Business Logic

```java
public class Payment {
    protected double amount;
    protected String transactionId;

    public Payment(double amount) {
        this.amount = amount;
    }

    public String process() {
        // Process the payment
        this.transactionId = generateTransactionId();
        return transactionId;
    }

    public void refund() {
        System.out.println("Refunding transaction: " + transactionId);
        // Process refund
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }

    public double getAmount() {
        return amount;
    }

    public String getTransactionId() {
        return transactionId;
    }
}

// Seems reasonable...
public class CreditCardPayment extends Payment {
    private String cardNumber;

    public CreditCardPayment(double amount, String cardNumber) {
        super(amount);
        this.cardNumber = cardNumber;
    }

    @Override
    public String process() {
        // Charge credit card
        return super.process();
    }
}

// But this violates LSP!
public class GiftCardPayment extends Payment {
    private double remainingBalance;

    public GiftCardPayment(double amount, double remainingBalance) {
        super(amount);
        this.remainingBalance = remainingBalance;
    }

    @Override
    public String process() {
        if (amount > remainingBalance) {
            throw new InsufficientFundsException("Gift card balance too low");
        }
        this.remainingBalance -= amount;
        return super.process();
    }

    @Override
    public void refund() {
        // Gift cards can't be refunded!
        throw new UnsupportedOperationException("Gift cards cannot be refunded");
    }
}
```

Now look at the problem:

```java
public class OrderProcessor {
    public void processOrder(Order order, Payment payment) {
        try {
            String transactionId = payment.process();
            order.setStatus("COMPLETED");
            order.setTransactionId(transactionId);
        } catch (Exception e) {
            // If payment fails, refund any partial charges
            if (payment.getTransactionId() != null) {
                payment.refund();  // BOOM! Crashes for GiftCardPayment
            }
            order.setStatus("FAILED");
            throw new OrderProcessingException("Order failed", e);
        }
    }
}
```

### The Right Way: Respecting LSP

```java
public interface Payment {
    PaymentResult process(double amount);
    boolean canProcess(double amount);
    String getPaymentType();
}

public interface Refundable {
    RefundResult refund(String transactionId, double amount);
    boolean canRefund(String transactionId);
}

// Credit card payments are refundable
public class CreditCardPayment implements Payment, Refundable {
    private final String cardNumber;
    private final CreditCardProcessor processor;

    public CreditCardPayment(String cardNumber, CreditCardProcessor processor) {
        this.cardNumber = cardNumber;
        this.processor = processor;
    }

    @Override
    public PaymentResult process(double amount) {
        if (!canProcess(amount)) {
            return PaymentResult.failure("Cannot process credit card payment");
        }

        try {
            String transactionId = processor.charge(cardNumber, amount);
            return PaymentResult.success(transactionId, amount);
        } catch (Exception e) {
            return PaymentResult.failure("Credit card processing failed: " + e.getMessage());
        }
    }

    @Override
    public boolean canProcess(double amount) {
        return amount > 0 && cardNumber != null;
    }

    @Override
    public RefundResult refund(String transactionId, double amount) {
        try {
            String refundId = processor.refund(transactionId, amount);
            return RefundResult.success(refundId, amount);
        } catch (Exception e) {
            return RefundResult.failure("Refund failed: " + e.getMessage());
        }
    }

    @Override
    public boolean canRefund(String transactionId) {
        return transactionId != null && !transactionId.isEmpty();
    }

    @Override
    public String getPaymentType() {
        return "CREDIT_CARD";
    }
}

// Gift card payments are NOT refundable
public class GiftCardPayment implements Payment {
    private final String giftCardNumber;
    private final GiftCardService giftCardService;

    public GiftCardPayment(String giftCardNumber, GiftCardService giftCardService) {
        this.giftCardNumber = giftCardNumber;
        this.giftCardService = giftCardService;
    }

    @Override
    public PaymentResult process(double amount) {
        if (!canProcess(amount)) {
            return PaymentResult.failure("Insufficient gift card balance");
        }

        try {
            double balance = giftCardService.getBalance(giftCardNumber);
            if (amount > balance) {
                return PaymentResult.failure("Gift card balance too low");
            }

            String transactionId = giftCardService.deduct(giftCardNumber, amount);
            return PaymentResult.success(transactionId, amount);
        } catch (Exception e) {
            return PaymentResult.failure("Gift card processing failed: " + e.getMessage());
        }
    }

    @Override
    public boolean canProcess(double amount) {
        try {
            double balance = giftCardService.getBalance(giftCardNumber);
            return amount > 0 && amount <= balance;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getPaymentType() {
        return "GIFT_CARD";
    }

    // Note: No refund method - gift cards don't implement Refundable
}

// Supporting classes
public class PaymentResult {
    private final boolean success;
    private final String transactionId;
    private final double amount;
    private final String errorMessage;

    private PaymentResult(boolean success, String transactionId, double amount, String errorMessage) {
        this.success = success;
        this.transactionId = transactionId;
        this.amount = amount;
        this.errorMessage = errorMessage;
    }

    public static PaymentResult success(String transactionId, double amount) {
        return new PaymentResult(true, transactionId, amount, null);
    }

    public static PaymentResult failure(String errorMessage) {
        return new PaymentResult(false, null, 0, errorMessage);
    }

    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
    public double getAmount() { return amount; }
    public String getErrorMessage() { return errorMessage; }
}

public class RefundResult {
    private final boolean success;
    private final String refundId;
    private final double amount;
    private final String errorMessage;

    private RefundResult(boolean success, String refundId, double amount, String errorMessage) {
        this.success = success;
        this.refundId = refundId;
        this.amount = amount;
        this.errorMessage = errorMessage;
    }

    public static RefundResult success(String refundId, double amount) {
        return new RefundResult(true, refundId, amount, null);
    }

    public static RefundResult failure(String errorMessage) {
        return new RefundResult(false, null, 0, errorMessage);
    }

    public boolean isSuccess() { return success; }
    public String getRefundId() { return refundId; }
    public double getAmount() { return amount; }
    public String getErrorMessage() { return errorMessage; }
}
```

Now our order processor can handle all payments safely:

```java
public class OrderProcessor {
    
    public void processOrder(Order order, Payment payment) {
        // Process the payment
        PaymentResult result = payment.process(order.getTotal());
        
        if (result.isSuccess()) {
            order.setStatus("COMPLETED");
            order.setTransactionId(result.getTransactionId());
        } else {
            order.setStatus("FAILED");
            throw new OrderProcessingException(result.getErrorMessage());
        }
    }

    public void processRefund(Order order, Payment payment) {
        // Check if this payment type supports refunds
        if (!(payment instanceof Refundable)) {
            throw new RefundNotSupportedException(
                "Payment type " + payment.getPaymentType() + " does not support refunds"
            );
        }

        Refundable refundablePayment = (Refundable) payment;
        
        if (!refundablePayment.canRefund(order.getTransactionId())) {
            throw new RefundNotSupportedException("Transaction cannot be refunded");
        }

        RefundResult result = refundablePayment.refund(
            order.getTransactionId(), 
            order.getTotal()
        );

        if (result.isSuccess()) {
            order.setStatus("REFUNDED");
            order.setRefundId(result.getRefundId());
        } else {
            throw new RefundProcessingException(result.getErrorMessage());
        }
    }
}
```

Now it's clear:
- ALL payments can be processed using the `Payment` interface
- ONLY refundable payments implement `Refundable`
- No surprises, no exceptions, no LSP violations

## The LSP Contract Rules

For a subclass to properly substitute for its parent, it must follow these rules:

### Rule 1: Preconditions Cannot Be Strengthened

If the parent accepts any positive number, the child can't suddenly require numbers greater than 10:

```java
// WRONG
public class PaymentProcessor {
    public void process(double amount) {
        // Accepts any positive amount
        if (amount <= 0) throw new IllegalArgumentException();
        // process...
    }
}

public class PremiumPaymentProcessor extends PaymentProcessor {
    @Override
    public void process(double amount) {
        // Strengthens precondition - now requires amount > 100
        if (amount <= 100) throw new IllegalArgumentException("Minimum $100");
        super.process(amount);
    }
}

// RIGHT
public class PaymentProcessor {
    public void process(double amount) {
        if (amount <= 0) throw new IllegalArgumentException();
        // process...
    }
}

public class PremiumPaymentProcessor extends PaymentProcessor {
    @Override
    public void process(double amount) {
        // Same precondition - still accepts any positive amount
        if (amount <= 0) throw new IllegalArgumentException();
        // But adds special handling for large amounts
        if (amount > 100) {
            applyPremiumProcessing(amount);
        }
        // process...
    }
}
```

### Rule 2: Postconditions Cannot Be Weakened

If the parent promises to return a non-null value, the child can't return null:

```java
// WRONG
public class UserRepository {
    public User findById(Long id) {
        // Always returns a user (throws exception if not found)
        User user = database.findUser(id);
        if (user == null) throw new UserNotFoundException();
        return user;
    }
}

public class CachedUserRepository extends UserRepository {
    @Override
    public User findById(Long id) {
        // Weakens postcondition - might return null
        return cache.get(id);  // Returns null if not in cache
    }
}

// RIGHT
public class CachedUserRepository extends UserRepository {
    @Override
    public User findById(Long id) {
        // Maintains postcondition - never returns null
        User user = cache.get(id);
        if (user == null) {
            user = super.findById(id);
            cache.put(id, user);
        }
        return user;
    }
}
```

### Rule 3: Invariants Must Be Preserved

If the parent maintains certain invariants (rules that are always true), the child must maintain them too:

```java
// WRONG
public class BankAccount {
    protected double balance;

    public void deposit(double amount) {
        balance += amount;
        // Invariant: balance >= 0
        assert balance >= 0;
    }
}

public class OverdraftAccount extends BankAccount {
    @Override
    public void deposit(double amount) {
        balance += amount;
        // Violates invariant - balance can go negative!
    }
}

// RIGHT
public class BankAccount {
    protected double balance;

    public void deposit(double amount) {
        if (amount < 0) throw new IllegalArgumentException();
        balance += amount;
        assert balance >= 0;
    }
}

public class OverdraftAccount extends BankAccount {
    private double overdraftLimit;

    @Override
    public void deposit(double amount) {
        super.deposit(amount);
        // Maintains invariant while adding flexibility
    }

    public void withdraw(double amount) {
        if (balance - amount < -overdraftLimit) {
            throw new InsufficientFundsException();
        }
        balance -= amount;
        // Note: balance can be negative but within limits
    }
}
```

### Rule 4: History Constraint

The child shouldn't allow state changes that the parent doesn't allow:

```java
// WRONG - Immutable parent, mutable child
public class ImmutablePoint {
    private final int x;
    private final int y;

    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}

public class MutablePoint extends ImmutablePoint {
    // This violates LSP - parent promised immutability!
    public void setX(int x) { /* ... */ }
    public void setY(int y) { /* ... */ }
}
```

## Common LSP Violations and How to Fix Them

### Violation 1: Empty/Throwing Override Methods

```java
// WRONG
public class Bird {
    public void fly() { /* flying logic */ }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException();
    }
}

// RIGHT - Use composition or better abstractions
public interface Bird {
    void move();
}

public class FlyingBird implements Bird {
    public void fly() { /* flying logic */ }
    public void move() { fly(); }
}

public class Penguin implements Bird {
    public void swim() { /* swimming logic */ }
    public void move() { swim(); }
}
```

### Violation 2: Type Checking in Client Code

If you find yourself doing this, you've violated LSP:

```java
// WRONG - Client needs to know about specific types
public void handleShape(Shape shape) {
    if (shape instanceof Circle) {
        // Special handling for circles
    } else if (shape instanceof Square) {
        // Special handling for squares
    }
}

// RIGHT - Polymorphism handles it
public void handleShape(Shape shape) {
    shape.draw();  // Works for all shapes
}
```

### Violation 3: Partial Implementation

```java
// WRONG
public interface Repository {
    void save(Entity entity);
    void delete(Entity entity);
    Entity findById(Long id);
}

public class ReadOnlyRepository implements Repository {
    public void save(Entity entity) {
        throw new UnsupportedOperationException();
    }
    
    public void delete(Entity entity) {
        throw new UnsupportedOperationException();
    }
    
    public Entity findById(Long id) {
        // Actual implementation
    }
}

// RIGHT - Split interfaces (Interface Segregation Principle)
public interface Readable {
    Entity findById(Long id);
}

public interface Writable {
    void save(Entity entity);
    void delete(Entity entity);
}

public class FullRepository implements Readable, Writable {
    // Full implementation
}

public class ReadOnlyRepository implements Readable {
    // Only read implementation
}
```

## Testing for LSP Compliance

Here's how you can test if your classes respect LSP:

```java
public abstract class PaymentTest {
    
    protected abstract Payment createPayment();

    @Test
    public void testProcessPayment_WithValidAmount_Succeeds() {
        Payment payment = createPayment();
        PaymentResult result = payment.process(100.0);
        assertTrue(result.isSuccess());
        assertNotNull(result.getTransactionId());
    }

    @Test
    public void testProcessPayment_WithZeroAmount_Fails() {
        Payment payment = createPayment();
        PaymentResult result = payment.process(0.0);
        assertFalse(result.isSuccess());
    }

    @Test
    public void testProcessPayment_WithNegativeAmount_Fails() {
        Payment payment = createPayment();
        PaymentResult result = payment.process(-50.0);
        assertFalse(result.isSuccess());
    }
}

// Each implementation gets these tests
public class CreditCardPaymentTest extends PaymentTest {
    @Override
    protected Payment createPayment() {
        return new CreditCardPayment("1234567890123456", mockProcessor);
    }

    // Add credit-card-specific tests
}

public class GiftCardPaymentTest extends PaymentTest {
    @Override
    protected Payment createPayment() {
        return new GiftCardPayment("GIFT123", mockService);
    }

    // Add gift-card-specific tests
}
```

If all subclasses pass the parent's test suite, you've got good LSP compliance.

## Practical Tips for Following LSP

1. **Design by Contract**: Clearly define what your parent class promises and requires. Document preconditions, postconditions, and invariants.

2. **Favor Composition Over Inheritance**: Sometimes it's better to have a `Bird` that contains a `MovementStrategy` than to force all birds into an inheritance hierarchy.

3. **Use Abstract Classes Carefully**: Make abstract methods truly abstract—don't force subclasses to override with empty or throwing implementations.

4. **Think "Is-A" vs "Behaves-Like-A"**: A penguin IS-A bird biologically, but doesn't BEHAVE-LIKE-A flying bird in your code.

5. **Test Substitutability**: If you can't write tests that treat all subclasses uniformly, you've violated LSP.

6. **Watch for Type Checking**: If you're checking `instanceof` in client code, that's a red flag.

7. **Document Exceptions**: If you must throw exceptions, document them clearly so clients know what to expect.

## When LSP Seems Impossible

Sometimes following LSP perfectly seems impossible. Here are strategies:

### Strategy 1: Use Interface Segregation

Instead of one big interface, split into smaller ones:

```java
public interface Document {
    String getContent();
    String getTitle();
}

public interface EditableDocument extends Document {
    void setContent(String content);
    void save();
}

// Now read-only documents don't violate LSP
public class ReadOnlyDocument implements Document {
    // Only implements reading
}

public class EditableDocument implements EditableDocument {
    // Implements both reading and writing
}
```

### Strategy 2: Use Composition

```java
public class Document {
    private final ContentProvider contentProvider;
    private final Optional<ContentEditor> contentEditor;

    public Document(ContentProvider provider) {
        this.contentProvider = provider;
        this.contentEditor = Optional.empty();
    }

    public Document(ContentProvider provider, ContentEditor editor) {
        this.contentProvider = provider;
        this.contentEditor = Optional.of(editor);
    }

    public String getContent() {
        return contentProvider.getContent();
    }

    public void editContent(String newContent) {
        contentEditor.orElseThrow(() -> 
            new UnsupportedOperationException("Document is read-only")
        ).edit(newContent);
    }
}
```

## Conclusion

The Liskov Substitution Principle is about keeping promises. When a class inherits from another, it's making a promise to behave like that parent class. Breaking that promise leads to bugs, confusion, and fragile code.

Think of inheritance like this: if your parent class is making a promise, your child class can promise more, but never less. You can be more generous (accept more inputs, return more detailed results), but you can't be more restrictive.

Here's the key insight: **inheritance is not just about code reuse—it's about behavioral compatibility**. Just because something shares some code or attributes doesn't mean it should inherit. Make sure the "is-a" relationship is behavioral, not just structural.

When you respect LSP:
- Your polymorphic code works without surprises
- You don't need type checking or special cases
- Your unit tests validate behavior, not types
- Refactoring becomes safer
- Your code becomes more maintainable

Remember: if it looks like a duck and quacks like a duck, it better actually be able to swim like a duck too. Don't make penguins pretend to be flying birds.
