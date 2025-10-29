---
title: "Java Ecosystem Update: October 20th, 2025 - Oracle CPU, Grails 7.0, and More"
pubDate: "2025-10-28"
description: "A comprehensive overview of the latest developments in the Java ecosystem as of October 20th, 2025, including Oracle's Critical Patch Update, Grails 7.0 GA release, and updates to Micronaut, Hazelcast, LangChain4j, and Open Liberty."
categories: ["AI News", "Java News"]
---

## Main Heading

This summary details the key updates across the Java ecosystem for the week of October 20th, 2025, encompassing releases from Oracle, BellSoft, Grails, Micronaut, Hazelcast, LangChain4j, Open Liberty, and OpenXava.  The updates cover security patches, framework releases, and new features aimed at improving developer productivity and application capabilities.

## Oracle JDK Updates

Oracle released several Critical Patch Updates (CPU) for October 2025, including versions 25.0.1, 21.0.9, 17.0.17, 11.0.29, and 8u471. These updates address security vulnerabilities.  Build 21 of JDK 26 early-access builds was also made available, incorporating fixes from Build 20. Developers are encouraged to report bugs via the Java Bug Database.

## BellSoft Liberica JDK CPU Patches

Concurrent with Oracle's CPU release, BellSoft released CPU patches for various versions of Liberica JDK (their OpenJDK distribution), including 25.0.0.0.1, 21.0.8.0.1, 17.0.16.0.1, 11.0.28.0.1, 8u471, 7u481, and 6u481. These patches address a total of 687 fixes and backports, eliminating 13 issues across all releases.  Additionally, Patch Set Update (PSU) versions 25.0.1, 21.0.9, 17.0.17, 11.0.29, and 8u472 were released, containing both CPU and non-critical fixes.

## Grails 7.0 GA Release

The Grails 7.0 release brings several significant changes and improvements. Key highlights include:

*   **Micronaut Auto-configuration Control:** Developers can now disable Micronaut auto-configuration via the Grails plugin to address test coverage issues.
*   **GORM Reproducibility:**  Improvements to the Grails Object Relational Mapper (GORM) services enhance reproducibility.
*   **Neo4j GORM Removal:** The GORM for Neo4J and related tests have been temporarily removed until they are updated for Grails 7.0 or 8.0.
*   More details are available in the release notes.

## Micronaut Framework Update

Micronaut Foundation released version 4.10.0, built on Micronaut Core 4.10.7.  Notable additions include:

*   **Micronaut MCP Module:**  Integration with the Model Context Protocol (MCP).
*   **LangChain4j 1.5.0:** Support for the ChatMemory API via the Micronaut LangChai4j module.
*   **ReadBuffer Class:** A new `ReadBuffer` abstract class replaces the `ByteBuffer` interface.

## Open Liberty Beta Release

Open Liberty 25.0.0.11 introduced support for the Model Context Protocol (MCP) through the `mcpServer-1.0` feature. This allows developers to bridge the gap between Large Language Models (LLMs) and business code, enabling AI applications to discover, understand, and utilize functionality.

## Hazelcast 5.6.0 Enhancements

Hazelcast 5.6.0 delivers improvements across several areas:

*   **CP Subsystem:** Enhancements to snapshot chunking, serialization, and log synchronization.
*   **Vector Collection:** Optimized index handling, CPU-aware search execution, and enhanced fault tolerance.
*   **Observability:**  Ability to enable diagnostic logging without cluster restarts, optimized memory allocation, and improved observability.

## OpenXava 7.6.1 Release

OpenXava 7.6.1 includes bug fixes, documentation improvements, and dependency upgrades. Key features include:

*   **Quartz Job Scheduler:** Project management archetypes now use the Quartz job scheduler for scheduled email reminders.
*   **Master Details Archetype Enhancements:**  Added a print action to generate a PDF of a master record, JUnit automated tests, and a database populated with sample data.

## LangChain4j 1.8.0 Release

The formal release (and fifteenth beta) of LangChain4j 1.8.0 introduces:

*   **AgenticScope Interface:** Access to the `AgenticScope` interface from methods annotated with `@Tool`.
*   **Custom Attributes:** Ability to pass custom attributes from a RAG pipeline to the `@Tool` interface.
*   **MCP Client Mapping:** Support for mapping tool names for MCP clients.

Refer to the release notes for more detailed information.

## References

https://www.infoq.com/news/2025/10/java-news-roundup-oct20-2025/