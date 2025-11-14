---
title: "Building ReAct Agents with LangGraph: A Step-by-Step Guide for Engineers"
pubDate: 2025-11-12
description: "Learn to build adaptive ReAct agents with LangGraph using hardcoded logic and LLM-powered reasoning."
categories: ["AI News", "LangGraph", "ReAct Agents"]
---

## What is the ReAct Pattern?

[2-sentence hook. Name the event, person, or system + one hard fact.]  
The ReAct (Reasoning + Acting) pattern enables AI agents to cycle through reasoning, action, and observation to solve problems. This article demonstrates how LangGraph’s StateGraph framework models agent workflows as graphs, allowing hardcoded or LLM-driven logic to execute dynamic decision-making.

### Why This Matters
[1 paragraph. Explain technical reality vs ideal models. Cite failure scale or cost.]  
Hardcoded ReAct agents, while useful for understanding mechanics, lack flexibility in real-world scenarios where dynamic queries are needed. LLM-powered agents, however, adapt to user inputs and gather context-specific data, reducing the risk of rigid, outdated workflows that fail to scale with complex use cases.

### Key Insights
- "Hardcoded ReAct agents with LangGraph's StateGraph for structured workflows": e.g., "ReAct cycle (Reason → Act → Observe) with hardcoded logic in Part 1"
- "LLM-powered agents using GPT-4o for dynamic decision-making": e.g., "LLM-driven reasoning in Part 2 to determine queries"
- "LangGraph’s conditional edges for routing workflows": e.g., "Conditional edges route between reasoning and action nodes based on state"

### Working Example
```python
# Define the state that flows through our graph
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    next_action: str
    iterations: int
```

```python
# Simple mock search tool
def search_tool(query: str) -> str:
    responses = {
        "weather tokyo": "Tokyo weather: 18°C, partly cloudy",
        "population japan": "Japan population: approximately 125 million",
    }
    return responses.get(query.lower(), f"No results found for: {query}")
```

```python
# Reasoning node - decides what to do next
def reasoning_node(state: AgentState):
    messages = state["messages"]
    iterations = state.get("iterations", 0)
    if iterations == 0:
        return {"messages": ["Thought: I need to check Tokyo weather"], "next_action": "action", "iterations": iterations + 1}
    elif iterations == 1:
        return {"messages": ["Thought: Now I need Japan's population"], "next_action": "action", "iterations": iterations + 1}
    else:
        return {"messages": ["Thought: I have enough info to answer"], "next_action": "end", "iterations": iterations + 1}
```

```python
# Build the graph workflow
workflow = StateGraph(AgentState)
workflow.add_node("reasoning", reasoning_node)
workflow.add_node("action", action_node)
workflow.set_entry_point("reasoning")
workflow.add_conditional_edges("reasoning", route, {"action": "action", "end": END})
workflow.add_edge("action", "reasoning")
app = workflow.compile()
```

### Practical Applications
- **Use Case**: "ReAct agents for dynamic Q&A systems using LangGraph and LLMs"
- **Pitfall**: "Over-reliance on LLMs without fallback tools leading to inaccurate information"

**References:**
- https://machinelearningmastery.com/building-react-agents-with-langgraph-a-beginners-guide/
---