---
title: Microservices vs Monoliths
pubDate: '2020-09-12 05:49:46 +0100'
categories:
  - Software design
  - Software architecture
---

Microservices are an architectural style that splits a software to a collection of fine-grained services. Those services have to be:

- Loosely coupled with other services.
- Independently testable.
- Maintainable
- Solely testable and deployable.

Microservices could use lightweight protocols to communicate with each other.

Each service solves a different problem than the other, and could be developed with a different programming language, database technology, operating system and hardware.

Microservices architecture shines in deployment, it integrates well with the CI/CD process. Making a change to the software, requires testing and deploying a handful of services. Time to market is essential to many domains.

Another clear advantage and a win is scalability, in a microservices architecture you can pinpoint services under load, and they could be scaled/optimized independently of other services, which in itself optimizes cost and resource usage.

Software developement as an indistry is not yet governed, and we are embracing new technologies and architectures as long as they have proved a successful usage, and solves existing problems.

Microservices was initially promoted by big companies, the likes of Netflix, Amazon, Spotify, Uber …

A common thing for all those companies, is that they are big, many teams, many developers, many business units. Without a proper organization, communication and management would be difficult. Not to talk about time to market and the cost of new features.

Microservices architecture, proved to be successful for their use case, it allowed them to continue to be competitive, scale their organization, and attract talented developers.

With all of those successful stories, and the trend microservices attracted, many developers consider Microservices a standard rather than a solution. Trying to apply it anywhere and to everything.

Let revisite some of the promises microservices promised to solve, and let&#39;s discuss each one:

1. Zero downtime independent deployment.
2. Higher degree of organizational autonomy and distribute responsibilities.
3. Scalability
4. Reusability (authentication, search, …)

# **1. Zero downtime independent deployment:**

With Microservices architecture, you can build and start the application quickly, which allows you to iterate more rapidly, and is more container friendly, as the startup time is massively reduced. You can change the behaviour and only test the parts you&#39;ve changed or even introduce a breaking change assuming you&#39;re using a strategy (versioning as an example). Deploying a microservice doesn&#39;t require shutting the whole application, only the part that needs to. the other services could keep running in isolation and fullfilling user requests.

Usually building a monolith has a lot of files and dependencies, and it takes a lot of time to build and start. Testing a monolith is another challenge, because you need to ensure that you don&#39;t break the rest of the application. Deploying a monolith in a traditional organization requires shutting all the services, and then deploy the new release, then restarting the application, which brings the whole application down for a couple of minutes (If you&#39;re lucky and everything went well).

Build time is important, but as long as we&#39;re building a few times a day in a CI/CD platform, it doesn&#39;t matter to most of us, what matters is the time the developers are waiting for the build in their local machines. However, as long as we&#39;re writing proper unit tests, we might not even need to start the application. More over, modern tools allow incremental build which drastically reduces build time.

Now a day, we have many strategies and tools that allows to deploy a monolith with zero downtime. One can use blue green deployment, canary deployment, rolling updates …

My opinion, is that it depends, is build time crucial to you ? Are you using a language where you can&#39;t have incremental builds ? How is your release cycle being organized and what is your target ? What is your deployment strategy ? …

# **2. Higher degree of organizational autonomy and distribute responsibilities.**

Scaling the business would require delivering more features, quickly and effectively. You can&#39;t ask developers to work on weekends, but you can bring in more developers. As the team grows, its responsibilities increases, getting more and more applications to maintain and enhance. Communication is another difficulty with big teams.

In a microservices architecture, you can scale your teams, decrease its responsibilities, and facilitate communication. Each team is responsible for a set of applications. Giving each team the liberty to choose the technologies and the approach that fits best their challenges.

Usually, in a monolith architecture, the teams are scaled vertically, adding more and more people to the same team, or a team besides that do the same thing. This introduces management overhead, and requires more communication. Development and solution design becomes harder.

> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization&#39;s communication structure.

—  **Melvin E. Conway**

The organization in itself, shouldn&#39;t be structured in such a way that only one team is responsible for the whole application. There should be different business units each has as many developers as required, responsible for the development and the maintenance of a set of code that belongs to that team.

Scaling the organization, doesn&#39;t require a microservices architecture, or a monolithic one. The organization and the teams should be structured around specific domains, allowing to add new business units, and new teams without affecting existing structure.

# **3. Scalability.**

As explained at the start of the article, microservices allows scalibity with an effective cost and resource usage.

On the other hand, monoliths usually are running on bare metal, or beefy virtual machines. To scale a monolith, you need to scale all the modules, which comes at a cost, buying new servers, or paying for expensive VMs.

I always believe that any application should fulfill a quorum, but exceeding a threshold, increases servers management overhead, at this stage, I would prefer a balance between vertical and horizontal scalability.

At the time of writing, we can get up to 448 vCPUs and 24576 GiB of RAM on aws, so we have a lot of room for vertical scalability before hitting the limit and start to scale out.

In microservices architecture, each call to an external service requires at least a 20ms extra time. And it&#39;s limited by the network&#39;s bandwidth.

In monoliths however, every call, is an internal process communication, no network is involved and you&#39;re limited by the machine (CPU, memory and disk).

# **4. Reusability.**

Reusability is at the heart of a lot of paradigms, starting from  **Object Oriented Programming**  and  **Functional Programming**. To be able to reuse code, components or software, is a must to move forward and not have to build everything, every time from scratch.

So we should try to maximise the amount of work we can reuse. But this is not trivial and doesn&#39;t come by default in any system requires proper planning and execution.

In a microservices architecture, it&#39;s more common to create a service around a functionality that other systems require. The services communicate using the network, so you get to create new reusable services that have their own life cycle, programming language, infrastructure …

Reusability in monoliths comes in the form of inter process communication. Either external libraries, or in house libraries. For this reason you have to use the same programming language or the same compiled code.

Having a clean, modular monolith, makes good use of reusability. We have many layers and techniques to avoid the temptation of using new services to promote reusability.

In the Java ecosystem, there are a lot of languages that ran on the JVM, so we can develop libraries in Scala, and use them in Java.

Many startups and small companies have understood that Microservices makes their management much harder. they&#39;re a lot of stories on the internet of companies migrating back to monoliths.

**Netflix**  and the likes are big companies, having their own set of management complexities that doesn&#39;t apply to everyone. They have matured CI/CD platforms, tools and experience.

Without proper understanding of this architecture, we usually see  **distributed monoliths** , you can&#39;t develop new features without adapting other services, you can&#39;t deploy a service without deploying everything, you can&#39;t scale individual services…

Monitoring is another challenge in Microservices, you have to have the infrastructure that would allow to monitor every application, and correlate between them. In a monolithic architecture, you have to monitor a single application.

I have compiled a list of which we should experiment until we hit a limit, then go to the next step.

1. Monolith
2. Modular monolith
3. Services as dependencies.
4. Microservices.
5. Serverless

**Conclusion:**

Don&#39;t use Microservices unless you really have to.
