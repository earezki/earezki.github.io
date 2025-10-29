#!/usr/bin/env python3
"""
Sanitize filenames in src/content/ainews:
- Lowercase
- Remove any character not in [a-z0-9-]
- Collapse multiple hyphens to single
- Preserve .md extension
- Avoid collisions by appending a numeric suffix if needed

Run: python scripts/sanitize-ainews-filenames.py
"""
import os
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / 'src' / 'content' / 'ainews'
if not BASE.exists():
    print(f"Directory not found: {BASE}")
    raise SystemExit(1)

changed = []
collisions = []

for p in sorted(BASE.iterdir()):
    if not p.is_file():
        continue
    old_name = p.name
    stem = p.stem
    suffix = p.suffix  # keep extension

    # Apply the same transformations
    new_stem = stem.lower()
    new_stem = re.sub(r'[^a-z0-9-]', '', new_stem)
    new_stem = re.sub(r'-+', '-', new_stem)

    # Ensure non-empty
    if not new_stem:
        new_stem = 'article'

    candidate = new_stem + suffix
    candidate_path = p.with_name(candidate)
    count = 1
    while candidate_path.exists() and candidate_path.resolve() != p.resolve():
        candidate = f"{new_stem}-{count}{suffix}"
        candidate_path = p.with_name(candidate)
        count += 1

    if candidate_path.resolve() == p.resolve():
        # already sanitized
        continue

    # Rename
    p.rename(candidate_path)
    changed.append((old_name, candidate_path.name))

print("Sanitization complete.")
if changed:
    print("Renamed files:")
    for a, b in changed:
        print(f"  {a} -> {b}")
else:
    print("No files needed renaming.")

if collisions:
    print("Collisions detected:")
    for c in collisions:
        print(c)
