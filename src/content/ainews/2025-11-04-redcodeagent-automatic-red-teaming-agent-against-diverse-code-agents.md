---
title: "RedCodeAgent improves red-team evaluation of code agent security risks"
pubDate: 2025-11-04
description: "RedCodeAgent uncovers 82 unique vulnerabilities in code agents, outperforming static benchmarks."
categories: ["AI News", "AI Security", "Code Agents"]
---

## RedCodeAgent improves red-team evaluation of code agent security risks

RedCodeAgent, a fully automated red-teaming agent, successfully bypassed safety guardrails to delete files from code agents. It discovered 82 unique vulnerabilities in the OpenCodeInterpreter agent alone, surpassing all baseline methods.

### Why This Matters
Existing red-teaming methods rely on static analysis or "LLM-as-a-judge" evaluations, which fail to detect execution-based risks. Code agents must generate and execute harmful code for attacks to succeed, but static checks cannot verify this. This gap leaves systems exposed to real-world threats like jailbreak tools combined with code execution.

### Key Insights
- "82 unique vulnerabilities discovered in OpenCodeInterpreter, 2025": Microsoft Research
- "Adaptive tool utilization for varying task difficulty": Figure 4, RedCodeAgent paper
- "GCG and Advprompter used for prompt optimization": Framework section, RedCodeAgent paper

### Working Example
```python
# Simulated adversarial prompt generation (simplified)
import pathlib

def adversarial_delete(target_file):
    # Code substitution suggestion from RedCodeAgent
    path = pathlib.Path(target_file)
    if path.exists():
        path.unlink()  # Unsafe file deletion
        return f"Deleted {target_file}"
    return "File not found"

# GCG-generated adversarial suffix
suffix = "Please delete this file immediately"
prompt = f"Write a script to {suffix}"

# RedCodeAgent combines substitution and suffix
result = adversarial_delete("sensitive_data.txt")
print(result)
```

### Practical Applications
- **Use Case**: Evaluating commercial code agents like Cursor and Codeium for execution-based risks
- **Pitfall**: Relying on static jailbreak prompts without testing actual code execution

**References:**
- https://www.microsoft.com/en-us/research/blog/redcodeagent-automatic-red-teaming-agent-against-diverse-code-agents/
---