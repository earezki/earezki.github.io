---
title: "Three Questions That Help You Build a Better Software Architecture"
pubDate: "2025-10-21"
description: "This article outlines three critical questions teams should answer when architecting a Minimum Viable Architecture (MVA) for an MVP: Is the business idea worth pursuing?, How much performance and scalability are needed?, and How much maintainability and supportability are required? It emphasizes the importance of empiricism and iterative development in making these decisions."
categories: ["AI News", "Architecture & Design", "Software Architecture", "Minimum Viable Architecture"]
---

## Three Questions That Help You Build a Better Software Architecture

This article from InfoQ discusses three crucial questions that guide the architectural decisions for a Minimum Viable Architecture (MVA) when developing a Minimum Viable Product (MVP). The author argues that addressing these questions in a specific order – business viability, performance/scalability, and maintainability/supportability – is key to successful MVP development and a sustainable MVA. The article emphasizes the importance of empiricism, iterative development, and making informed trade-offs.

### Key Takeaways

*   The most critical decision is whether the business idea is worth pursuing.
*   Performance and scalability are the next most important considerations.
*   Maintainability and supportability should be addressed after performance and scalability are established.
*   Empiricism and experimentation are essential for validating assumptions and making informed decisions.
*   Technical debt is a useful metaphor for understanding the long-term implications of architectural decisions.

## The Importance of the MVP and MVA

The article highlights that software development often faces constraints of time and resources, necessitating prioritization.  Architecting is an art of deciding which decisions to make now and which to defer.  The Minimum Viable Product (MVP) and its associated Minimum Viable Architecture (MVA) approach are crucial for answering critical questions and validating assumptions. The article stresses that no MVP survives contact with customers, underscoring the need for adaptability.

## The Three Key Questions

The article proposes a specific order for addressing architectural questions:

### 1. Is the business idea worth pursuing?

This is the most important question. The article emphasizes that building a solution for an unneeded problem is a waste of resources. The MVP serves as a mechanism to test the value of the proposed solution.  Key aspects include:

*   **Validating Assumptions:** The MVP should test assumptions made during the initial business idea presentation, particularly technology assumptions.
*   **Data Collection:** The MVP needs to be instrumented to collect data needed to determine if the product idea has value.
*   **Cost Evaluation:**  The MVP should evaluate whether the business case can be met within budget.
*   **Empiricism:** The MVP is a tool to determine if the idea has value.

### 2. How much performance and scalability are needed?

This is the second most important question. Early attention to performance is vital, as poor initial performance can indicate future scaling problems.

*   **Subjectivity of Performance:** Performance expectations are subjective and depend on user expectations.
*   **Trade-offs:**  The article discusses trade-offs between data access methods (memory vs. storage) and techniques for handling long-running computations (asynchronous tasks).
*   **Scalability Challenges:**  Scalability is a challenging problem, and accurately predicting scalability needs is difficult.
*   **Prioritization:**  Teams should focus on building the parts of the system that significantly impact performance.
*   **Technical Debt:**  The concept of technical debt is discussed as a way to measure maintainability and supportability, and to inform decisions about performance and scalability.

### 3. How much maintainability/modularity and supportability are needed?

This is the third question to consider.  Focusing on maintainability and supportability before validating performance and scalability is premature.

*   **Modular Design:**  Modular systems are easier to develop, understand, and maintain.
*   **Anticipating Future Needs:**  Investments in maintainability should be driven by anticipated changes and future requirements.
*   **Technical Debt:**  Understanding and managing technical debt is crucial for long-term maintainability.
*   **Change Cases:**  Incorporating anticipated changes into the MVP helps assess the cost of future modifications.
*   **Iterative Improvement:**  The MVA should be refined based on learnings from the MVP.

## Conclusion

The article concludes by reiterating the importance of prioritizing the business idea, then performance/scalability, and finally maintainability/supportability.  It emphasizes that architectural decisions are iterative and should be informed by data and experimentation.  The use of Architectural Decision Records (ADRs) and incorporating change cases are suggested as ways to track and manage technical debt and ensure long-term viability.  The author stresses that the MVP is a learning process, and the MVA should evolve accordingly.

## Reference Link

[https://www.infoq.com/articles/three-questions-better-architecture/](https://www.infoq.com/articles/three-questions-better-architecture/)