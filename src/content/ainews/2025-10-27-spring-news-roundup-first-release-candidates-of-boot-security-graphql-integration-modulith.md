---
title: "Spring Ecosystem Gains Momentum with Release Candidates in October 2025"
pubDate: "2025-10-27"
description: "A summary of the first release candidates for various Spring projects, including Spring Boot, Security, GraphQL, and more, released during the week of October 20th, 2025."
categories: ["AI News", "Spring Framework"]
---

## Spring Ecosystem Release Candidate Roundup (October 20th, 2025)

The week of October 20th, 2025, witnessed significant progress in the Spring ecosystem with the release of first release candidates for several key projects. This summary details the notable updates and new features introduced in these candidates.

### Overview

A flurry of activity occurred across various Spring projects, with the release of initial release candidates for:

*   Spring Boot 4.0.0
*   Spring Security 7.0.0
*   Spring for GraphQL 2.0.0
*   Spring Session 4.0.0
*   Spring Integration 7.0.0
*   Spring Modulith 2.0.0
*   Spring REST Docs 4.0.0
*   Spring Batch 6.0.0
*   Spring AMQP 4.0.0
*   Spring for Apache Kafka 4.0.0
*   Spring for Apache Pulsar 2.0.0
*   Spring Web Services 5.0.0
*   Spring Vault 4.0.0

These release candidates include bug fixes, dependency upgrades, new features, and improvements to existing functionalities.

### Key Highlights by Project

#### Spring Boot 4.0.0

*   **Focus:** Modularization and enhanced auto-configuration.
*   **Details:** Introduces support for the new Spring Framework `RestTestClient` interface and completes modularizing the codebase to reduce application size and improve auto-configuration signals.
*   **Impact:**  Improved application performance and reduced dependencies.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/) and [Wiki Page](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Security 7.0.0

*   **Focus:** Enhanced authentication and authorization.
*   **Details:** Introduces a new `@EnableGlobalMultiFactorAuthentication` annotation and a `DefaultAuthorizationManagerFactory` class for managing authority granted to `FactorGrantedAuthority` instances.
*   **Impact:**  Improved security through multi-factor authentication and more flexible authorization management.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring for GraphQL 2.0.0

*   **Focus:** Kotlin support and testing capabilities.
*   **Details:** Provides Kotlin extensions for the `GraphQlClient` interface and introduces a `GraphQlTester` class for managing HTTP headers.
*   **Impact:** Enhanced developer experience for Kotlin users and improved testing of GraphQL APIs.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/) and [Wiki Page](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Session 4.0.0

*   **Focus:** Documentation and Gradle plugin updates.
*   **Details:** Modernizes the Antora documentation site generation and adds exclusions to the `nohttp` Gradle plugin.
*   **Impact:** Improved documentation and streamlined build processes.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Integration 7.0.0

*   **Focus:** AMQP 4.0 support and runtime configuration.
*   **Details:** Introduces new channel adapters based on Spring AMQP 4.0 and allows configuring the `FileReadingMessageSource` class as an expression at runtime.
*   **Impact:** Enhanced integration capabilities with AMQP and more flexible message source configuration.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Modulith 2.0.0

*   **Focus:** Deprecation removal and database migration support.
*   **Details:** Removes the deprecated `@ApplicationEventListener` annotation and enables executing Flyway database migrations on startup.
*   **Impact:** Simplifies application structure and streamlines database management.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring REST Docs 4.0.0

*   **Focus:** JUnit support and compatibility.
*   **Details:** Aligns with JUnit 6.0 as the minimal supported version and temporarily drops support for REST-Assured.
*   **Impact:** Ensures compatibility with the latest JUnit version and addresses potential issues with REST-Assured.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/) and [Wiki Page](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Batch 6.0.0

*   **Focus:** Job shutdown and SEDA processing.
*   **Details:** Implements a more graceful shutdown of batch jobs and provides support for Staged Event Driven Architecture (SEDA) processing using Spring Integration messaging channels.
*   **Impact:** Improved job reliability and scalability.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring AMQP 4.0.0

*   **Focus:** Bean instantiation and dependency resolution.
*   **Details:** Addresses an issue where the `allowEagerInit` parameter in `getBeansOfType` could cause eager instantiation of beans, breaking lazy initialization semantics.
*   **Impact:** Corrects a bug related to bean instantiation and ensures proper lazy initialization.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/) and [What's New Page](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring for Apache Kafka 4.0.0

*   **Focus:** Concurrency and Dead Letter Topic handling.
*   **Details:** Introduces concurrency support to the `ShareKafkaMessageListenerContainer` class and modifies the constructor of `KafkaOperations` to accept a `DeadLetterPublishingRecoverer`.
*   **Impact:** Improves the performance and reliability of Kafka message processing.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring for Apache Pulsar 2.0.0

*   **Focus:** Dead Letter Topic resolution.
*   **Details:** Ensures the `deadLetterTopic` attribute in the Apache Pulsar class is non-fully-qualified for proper message routing.
*   **Impact:** Resolves an issue related to dead letter topic handling in Pulsar.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Web Services 5.0.0

*   **Focus:** JUnit support.
*   **Details:** Aligns with JUnit 6.0 as the minimal supported version.
*   **Impact:** Ensures compatibility with the latest JUnit version.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

#### Spring Vault 4.0.0

*   **Focus:** Dependency upgrades and new features.
*   **Details:** Includes dependency upgrades to JDK 25, Spring Framework 7.0.0, Spring Data 2025.1.0, JUnit 6.0, and Jackson 3.0. Introduces support for the Spring Framework `RestClient` interface for authentication.
*   **Impact:** Improves security and enhances integration capabilities.
*   **Reference:** [Release Notes](https://www.infoq.com/news/2025/10/spring-news-roundup-oct20-2025/)

### Conclusion

The release of these first release candidates signals a period of active development and innovation within the Spring ecosystem. These updates provide developers with access to new features, improved performance, and enhanced security capabilities.  Developers are encouraged to review the release notes and documentation for each project to understand the full scope of changes and plan accordingly.