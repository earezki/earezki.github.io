---
title: Domain Driven Design Core Concepts
pubDate: '2020-03-23 05:49:46 +0100'
categories:
  - Software design
  - Domain driven design
---

![](/assets/whiteboard.jpg)

In this blog I&#39;m sharing my understandings on the core concepts of Domain Driven Design.

**Domain Driven Design**  or  **DDD**  for short should only be used in fairly complex domain software. A  **CRUD**  application with little to no domain complexity doesn&#39;t justify the complexity of using  **DDD**.

![](/assets/DomainDrivenDesignReference.png)Figure 1: Eric Evans Domain Driven Design overview

[Figure 1](/assets/DomainDrivenDesignReference.png) show an overview of DDD.

### **Core elements of a Domain Model:**

**Domain Driven Design**  requires extensive communication with a  **domain expert**  in order to understand the requirements and to discover  **sub-domains**.

The software development team and the client, should speak the same language. To do so, while modeling the domain with the domain expert, we should extract the terminology used by the domain expert. The &quot;software terms&quot; should never be used while talking to a domain expert, terms such as  **class** ,  **cache** , … may be interpreted differently which introduce confusion in both sides. Rule of thumb, ask as much questions as possible and don&#39;t be afraid to say I don&#39;t understand or to ask the same question again, better understand it now than to find out it&#39;s not what the client meant 2 months along the way.

> As software developers, we fail in two ways:
 We build the thing wrong, or we build the wrong thing.

—  **Steve Smith**

### **Sub-Domains and Bounded Contexts:**

A  **Domain Model**  is valid within a  **Bounded Context**  (BC for short), while modeling, we should be looking into which BC does that model belongs.

A model that is not clearly identified into which BC it belongs could be used in the wrong way/place, even if another model holds the same name (even if they refer to the same thing) and doesn&#39;t belong to the same BC, it&#39;s a totally different model.

Let&#39;s take a  **client**  model in a e-commerce website as an example, in the  **subscription**  bounded context, we only need the email, the name and the opt-in channels, however, in the  **billing**  bounded context, we require the name, billing info, credit card and the address.

One problem, would be if the client in the billing bounded context requires billing information validation, trying to reuse this same client model in the subscription would introduce inconsistency.

As such, we shouldn&#39;t try an reuse a model in a different bounded context where it doesn&#39;t belong.

> Explicitly define the context within which a model applies… Keep the model strictly consistent within these bounds, but don&#39;t be distracted or confused by issues outside_

—  **Eric Evans**

In a perfect world, each bounded context should have distinct database, code base and team. so each bounded context is a separate application.
 While this is great, but it&#39;s not easily applied in the real world, so we can keep separation using different modules, folders, projects …

Sub-domain and a Bounded Context are separate concepts, but are confusing to distinct from one another.

> Sub-domain is a problem space concept, Bounded context is a solution space concept.

—  **Eric Evans**

Eric evans explains that the difference between the two as the difference between the floor and the carpet, the floor is the sub-domain (the problem space) while the carpet is the bounded context.
 The carpet should fit well the floor, and there should be no hidden or visible parts that doesn&#39;t match.
 And he goes explaining that a carpet that doesn&#39;t fit means that the domain changes.

**Context Maps**  allows to draw the boundaries where each bounded context ends.

### **Ubiquitous Language:**

The Ubiquitous Language is a core concept of DDD, it&#39;s the language spoken by the software development teams that work in the same software domain, but not only, it&#39;s also the language spoken by the stakeholders. This allows to have fluid conversations without  **Translations**.

The Ubiquitous Language should be used everywhere in the bounded context, in conversations, code, diagrams, boards, emails …

> A project faces serious problems when its language is fractured.

—  **Eric Evans**

I&#39;ve seen many times the stakeholders adapting to the language of the development teams because they are rigid and want to use their terminology, I&#39;ve also seen demos where the team explains their technical solution rather than the solution itself. The result is the stakeholders don&#39;t understand what teams are presenting, and in the early stages, they may just assume that everything is well and that the team is advancing, while the reality is that the teams are working on the wrong thing.
 Communication is key, there is no shame in saying I don&#39;t understand!

### **Summary:**

**Problem Domain** : The specific problem the software is trying to solve.
**Core Domain** : the customer&#39;s business.
**Sub-Domains** : Separate features/applications the software should support and interact with.
**Bounded Context** : A responsibility with explicit boundaries that separate it from other parts of the system.
**Context Mapping** : The process of identifying bounded contexts and their relationships to one another.
**Shared Kernel** : Part of the model that is shared by two or more teams, who agree not to change it without collaboration.
**Ubiquitous Language** : A language using terms from the domain model that programmers and domain experts use discuss the system.
