---
title: Anemic vs Rich Domain Models
pubDate: '2020-03-24 05:49:46 +0100'
description: 'Understand the difference between Anemic and Rich Domain Models in Domain-Driven Design. Learn which approach to choose for better code organization and where to put business logic.'
categories:
  - Software architecture
  - Software design
  - Domain driven design
---

![technical debt](/assets/anemic_domain_model.jpg "technical debt")

This short article contrasts two approaches to modeling your domain: the Anemic Domain Model and the Rich Domain Model. Both are common in real systems; the right choice depends on your domain complexity, team skills and long-term maintenance goals.

Summary first:
- Anemic Domain Model: objects hold data (getters/setters) and domain logic lives in separate service classes. Easy to start, works well for CRUD-focused apps, but tends to scatter invariants and make reasoning about object state harder.
- Rich Domain Model: objects encapsulate both state and behavior. Business invariants and operations live on the domain objects themselves (or on small, focused domain services). Better for complex domains where behavior matters.

Why this matters:
- Maintaining invariants and reasoning about system behavior is easier when the model owns the rules that affect its state.
- Tests can be more focused: rich models let you unit-test behavior on the domain object without stubbing orchestration services.
- Overusing rich models in a trivial CRUD app, however, adds unnecessary indirection and can slow development.

Definitions
-----------

Anemic Domain Model
: A model where domain objects are thin data holders, essentially POJOs/DTOs with getters and setters. Business logic and rules are implemented in separate service classes that orchestrate changes to those objects.

Rich Domain Model
: A model where domain objects encapsulate behavior and enforce their own invariants. Objects expose intention-revealing methods (e.g. order.addItem(...), account.withdraw(amount)) that internally validate and mutate state.

Technical trade-offs
-------------------

When to prefer anemic models
- Simple CRUD apps where the domain is not complex and business rules are minimal.
- When you have a thin API façade over a database (e.g. internal admin tools) and behavior is mostly just persistence and mapping.
- When teams are small and prefer simple DTOs that can be easily serialized and mapped.

When to prefer rich models
- Complex domains with many invariants, workflows, and business rules.
- When you want behavior to be discoverable, testable, and colocated with the data it operates on.
- When you need stronger encapsulation to prevent accidental invariant violation across multiple services.

Key design concepts for rich models
----------------------------------

- Aggregates and aggregate roots: define transactional boundaries and encapsulate invariants. Only the aggregate root is accessible from outside; internal objects are modified through root methods. Example: an Order aggregate with OrderLines; callers interact with Order.addLine(...) not by mutating lines directly.

- Invariants: rules that must hold true for an aggregate. Prefer enforcing them inside the aggregate root so every state change goes through a validating path.

- Domain services: operations that do not naturally belong to a single entity. Keep them thin and focused; prefer methods on entities when behavior can be modeled there.

- Value objects: immutable small objects (e.g. Money, Email, Address) that encapsulate domain concepts and avoid primitive obsession.

Example:
-----------------------------------------

Here are the same two approaches written in Java so you can see how they map to a statically typed, object-oriented language.

Anemic approach:

```java
// simple data holder
public class AccountDto {
  private long id;
  private java.math.BigDecimal balance;

  // getters / setters omitted for brevity
}

// service that performs business logic outside the DTO
public class AccountService {
  private final AccountRepository repo;

  public AccountService(AccountRepository repo) {
    this.repo = repo;
  }

  public void withdraw(long accountId, BigDecimal amount) {
    AccountDto a = repo.load(accountId);
    if (a.getBalance().compareTo(amount) < 0) {
      throw new IllegalStateException("Insufficient funds");
    }
    a.setBalance(a.getBalance().subtract(amount));
    repo.save(a);
  }
}
```

Rich approach:

```java
// small value object for money
public final class Money {
  private final BigDecimal value;

  public Money(BigDecimal value) { this.value = value; }
  public Money minus(Money other) { return new Money(this.value.subtract(other.value)); }
  public boolean lessThan(Money other) { return this.value.compareTo(other.value) < 0; }
  // equals/hashCode/toString omitted
}

// aggregate root encapsulating behavior
public class Account {
  private final long id;
  private Money balance;

  public Account(long id, Money balance) {
    this.id = id;
    this.balance = balance;
  }

  public void withdraw(Money amount) {
    if (balance.lessThan(amount)) {
      throw new InsufficientFundsException();
    }
    this.balance = this.balance.minus(amount);
  }

  // getters for id/balance and other behavior omitted
}

// repository usage remains straightforward
Account account = repo.load(accountId);
account.withdraw(new Money(new BigDecimal("12.34")));
repo.save(account);
```

The rich approach places the rule ("don't allow withdrawing more than the balance") inside the Account aggregate. That keeps the invariant close to the data it protects and makes it harder for callers to bypass the rule.

Testing implications
--------------------

- Rich models: unit tests exercise domain objects directly. No need for large setup of orchestration services when verifying a single business rule.
- Anemic models: business rules reside in services, so tests often exercise the services and require stubbing repositories. This can be fine but may lead to brittle integration-style tests if boundaries are unclear.

Migration guidance (from anemic → rich)
-------------------------------------

1. Identify aggregates and their invariants: scan where services mutate related data together. Those are good candidates to become aggregate roots.
2. Introduce intention-revealing methods on the aggregate root and move validation logic inside.
3. Keep repository boundaries: the repository should still only load and save aggregates; avoid cross-aggregate direct mutations.
4. Replace call sites incrementally: change one caller to use the new aggregate API, run tests, and iterate.

Practical tips
--------------

- Prefer small, focused domain services rather than large god services. If a service has many unrelated responsibilities, it's probably doing orchestration that belongs in aggregates.
- Use value objects (Money, Quantity, Email) to encode domain constraints and make validation explicit.
- Resist the urge to put orchestration logic inside entities; entities should not be responsible for application concerns like scheduling or I/O, those belong to application services.

Conclusion
----------

The Anemic Domain Model is common and pragmatic for CRUD-focused systems, while Rich Domain Models provide stronger encapsulation and clearer invariants for complex domains. The right approach depends on your application's complexity and the development trade-offs you want to accept.

When in doubt, start pragmatic: use anemic models for small CRUD services and introduce rich behavior gradually around the aggregates that actually need it.

Further reading
---------------
- Martin Fowler's Anemic Domain Model: https://www.martinfowler.com/bliki/AnemicDomainModel.html
- Evans, Eric's Domain-Driven Design: Tackling Complexity in the Heart of Software

