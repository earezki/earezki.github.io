---
title: "Dynamic Parameter Handling in GitHub Actions via JSON Templating"
pubDate: 2025-11-16
description: "GitHub Actions now supports dynamic parameter passing through JSON templating, enabling flexible config management."
categories: ["AI News", "DevOps", "GitHub Actions"]
---

## Passing dynamic number of parameters to a reusable Github Actions workflow

GitHub Actions enables dynamic parameter passing in reusable workflows. This technique uses JSON inputs and `envsubst` to template config files at runtime.

### Why This Matters
Reusable workflows in GitHub Actions are ideal for standardizing CI/CD processes, but they traditionally require static input parameters. Dynamic parameter handling via JSON addresses real-world scenarios where config variables are unknown at workflow definition time. However, this approach introduces risks: untrusted JSON inputs could inject malicious environment variables, and improper escaping may break templating. The cost of misconfiguration includes potential security vulnerabilities or failed deployments.

### Key Insights
- "JSON-based dynamic parameters in GitHub Actions, 2025"
- "envsubst for config templating in CI/CD pipelines"
- "jq and envsubst used for dynamic config templating"

### Working Example
```yaml
- name: Checkout
  uses: actions/checkout@v4
```

```yaml
- name: Template File
  env:
    TEMPLATE_VARS: ${{ inputs.TEMPLATE_VARS }}
  run: |
    set -ex
    PARSED_VARS=$(echo "${TEMPLATE_VARS}" | jq 'to_entries[] | "\(.key)=\(.value)"' | xargs -I '{}' echo "export {}")
    eval "${PARSED_VARS}"
    ENVSUBST_VAR_LIST=$(echo "${TEMPLATE_VARS}" | jq 'to_entries[] | "${\(.key)}"' | xargs)
    envsubst "${ENVSUBST_VAR_LIST}" < ${{ inputs.TEMPLATE_FILE_PATH }} > ${{ inputs.TARGET_FILE_PATH }}
```

### Practical Applications
- **Use Case**: Config templating in CI/CD pipelines using GitHub Actions
- **Pitfall**: Using untrusted JSON inputs can introduce security risks via environment variable injection

**References:**
- https://dev.to/karatheodory/passing-dynamic-number-of-parameters-to-a-reusable-github-actions-workflow-2bcl
---