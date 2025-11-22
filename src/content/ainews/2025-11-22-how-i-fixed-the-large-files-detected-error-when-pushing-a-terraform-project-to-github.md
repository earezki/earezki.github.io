---
title: "Fixing GitHub's 'Large Files Detected' Error in Terraform Projects"
pubDate: 2025-11-22
description: "GitHub blocks Terraform pushes with 100MB+ files; providers often exceed 200MB–500MB."
categories: ["AI News", "DevOps", "Terraform"]
---

## How I Fixed the “Large Files Detected” Error When Pushing a Terraform Project to GitHub

GitHub blocks pushes containing files over 100MB. Terraform provider binaries, typically 200MB–500MB, trigger this error when committed.

### Why This Matters
GitHub’s 100MB limit clashes with Terraform’s default behavior of storing large provider binaries in the `.terraform/` directory. Even if these files are later ignored, they persist in Git history, causing pushes to fail. Cleaning this history requires tools like `git-filter-repo` and force-pushing, which can be time-consuming if overlooked.

### Key Insights
- "GitHub enforces a 100MB file size limit for repositories": https://dev.to/christiana_otoboh/how-i-fixed-the-large-files-detected-error-when-pushing-a-terraform-project-to-github-3581
- "Use `git-filter-repo` to remove large files from history": https://dev.to/christiana_otoboh/how-i-fixed-the-large-files-detected-error-when-pushing-a-terraform-project-to-github-3581
- "Ignore `.terraform/` and state files in `.gitignore`": https://dev.to/christiana_otoboh/how-i-fixed-the-large-files-detected-error-when-pushing-a-terraform-project-to-github-3581

### Working Example
```bash
# Step 1: Add .terraform to .gitignore
echo ".terraform/" >> .gitignore
git add .gitignore
git commit -m "Add Terraform ignores files"
```

```bash
# Step 2: Install and use git-filter-repo
sudo apt update
sudo apt install git-filter-repo
git filter-repo --force --path .terraform/ --invert-paths
```

```bash
# Step 3: Force push cleaned history
git push --force
```

### Practical Applications
- **Use Case**: Terraform projects avoiding `.terraform/` and state files in version control.
- **Pitfall**: Committing large binaries without cleaning history, leading to permanent GitHub push failures.

**References:**
- https://dev.to/christiana_otoboh/how-i-fixed-the-large-files-detected-error-when-pushing-a-terraform-project-to-github-3581
---