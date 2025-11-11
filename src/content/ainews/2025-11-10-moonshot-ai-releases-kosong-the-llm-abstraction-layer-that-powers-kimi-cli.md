---
title: "Moonshot AI Launches Kosong: LLM Abstraction Layer for Agent Applications"
pubDate: 2025-11-10
description: "Moonshot AI's Kosong unifies LLM message structures and async tool orchestration, enabling agent apps to switch providers without rewriting logic."
categories: ["AI News", "Agentic AI", "Applications"]
---

## Kosong: The LLM Abstraction Layer that Powers Kimi CLI

Moonshot AI released **Kosong**, an LLM abstraction layer that powers its Kimi CLI. The library unifies message structures, asynchronous tool orchestration, and pluggable chat providers, allowing teams to build agents without hardcoding logic to specific APIs.

### Why This Matters
Modern agentic applications often rely on multiple models and tools, but switching providers or updating tooling typically requires rewriting agent logic. Kosong addresses this by abstracting provider-specific details like token accounting and streaming formats, reducing maintenance overhead. Without such abstractions, teams face significant costs from vendor lock-in and fragmented tooling integration.

### Key Insights
- "Kosong provides `generate` and `step` functions for chat and tool-based agents (2025)"
- "Sagas over ACID for e-commerce": Kosong’s `step` function handles async tool orchestration, akin to distributed transaction patterns
- "Kosong used by Moonshot’s Kimi CLI (2025)"

### Working Example
```python
from kosong import generate, step
from kosong.message import Message
from kosong.chat_provider.kimi import Kimi
from kosong.tooling.simple import SimpleToolset
from kosong.tooling import CallableTool2, ToolOk

# Define a simple tool
class AddTool(CallableTool2):
    name = "add"
    description = "Adds two numbers"
    params = {"a": int, "b": int}
    def __call__(self, a: int, b: int) -> ToolOk:
        return ToolOk(result=a + b)

# Initialize chat provider
provider = Kimi(base_url="https://api.moonshot.ai", api_key="your-key", model="kimi-k2-turbo-preview")

# Create toolset
toolset = SimpleToolset()
toolset += AddTool()

# Single shot completion
result = generate(
    chat_provider=provider,
    system_prompt="You are a helpful assistant.",
    tools=[],
    history=[Message(role="user", content="What is 2 + 2?")]
)
print(result.message.content)

# Tool-using agent
result = step(
    chat_provider=provider,
    toolset=toolset,
    system_prompt="You have access to the 'add' tool.",
    history=[Message(role="user", content="Calculate 3 + 5.")]
)
print(result.message.content)
print(result.tool_results())
```

### Practical Applications
- **Use Case**: Kimi CLI uses Kosong to abstract LLM and tooling interactions, enabling command-line agents to target multiple backends
- **Pitfall**: Over-reliance on single-provider-specific features without abstraction layers leads to vendor lock-in and brittle code

**References:**
- https://www.marktechpost.com/2025/11/10/moonshot-ai-releases-kosong-the-llm-abstraction-layer-that-powers-kimi-cli/
---