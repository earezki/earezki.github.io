---
title: Anemic vs Rich Domain Models
pubDate: '2020-03-24 05:49:46 +0100'
categories:
  - Software design
  - Domain driven design
---

![technical debt](/assets/anemic_domain_model.jpg "technical debt")

An  **Anemic Domain Model**  is a model that is focused on the state of the object. This is not what is advised while using [**Domain Driven Design**](/domain-driven-design-core-concepts/) ( **DDD** ) to develop a software.
 Usually, it&#39;s a [bag of getters and setters with logic on top of services](/tell-dont-ask-getters-are-evil/).
 There is nothing wrong with an  **Anemic Domain Model**  if what we&#39;re developing is a  **CRUD**  application.

> The basic symptom of an Anemic Domain Model is that at first blush it looks like the real thing. There are objects, many named after the nouns in the domain space, and these objects are connected with the rich relationships and structure that true domain models have. The catch comes when you look at the behavior, and you realize that there is hardly any behavior on these objects, making them little more than bags of getters and setters. Indeed often these models come with design rules that say that you are not to put any domain logic in the the domain objects. Instead there are a set of service objects which capture all the domain logic, carrying out all the computation and updating the model objects with the results. These services live on top of the domain model and use the domain model for data.

— **Martin Fowler: [Anemic Domain Model](https://www.martinfowler.com/bliki/AnemicDomainModel.html)**

When using  **DDD** , we aim to have  **Rich Domain Models**  which represents the behavior of the domain.

Strive for  **Rich Domain Models**!
