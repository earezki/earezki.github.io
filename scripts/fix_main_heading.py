#!/usr/bin/env python3
import re
import os
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT_GLOB = ROOT / 'src' / 'content'

PLACEHOLDER_REGEX = re.compile(r'^(##\s*Main Heading(?:\s*\(.*?\))?\s*$|\*\*Main Heading:\*\*)', re.MULTILINE)


def extract_frontmatter_and_body(text):
    if text.startswith('---'):
        parts = text.split('---', 2)
        if len(parts) >= 3:
            _, fm, body = parts[0], parts[1], parts[2]
            try:
                meta = yaml.safe_load(fm)
            except Exception:
                meta = {}
            return meta or {}, body.lstrip('\n')
    return {}, text


def first_heading_from_body(body):
    # look for first H1 or H2
    for line in body.splitlines():
        s = line.strip()
        if s.startswith('# '):
            return s[2:].strip()
        if s.startswith('## '):
            return s[3:].strip()
    return None


def filename_title(path: Path):
    name = path.stem
    # remove leading date
    name = re.sub(r'^\d{4}-\d{2}-\d{2}-?', '', name)
    return name.replace('-', ' ').replace('_', ' ').strip().title()


def replace_placeholder_with_title(path: Path):
    text = path.read_text(encoding='utf-8')
    meta, body = extract_frontmatter_and_body(text)
    # Determine the title to use
    title = None
    if meta.get('title'):
        title = meta.get('title')
    else:
        fh = first_heading_from_body(body)
        if fh:
            title = fh
        else:
            title = filename_title(path)

    # Build heading line: use H2 '## Title' to replace '## Main Heading' occurrences
    new_heading = f'## {title}'

    if 'Main Heading' not in text:
        return False, None

    new_text = re.sub(r'##\s*Main Heading(?:\s*\(.*?\))?', new_heading, text)
    new_text = new_text.replace('**Main Heading:**', new_heading)

    if new_text == text:
        return False, None

    path.write_text(new_text, encoding='utf-8')
    return True, title


if __name__ == '__main__':
    changed = []
    files = list((CONTENT_GLOB).rglob('*.md'))
    for f in files:
        ok, t = replace_placeholder_with_title(f)
        if ok:
            changed.append((str(f.relative_to(ROOT)), t))
    print(f'Files scanned: {len(files)}')
    print(f'Files changed: {len(changed)}')
    for p, t in changed:
        print(f'- {p} -> "{t}"')
