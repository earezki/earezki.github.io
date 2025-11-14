---
title: "How to Build a Fully Functional Custom GPT-style Conversational AI Locally Using Hugging Face Transformers"
pubDate: 2025-11-12
description: "Build a local GPT-style AI with Hugging Face Transformers using Microsoft's Phi-3 model and Python code."
categories: ["AI News", "Artificial Intelligence", "Machine Learning"]
---

## How to Build a Fully Functional Custom GPT-style Conversational AI Locally Using Hugging Face Transformers

This tutorial demonstrates building a local conversational AI using Hugging Face Transformers. The system leverages the **microsoft/Phi-3-mini-4k-instruct** model with 256 max tokens and GPU acceleration.

### Why This Matters
Commercial GPT systems rely on opaque cloud infrastructure, but this approach enables full transparency and offline operation. Local execution avoids cloud dependency costs (e.g., $0.002 per 1K tokens on AWS) while maintaining conversational memory and tool integration. Failures in distributed systems like the 2012 App Engine outage highlight the value of self-contained models.

### Key Insights
- "8-hour App Engine outage, 2012": Cloud dependencies risk downtime.
- "Sagas over ACID for e-commerce": Lightweight tool routing (e.g., `search:` prefix) enables local task simulation.
- "Hugging Face Transformers used by Meta, Anthropic": Open-source models power commercial systems.

### Working Example
```python
!pip install transformers accelerate sentencepiece --quiet
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import List, Tuple, Optional
import textwrap, json, os

MODEL_NAME = "microsoft/Phi-3-mini-4k-instruct"
BASE_SYSTEM_PROMPT = (
    "You are a custom GPT running locally. "
    "Follow user instructions carefully. "
    "Be concise and structured. "
    "If something is unclear, say it is unclear. "
    "Prefer practical examples over corporate examples unless explicitly asked. "
    "When asked for code, give runnable code."
)
MAX_NEW_TOKENS = 256

print("Loading model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
if tokenizer.pad_token_id is None:
    tokenizer.pad_token_id = tokenizer.eos_token_id
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"
)
model.eval()
print("Model loaded.")
```

```python
ConversationHistory = List[Tuple[str, str]]
history: ConversationHistory = [("system", BASE_SYSTEM_PROMPT)]

def wrap_text(s: str, w: int = 100) -> str:
    return "\n".join(textwrap.wrap(s, width=w))

def build_chat_prompt(history: ConversationHistory, user_msg: str) -> str:
    prompt_parts = []
    for role, content in history:
        if role == "system":
            prompt_parts.append(f"<|system|>\n{content}\n")
        elif role == "user":
            prompt_parts.append(f"<|user|>\n{content}\n")
        elif role == "assistant":
            prompt_parts.append(f"<|assistant|>\n{content}\n")
    prompt_parts.append(f"<|user|>\n{user_msg}\n")
    prompt_parts.append("<|assistant|>\n")
    return "".join(prompt_parts)
```

```python
def local_tool_router(user_msg: str) -> Optional[str]:
    msg = user_msg.strip().lower()
    if msg.startswith("search:"):
        query = user_msg.split(":", 1)[-1].strip()
        return f"Search results about '{query}':\n- Key point 1\n- Key point 2\n- Key point 3"
    if msg.startswith("docs:"):
        topic = user_msg.split(":", 1)[-1].strip()
        return f"Documentation extract on '{topic}':\n1. The agent orchestrates tools.\n2. The model consumes output.\n3. Responses become memory."
    return None

def generate_reply(history: ConversationHistory, user_msg: str) -> str:
    tool_context = local_tool_router(user_msg)
    if tool_context:
        user_msg = user_msg + "\n\nUseful context:\n" + tool_context
    prompt = build_chat_prompt(history, user_msg)
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=True,
            top_p=0.9,
            temperature=0.6,
            pad_token_id=tokenizer.eos_token_id
        )
    decoded = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    reply = decoded.split("<|assistant|>")[-1].strip() if "<|assistant|>" in decoded else decoded[len(prompt):].strip()
    history.append(("user", user_msg))
    history.append(("assistant", reply))
    return reply
```

### Practical Applications
- **Use Case**: Local AI assistant for documentation lookup using `docs:<topic>` queries.
- **Pitfall**: Over-reliance on local models without cloud fallback risks scalability limitations.

**References:**
- https://www.marktechpost.com/2025/11/12/how-to-build-a-fully-functional-custom-gpt-style-conversational-ai-locally-using-hugging-face-transformers/
---