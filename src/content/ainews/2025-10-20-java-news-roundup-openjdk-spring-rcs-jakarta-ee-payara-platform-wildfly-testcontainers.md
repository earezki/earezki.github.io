---
title: "Java Ecosystem Update: October 13th, 2025 - OpenJDK, Jakarta EE 12, Spring 7.0 RC1 & More"
pubDate: 2025-10-20
description: "A comprehensive summary of the latest developments in the Java ecosystem as of October 13th, 2025, covering OpenJDK, Jakarta EE 12, Spring Framework 7.0 RC1, Payara Platform, WildFly 38, Micrometer, Project Reactor, and Testcontainers."
categories: ["AI News", "Java News"]
---

## Java Ecosystem Update: October 13th, 2025 - OpenJDK, Jakarta EE 12, Spring 7.0 RC1 & More

This summary details the key updates across various components of the Java ecosystem as of October 13th, 2025.  Significant advancements were made in OpenJDK, Jakarta EE 12, Spring Framework, Payara Platform, WildFly, Micrometer, Project Reactor, and Testcontainers, encompassing new releases, release candidates, and feature enhancements.

## OpenJDK

OpenJDK has advanced its development with two new candidates:

*   **JEP 529, Vector API (Eleventh Incubator):** Elevated to Candidate status (formerly JEP Draft 8328351). This marks the eleventh incubation phase, building upon ten previous rounds from JDK 16 to JDK 25. The Vector API aims to enable efficient vector computations by compiling to optimized vector instructions on supported CPU architectures. It will continue to incubate until Project Valhalla's preview features are available, at which point it will transition to Preview.
*   **JEP 528, Post-Mortem Crash Analysis with jcmd:**  Also elevated to Candidate status (formerly JEP Draft 8369012). This proposes extending the `jcmd` utility to facilitate diagnosing JVM crashes, offering an alternative to the Serviceability Agent or `jhsdb`.

JDK 26 development continues with the release of Build 20 early-access builds, incorporating fixes from Build 19. Developers are encouraged to report bugs via the Java Bug Database.

## Jakarta EE 12

The Jakarta EE 12 development is progressing with several milestones:

*   **Jakarta Query 1.0:** The ballot for inclusion in the Jakarta EE Platform and Jakarta EE Web Profile concluded successfully.
*   **Milestone 1 Releases:**  A significant number of specifications published their M1 releases as part of the Jakarta EE 12 Release Plan. The Platform team is expected to publish the APIs' M1 release soon.
*   **Jakarta Agentic Artificial Intelligence:** A new specification proposal has been submitted for public community review and will proceed to a Creation Review by the Jakarta EE Specification Committee after the community review is complete.
*   **M1 Releases Published:** The following specifications have their M1 releases available on Maven Central: Jakarta Servlet 6.2, Jakarta Expression Language 6.1, Jakarta Pages 4.1, Jakarta WebSocket 2.3, Jakarta Data 1.1, Jakarta NoSQL 1.1, Jakarta Concurrency 3.2, Jakarta Query 1.0, Jakarta Activation 2.2, and Jakarta Mail 2.2.
*   **Jakarta Contexts and Dependency Injection 5.0:** The M1 release is complete but not yet published on Maven Central.

## Spring Framework

The Spring team has released several updates:

*   **Spring Framework 7.0.0 RC1:** This release candidate includes bug fixes, documentation improvements, dependency upgrades (JUnit 6.0, Jackson 3.0), and new features. Notable additions include refinements to `@Retryable` and `@ConcurrencyLimit` annotations, improvements to `@EnableResilientMethods` for Kotlin users, and the addition of `PropagationContextElement`.
*   **Spring Framework 6.2.12:** This is a patch release addressing CVE-2025-41254, a Spring Framework STOMP CSRF vulnerability affecting versions up to and including 6.2.11.
*   **Spring Data 2025.1.0 RC1:** This release candidate provides support for Spring Framework 7, Jakarta Persistence 3.2 and Jakarta Servlet 6.1 (under Jakarta EE 11), Kotlin 2.2, and Jackson 3.0. Key features include increased use of JPQL to replace `QueryCriteria` and support for composite IDs in Spring Data JDBC and Spring Data R2DBC.

## Payara Platform

Payara has released the October 2025 edition of the Payara Platform, including:

*   **Community Edition 6.2025.10**
*   **Enterprise Edition 6.31.0**
*   **Enterprise Edition 5.80.0**

These editions include:

*   Configuration of cache time-to-live settings for application deployments.
*   Resolution of slow response times in degraded server instances, allowing the admin interface to respond normally.

## WildFly

WildFly 38 includes:

*   Bug fixes and dependency upgrades.
*   Support for Jakarta EE 11 specifications (Jakarta Persistence, Jakarta Context and Dependency Injection, Jakarta Authorization).
*   Support for MicroProfile 7.1, featuring updated MicroProfile Telemetry and MicroProfile OpenAPI specifications.

## Micrometer

Micrometer has released:

*   **Micrometer Metrics 1.16.0 RC1:** This release candidate includes dependency upgrades and two new features:
    *   `@ObservedKeyValueTag` annotation for declaring dynamic key values.
    *   Validation of low cardinality keys with the same name.
*   **Micrometer Tracing 1.6.0 RC1:** This release candidate includes dependency upgrades to Micrometer Metrics 1.16.0-RC1 and OpenTelemetry Instrumentation 2.20.1.

## Project Reactor

Project Reactor has released:

*   **Project Reactor 2025.0.0 RC1:**  Includes dependency upgrades to `reactor-core 3.8.0-RC1`, `reactor-netty 1.3.0-RC1`, `reactor-pool 1.2.0-RC1`, `reactor-addons 3.6.0-RC6`, `reactor-kotlin-extensions 1.3.0-RC5`.
*   **Project Reactor 2024.0.11:** This eleventh maintenance release includes dependency upgrades to `reactor-core 3.7.12`, `reactor-netty 1.2.11`, `reactor-pool 1.1.5`, and `reactor-addons 3.5.4`, along with `reactor-kotlin-extensions 1.2.4`.  `reactor-kafka 1.3.24` remains unchanged.

## Testcontainers

Testcontainers 2.0 has been released, featuring:

*   A gRPC endpoint for the `BigQueryEmulatorContainer` class, aligning with the `gcloud` class name.
*   A `BigQueryWriteSettings` method added to the `getHttpUrl()` class.