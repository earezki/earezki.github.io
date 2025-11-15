---
title: "Brand Tagging with VLMs"
pubDate: 2025-11-15
description: "Two-stage pipeline using SigLIP-2 and LLaVA-OneVision-1.5 achieves 95% confidence in logo verification on 44s video clips"
categories: ["AI News", "Computer Vision", "NLP"]
---

## Brand Tagging with VLMs

A two-stage pipeline using SigLIP-2 and LLaVA-OneVision-1.5 identifies logos in video with 95% confidence on 44-second clips. The system processes 88 frames from a Red Bull Racing video, detecting the logo with cosine similarity thresholds and structured JSON verification.

### Why This Matters
Real-world logos are tiny, occluded, or distorted, making detection error-prone. Retrieval via SigLIP-2 (with dynamic aspect ratio support) ensures high recall, while LLaVA-OneVision-1.5 verification filters false positives. Failure to verify could lead to missed brand detections in critical applications like advertising analytics or content moderation.

### Key Insights
- "44-second video example with 95% confidence in detection" (example output from context)
- "SigLIP-2 used for high-recall retrieval with dynamic patch resizing"
- "LLaVA-OneVision-1.5 used by developers for structured yes/no verification"

### Working Example
```python
# build_logo_index.py
import json, faiss, torch
from pathlib import Path
from PIL import Image
import numpy as np
from transformers import AutoModel, AutoProcessor

MODEL_ID = "google/siglip2-base-patch16-naflex"
OUT_DIR = Path("artifacts")

def embed_images(paths, model, proc, batch=16):
    # Embedding logic as described
    pass

def main():
    model = AutoModel.from_pretrained(MODEL_ID, dtype=torch.float32, device_map="auto")
    proc = AutoProcessor.from_pretrained(MODEL_ID)
    logo_paths = sorted(list(Path("logos").glob("*.*")))
    vecs = embed_images(logo_paths, model, proc)
    index = faiss.IndexFlatIP(vecs.shape[1])
    index.add(vecs)
    faiss.write_index(index, str(OUT_DIR / "logos.faiss"))
    print(f"Indexed {len(logo_paths)} brands")
```

```python
# verify.py
import json, torch
from pathlib import Path
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM

VLM_ID = "lmms-lab/LLaVA-OneVision-1.5-8B-Instruct"

def run_once(proc, model, crop, brand):
    # JSON verification logic as described
    pass

def main():
    proc = AutoProcessor.from_pretrained(VLM_ID)
    model = AutoModelForCausalLM.from_pretrained(VLM_ID, dtype=torch.float32, device_map="auto")
    results = []
    for line in Path("candidates.jsonl").read_text().splitlines():
        c = json.loads(line)
        im = Image.open(Path("frames")/c["frame"]).convert("RGB")
        crop = im.crop(c["bbox"])
        j = run_once(proc, model, crop, c["brand"])
        results.append({**c, **j})
    Path("detections.jsonl").write_text(json.dumps(results))
```

### Practical Applications
- **Use Case**: Brand monitoring in sports videos using Red Bull logo detection
- **Pitfall**: Overlooking occluded logos due to low cosine threshold (COSINE_TH=0.7)

**References:**
- https://dev.to/thevilledev/brand-tagging-with-vlms-3096
- https://upload.wikimedia.org/wikipedia/commons/b/ba/Red_Bull_Racing_Pit_Stop_Practice.webm
---