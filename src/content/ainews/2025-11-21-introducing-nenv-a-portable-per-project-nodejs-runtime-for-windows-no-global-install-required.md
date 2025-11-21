---
title: "nenv: A Portable, Per-Project Node.js Runtime for Windows"
pubDate: 2025-11-21
description: "nenv solves Node.js version conflicts on Windows by providing a portable, per-project runtime, eliminating the need for global installations."
categories: ["AI News", "Node.js", "DevOps"]
---

## nenv: A Portable, Per-Project Node.js Runtime for Windows

nenv is a new open-source tool designed to manage Node.js versions on a per-project basis for Windows, addressing common version conflicts and installation restrictions. The tool downloads and isolates a specific Node.js runtime directly into each project folder, enabling developers to work seamlessly across projects with differing Node.js requirements.

### Why This Matters
Traditional Node.js version management on Windows often requires global installations and administrator privileges, leading to conflicts and inconsistencies between projects. This can cause build failures, runtime errors, and significant debugging overhead, potentially costing development teams valuable time and resources. nenv aims to resolve these issues by providing a self-contained, portable solution.

### Key Insights
- **Node.js version conflicts are common**: Many developers experience issues due to differing Node.js version requirements across projects.
- **.venv inspiration**: nenv mirrors the functionality of Python’s `.venv` for creating isolated environments.
- **No admin rights needed**: nenv operates without requiring administrator privileges, making it ideal for restricted environments.

### Working Example
```powershell
# Installation
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/gh/tabreezsajjad/nenv@v0.5.0/nenv.txt" -OutFile "nenv.cmd"

# Initialization (select Node version, e.g., 20.11.1)
.\nenv.cmd init

# Check Node version
.\nenv.cmd node --version

# Install dependencies
.\nenv.cmd npm install

# Run scripts
.\nenv.cmd dev
```

### Practical Applications
- **Corporate Laptops**: Enables developers to work on multiple Node.js projects on corporate laptops without requiring global installations.
- **CI/CD Pipelines**: Ensures consistent Node.js versions across development, testing, and production environments, preventing "works on my machine" issues.

**References:**
- https://dev.to/tabreezsajjad/introducing-nenv-a-portable-per-project-nodejs-runtime-for-windows-no-global-install-required-4fp7
- https://github.com/tabreezsajjad/nenv