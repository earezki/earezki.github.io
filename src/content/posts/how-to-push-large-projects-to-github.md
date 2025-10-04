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

```shell
#!/bin/bash

BATCH_SIZE_MB=50
BATCH_SIZE_BYTES=$((BATCH_SIZE_MB * 1024 * 1024))

CURRENT_BATCH_SIZE=0
BATCH_NUMBER=1

CURRENT_BATCH_FILES=()

commit_batch() {
    if [ ${#CURRENT_BATCH_FILES[@]} -eq 0 ]; then
        return
    fi

    echo "Commit in progress ..."

    git add "${CURRENT_BATCH_FILES[@]}"

    # Commit the batch
    git commit -m "Batch $BATCH_NUMBER: Commit for approximately $BATCH_SIZE_MB MB of files"
    git push -u origin master

    echo "Commit done ..."

    CURRENT_BATCH_SIZE=0
    CURRENT_BATCH_FILES=()
    BATCH_NUMBER=$((BATCH_NUMBER + 1))
}

echo "Start ..."

find . -type f | while read -r FILE; do
    # Skip files in the .git directory
    if [[ "$FILE" == ./.git* ]]; then
        continue
    fi

    FILE_SIZE=$(stat -c%s "$FILE")

    if (( CURRENT_BATCH_SIZE + FILE_SIZE > BATCH_SIZE_BYTES )); then
        commit_batch
    fi

    CURRENT_BATCH_FILES+=("$FILE")
    CURRENT_BATCH_SIZE=$((CURRENT_BATCH_SIZE + FILE_SIZE))
done

# Commit remaining files
commit_batch

echo "Finished..."
```
