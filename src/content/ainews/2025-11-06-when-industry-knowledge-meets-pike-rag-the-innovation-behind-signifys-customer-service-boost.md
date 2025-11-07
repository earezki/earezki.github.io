---
title: "Signify and Microsoft Research Asia Enhance Customer Service with PIKE-RAG Technology"
pubDate: 2025-11-06
description: "A collaboration between Signify and Microsoft Research Asia demonstrates how PIKE-RAG improves enterprise knowledge systems, achieving a 12% increase in accuracy and faster, reliable answers for complex industrial queries."
categories: ["AI News", "AI in Industry", "Knowledge Management"]
---

## Signify and Microsoft Research Asia Enhance Customer Service with PIKE-RAG Technology

Signify, a global leader in connected LED lighting, partnered with Microsoft Research Asia to implement **PIKE-RAG** (a Retrieval-Augmented Generation system) in its knowledge management platform. This integration addressed critical challenges in handling technical documentation and complex customer queries, resulting in a **12% improvement in answer accuracy**. The solution leverages advanced AI to process multimodal data, perform multi-step reasoning, and adapt to domain-specific engineering logic, setting a benchmark for industrial knowledge systems.

---

## Challenges of Applying RAG in Lighting

Traditional RAG systems faced significant limitations in Signify’s context due to the complexity of its product data and customer inquiries. Key challenges included:

- **Multimodal Data Complexity**: Product documentation contained nonstandard tables, circuit diagrams, and unstructured technical parameters, which traditional systems struggled to parse effectively.
- **Scalability and Customization**: Continuous updates to product specifications and the need for domain-specific reasoning slowed development and limited system scalability.
- **Reliance on Erroneous Data Sources**: Discrepancies between synchronized databases and external sources led to inconsistent or inaccurate answers.

Despite efforts like keyword optimization and prompt refinement, Signify required a more robust solution to meet the demands of professional users requiring precise technical information.

---

## How PIKE-RAG Addressed Signify’s Pain Points

PIKE-RAG overcame these challenges through three core innovations:

### 1. **Multimodal Document Parsing and Industry-Specific Reasoning**

- **Integration of Document Intelligence**: Combines Microsoft Azure OpenAI models with Microsoft Research Asia’s Document Intelligence to extract structured data from tables and diagrams.
- **Example Use Case**: When querying “What is the output voltage of a specific driver model at 0.15A current?” PIKE-RAG locates the relevant voltage-current curve in the document and infers a range (e.g., 40–54V), a task traditional systems fail due to inability to interpret visual data.

### 2. **End-to-End Knowledge Loop with Multi-Source Validation**

- **Direct Document Parsing**: Uses original product manuals and PDFs as primary data sources, avoiding reliance on potentially outdated or inconsistent databases.
- **Citation Relationships**: Establishes links between data sources to ensure answers are grounded in verified information, improving trustworthiness.

### 3. **Dynamic Task Decomposition and Multi-Hop Reasoning**

- **Complex Query Handling**: Breaks down multi-step questions into subtasks and uses multi-hop reasoning to derive answers from indirect information.
- **Example Use Case**: For the query “List all bases compatible with the G8 series lamps,” PIKE-RAG:
  1. Identifies that G7 and G8 series share dimensions.
  2. Retrieves G7-compatible bases.
  3. Maps abbreviations to full names using a reference table, generating a complete list.

This automated reasoning process ensures accuracy even when direct answers are absent.

---

## Beyond Lighting: Generalization Across Industries

PIKE-RAG’s success in Signify’s use case highlights its adaptability to other complex domains. Key generalization capabilities include:

### **1. Self-Evolution and Continuous Learning**
- **Automated Optimization**: Analyzes interaction logs to refine knowledge extraction strategies (e.g., adjusting table parsing methods or multimodal content weights).
- **No Manual Intervention**: Validated strategies are automatically integrated, enabling the system to adapt to new knowledge types dynamically.

### **2. Modular Architecture for Flexibility**
- **Component-Based Design**: Combines modules for document parsing, storage, retrieval, and reasoning, allowing dynamic configuration based on use cases (e.g., fact retrieval vs. multi-hop reasoning).
- **Scalability**: Efficiently handles diverse tasks, from simple lookups to complex engineering queries.

### **3. Domain-Specific Reasoning Adaptation**
- **Real-Time Logic Updates**: Enterprises can inject domain-specific rules (e.g., “LED driver max voltage is the operating range’s maximum”) via the Domain Tips feature.
- **Industry Compliance**: Ensures outputs align with professional standards and conventions.

PIKE-RAG has been piloted in sectors like manufacturing, mining, and pharmaceuticals, consistently improving Q&A accuracy and reducing customization efforts.

---

## Recommendations for Implementation

- **Use Case Fit**: Ideal for industries with complex technical documentation (e.g., engineering, healthcare, law) requiring precise, multi-step reasoning.
- **Best Practices**:
  - Integrate domain-specific rules to align with industry conventions.
  - Prioritize continuous learning to refine knowledge extraction strategies.
  - Leverage modular architecture to adapt to evolving use cases.
- **Pitfalls to Avoid**:
  - Over-reliance on unstructured data without validation mechanisms.
  - Neglecting to update domain-specific logic as standards evolve.

---

## Working Example (Conceptual)

While no code is provided in the context, a simplified Python-like pseudocode illustrates PIKE-RAG’s multi-hop reasoning:

```python
def answer_complex_query(query, documents):
    subtasks = decompose_query(query)  # e.g., "G8 bases" → ["G7 bases", "G7-G8 compatibility"]
    results = []
    for task in subtasks:
        doc = find_relevant_document(task, documents)
        if doc:
            info = extract_info(doc, task)
            results.append(info)
    final_answer = synthesize_results(results)  # Combine G7 bases and compatibility rules
    return final_answer
```

This approach demonstrates how PIKE-RAG dynamically breaks down queries and synthesizes information from multiple sources.

---

## Reference

https://www.microsoft.com/en-us/research/blog/when-industry-knowledge-meets-pike-rag-the-innovation-behind-signifys-customer-service-boost/