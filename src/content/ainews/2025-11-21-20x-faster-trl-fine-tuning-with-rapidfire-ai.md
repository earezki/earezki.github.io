---
title: "20x Faster TRL Fine-tuning with RapidFire AI"
pubDate: 2025-06-03
description: "Hugging Face TRL integrates with RapidFire AI, delivering 16–24x faster experimentation throughput for LLM fine-tuning."
categories: ["AI News", "LLM", "Fine-tuning"]
---

## 20x Faster TRL Fine-tuning with RapidFire AI

Hugging Face TRL now officially integrates with RapidFire AI to accelerate LLM fine-tuning and post-training experiments. This integration allows TRL users to leverage RapidFire AI for significantly faster configuration comparisons without requiring major code changes or excessive GPU resources.

## Why this matters

Traditional LLM fine-tuning often lacks the speed to efficiently compare multiple configurations, hindering the ability to achieve optimal evaluation metrics. This is costly, as experimentation time directly impacts development cycles and resource allocation. RapidFire AI addresses this by enabling concurrent execution of TRL configurations—even on a single GPU—through an adaptive, chunk-based scheduling scheme, resulting in up to 24x higher experimentation throughput.

### Key Insights
- **16–24x throughput increase**: Internal benchmarks demonstrate a substantial improvement in experimentation speed with RapidFire AI.
- **Adaptive Chunking**: RapidFire AI shards datasets and cycles configurations to facilitate early comparative analysis and maximize GPU utilization.
- **Interactive Control Ops (IC Ops)**: Users can dynamically stop, resume, clone, and modify experiments from a dashboard, optimizing resource allocation.

### Working Example 
```python
from rapidfireai import Experiment
from rapidfireai.automl import List, RFGridSearch, RFModelConfig, RFLoraConfig, RFSFTConfig
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer

# Setup: load your dataset and define formatting
dataset = load_dataset("bitext/Bitext-customer-support-llm-chatbot-training-dataset")
train_dataset = dataset["train"].select(range(128)).shuffle(seed=42)
def formatting_function(row):
    return {
        "prompt": [
            {"role": "system", "content": "You are a helpful customer support assistant."},
            {"role": "user", "content": row["instruction"]},
        ],
        "completion": [{"role": "assistant", "content": row["response"]}]
    }
dataset = dataset.map(formatting_function)

# Define multiple configs to compare
config_set = List([
    RFModelConfig(
        model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        peft_config=RFLoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"]),
        training_args=RFSFTConfig(learning_rate=1e-3, max_steps=128, fp16=True),
    ),
    RFModelConfig(
        model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        peft_config=RFLoraConfig(r=32, lora_alpha=64, target_modules=["q_proj", "v_proj"]),
        training_args=RFSFTConfig(learning_rate=1e-4, max_steps=128, fp16=True),
        formatting_func=formatting_function,
    )
])

# Run all configs concurrently with chunk-based scheduling
experiment = Experiment(experiment_name="sft-comparison")
config_group = RFGridSearch(configs=config_set, trainer_type="SFT")
def create_model(model_config):
    model = AutoModelForCausalLM.from_pretrained(
        model_config["model_name"],
        device_map="auto", torch_dtype="auto"
    )
    tokenizer = AutoTokenizer.from_pretrained(model_config["model_name"])
    return (model, tokenizer)
experiment.run_fit(config_group, create_model, train_dataset, num_chunks=4, seed=42)
experiment.end()
```

### Practical Applications
- **Hugging Face**: Accelerating TRL fine-tuning for faster model iteration and improved performance.
- **Pitfall**: Relying on sequential experimentation can lead to suboptimal model configurations and wasted GPU resources.

**References:**
- https://huggingface.co/blog/rapidfireai