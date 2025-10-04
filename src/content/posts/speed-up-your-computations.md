---
title: Speed Up Your Computations
pubDate: '2017-09-11 05:49:46 +0100'
categories:
  - Performance
---

![Speed Up Your Computations](/assets/speed_up_your_computations.jpg "Speed Up Your Computations")

Sometimes you find yourself trying to squeeze the last bits of your CPU to give you some more milliseconds. Or you may hate the smell of a melting CPU. Or maybe you are just a performance maniac. If you happen to be in one of these cases, keep reading this post.

So let us say you are designing a banking application in which you have a Transaction entity, and let us say that the entity contains these simple fields.

```java
public class Transaction {
    private TransactionId id;
    private Money amount;
    private AccountId debit;
    private AccountId credit;
}
```

The Money would, simple holding only the value itself as:

```java
public class Money {

    private double value;

    Money add(Money other) {
        return new Money(value + other.value);
    }

}
```
And then you have an account with a liste of all the transactions that it has made.

```java
public class Account {
    private AccountId id;
    ...
    private List<Transaction> transactions;
    ...
}
```
Now you are tasked to calculate the total amount of those transactions. A simple functional solution with java 8 streams would be:

```java
public class Account {
    Money total() {
        return transactions.stream()
            .map(Transaction::amount)
            .reduce(Money.ZERO, Money::add);
    }
}
```
You test it and it works. The next day, your colleagues start to complain about performance, and given there are millions of transactions, the profiler points to your method.

What are you going to do now? Hmm, let me see, yeah, I got it, parallelism to the rescue. You take this great idea to your colleagues and they turn you down because the server is already filled with active threads. Now what? Well, you just need to better use your cycles (bear the word).

Let’s change the structure of the Transaction entity.

```java
public class Transactions {
    private TransactionId[] uuid;
    private Moneys amount;
    private AccountId[] debit;
    private AccountId[] credit;
    private int transactionsCount;

    Money total() {
        Money result = Money.ZERO;
    }

}
```
Notice the name that is transactions (with an S), and also the entity holds arrays rather than single objects.

Now the Account will hold this new Transactions object instead of the Transaction list.

Then the calculation becomes:

```java
public class Account {
    private Transactions transactions;

    Money total() {
       return transactions.total();
   }
} 
```
Nothing wrong with this code, always OOP !

We also changed the Amount class, the new object (Amounts) hold an array of values (primitive double array).

```java
public class Moneys {

    private double[] values;

    Money add(Money other) {
        double result = 0;
        for (int i = 0; i < values.length; i++) {
            result += value[i];
        }
        return new Money(result);
    }

}
```
On my machine and after warming the JVM for a million rounds, this implementation is around 32X faster than the previous one (test the code for yourselves on [Github](https://github.com/earezki/speedup-computations)) and share your results).

Now, why this is faster? It turns out that modern CPUs work better when all the calculation is applied on data that is packed together. The CPU reads data from the memory in cache lines (it is around 64KB in most CPUs) and stores it in the L1 cache. When the CPU wants to fetch data, it will compare its address to the address space in the L1 then L2 then L3 caches. If the address is not there, the CPU will read a whole cache line starting from the nearest alignment to the needed address and store it in the L1 cache (in this example, the CPU will load all the attributes of the Transaction to use the amount attribute).

The first example suffers a lot from cache miss, which means the CPU reads a lot of data that it doesn’t need, then throws it away, and then reads more data that it won’t need.

One more advantage is that this approach fits naturally with SIMD operations (Kinda hard to use in java anyway, but the compiler may chose to optimize the code to use it).

To a give an example, the read from the L1 cache in Intel i7 5500 takes around 4 cycles for simple access, whereas a read from main memory takes around 120 cycles.

Now you have it; most of the time, you probably won’t use it, this technique is heavily used in the game development industry, and in embedded systems.

And to make a disclaimer, you may not benefit from this approach in a large web app, because other scheduled threads will pollute the cache anyway, and your best bet is the large shared L3 cache (for Intel, at least).

