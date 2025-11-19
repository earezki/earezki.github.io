---
title: How to push large projects to Github
pubDate: '2024-11-24 00:00:46 +0100'
categories:
  - Git
  - Github
  - Toolkit
---

Recently, I've had to push a somewhat large project (~50 GB) to **Github** for the first time, the project was not tracked in **Git**, and hence trying a single commit with all the files failed with the following:
```
remote: fatal: pack exceeds maximum allowed size (2.00 gib)
```
Turns out (which I didn't knew) that **Github** imposes a size limit per *push*.
in this [link]((https://docs.github.com/en/get-started/using-git/troubleshooting-the-2-gb-push-limit)), **Github** suggests certain solutions, which didn't work out for me, so I was inspired by the push per commit idea, and came up with a shell script to push per **50 MB** worth of files.

```text
#!/usr/bin/env bash
set -euo pipefail

# Batch size in megabytes (adjust as needed)
BATCH_SIZE_MB=${BATCH_SIZE_MB:-50}
BATCH_SIZE_BYTES=$((BATCH_SIZE_MB * 1024 * 1024))

# Remote and branch detection (push to same branch)
REMOTE=${REMOTE:-origin}
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")

echo "Using remote: $REMOTE, branch: $BRANCH, batch size: ${BATCH_SIZE_MB}MB"

current_size=0
batch_num=1
files_to_add=()

commit_batch() {
    if [ ${#files_to_add[@]} -eq 0 ]; then
        return
    fi

    echo "[batch $batch_num] adding ${#files_to_add[@]} files (~$((current_size/1024/1024)) MB)"
    git add -- "${files_to_add[@]}"

    git commit -m "Batch $batch_num: ~${BATCH_SIZE_MB}MB"
    git push -u "$REMOTE" "$BRANCH"

    # reset
    current_size=0
    files_to_add=()
    batch_num=$((batch_num + 1))
}

# Iterate over files tracked by git (respects .gitignore). Use NUL separators.
git ls-files -z | while IFS= read -r -d '' file; do
    # get file size in bytes in a portable way
    if stat --version >/dev/null 2>&1; then
        # GNU stat
        size=$(stat -c%s -- "$file")
    else
        # BSD stat (macOS)
        size=$(stat -f%z -- "$file")
    fi

    # if adding this file would exceed the batch size, flush current batch first
    if [ $((current_size + size)) -gt $BATCH_SIZE_BYTES ]; then
        commit_batch
    fi

    files_to_add+=("$file")
    current_size=$((current_size + size))
done

# commit remaining files
commit_batch

echo "All done."
```

If you prefer a Python script instead of shell, here's a small, cross-platform script that does the same thing: it iterates tracked files (via `git ls-files`), accumulates file sizes until the batch limit is reached, then stages, commits and pushes the batch.

```python
#!/usr/bin/env python3
"""
Batch tracked git files by cumulative size and push each batch.

Usage: set BATCH_SIZE_MB env var to override default (50 MB).
"""
import os
import shlex
import subprocess
from typing import List


def get_env_batch_size_mb(default: int = 50) -> int:
    return int(os.environ.get("BATCH_SIZE_MB", default))


def git_ls_files() -> List[str]:
    p = subprocess.run(["git", "ls-files", "-z"], check=True, stdout=subprocess.PIPE)
    raw = p.stdout
    if not raw:
        return []
    # split on NUL and filter any empty entries
    return [f.decode("utf-8") for f in raw.split(b"\0") if f]


def file_size(path: str) -> int:
    return os.path.getsize(path)


def commit_and_push(files: List[str], batch_num: int, batch_mb: int, remote: str, branch: str) -> None:
    if not files:
        return
    print(f"[batch {batch_num}] adding {len(files)} files (~{sum(file_size(f) for f in files)//(1024*1024)} MB)")
    # git add -- files
    subprocess.run(["git", "add", "--"] + files, check=True)
    subprocess.run(["git", "commit", "-m", f"Batch {batch_num}: ~{batch_mb}MB"], check=True)
    subprocess.run(["git", "push", "-u", remote, branch], check=True)


def main():
    batch_mb = get_env_batch_size_mb()
    batch_bytes = batch_mb * 1024 * 1024
    remote = os.environ.get("REMOTE", "origin")
    # try to detect branch; fallback to 'master'
    try:
        branch = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], check=True, stdout=subprocess.PIPE).stdout.decode().strip()
    except subprocess.CalledProcessError:
        branch = "master"

    files = git_ls_files()
    current_size = 0
    batch: List[str] = []
    batch_num = 1

    for f in files:
        try:
            sz = file_size(f)
        except OSError:
            # skip files that disappear between listing and stat
            continue

        if current_size + sz > batch_bytes:
            commit_and_push(batch, batch_num, batch_mb, remote, branch)
            batch = []
            current_size = 0
            batch_num += 1

        batch.append(f)
        current_size += sz

    # final batch
    commit_and_push(batch, batch_num, batch_mb, remote, branch)


if __name__ == "__main__":
    main()
```
