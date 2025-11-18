---
title: "Efficient Optimization With Ax, an Open Platform for Adaptive Experimentation"
pubDate: 2025-11-18
description: "Meta released Ax 1.0, an open-source platform utilizing machine learning to automate complex experimentation and improve AI models at scale."
categories: ["AI News", "Open Source", "Machine Learning"]
---

## Efficient Optimization With Ax, an Open Platform for Adaptive Experimentation

Meta has released Ax 1.0, an open-source platform that leverages machine learning to automatically guide complex, resource-intensive experimentation; Ax is currently used across Meta to improve AI models and tune production infrastructure. The accompanying paper, “Ax: A Platform for Adaptive Experimentation,” details Ax’s architecture and methodology.

Adaptive experimentation is crucial for optimizing AI models and systems with numerous configurations, particularly when each evaluation is costly in time or resources. Traditional optimization methods often fall short in these scenarios, requiring excessive evaluations to achieve optimal results, which can translate to significant financial and time investments. 

### Key Insights
- **Bayesian Optimization**: Ax utilizes Bayesian optimization, an iterative approach that balances exploration and exploitation to efficiently identify optimal configurations.
- **Gaussian Processes**: Ax employs Gaussian processes as surrogate models, effectively quantifying uncertainty with limited data, crucial for high-dimensional optimization problems.
- **Meta's Internal Use**: Thousands of developers at Meta use Ax for hyperparameter optimization, infrastructure tuning, and even hardware design for AR/VR devices.

### Working Example
```python
# Install Ax
# pip install ax-platform
```

### Practical Applications
- **Meta's Ray-Ban Stories**: Ax was used to optimize natural language models for the Ray-Ban Stories, balancing model size and performance.
- **Pitfall**: Relying solely on manual parameter tuning for complex systems can lead to suboptimal configurations and wasted resources.

**References:**
- https://engineering.fb.com/2025/11/18/open-source/efficient-optimization-ax-open-platform-adaptive-experimentation/