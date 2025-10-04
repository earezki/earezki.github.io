---
title: Hexagonal Architecture
pubDate: '2020-03-29 05:49:46 +0100'
categories:
  - Software design
  - Software architecture
---

> The _ **_hexagonal architecture_** _, or _ **_ports and adapters architecture_** _, is an architectural pattern used in _ **_software design_** _. It aims at creating loosely coupled application components that can be easily connected to their software environment by means of ports and adapters. This makes components exchangeable at any level and facilitates test automation

—  **[wikipedia](https://en.wikipedia.org/wiki/Event-driven_architecture)**

![Hexagonal Architecture](/assets/Hexagonal_Architecture.png "Hexagonal Architecture")

###### Figure 1: Example of hexagonal architecture [Wikipedia](https://en.wikipedia.org/wiki/File:Hexagonal_Architecture.svg)

In [Figure 1](/assets/Hexagonal_Architecture.png), we can see that we have adapters for each client.

**Hexagonal Architecture**  is different from the classical  **Layered Architecture** , in  **Layered Architecture**  the dependencies goes downward, AKA, the  **Presentation**  (UI) depends on the  **Domain** , and the  **Domain**  depends on the  **Infrastructure**  (Usually there is an  **Application**  layer but we&#39;ll skip it for the sake of simplicity). ([Figure 2](/assets/layered_architecture.png))

![Layered Architecture](/assets/layered_architecture.png "Layered Architecture")

###### Figure 2 : Layered Architecture

Now a days, many teams who says they are doing Layered Architecture, are in fact using a sort of Hexagonal Architecture, the reason is that almost every one is using a Framework for dependency injection. and as such, you wire the  **Repository**  ( **Infrastructure Layer** ) into the  **Service**  ( **The Application/Domain Layer** ), Hence, the Domain doesn&#39;t depends on the Infrastructure no more, we can change the database implementation without affecting the domain.
 It doesn&#39;t mean that dependency injection frameworks implement Hexagonal Architecture, but they encourage into doing so.

As demonstrated in [Figure 1](/assets/Hexagonal_Architecture.png), in hexagonal architecture, there are inner, and outer layers, the inner layer is the domain, it&#39;s the heart of our business. The inner layer exposes interfaces ( **Ports** ) to the outer layer.
 The outer layer have the power to wire how the data is coming into our system (Gui, Restful api, SOAP, RMI, …), it controls where the data goes (Memory, a database, a messaging system, …). It does so by providing implementation to the interfaces ( **Adapters** ).

When using the hexagonal architecture, we should develop per domain use cases and not the supported clients. Afterward the clients would implements their adapters to adapt into our system.

I&#39;m presenting this architecture because it integrates naturally with [Domain Driven Design](/domain-driven-design-core-concepts/).

In [Figure 1](/assets/Hexagonal_Architecture.png), we have a  **port**  for the persistence, we can have an  **adapter Repository**  to persist our  **Domain Models**  in a relational database, or in an object store, a flat file, S3, in memory, …. Also,  **Domain Events**  could be sent in memory or in a AMQP broker.
 The advantage of  **Hexagonal Architecture**  is that we can have simple implementation for our  **ports**  to facilitate testing, and delay the decision making for the technologies behind the  **adapters**.
